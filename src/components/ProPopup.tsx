import React from 'react';
import {View, ScrollView, StyleSheet, Image} from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  useTheme,
  IconButton,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';

// Define benefit types and arrays here
type Benefit = {
  title: string;
  description: string;
};

const basicBenefits: Benefit[] = [
  {
    title: 'Unlimited Retries',
    description: 'No daily restrictions on Journeys & Bytes.',
  },
  {
    title: 'Freeze Your Streak',
    description:
      'Get two streak freezes per week to keep your streak alive on your off days.',
  },
];

const advancedBenefits: Benefit[] = [
  {title: 'Basic', description: 'Everything from the Basic plan.'},
  {
    title: 'Access to Challenges',
    description: "GIGO's project-based learning experience.",
  },
  {title: 'Larger DevSpaces', description: '8 CPU cores, 8GB RAM, 50GB disk'},
];

const maxBenefits: Benefit[] = [
  {title: 'Advanced', description: 'Everything from the Advanced plan.'},
  {
    title: 'Smarter Code Teacher',
    description:
      'Learn faster with the smartest version of Code Teacher, your personal tutor on GIGO.',
  },
];

interface ProPopupProps {
  visible: boolean;
  onDismiss: () => void;
}

const ProPopup: React.FC<ProPopupProps> = ({visible, onDismiss}) => {
  const theme = useTheme();

  const renderSubscriptionCard = (
    title: string,
    benefits: Benefit[],
    price: string,
  ) => (
    <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
      <Card.Content>
        <Title style={{color: theme.colors.onSurface}}>{title}</Title>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Paragraph
              style={[styles.benefitTitle, {color: theme.colors.onSurface}]}>
              {benefit.title}
            </Paragraph>
            <Paragraph style={{color: theme.colors.onSurface}}>
              {benefit.description}
            </Paragraph>
          </View>
        ))}
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => console.log(`Upgrade to ${title}`)}>
          {price}
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <IconButton
          icon="close"
          size={24}
          onPress={onDismiss}
          style={styles.closeButton}
          color={theme.colors.onBackground}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image
            source={require('../img/premium-gorilla.svg')}
            style={styles.image}
          />
          <Text style={[styles.title, {color: theme.colors.onBackground}]}>
            GIGO Pro
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.onBackground}]}>
            Unlimited retries on Journeys & Bytes.
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.onBackground}]}>
            Freeze your Streak.
          </Text>

          {renderSubscriptionCard('Basic', basicBenefits, '$3/month')}
          {renderSubscriptionCard('Advanced', advancedBenefits, '$8/month')}
          {renderSubscriptionCard('Max', maxBenefits, '$15/month')}

          <Button
            mode="text"
            onPress={() => console.log('Learn more about Pro')}
            style={styles.learnMoreButton}>
            Learn More About Pro
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: '90%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  card: {
    width: '100%',
    marginVertical: 10,
  },
  benefitItem: {
    marginBottom: 5,
  },
  benefitTitle: {
    fontWeight: 'bold',
  },
  learnMoreButton: {
    marginTop: 20,
  },
});

export default ProPopup;
