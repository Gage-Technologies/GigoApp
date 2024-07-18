/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import {useTheme, Card, List} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AboutJourney = () => {
  const theme = useTheme();
  const {width: screenWidth} = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerBackground: {
      width: '100%',
      height: screenWidth * 0.5,
      justifyContent: 'flex-end',
      paddingBottom: 30,
    },
    headerText: {
      color: '#e4c8b5',
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: 'bold',
      fontSize: 32,
      textShadowColor: '#915d5d',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
      textAlign: 'center',
      marginBottom: 100,
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: theme.fonts.medium.fontFamily,
      color: theme.colors.primary,
      marginBottom: 15,
    },
    paragraph: {
      fontSize: 16,
      fontFamily: theme.fonts.medium.fontFamily,
      marginBottom: 15,
      color: theme.colors.text,
    },
    card: {
      marginBottom: 16, // increased margin between cards
      elevation: 4,
      backgroundColor: theme.colors.surface,
    },
    firstCard: {
      marginTop: 16, // margin above the first card
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      width: 32,
      height: 32,
      paddingBottom: 10,
    },
    listItemDescription: {
      color: theme.colors.onSurface,
    },
  });

  const renderSection = (title, content, icon, isFirstCard = false) => (
    <Card style={[styles.card, isFirstCard && styles.firstCard]}>
      <Card.Title
        title={title}
        left={props => (
          <View style={styles.iconContainer}>
            <Icon name={icon} size={24} color={theme.colors.primary} />
          </View>
        )}
        titleStyle={styles.cardTitle}
      />
      <Card.Content>
        <Text style={styles.paragraph}>{content}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../img/Journey/journey-page.png')}
        style={styles.headerBackground}
        resizeMode="cover">
        <Text style={styles.headerText}>Your Journey Starts Here</Text>
      </ImageBackground>
      <View style={styles.content}>
        <Text style={styles.title}>GIGO Journey System</Text>

        <Text style={styles.paragraph}>
          GIGO Journeys focus on delivering comprehensive programming education.
          The journey is structured to provide programmers of various skill
          levels with concise, well-defined, and efficient paths to enhance
          their programming expertise.
        </Text>

        {renderSection(
          'Incremental Learning Path',
          'Our journey caters to both entry-level and experienced programmers. Beginners start with programming basics, while advanced users dive into complex algorithms and specialized areas.',
          'stairs-up',
          true, // this is the first card
        )}

        {renderSection(
          'Bite-Sized Lessons',
          'Lessons are broken down into manageable segments, allowing participants to learn at their own pace. Practical examples and hands-on exercises ensure understanding and retention.',
          'food-apple',
        )}

        <Card style={styles.card}>
          <Card.Title
            title="Curriculum"
            left={props => (
              <View style={styles.iconContainer}>
                <Icon
                  name="book-open-variant"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
            )}
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text style={styles.paragraph}>
              The curriculum covers a wide array of programming languages and
              paradigms, including:
            </Text>
            <List.Section>
              <List.Item
                title="Fundamentals"
                description="Data types, control structures, error handling, etc."
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="code-tags" />}
              />
              <List.Item
                title="Intermediate Concepts"
                description="Object-oriented programming, APIs, databases, etc."
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="code-braces" />}
              />
              <List.Item
                title="Advanced Topics"
                description="Multi-threading, distributed computing, cloud-native technologies, etc."
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="code-array" />}
              />
              <List.Item
                title="Specialized Paths"
                description="In-depth mastery in areas like machine learning, network programming, etc."
                descriptionStyle={styles.listItemDescription}
                left={props => (
                  <List.Icon {...props} icon="code-greater-than" />
                )}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {renderSection(
          'Code Teacher Tutor Support',
          'Never venture alone! Code Teacher helps students overcome obstacles and achieve success together.',
          'account-group',
        )}

        {renderSection(
          'Conclusion',
          'The GIGO Journey system is a robust educational framework catering to different skill levels. Its incremental and bite-sized approach ensures a coherent and fulfilling learning experience for anyone looking to start their coding journey or elevate their existing skills to complete mastery.',
          'flag-checkered',
        )}
      </View>
    </ScrollView>
  );
};

export default AboutJourney;
