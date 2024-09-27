import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import HapticTouchableOpacity from '../Buttons/HapticTouchableOpacity';
import {shuffle} from 'lodash';
import MarkdownRenderer from '../Markdown/MarkdownRenderer';

interface MatchingQuestionProps {
  question: {
    question: string;
    matching_pairs?: {left: string; right: string}[];
  };
  matchedPairs: {[key: number]: {[key: string]: string}};
  setMatchedPairs: React.Dispatch<
    React.SetStateAction<{[key: number]: {[key: string]: string}}>
  >;
  currentQuestionIndex: number;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question,
  matchedPairs,
  setMatchedPairs,
  currentQuestionIndex,
}) => {
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const [pairColors, setPairColors] = useState<{[key: string]: string}>({});

  const colors = ['#3498db', '#2ecc71', '#f1c40f', '#ffffff'];

  useEffect(() => {
    const currentPairs = question.matching_pairs || [];
    setLeftItems(shuffle(currentPairs.map(pair => pair.left)));
    setRightItems(shuffle(currentPairs.map(pair => pair.right)));
    setSelectedLeft(null);
    setWrongPair(null);

    // assign colors to pairs
    const newPairColors: {[key: string]: string} = {};
    currentPairs.forEach((pair, index) => {
      const color = colors[index % colors.length];
      newPairColors[pair.left] = color;
      newPairColors[pair.right] = color;
    });
    setPairColors(newPairColors);
  }, [currentQuestionIndex, question.matching_pairs]);

  const handleLeftClick = (item: string) => {
    setSelectedLeft(item);
  };

  const handleRightClick = (item: string) => {
    if (selectedLeft) {
      const correctPair = question.matching_pairs?.find(
        pair => pair.left === selectedLeft && pair.right === item,
      );
      if (correctPair) {
        setMatchedPairs(prev => ({
          ...prev,
          [currentQuestionIndex]: {
            ...prev[currentQuestionIndex],
            [selectedLeft]: item,
          },
        }));
      } else {
        setWrongPair([selectedLeft, item]);
        setTimeout(() => setWrongPair(null), 500);
      }
      setSelectedLeft(null);
    }
  };

  const getItemColor = (item: string): string => {
    return pairColors[item] || '#ffffff';
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionCard}>
        <MarkdownRenderer markdown={question.question} />
      </View>
      <View style={styles.matchingGame}>
        <View style={styles.column}>
          {leftItems.map((item, index) => (
            <HapticTouchableOpacity
              key={index}
              style={[
                styles.item,
                selectedLeft === item && styles.selectedItem,
                item in (matchedPairs[currentQuestionIndex] || {}) &&
                  styles.matchedItem,
                wrongPair && wrongPair[0] === item && styles.wrongItem,
                {borderColor: getItemColor(item)},
              ]}
              onPress={() => handleLeftClick(item)}
              disabled={item in (matchedPairs[currentQuestionIndex] || {})}>
              <Text style={styles.itemText}>{item}</Text>
            </HapticTouchableOpacity>
          ))}
        </View>
        <View style={styles.column}>
          {rightItems.map((item, index) => (
            <HapticTouchableOpacity
              key={index}
              style={[
                styles.item,
                Object.values(
                  matchedPairs[currentQuestionIndex] || {},
                ).includes(item) && styles.matchedItem,
                wrongPair && wrongPair[1] === item && styles.wrongItem,
                {borderColor: getItemColor(item)},
              ]}
              onPress={() => handleRightClick(item)}
              disabled={Object.values(
                matchedPairs[currentQuestionIndex] || {},
              ).includes(item)}>
              <Text style={styles.itemText}>{item}</Text>
            </HapticTouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  questionCard: {
    width: '100%',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
  },
  matchingGame: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
  },
  column: {
    flex: 1,
    gap: 16,
  },
  item: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
  },
  matchedItem: {
    opacity: 0.3,
  },
  wrongItem: {
    backgroundColor: '#ffcccb',
  },
  itemText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MatchingQuestion;
