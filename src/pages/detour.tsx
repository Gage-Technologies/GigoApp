import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import { debounce } from 'lodash';
import DetourCard from '../components/DetourCard';
import JourneyDetourPopup from '../components/JourneyDetourPopup';
import { Unit } from '../models/Journey';
import { useRoute } from '@react-navigation/native';

interface JourneyGroups {
  [key: string]: Unit[];
}

const Detour = () => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [searchUnits, setSearchUnits] = useState<Unit[]>([]);
  const [searchPending, setSearchPending] = useState(false);
  const [journeyGroups, setJourneyGroups] = useState<JourneyGroups>({});
  const [loading, setLoading] = useState(false);
  const [groupStates, setGroupStates] = useState<{ [key: string]: any }>({});

  // state to manage popup visibility and selected unit
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const route = useRoute();
  const initialSearchQuery = route.params?.searchQuery || '';

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchText(initialSearchQuery);
      searchJourneyUnits(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  useEffect(() => {
    getGroups();
  }, []);

  const searchJourneyUnits = async (text: string) => {
    setSearchPending(true);
    const params = {
      query: text,
      skip: 0,
      limit: 50,
    };

    try {
      const response = await fetch(
        `${Config.API_URL}/api/search/journeyUnits`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        },
      );

      const res = await response.json();

      if (res && res.units) {
        setSearchUnits(res.units);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search journey units');
    } finally {
      setSearchPending(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchJourneyUnitsDebounced = useCallback(
    debounce(searchJourneyUnits, 800),
    [],
  );

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      searchJourneyUnitsDebounced(text);
    } else {
      setSearchUnits([]);
    }
  };

  const getGroups = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${Config.API_URL}/api/journey/getJourneyGroups`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: '{}',
        },
      );

      const groups = await response.json();

      if (groups && groups.success) {
        setJourneyGroups(groups.groups);
      } else {
        Alert.alert('Server Error', 'Failed to fetch journey groups');
      }
    } catch (error) {
      Alert.alert('Server Error', 'Failed to fetch journey groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalUnits = async (unitId: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/api/journey/getUnitsFromGroup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ group_id: unitId }),
        },
      );

      const units = await response.json();

      if (units && units.success) {
        return units.units;
      } else {
        Alert.alert('Server Error', 'Failed to fetch additional units');
      }
    } catch (error) {
      Alert.alert('Server Error', 'Failed to fetch additional units');
    }
  };

  const handleShowAllToggle = async (GroupID: string) => {
    if (!groupStates[GroupID]?.loaded) {
      const additionalUnits = await fetchAdditionalUnits(GroupID);
      if (additionalUnits === undefined) {
        return;
      }
      setGroupStates(prevState => ({
        ...prevState,
        [GroupID]: {
          loaded: true,
          units: [...(prevState[GroupID]?.units || []), ...additionalUnits],
          showAll: true,
        },
      }));
    } else {
      setGroupStates(prevState => ({
        ...prevState,
        [GroupID]: {
          ...prevState[GroupID],
          showAll: !prevState[GroupID].showAll,
        },
      }));
    }
  };

  const handleCardPress = (unit: Unit | React.SetStateAction<null>) => {
    // @ts-ignore
    setSelectedUnit(unit);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedUnit(null);
  };

  const renderJourneyGroups = () => {
    // @ts-ignore
    return (
      <View style={styles.journeyGroupsContainer}>
        {Object.entries(journeyGroups).map(
          ([
            category,
            {
              //@ts-ignore
              Units,
              //@ts-ignore
              GroupID,
            },
          ]) => (
            <View key={category} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {Units.length === 4 && (
                  <IconButton
                    icon={groupStates[GroupID]?.showAll ? 'chevron-up' : 'chevron-down'}
                    onPress={() => handleShowAllToggle(GroupID)}
                  />
                )}
              </View>
              <View style={styles.unitsContainer}>
                {(groupStates[GroupID]?.showAll
                  ? groupStates[GroupID]?.units || Units
                  : Units.slice(0, 4)
                ).map((unit: Unit | React.SetStateAction<null>) => (
                  <View
                    key={
                      //@ts-ignore
                      unit.id
                    }
                    style={styles.unitItem}>
                    <DetourCard
                      //@ts-ignore
                      data={unit}
                      onPress={() => handleCardPress(unit)}
                    />
                  </View>
                ))}
              </View>
            </View>
          ),
        )}
      </View>
    );
  };

  const renderSearchContent = () => {
    return (
      <View style={styles.searchContentContainer}>
        {searchPending ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <View style={styles.unitsContainer}>
            {searchUnits.map(unit => (
              <View
                key={
                  //@ts-ignore
                  unit.id
                }
                style={styles.unitItem}>
                <DetourCard
                  //@ts-ignore
                  data={unit}
                  onPress={() => handleCardPress(unit)}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={theme.colors.primary} />;
    }

    return searchText === '' ? renderJourneyGroups() : renderSearchContent();
  };

  // styles for the detour page
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.primary,
    },
    titleText: {
      fontSize: 32,
      color: theme.colors.surface,
      fontWeight: '700',
      ...theme.fonts.medium,
    },
    subtitleText: {
      fontSize: 16,
      color: theme.colors.surfaceVariant,
      ...theme.fonts.regular,
      marginTop: 4,
    },
    searchBarContainer: {
      marginTop: 20,
      marginBottom: 10,
      marginHorizontal: 20,
      borderRadius: 25,
      backgroundColor: theme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    searchBar: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: theme.colors.text,
      ...theme.fonts.regular,
    },
    content: {
      flexGrow: 1,
      paddingTop: 10,
      paddingHorizontal: 20,
      paddingBottom: 70,
    },
    journeyGroupsContainer: {
      alignItems: 'center',
      width: '100%',
    },
    categoryContainer: {
      marginVertical: 10,
      width: '100%',
      paddingHorizontal: '3%',
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    categoryTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    unitsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    unitItem: {
      width: '45%',
      margin: 5,
    },
    searchContentContainer: {
      alignItems: 'center',
      width: '100%',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Detour</Text>
        <Text style={styles.subtitleText}>Discover new journeys</Text>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search journeys..."
            placeholderTextColor={theme.colors.placeholder}
            value={searchText}
            onChangeText={handleSearchTextChange}
          />
          <IconButton
            icon="magnify"
            color={theme.colors.primary}
            size={24}
            onPress={() => searchJourneyUnits(searchText)}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>
      {selectedUnit && (
        <JourneyDetourPopup
          open={isPopupVisible}
          onClose={handleClosePopup}
          unit={selectedUnit}
        />
      )}
    </View>
  );
};

export default Detour;