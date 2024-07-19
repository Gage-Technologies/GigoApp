import React from 'react';
import {StyleSheet, View, Dimensions, Modal} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import StatBox from './StatBox';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const POPUP_WIDTH = SCREEN_WIDTH * 0.85;
const POPUP_HEIGHT = SCREEN_HEIGHT * 0.6;
const STAT_BOX_WIDTH = POPUP_WIDTH * 0.8;
const STAT_BOX_HEIGHT = STAT_BOX_WIDTH * 0.6;

interface StatPopupProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  value: string;
  tooltip: string;
}

const StatPopup: React.FC<StatPopupProps> = ({
  visible,
  onClose,
  title,
  icon,
  value,
  tooltip,
}) => {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.blurredBackground} />
        <View
          style={[
            styles.popupContainer,
            {backgroundColor: theme.colors.background},
          ]}>
          <View style={styles.closeButtonContainer}>
            <Button onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </Button>
          </View>
          <Text style={[styles.title, {color: theme.colors.text}]}>{title}</Text>
          <View style={styles.statBoxWrapper}>
            <StatBox
              icon={icon}
              title={title}
              value={value}
              tooltip={tooltip}
            />
          </View>
          <Text style={[styles.description, {color: theme.colors.text}]}>
            {tooltip}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurredBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContainer: {
    width: POPUP_WIDTH,
    maxHeight: POPUP_HEIGHT,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButton: {
    minWidth: 0,
    padding: 0,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statBoxWrapper: {
    width: STAT_BOX_WIDTH - 45,
    height: STAT_BOX_HEIGHT - 30,
    marginBottom: 15,
  },
  description: {
    textAlign: 'center',
  },
});

export default StatPopup;
