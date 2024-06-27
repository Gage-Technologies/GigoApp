import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Modal,
    StatusBar,
    NativeScrollEvent,
    NativeSyntheticEvent,
    PanResponder,
    PanResponderGestureState,
} from 'react-native';
import MarkdownRenderer from '../Markdown/MarkdownRenderer';
import { useTheme } from 'react-native-paper';
import { Unit } from '../../models/Journey';
import { getTextColor } from '../../services/utils';

interface HandoutOverlayProps {
    isVisible: boolean;
    onClose: () => void;
    unit: Unit | null;
}

const INITIAL_OFFSET = 0.50;
const LOWER_BOUND_SNAP_THRESHOLD = 0.55;
const UPPER_BOUND_SNAP_THRESHOLD = 0.15;
const SCROLL_SMOOTHING = 0.4;

const HandoutOverlay: React.FC<HandoutOverlayProps> = ({ isVisible, onClose, unit }) => {
    const { height } = Dimensions.get('window');
    const theme = useTheme();
    const slideAnim = useRef(new Animated.Value(height * INITIAL_OFFSET)).current;
    const [isFullyExpanded, setIsFullyExpanded] = useState(false);
    const isFullyExpandedRef = useRef(isFullyExpanded);
    const scrollViewRef = useRef<ScrollView>(null);
    const lastGestureY = useRef(0);

    // helper function to handle pan gestures
    const handlePanGesture = (gestureState: PanResponderGestureState) => {
        // if not fully expanded or at the top, handle pan gesture
        // @ts-ignore
        const newPosition = Math.max(0, Math.min(slideAnim._value + (gestureState.dy * SCROLL_SMOOTHING), height));
        if (newPosition <= 0) {
            setIsFullyExpanded(true);
            isFullyExpandedRef.current = true;
        }
        slideAnim.setValue(newPosition);
    };

    // create a pan responder for handling the overlay drag
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => !isFullyExpandedRef.current,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return !isFullyExpandedRef.current && Math.abs(gestureState.dy) > 5;
        },
        onPanResponderGrant: (_, gestureState) => {
            lastGestureY.current = gestureState.y0;
        },
        onPanResponderMove: (_, gestureState) => {
            if (!isFullyExpandedRef.current || gestureState.dy > 0) {
                handlePanGesture(gestureState);
            }
        },
        onPanResponderRelease: async (_, gestureState) => {
            // @ts-ignore
            let snapClose = (gestureState.dy * SCROLL_SMOOTHING) + slideAnim._value > 10

            if (isFullyExpandedRef.current && !snapClose) {
                await new Promise(resolve => setTimeout(resolve, 200));
                // double check that we're still fully expanded
                if (isFullyExpandedRef.current) {
                    return;
                }
            }

            if (
                // @ts-ignore
                (gestureState.dy * SCROLL_SMOOTHING) + slideAnim._value < height * LOWER_BOUND_SNAP_THRESHOLD ||
                // @ts-ignore
                slideAnim._value > height * LOWER_BOUND_SNAP_THRESHOLD ||
                gestureState.vy > height * LOWER_BOUND_SNAP_THRESHOLD
            ) {
                // snap to bottom and close
                Animated.timing(slideAnim, {
                    toValue: height,
                    duration: 300,
                    useNativeDriver: true,
                }).start(onClose);
            // @ts-ignore
            } else if ((gestureState.dy * SCROLL_SMOOTHING) + slideAnim._value < height * UPPER_BOUND_SNAP_THRESHOLD) {
                // snap to top
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    setIsFullyExpanded(true);
                    isFullyExpandedRef.current = true;
                });
            }
        },
    });

    // handle scroll events from the markdown content
    const handleContentScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!isFullyExpandedRef.current) {
            // prevent scrolling of content when overlay is not fully expanded
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
            return;
        }

        // get the current scroll position
        const scrollY = event.nativeEvent.contentOffset.y;

        // check if we've scrolled back to the top
        if (scrollY <= 0) {
            // set isFullyExpanded to false when we're at the top
            setIsFullyExpanded(false);
            isFullyExpandedRef.current = false;
        }
    };

    // debounce function to prevent accidental triggers
    const debounce = (func: () => void, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(func, delay);
        };
    };

    useEffect(() => {
        if (isVisible) {
            // reset to initial position when opening
            slideAnim.setValue(height * INITIAL_OFFSET);
            setIsFullyExpanded(false);
            isFullyExpandedRef.current = false;
        } else {
            // reset when closing
            slideAnim.setValue(height);
            setIsFullyExpanded(false);
            isFullyExpandedRef.current = false;
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }
    }, [isVisible, height, slideAnim]);

    if (!isVisible || !unit) return null;

    return (
        <Modal transparent visible={isVisible} animationType="none" onRequestClose={onClose}>
            <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.overlayContent,
                        {
                            transform: [{ translateY: slideAnim }],
                            backgroundColor: unit.color
                        },
                    ]}
                    // {...(isFullyExpanded ? {} : panResponder.panHandlers)}
                    {...panResponder.panHandlers}
                >
                    <View style={[styles.dragHandle, { backgroundColor: getTextColor(unit.color) }]} />
                    <View style={styles.handoutContainer}>
                        <ScrollView
                            ref={scrollViewRef}
                            style={styles.scrollView}
                            scrollEventThrottle={16}
                            onScroll={handleContentScroll}
                            scrollEnabled={isFullyExpanded}
                        >
                            <MarkdownRenderer
                                style={styles.handoutText}
                                markdown={unit.handout}
                                textColor={getTextColor(unit.color)}
                            />
                        </ScrollView>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    overlayContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 10,
    },
    handoutContainer: {
        flex: 1,
    },
    handoutTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    scrollView: {
        flexGrow: 1,
    },
    handoutText: {
        fontSize: 16,
        lineHeight: 24,
        padding: 10
    },
});

export default HandoutOverlay;