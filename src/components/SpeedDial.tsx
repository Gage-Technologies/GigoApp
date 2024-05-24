import React, { useState } from 'react';
import { FAB, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const SpeedDial = () => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();

  const navigateTo = (screen: string) => {
    setOpen(false);
    navigation.navigate(screen);
  };

  return (
    <Portal>
      <View style={styles.fabContainer}>
        {open && (
          <>
            <FAB
              style={[styles.fab, styles.fabButton, { backgroundColor: theme.colors.secondary }]}
              small
              icon="home"
              label="Home"
              onPress={() => navigateTo('Home')}
              color={theme.colors.onPrimary}
            />
            <FAB
              style={[styles.fab, styles.fabButton, { backgroundColor: theme.colors.secondary }]}
              small
              icon="map"
              label="Journey"
              onPress={() => navigateTo('JourneyMain')}
              color={theme.colors.onPrimary}
            />
          </>
        )}
        <FAB
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          icon={open ? 'close' : 'menu'}
          onPress={() => setOpen(!open)}
          color={`white`}
        />
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'center',
  },
  fab: {
    marginVertical: 8,
  },
  fabButton: {
    width: 'auto',
  },
});

export default SpeedDial;
