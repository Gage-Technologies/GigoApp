import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import HapticTouchableOpacity from '../components/Buttons/HapticTouchableOpacity';
import {useTheme} from 'react-native-paper';
import Config from 'react-native-config';
import HapticAwesomeButton from '../components/Buttons/HapticAwesomeButton';
import MarkdownRenderer from '../components/Markdown/MarkdownRenderer';
import MatchingQuestion from '../components/Quiz/MatchingQuestion';
import {theme} from '../theme';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';

// define the question type
interface Question {
  correct_index: number;
  options: string[];
  question: string;
  type: number;
  matching_pairs?: {left: string; right: string}[];
}

// define the quiz data type
interface QuizData {
  _id: string;
  color: string;
  questions: Question[];
  name: string;
  description: string;
}

const QuizPage: React.FC<{
  route: {params: {quizId: string; isJourney: boolean}};
}> = ({route}) => {
  let {quizId, isJourney} = route.params;
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [wrongAnswerIndex, setWrongAnswerIndex] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{
    [key: number]: {[key: string]: string};
  }>({});
  const [loading, setLoading] = useState(true);
  const [isCompletionModalVisible, setIsCompletionModalVisible] = useState(false);

  const theme = useTheme();

  const navigation = useNavigation();

  // start the quiz attempt
  const startQuizAttempt = async (quizId: string) => {
    try {
      const response = await fetch(`${Config.API_URL}/api/quiz/startAttempt`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({quiz_id: quizId}),
      });

      if (!response.ok) {
        throw new Error('failed to start quiz attempt');
      }

      const data = await response.json();
      console.log('data: ', data);
      // handle the response data as needed
    } catch (error) {
      console.error(
        'error: an error occurred while starting the quiz attempt.',
        error,
      );
    }
  };

  // fetch the quiz data
  const getQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`${Config.API_URL}/api/quiz/get`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({quiz_id: quizId}),
      });

      if (!response.ok) {
        throw new Error('failed to fetch quiz data');
      }

      const data = await response.json();
      setQuizData(data.quiz);
      setSelectedAnswers(new Array(data.quiz.questions.length).fill(null));
      setAnsweredQuestions(new Array(data.quiz.questions.length).fill(false));
    } catch (error) {
      console.error(
        'error: an error occurred while fetching the quiz data.',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      startQuizAttempt(quizId);
      getQuiz(quizId);
    }
  }, [quizId]);

  const handleAnswerClick = (index: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = index;
    setSelectedAnswers(newSelectedAnswers);
    setIsWrongAnswer(false);
  };

  const handleNextQuestion = () => {
    const currentAnswer = selectedAnswers[currentQuestionIndex];
    const currentQuestion = quizData?.questions[currentQuestionIndex];
    if (
      currentAnswer === currentQuestion?.correct_index ||
      currentQuestion?.type === 1
    ) {
      const newAnsweredQuestions = [...answeredQuestions];
      newAnsweredQuestions[currentQuestionIndex] = true;
      setAnsweredQuestions(newAnsweredQuestions);
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setIsWrongAnswer(false);
      setWrongAnswerIndex(null);
    } else {
      setIsWrongAnswer(true);
      setWrongAnswerIndex(currentAnswer);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    setIsWrongAnswer(false);
  };

  const setQuizComplete = async (quizId: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/api/quiz/setAttemptComplete`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({quiz_id: quizId}),
        },
      );

      if (!response.ok) {
        throw new Error('failed to mark quiz as complete');
      }

      const data = await response.json();

      console.log('completion data: ', data);

      if (data.message === 'quiz attempt marked as complete') {
        // show completion modal instead of navigating immediately
        setIsCompletionModalVisible(true);
      }
    } catch (error) {
      console.error(
        'error: an error occurred while marking quiz complete',
        error,
      );
    }
  };

  const handleContinue = () => {
    setIsCompletionModalVisible(false);
    navigation.navigate('JourneyMain');
  };

  const handleSubmit = () => {
    const currentQuestion = quizData?.questions[currentQuestionIndex];
    if (
      (currentQuestion?.type !== 1 &&
        selectedAnswers[currentQuestionIndex] ===
          currentQuestion?.correct_index) ||
      (currentQuestion?.type === 1 &&
        Object.keys(matchedPairs[currentQuestionIndex] || {}).length ===
          currentQuestion?.matching_pairs?.length)
    ) {
      setQuizComplete(quizData?._id || '');
    } else {
      setIsWrongAnswer(true);
    }
  };

  if (loading || !quizData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  return (
    <ScrollView
      style={[styles.scrollView, {backgroundColor: theme.colors.background}]}
      contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={[styles.quizName, {color: theme.colors.text}]}>
          {quizData.name}
        </Text>

        {/* progress bar and question count */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (currentQuestionIndex / quizData.questions.length) * 100
                  }%`,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, {color: theme.colors.text}]}>
            {currentQuestionIndex + 1} / {quizData.questions.length}
          </Text>
        </View>

        {/* code type question */}
        {currentQuestion.type === 0 && (
          <View style={styles.questionContainer}>
            <View style={styles.codeEditorContainer}>
              {/* TODO: add code editor */}
              {/* <CodeEditor
                language="python"
                code={currentQuestion.question}
                readonly={true}
                theme="dark"
              /> */}
              <MarkdownRenderer
                markdown={`\`\`\`python\n${currentQuestion.question}\n\`\`\``}
                textColor={'#ffffff'}
              />
            </View>
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((answer, index) => (
                <HapticTouchableOpacity
                  key={index}
                  style={[
                    styles.optionCard,
                    selectedAnswers[currentQuestionIndex] === index &&
                      styles.selectedOption,
                    isWrongAnswer &&
                      (isLastQuestion || index === wrongAnswerIndex) &&
                      styles.wrongOption,
                    answeredQuestions[currentQuestionIndex] &&
                      index === currentQuestion.correct_index &&
                      styles.correctOption,
                  ]}
                  onPress={() => handleAnswerClick(index)}>
                  <Text style={styles.optionText}>{answer}</Text>
                </HapticTouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* matching type question */}
        {currentQuestion.type === 1 && (
          <MatchingQuestion
            question={currentQuestion}
            matchedPairs={matchedPairs}
            setMatchedPairs={setMatchedPairs}
            currentQuestionIndex={currentQuestionIndex}
          />
        )}

        {/* text type question */}
        {currentQuestion.type === 2 && (
          <View style={styles.questionContainer}>
            <View style={styles.textQuestionCard}>
              <MarkdownRenderer
                markdown={currentQuestion.question}
                textColor={'#ffffff'}
              />
            </View>
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((answer, index) => (
                <HapticTouchableOpacity
                  key={index}
                  style={[
                    styles.optionCard,
                    selectedAnswers[currentQuestionIndex] === index &&
                      styles.selectedOption,
                    isWrongAnswer &&
                      (isLastQuestion || index === wrongAnswerIndex) &&
                      styles.wrongOption,
                    answeredQuestions[currentQuestionIndex] &&
                      index === currentQuestion.correct_index &&
                      styles.correctOption,
                  ]}
                  onPress={() => handleAnswerClick(index)}>
                  <Text style={styles.optionText}>{answer}</Text>
                </HapticTouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <HapticAwesomeButton
            width={140}
            height={50}
            borderRadius={25}
            backgroundColor={theme.colors.secondary}
            // @ts-ignore
            backgroundDarker={theme.colors.secondaryVariant}
            // @ts-ignore
            textColor={theme.colors.secondaryVariant}
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            raiseLevel={4}>
            Previous
          </HapticAwesomeButton>
          {!isLastQuestion ? (
            <HapticAwesomeButton
              width={140}
              height={50}
              borderRadius={25}
              backgroundColor={theme.colors.primary}
              // @ts-ignore
              backgroundDarker={theme.colors.primaryVariant}
              // @ts-ignore
              textColor={theme.colors.primaryVariant}
              onPress={handleNextQuestion}
              disabled={
                currentQuestion.type === 1 &&
                Object.keys(matchedPairs[currentQuestionIndex] || {}).length !==
                  currentQuestion.matching_pairs?.length
              }
              raiseLevel={4}>
              Next
            </HapticAwesomeButton>
          ) : (
            <HapticAwesomeButton
              width={140}
              height={50}
              borderRadius={25}
              backgroundColor={theme.colors.primary}
              // @ts-ignore
              backgroundDarker={theme.colors.primaryVariant}
              // @ts-ignore
              textColor={theme.colors.primaryVariant}
              onPress={handleSubmit}
              raiseLevel={4}>
              Submit
            </HapticAwesomeButton>
          )}
        </View>
        {isWrongAnswer && isLastQuestion && (
          <Text style={styles.errorText}>
            your answer is incorrect. please try again.
          </Text>
        )}
      </View>
      <View style={styles.bottomSpacer} />

      <Modal
        isVisible={isCompletionModalVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.5}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <Animatable.View
            animation="bounceIn"
            duration={1500}
            style={styles.checkmarkContainer}>
            <Animatable.Text
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              style={styles.checkmark}>
              ✓
            </Animatable.Text>
          </Animatable.View>
          <Text style={styles.congratsText}>Congratulations!</Text>
          <Text style={styles.completionText}>You've completed the quiz!</Text>
          <HapticAwesomeButton
            width={200}
            height={50}
            borderRadius={25}
            backgroundColor={theme.colors.primary}
            // @ts-ignore
            backgroundDarker={theme.colors.primaryVariant}
            // @ts-ignore
            textColor={theme.colors.primaryVariant}
            onPress={handleContinue}
            raiseLevel={4}>
            Continue
          </HapticAwesomeButton>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  bottomSpacer: {
    height: 80,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  quizName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
  },
  questionContainer: {
    width: '100%',
    marginBottom: 16,
  },
  codeEditorContainer: {
    height: 200,
    marginBottom: 16,
  },
  textQuestionCard: {
    padding: 16,
    backgroundColor: theme.colors.paper,
    borderRadius: 8,
    marginBottom: 16,
  },
  optionsContainer: {
    width: '100%',
  },
  optionCard: {
    minHeight: 70,
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#3a3a38',
  },
  wrongOption: {
    backgroundColor: '#c30010',
  },
  correctOption: {
    backgroundColor: 'green',
  },
  optionText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  errorText: {
    color: '#c30010',
    marginTop: 8,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.paper,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    width: '80%',
    maxWidth: 400,
  },
  checkmarkContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkmark: {
    color: 'white',
    fontSize: 72,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.onBackground,
    textAlign: 'center',
  },
  completionText: {
    fontSize: 18,
    marginBottom: 20,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default QuizPage;
