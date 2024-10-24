import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import HapticTouchableOpacity from './Buttons/HapticTouchableOpacity';
import {IconButton, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import JourneyUnitCard from './JourneyUnitCard';
import UnitSelector from './UnitSelector';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import { theme } from '../theme';

interface JourneyDetourPopupProps {
  open: boolean;
  onClose: () => void;
  unit: any;
  style?: StyleSheet;
}

const CloseIcon = () => <Icon name="close" size={24} color="#fff" />;

const JourneyDetourPopup: React.FC<JourneyDetourPopupProps> = ({
  open,
  onClose,
  unit,
  style,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [stage, setStage] = useState(1);
  const [journeyUnitMap, setJourneyUnitMap] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState(unit._id);
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(unit);
  const theme = useTheme();
  const navigation = useNavigation();
  const userId = useSelector(state => state.auth.id);

  const toggleDescription = () => setShowFullDescription(!showFullDescription);
  // const displayedDescription = showFullDescription
  //   ? unit.description
  //   : `${unit.description.substring(0, 150)}...`;
  const displayedDescription = unit.description;

  // ref for the bottom sheet modal component
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // defines the snap points for bottom sheet modal
  const snapPoints = useMemo(() => ['50%', '100%'], []);

  // effect to control the visibility of the bottom sheet modal
  useEffect(() => {
    if (open) {
      // present the bottom sheet modal
      bottomSheetModalRef.current?.present();
      getUnitMap(unit._id);
    } else {
      // dismiss the bottom sheet modal
      bottomSheetModalRef.current?.dismiss();
    }
  }, [open, unit._id]);

  // handles changes in the sheet position
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const getUnitMap = async (unitId: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/api/journey/getJourneyFromUnit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({unit_id: unitId}),
        },
      );
      const data = await response.json();
      if (data.success) {
        setJourneyUnitMap(data.units);
      } else {
        console.error('There was an issue getting the journey map');
      }
    } catch (error) {
      console.error('Error fetching unit map:', error);
    }
  };

  const handleContinue = () => {
    setStage(2);
  };

  const takeDetour = async () => {
    if (!userId) {
      Alert.alert(
        'Error',
        'User is not authenticated. Please log in and try again.',
      );
      return;
    }

    try {
      const response = await fetch(
        `${Config.API_URL}/api/journey/createDetour`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            detour_unit_id: unit._id,
            user_id: userId,
            task_id: '0',
          }),
        },
      );

      const detour = await response.json();

      if (detour.success) {
        // Close the popup
        onClose();
        // Navigate to the Journey screen
        // @ts-ignore
        navigation.navigate('JourneyMain');
      } else {
        Alert.alert('Error', 'There was an issue adding this detour');
      }
    } catch (error) {
      console.error('Error taking detour:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleUnitSelect = useCallback(selectedUnit => {
    console.log('Selecting unit:', selectedUnit._id);
    setSelectedUnit(selectedUnit);
    setStage(3); // move to the new stage
  }, []);

  const handleSelectUnit = () => {
    setSelectedUnitId(selectedUnit._id);
    setStage(2); // go back to stage 2
  };

  useEffect(() => {
    console.log('Selected unit ID updated:', selectedUnitId);
  }, [selectedUnitId]);

  const renderStage1 = () => (
    <ScrollView>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          {unit.name}
        </Text>
        <IconButton
          icon={CloseIcon}
          onPress={onClose}
          style={styles.closeButton}
        />
      </View>
      <FastImage
        source={{uri: `${Config.API_URL}/static/junit/t/${unit._id}`}}
        style={styles.image}
        onError={e => console.log('Image Load Error:', e.nativeEvent.error)}
        resizeMode={FastImage.resizeMode.cover}
      />
      <Text style={[styles.description, {color: theme.colors.text}]}>
        {displayedDescription}
      </Text>
      {/* {unit.description.length > 150 && (
        <HapticTouchableOpacity onPress={toggleDescription}>
          <Text style={[styles.readMore, {color: theme.colors.primary}]}>
            {showFullDescription ? 'Read Less' : 'Read More'}
          </Text>
        </HapticTouchableOpacity>
      )} */}
      <HapticTouchableOpacity
        onPress={handleContinue}
        style={styles.continueButton}>
        <Text style={styles.continueButtonLabel}>Continue</Text>
      </HapticTouchableOpacity>
    </ScrollView>
  );

  const renderStage2 = () => {
    const selectedIndex = journeyUnitMap.findIndex(
      unit => unit._id === selectedUnitId,
    );
    const unitHeight = 90;

    return (
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            Select Starting Point
          </Text>
          <IconButton
            icon={CloseIcon}
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>
        <View style={styles.explanationContainer}>
          <View style={styles.explanationTextWrapper}>
            <Text
              style={[styles.explanationText, {color: theme.colors.text}]}
              numberOfLines={showFullExplanation ? undefined : 2}>
              This Detour is part of a larger Journey. Select the point that you
              would like to start your Detour at. If you are unfamiliar with the
              concept, we would recommend starting this detour at the beginning
              of the Journey.
            </Text>
          </View>
          <HapticTouchableOpacity
            onPress={() => setShowFullExplanation(!showFullExplanation)}>
            <Text style={[styles.readMore, {color: theme.colors.primary}]}>
              {showFullExplanation ? 'Read Less' : 'Read More'}
            </Text>
          </HapticTouchableOpacity>
        </View>
        <View style={styles.unitMapContainer}>
          <Text style={[styles.subtitle, {color: theme.colors.text}]}>
            Unit Map
          </Text>
          <View style={styles.unitMapContent}>
            <View style={styles.unitSelectorContainer}>
              <UnitSelector
                unitCount={journeyUnitMap.length}
                selectedIndex={selectedIndex}
                onSelectUnit={index => handleUnitSelect(journeyUnitMap[index])}
                unitHeight={unitHeight} // Pass the unitHeight
              />
            </View>
            <View style={styles.cardsContainer}>
              {journeyUnitMap.map((journeyUnit, index) => {
                const isSelected = selectedUnitId === journeyUnit._id;
                return (
                  <View key={journeyUnit._id} style={styles.unitItem}>
                    <JourneyUnitCard
                      data={journeyUnit}
                      onPress={() => handleUnitSelect(journeyUnit)}
                      isSelected={isSelected}
                      currentUnit={selectedUnitId}
                      unitNumber={index + 1}
                      unitNumberColor="#007AFF"
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <HapticTouchableOpacity
          onPress={takeDetour}
          style={styles.continueButton}>
          <Text style={styles.continueButtonLabel}>Take Detour</Text>
        </HapticTouchableOpacity>
      </ScrollView>
    );
  };

  const renderStage3 = () => {
    // find the index of the selected unit in the journeyUnitMap
    const unitIndex = journeyUnitMap.findIndex(u => u._id === selectedUnit._id);
    const unitNumber = unitIndex !== -1 ? unitIndex + 1 : null;

    return (
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              {selectedUnit.name}
            </Text>
            {unitNumber !== null && (
              <View style={styles.unitNumberContainer}>
                <Text style={styles.unitNumber}>{unitNumber}</Text>
              </View>
            )}
          </View>
        </View>
        <FastImage
          source={{uri: `${Config.API_URL}/static/junit/t/${selectedUnit._id}`}}
          style={styles.image}
          onError={e => console.log('Image Load Error:', e.nativeEvent.error)}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text style={[styles.description, {color: theme.colors.text}]}>
          {selectedUnit.description}
        </Text>
        <View style={styles.buttonContainer}>
          <HapticTouchableOpacity
            onPress={handleSelectUnit} // start unit
            style={styles.startUnitButton}>
            <Text style={styles.continueButtonLabel}>Start Unit</Text>
          </HapticTouchableOpacity>
          <HapticTouchableOpacity
            onPress={() => setStage(2)} // return to units
            style={styles.returnToUnitsButton}>
            <Text style={styles.continueButtonLabel}>Return To Units</Text>
          </HapticTouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        style={style}
        onChange={handleSheetChanges}
        onDismiss={onClose}
        backgroundStyle={{backgroundColor: theme.colors.surface}}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.text,
        }}>
        <BottomSheetScrollView>
          <View style={styles.modalContainer}>
            {stage === 1
              ? renderStage1()
              : stage === 2
              ? renderStage2()
              : renderStage3()}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    marginBottom: 15,
  },
  description: {
    marginTop: 10,
    fontSize: 16,
  },
  readMore: {
    marginTop: 5,
  },
  closeButton: {
    backgroundColor: 'transparent',
  },
  continueButton: {
    marginTop: 20,
    paddingVertical: 8,
    height: 50,
    borderRadius: 20,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  returnToUnitsButton: {
    marginTop: 20,
    paddingVertical: 8,
    height: 50,
    borderRadius: 20,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
  },
  startUnitButton: {
    marginTop: 20,
    paddingVertical: 8,
    height: 50,
    borderRadius: 20,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  continueButtonLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  unitMapContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  unitMapContent: {
    flexDirection: 'row',
    width: '100%',
  },
  unitSelectorContainer: {
    width: 30,
    marginRight: 10,
  },
  cardsContainer: {
    flex: 1,
  },
  unitItem: {
    marginBottom: 10,
    height: 80,
  },
  explanationContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  explanationTextWrapper: {
    overflow: 'hidden',
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 22,
  },
  readMore: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  unitNumberContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unitNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    // justifyContent: 'space-between',
    marginTop: 20,
  },
  returnButton: {
    flex: 1,
    marginRight: 10,
  },
  startButton: {
    flex: 1,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default JourneyDetourPopup;
