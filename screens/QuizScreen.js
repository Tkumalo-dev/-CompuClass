import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const quizQuestions = [
  {
    id: 1,
    question: "What is the main function of a CPU?",
    options: [
      "Store data permanently",
      "Process instructions and calculations",
      "Display graphics",
      "Connect to the internet"
    ],
    correct: 1,
    explanation: "The CPU (Central Processing Unit) is the brain of the computer that processes instructions and performs calculations."
  },
  {
    id: 2,
    question: "Which component stores data temporarily while the computer is running?",
    options: ["Hard Drive", "RAM", "CPU", "Power Supply"],
    correct: 1,
    explanation: "RAM (Random Access Memory) stores data temporarily while the computer is running and loses data when power is turned off."
  },
  {
    id: 3,
    question: "What does GPU stand for?",
    options: [
      "General Processing Unit",
      "Graphics Processing Unit", 
      "Gaming Performance Unit",
      "Global Processing Unit"
    ],
    correct: 1,
    explanation: "GPU stands for Graphics Processing Unit, which handles rendering graphics and visual processing."
  },
  {
    id: 4,
    question: "Which connector is commonly used for modern monitors?",
    options: ["VGA", "HDMI", "PS/2", "USB-A"],
    correct: 1,
    explanation: "HDMI (High-Definition Multimedia Interface) is the most common connector for modern monitors and displays."
  },
  {
    id: 5,
    question: "What is the purpose of a motherboard?",
    options: [
      "Cool the system",
      "Store files",
      "Connect all components together",
      "Provide internet connection"
    ],
    correct: 2,
    explanation: "The motherboard is the main circuit board that connects and allows communication between all computer components."
  }
];

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      Alert.alert("Please select an answer", "Choose one of the options before proceeding.");
      return;
    }

    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correct;
    const newAnswers = [...answers, {
      questionId: quizQuestions[currentQuestion].id,
      selected: selectedAnswer,
      correct: quizQuestions[currentQuestion].correct,
      isCorrect
    }];
    
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
    
    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    setAnswers([]);
  };

  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return '#10B981';
    if (percentage >= 60) return '#F59E0B';
    return '#EF4444';
  };

  if (quizCompleted) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={[getScoreColor(), '#1F2937']}
          style={styles.resultContainer}
        >
          <Ionicons name="trophy" size={64} color="#fff" />
          <Text style={styles.resultTitle}>Quiz Completed!</Text>
          <Text style={styles.scoreText}>
            Your Score: {score}/{quizQuestions.length}
          </Text>
          <Text style={styles.percentageText}>
            {Math.round((score / quizQuestions.length) * 100)}%
          </Text>
          
          <TouchableOpacity style={styles.retryButton} onPress={resetQuiz}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.reviewContainer}>
          <Text style={styles.reviewTitle}>Review Your Answers</Text>
          {quizQuestions.map((question, index) => (
            <View key={question.id} style={styles.reviewItem}>
              <Text style={styles.reviewQuestion}>
                {index + 1}. {question.question}
              </Text>
              <Text style={[
                styles.reviewAnswer,
                { color: answers[index]?.isCorrect ? '#10B981' : '#EF4444' }
              ]}>
                Your answer: {question.options[answers[index]?.selected]}
                {answers[index]?.isCorrect ? ' ✓' : ' ✗'}
              </Text>
              {!answers[index]?.isCorrect && (
                <Text style={styles.correctAnswer}>
                  Correct: {question.options[question.correct]}
                </Text>
              )}
              <Text style={styles.explanation}>{question.explanation}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionCounter}>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </Text>
        <Text style={styles.scoreCounter}>Score: {score}</Text>
      </View>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }
          ]} 
        />
      </View>

      <ScrollView style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {quizQuestions[currentQuestion].question}
        </Text>

        <View style={styles.optionsContainer}>
          {quizQuestions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption,
                showResult && index === quizQuestions[currentQuestion].correct && styles.correctOption,
                showResult && selectedAnswer === index && index !== quizQuestions[currentQuestion].correct && styles.wrongOption
              ]}
              onPress={() => !showResult && handleAnswerSelect(index)}
              disabled={showResult}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText,
                showResult && index === quizQuestions[currentQuestion].correct && styles.correctOptionText,
                showResult && selectedAnswer === index && index !== quizQuestions[currentQuestion].correct && styles.wrongOptionText
              ]}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
              {showResult && index === quizQuestions[currentQuestion].correct && (
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
              )}
              {showResult && selectedAnswer === index && index !== quizQuestions[currentQuestion].correct && (
                <Ionicons name="close-circle" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {showResult && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>Explanation:</Text>
            <Text style={styles.explanationText}>
              {quizQuestions[currentQuestion].explanation}
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.nextButton, selectedAnswer === null && styles.disabledButton]}
        onPress={handleNextQuestion}
        disabled={selectedAnswer === null}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestion + 1 === quizQuestions.length ? 'Finish Quiz' : 'Next Question'}
        </Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  scoreCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 30,
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF8FF',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  wrongOption: {
    borderColor: '#EF4444',
    backgroundColor: '#EF4444',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  selectedOptionText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  correctOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  wrongOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  explanationContainer: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#10B981',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  resultContainer: {
    alignItems: 'center',
    padding: 40,
    margin: 20,
    borderRadius: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reviewContainer: {
    margin: 20,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  reviewAnswer: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  correctAnswer: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 8,
  },
  explanation: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});