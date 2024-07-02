import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {useTheme, IconButton, Button} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Config from 'react-native-config';
import {debounce} from 'lodash';
import DetourCard from '../components/DetourCard'; 

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
  const [groupStates, setGroupStates] = useState<{[key: string]: any}>({});

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

  const searchJourneyUnitsDebounced = useCallback(
    debounce(searchJourneyUnits, 800),
    [],
  );

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    if (text.length > 2) {
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
          body: JSON.stringify({group_id: unitId}),
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

  const renderJourneyGroups = () => {
    return (
      <View style={styles.journeyGroupsContainer}>
        {Object.entries(journeyGroups).map(([category, {Units, GroupID}]) => (
          <View key={category} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {Units.length === 4 && (
                <Button onPress={() => handleShowAllToggle(GroupID)}>
                  {groupStates[GroupID]?.showAll ? 'Show Less' : 'Show More'}
                </Button>
              )}
            </View>
            <View style={styles.unitsContainer}>
              {(groupStates[GroupID]?.showAll
                ? groupStates[GroupID]?.units || Units
                : Units.slice(0, 4)
              ).map(unit => (
                <View key={unit.id} style={styles.unitItem}>
                  <DetourCard data={unit} />
                </View>
              ))}
            </View>
          </View>
        ))}
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
              <View key={unit.id} style={styles.unitItem}>
                <DetourCard data={unit} />
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
    titleContainer: {
      width: '100%',
      paddingVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#29C18C',
    },
    titleText: {
      fontSize: 24,
      color: theme.colors.text,
      fontWeight: 'bold',
      ...theme.fonts.medium,
    },
    searchBarContainer: {
      width: '90%',
      marginTop: 10,
      marginBottom: 20,
      borderRadius: 25,
      backgroundColor: theme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      alignSelf: 'center',
    },
    searchBar: {
      flex: 1,
      height: 40,
      fontSize: 16,
      ...theme.fonts.regular,
    },
    content: {
      flexGrow: 1,
      alignItems: 'center',
      paddingHorizontal: '5%',
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
      <LinearGradient
        colors={['#29C18C', '#1c8762', '#145D46']}
        style={styles.titleContainer}>
        <Text style={styles.titleText}>Take A Detour</Text>
      </LinearGradient>
      <View style={styles.searchBarContainer}>
        <IconButton icon="magnify" size={25} color={theme.colors.surface} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default Detour;

