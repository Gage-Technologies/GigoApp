import React, {useState, useEffect} from 'react';
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

  useEffect(() => {
    console.log('journeyUnitMap:', journeyUnitMap);
  }, [journeyUnitMap]);

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

  const handleUnitSelect = (selectedUnit) => {
    setSelectedUnitId(selectedUnit._id);
  };

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

  const renderStage2 = () => (
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
      <View style={styles.unitMapContainer}>
        <Text style={[styles.subtitle, {color: theme.colors.text}]}>
          Unit Map
        </Text>
        {journeyUnitMap.map((journeyUnit, index) => (
          <View key={journeyUnit._id} style={styles.unitItem}>
            <Text style={[styles.unitNumber, {color: theme.colors.text}]}>
              {index + 1}.
            </Text>
            <View style={styles.journeyUnitCardContainer}>
              <JourneyUnitCard
                data={{
                  id: journeyUnit._id,
                  name: journeyUnit.name,
                  image: `${Config.API_URL}/static/junit/t/${journeyUnit._id}`,
                  langs: journeyUnit.langs || [],
                }}
                onPress={() => handleUnitSelect(journeyUnit)}
                isSelected={selectedUnitId === journeyUnit._id}
              />
            </View>
          </View>
        ))}
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
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
    marginBottom: 10,
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  unitNumber: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
  },
  journeyUnitCardContainer: {
    flex: 1,
  },
});

export default JourneyDetourPopup;