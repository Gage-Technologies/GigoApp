import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Card} from 'react-native-paper';

interface MembershipTabProps {
  membership: number;
  membershipString: string;
  membershipCost: string;
}

const MembershipTab: React.FC<MembershipTabProps> = ({
  membership,
  membershipString,
  membershipCost,
}) => {
  const calculateProgress = () => {
    // Placeholder for progress calculation logic
    // Replace with actual logic as needed
    return 50; // Example percentage
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Membership Details</Text>
      <Card style={styles.card}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Current Membership:</Text>
          <Text style={styles.value}>{membershipString}</Text>
        </View>
        {membership > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Next Payment:</Text>
            <Text style={styles.value}>${membershipCost}</Text>
          </View>
        )}
        <View style={styles.progressBarContainer}>
          <Text style={styles.label}>Progress</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, {width: `${calculateProgress()}%`}]}
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#282826',
    borderRadius: 10,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: 'white',
  },
  value: {
    fontSize: 16,
    color: '#29c18c',
  },
  progressBarContainer: {
    marginTop: 20,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#555',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#29c18c',
  },
});

export default MembershipTab;
