import React from 'react';
import {View, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProgressionPopupProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  iconColor: string;
  description: string;
}

const ProgressionPopup: React.FC<ProgressionPopupProps> = ({
  visible,
  onClose,
  title,
  icon,
  iconColor,
  description,
}) => {
  const theme = useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade">
      <View style={styles.modalBackground}>
        <View
          style={[
            styles.popupContainer,
            {backgroundColor: theme.colors.surface},
          ]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            {title}
          </Text>
          <Icon name={icon} size={48} color={iconColor} style={styles.icon} />
          <Text style={[styles.description, {color: theme.colors.text}]}>
            {description}
          </Text>
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
  popupContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  icon: {
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
  },
});

export default ProgressionPopup;
