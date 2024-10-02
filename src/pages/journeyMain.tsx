import React, {useState, useEffect, useRef, useCallback, memo, useMemo} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  InteractionManager, // import InteractionManager
} from 'react-native';
import HapticTouchableOpacity from '../components/Buttons/HapticTouchableOpacity';
import {Text, useTheme} from 'react-native-paper';
import Config from 'react-native-config';
import JourneyMap from '../components/Journey/JourneyMap';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GetStarted from '../components/GetStarted';
import {Unit} from '../models/Journey';
import HandoutOverlay from '../components/Journey/HandoutOverlay';
import {getTextColor} from '../services/utils';
import HapticAwesomeButton from '../components/Buttons/HapticAwesomeButton';
import {BlurView} from '@react-native-community/blur';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import XpPopup from '../components/XpPopup';
import {useLanguage} from '../LanguageContext';
import EmptyJourney from '../components/Journey/EmptyJourney';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initialAuthStateUpdate,
  selectAuthState,
  updateAuthState,
} from '../reducers/auth';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomBarVisible} from '../reducers/appSettings';
import debounce from 'lodash/debounce';

const JourneyMain = () => {
  const [initialized, setInitialized] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [activeJourney, setActiveJourney] = useState<boolean | null>(null);
  const [showHandout, setShowHandout] = useState<number | null>(null);
  const [openDetourPop, setOpenDetourPop] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [showEmptyJourney, setShowEmptyJourney] = useState(false);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [nextUnit, setNextUnit] = useState<Unit>();
  const [xpData, setXpData] = useState({
    oldXP: 0,
    newXP: 0,
    nextLevel: 1,
    maxXP: 100,
    levelUp: false,
    gainedXP: 0,
    renown: 0,
  });
  const authState = useSelector(selectAuthState);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const [renderKey, setRenderKey] = useState(0);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollStartY = useRef(0);
  const scrollThreshold = 10;

  const API_URL = Config.API_URL;
  const theme = useTheme();
  const {selectedLanguage} = useLanguage();

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const forceRerender = () => {
    setRenderKey(prevKey => prevKey + 1); // Change the key to force re-render
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const xpLogin = await AsyncStorage.getItem('loginXP');

        if (xpLogin && xpLogin !== 'undefined' && xpLogin !== '0') {
          setShowXpPopup(true);
          setXpData(JSON.parse(xpLogin));
        }
      } catch (error) {
        console.error('Error loading data', error);
      }
    };

    fetchSessionData();
  }, []);

  useEffect(() => {
    getProStatus();
  }, []);

  const getProStatus = async () => {
    try {
      let followResponse = await fetch(
        `${Config.API_URL}/api/user/subscriptionApp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
      );

      if (!followResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await followResponse.json();

      let authState = Object.assign({}, initialAuthStateUpdate);
      // @ts-ignore
      authState.role = res.current_subscription;
      dispatch(updateAuthState(authState));
      // dispatch(updateAuthState(authState));
    } catch (error) {
      console.log('error getting user membership level');
    }
  };

  const getTasks = async (loadMore = false) => {
    try {
      setIsLoadingMore(true);

      let response = await fetch(`${API_URL}/api/journey/determineStart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch start of journey, status ${response.status}`,
        );
      }

      let map = await response.json();
      if (!map.started_journey) {
        setActiveJourney(false);
        setInitialized(true);
        setIsLoadingMore(false);
        return;
      }

      response = await fetch(`${API_URL}/api/journey/getUserMap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skip: loadMore ? units.length : 0,
          limit: 5,
        }),
      });

      if (!response.ok) {
        // TODO: replace this after we fix the backend
        if (response.status === 500) {
          setHasMore(false);
        }

        let res = response.statusText;
        try {
          res = await response.json();
        } catch (e) {}
        console.log(
          `Failed to fetch user map: ${response.status} - ${JSON.stringify(
            res,
          )}`,
        );
        setIsLoadingMore(false);
        return;
      }

      let res = await response.json();

      const fetchedUnits = await Promise.all(
        res.user_map.units.map(async (unit: {_id: any}) => {
          const response = await fetch(
            `${API_URL}/api/journey/getTasksInUnit`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                unit_id: unit._id,
              }),
            },
          );

          if (!response.ok) {
            throw new Error('Failed to fetch tasks in unit');
          }

          const tasksResponse = await response.json();
          const tasks = tasksResponse.data ? tasksResponse.data.tasks : [];
          if (!tasks.length) {
            console.error('No tasks array in the response for unit:', unit._id);
            return {...unit, tasks: []};
          }

          const sortedTasks = tasks.sort((a: any, b: any) => {
            if (a.node_above === null) {
              return -1;
            }
            if (b.node_above === null) {
              return 1;
            }
            return a.node_above - b.node_above;
          });

          return {...unit, tasks: sortedTasks};
        }),
      );

      // Set nextUnit if fetchedUnits has more than 1 unit
      if (fetchedUnits.length > 1) {
        const nextUnit = fetchedUnits[fetchedUnits.length - 1];
        setNextUnit(nextUnit);
        // Slice off the last unit from the fetched units, as in the original logic
        const slicedUnits = fetchedUnits.slice(0, -1);
        setUnits(prevUnits =>
          loadMore ? [...slicedUnits, ...prevUnits] : slicedUnits,
        );
      } else {
        setUnits(prevUnits =>
          loadMore ? [...fetchedUnits, ...prevUnits] : fetchedUnits,
        );
      }

      if (fetchedUnits.length < 5) {
        setHasMore(false);
      }
      setActiveJourney(true);
      setIsLoadingMore(false);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message ||
          'Failed to fetch tasks. Please check your network connection.',
      );
      setIsLoadingMore(false);
    } finally {
      setIsLoadingMore(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    console.log('Fetching tasks...');
    getTasks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTasks();
      forceRerender();
    }, []),
  );

  useEffect(() => {
    if (selectedLanguage === 'All') {
      setFilteredUnits(units);
    } else {
      const filtered = units.filter(unit =>
        unit.langs.includes(selectedLanguage),
      );
      setFilteredUnits(filtered);
    }
  }, [selectedLanguage, units]);

  useEffect(() => {
    setShowEmptyJourney(
      activeJourney && selectedLanguage !== 'All' && filteredUnits.length === 0,
    );
  }, [activeJourney, selectedLanguage, filteredUnits]);

  const handleAddUnitToMap = async () => {
    if (!nextUnit) {
      return;
    }

    setLoading(true);

    const response = await fetch(`${API_URL}/api/journey/addUnitToMap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        unit_id: nextUnit._id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks in unit');
    }

    const res = await response.json();

    if (res && res.success) {
      getTasks().then(() => {
        setLoading(false);
      });
    } else {
      console.error('Failed to add unit to map');
      return;
    }
  };

  const triggerHandout = (index: number) => {
    if (index === null || index === undefined) {
      return;
    }
    dispatch(setBottomBarVisible(false));
    setShowHandout(index);
  };

  // memoize the handleMap function
  const memoizedHandleMap = useCallback(
    (unit: Unit, index: number) => {
      const isLastIndex = index === filteredUnits.length - 1;
      const allCompleted = unit.tasks.every(task => task.completed);
      const isPendingAcceptance = isLastIndex && !allCompleted;

      // calculate task offset by summing the length of all previous units
      const taskOffset = filteredUnits
        .slice(0, index)
        .reduce((acc, unit) => acc + unit.tasks.length, 0);

      const isUnitStarted = unit.tasks.some(task => task.completed);

      return (
        <View
          style={
            isPendingAcceptance
              ? [styles.unitContainer, {paddingTop: 20}]
              : styles.unitContainer
          }
          key={`journey-unit-${unit._id}-${index}`}>
          <HapticTouchableOpacity
            style={[styles.unitHeader, {backgroundColor: unit.color}]}
            onPress={() => triggerHandout(index)}>
            <Text style={[styles.unitTitle, {color: getTextColor(unit.color)}]}>
              {unit.name}
            </Text>
            <View style={styles.clipboardIcon}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color={getTextColor(unit.color)}
              />
            </View>
          </HapticTouchableOpacity>
          <View style={styles.unitContent} key={renderKey}>
            <JourneyMap
              unitId={unit._id}
              unitIndex={index}
              taskOffset={taskOffset}
              isUnitStarted={isUnitStarted}
              isScrolling={isScrolling}
            />
          </View>
          {isPendingAcceptance && (
            <View style={styles.blurOverlay}>
              <BlurView
                style={styles.blurView}
                blurType="dark"
                blurAmount={3}
                reducedTransparencyFallbackColor={theme.colors.background}
              />
              <View style={styles.buttonWrapper}>
                <HapticAwesomeButton
                  width={300}
                  height={80}
                  borderRadius={20}
                  textSize={28}
                  backgroundColor={theme.colors.primary}
                  // @ts-ignore
                  backgroundDarker={theme.colors.primaryVariant}
                  // @ts-ignore
                  textColor={theme.colors.primaryVariant}
                  onPress={() => {
                    // handle adding unit to journey
                    handleAddUnitToMap();
                  }}>
                  Add Unit To Journey
                </HapticAwesomeButton>
              </View>
            </View>
          )}
          {isLastIndex && <View style={styles.bottomSpacer} />}
        </View>
      );
    },
    [filteredUnits, handleAddUnitToMap, triggerHandout, theme.colors],
  );

  // memoize the renderItem function for FlatList
  const renderItem = useCallback(
    ({item, index}: {item: Unit; index: number}) => {
      return memoizedHandleMap(item, index);
    },
    [memoizedHandleMap],
  );

  // memoize the keyExtractor function for FlatList
  const keyExtractor = useCallback((item: Unit) => item._id, []);

  const refetchJourneys = async () => {
    await getTasks();
  };

  const handleCloseXpPopup = () => {
    setShowXpPopup(false);
  };

  const handleLoadMore = () => {
    console.log('loading more: ', hasMore, !isLoadingMore);
    if (hasMore && !isLoadingMore) {
      getTasks(true);
    }
  };

  const removeHandout = () => {
    setShowHandout(null);
    dispatch(setBottomBarVisible(true));
  };

  // optimize the main render function
  return (
    <>
      {initialized ? (
        activeJourney ? (
          showEmptyJourney ? (
            <EmptyJourney
              language={selectedLanguage}
              onStartJourney={() => setShowEmptyJourney(false)}
              refetchJourneys={refetchJourneys}
            />
          ) : (
            <FlatList
              style={[
                styles.scrollView,
                {backgroundColor: theme.colors.background},
              ]}
              data={filteredUnits}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              // onStartReached={handleLoadMore}
              // onStartReachedThreshold={0.1}
              ListHeaderComponent={
                isLoadingMore ? (
                  <View style={styles.loadingMoreIndicator}>
                    <ActivityIndicator
                      size="large"
                      color={theme.colors.primary}
                    />
                  </View>
                ) : null
              }
              contentContainerStyle={styles.scrollViewContent}
              scrollEventThrottle={16}
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
              }} // maintain visible content position when prepending data
              onScroll={({nativeEvent}) => {
                // check if the user has scrolled to the top
                if (nativeEvent.contentOffset.y <= 0 && !isLoadingMore) {
                  handleLoadMore();
                }
              }}
            />
          )
        ) : (
          <GetStarted getTasks={getTasks} />
        )
      ) : (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      {/* {activeJourney && !showEmptyJourney && filteredUnits.length > 0 && (
        <HapticTouchableOpacity
          style={styles.detourButton}
          onPress={handleDetourNavigation}>
          <MaterialCommunityIcons
            name="sign-direction"
            size={30}
            color="white"
          />
        </HapticTouchableOpacity>
      )} */}
      {showXpPopup && (
        <XpPopup {...xpData} popupClose={handleCloseXpPopup} homePage={false} />
      )}
      <HandoutOverlay
        isVisible={showHandout !== null}
        onClose={removeHandout}
        unit={showHandout !== null ? filteredUnits[showHandout] : null}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  unitContainer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  unitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    flexWrap: 'wrap',
    maxWidth: 400,
  },
  completedIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    borderRadius: 50,
    backgroundColor: '#41c18c',
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#ef9558',
    padding: 10,
    borderRadius: 30,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handoutText: {
    fontSize: 14,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 8,
    marginTop: 8,
  },
  unitContent: {
    padding: 15,
  },
  clipboardIcon: {
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  unitWrapper: {
    width: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonWrapper: {
    zIndex: 1,
  },
  detourButton: {
    position: 'absolute',
    left: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    backgroundColor: '#ef9558',
  },
  bottomSpacer: {
    height: 80,
  },
  loadingMoreIndicator: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 15,
    alignItems: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}], // assuming a 50x50 loading indicator
    zIndex: 1,
  },
});

// memoize the JourneyMain component
export default memo(JourneyMain);