import React, {useState, useEffect, useCallback} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {IconButton, useTheme, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import DetourCard from './DetourCard';
import JourneyUnitCard from './JourneyUnitCard';
import UnitSelector from './UnitSelector';

interface JourneyDetourPopupProps {
  open: boolean;
  onClose: () => void;
  unit: any;
}

const CloseIcon = () => <Icon name="close" size={24} color="#fff" />;

const JourneyDetourPopup: React.FC<JourneyDetourPopupProps> = ({
  open,
  onClose,
  unit,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [stage, setStage] = useState(1);
  const [journeyUnitMap, setJourneyUnitMap] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState(unit._id);
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  const theme = useTheme();

  const toggleDescription = () => setShowFullDescription(!showFullDescription);
  const displayedDescription = showFullDescription
    ? unit.description
    : `${unit.description.substring(0, 150)}...`;

  useEffect(() => {
    if (open) {
      getUnitMap(unit._id);
    }
  }, [open]);

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
    // implement the logic for taking the detour
    console.log('Taking detour');
  };

  const handleUnitSelect = useCallback(selectedUnit => {
    console.log('Selecting unit:', selectedUnit._id);
    setSelectedUnitId(selectedUnit._id);
  }, []);

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
      {unit.description.length > 150 && (
        <TouchableOpacity onPress={toggleDescription}>
          <Text style={[styles.readMore, {color: theme.colors.primary}]}>
            {showFullDescription ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
      <Button
        mode="contained"
        onPress={handleContinue}
        style={styles.continueButton}
        labelStyle={styles.continueButtonLabel}>
        Continue
      </Button>
    </ScrollView>
  );

  const renderStage2 = () => {
    const selectedIndex = journeyUnitMap.findIndex(unit => unit._id === selectedUnitId);

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
              numberOfLines={showFullExplanation ? undefined : 1}
            >
              This Detour is part of a larger Journey. Select the point that you
              would like to start your Detour at. If you are unfamiliar with the
              concept, we would recommend starting this detour at the beginning of
              the Journey.
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowFullExplanation(!showFullExplanation)}>
            <Text style={[styles.readMore, {color: theme.colors.primary}]}>
              {showFullExplanation ? 'Read Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.unitMapContainer}>
          <Text style={[styles.subtitle, {color: theme.colors.text}]}>
            Unit Map
          </Text>
          <View style={styles.unitMapContent}>
            <UnitSelector
              unitCount={journeyUnitMap.length}
              selectedIndex={selectedIndex}
              onSelectUnit={(index) => handleUnitSelect(journeyUnitMap[index])}
            />
            <View style={styles.cardsContainer}>
              {journeyUnitMap.map((journeyUnit, index) => {
                const isSelected = selectedUnitId === journeyUnit._id;
                return (
                  <View key={journeyUnit._id} style={styles.unitItem}>
                    <View style={styles.journeyUnitCardContainer}>
                      <JourneyUnitCard
                        data={journeyUnit}
                        onPress={() => handleUnitSelect(journeyUnit)}
                        isSelected={isSelected}
                        currentUnit={selectedUnitId}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <Button
          mode="contained"
          onPress={takeDetour}
          style={styles.continueButton}
          labelStyle={styles.continueButtonLabel}>
          Take Detour
        </Button>
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={open}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}>
      <View style={styles.modalBackground}>
        <View
          style={[
            styles.modalContainer,
            {backgroundColor: theme.colors.surface},
          ]}>
          {stage === 1 ? renderStage1() : renderStage2()}
        </View>
      </View>
    </Modal>
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
    width: '90%',
    maxHeight: '90%',
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
  },
  continueButtonLabel: {
    fontSize: 16,
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
  },
  cardsContainer: {
    flex: 1,
  },
  unitItem: {
    marginBottom: 8,
  },
  journeyUnitCardContainer: {
    maxHeight: 80,
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
});

export default JourneyDetourPopup;