import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import MarkdownRenderer from '../Markdown/MarkdownRenderer';
import {Unit} from '../../models/Journey';
import {getTextColor} from '../../services/utils';

interface HandoutOverlay2Props {
  isVisible: boolean;
  onClose: () => void;
  unit: Unit | null;
}

/**
 * handoutoverlay2 component
 *
 * this component displays a bottom sheet modal containing unit handout information.
 * it uses BottomSheetModal from @gorhom/bottom-sheet to appear over the entire screen.
 *
 * @param isVisible - boolean to control the visibility of the overlay
 * @param onClose - function to call when the overlay should be closed
 * @param unit - the unit object containing handout information
 */
const HandoutOverlay: React.FC<HandoutOverlay2Props> = ({
  isVisible,
  onClose,
  unit,
}) => {
  // ref for the bottom sheet modal component
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // defines the snap points for bottom sheet modal
  const snapPoints = useMemo(() => ['50%', '100%'], []);

  // effect to control the visibility of the bottom sheet modal
  useEffect(() => {
    if (isVisible) {
      // present the bottom sheet modal
      bottomSheetModalRef.current?.present();
    } else {
      // dismiss the bottom sheet modal
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  // handles changes in the sheet position
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // callback when the modal is dismissed
  const handleModalClose = useCallback(() => {
    // call the onClose prop when modal is dismissed
    onClose();
  }, [onClose]);

  return (
    <BottomSheetModalProvider>
      {unit && (
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          style={{zIndex: 1000}}
          onChange={handleSheetChanges}
          onDismiss={handleModalClose}
          backgroundStyle={{backgroundColor: unit.color}}
          handleIndicatorStyle={{
            backgroundColor: getTextColor(unit.color),
          }}>
          <BottomSheetScrollView style={styles.scrollView}>
            <MarkdownRenderer
              style={styles.handoutText}
              markdown={unit.handout}
              textColor={getTextColor(unit.color)}
            />
          </BottomSheetScrollView>
        </BottomSheetModal>
      )}
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  handoutText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default HandoutOverlay;
