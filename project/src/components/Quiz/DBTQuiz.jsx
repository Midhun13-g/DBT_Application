import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';

const DBTQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const allQuestions = [
    {
      question: "What does DBT stand for?",
      options: [
        "Direct Bank Transfer",
        "Direct Benefit Transfer", 
        "Digital Banking Technology",
        "Direct Business Transaction"
      ],
      correct: 1,
      explanation: "DBT stands for Direct Benefit Transfer - a system to transfer subsidies directly to beneficiaries' bank accounts."
    },
    {
      question: "Which document is mandatory for DBT linking?",
      options: [
        "PAN Card",
        "Voter ID",
        "Aadhaar Card",
        "Driving License"
      ],
      correct: 2,
      explanation: "Aadhaar Card is mandatory for DBT linking as it serves as the unique identifier for beneficiaries."
    },
    {
      question: "What happens if your bank account is not linked to Aadhaar?",
      options: [
        "You get cash payments",
        "Benefits are delayed or denied",
        "Nothing changes",
        "You get double benefits"
      ],
      correct: 1,
      explanation: "If your bank account is not linked to Aadhaar, your DBT benefits may be delayed or denied."
    },
    {
      question: "How can you check your DBT status?",
      options: [
        "Only at bank branches",
        "Through this portal, WhatsApp, or IVR",
        "Only through government offices",
        "Only via SMS"
      ],
      correct: 1,
      explanation: "You can check DBT status through multiple channels: web portal, WhatsApp bot, IVR system, and SMS."
    },
    {
      question: "What is the main benefit of DBT?",
      options: [
        "Faster internet",
        "Direct transfer without middlemen",
        "Free mobile recharge",
        "Tax exemption"
      ],
      correct: 1,
      explanation: "DBT eliminates middlemen and ensures direct transfer of benefits to beneficiaries' accounts."
    },
    {
      question: "Which ministry primarily handles DBT in India?",
      options: [
        "Ministry of Finance",
        "Ministry of Electronics and IT",
        "Ministry of Rural Development",
        "All of the above"
      ],
      correct: 3,
      explanation: "DBT is handled by multiple ministries including Finance, Electronics & IT, and Rural Development."
    },
    {
      question: "What is the maximum time for DBT transfer?",
      options: [
        "24 hours",
        "48 hours",
        "72 hours",
        "1 week"
      ],
      correct: 2,
      explanation: "DBT transfers typically complete within 72 hours of processing."
    },
    {
      question: "Which of these is NOT a DBT scheme?",
      options: [
        "MGNREGA",
        "PM-KISAN",
        "Aadhaar Card",
        "LPG Subsidy"
      ],
      correct: 2,
      explanation: "Aadhaar Card is an identity document, not a DBT scheme. Others are DBT-enabled schemes."
    },
    {
      question: "What should you do if DBT transfer fails?",
      options: [
        "Wait indefinitely",
        "Contact bank and verify Aadhaar linking",
        "Apply for new Aadhaar",
        "Give up on benefits"
      ],
      correct: 1,
      explanation: "If DBT fails, contact your bank to verify Aadhaar linking and account details."
    }
  ];

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeQuiz = () => {
    const shuffled = shuffleArray(allQuestions).slice(0, 5);
    setShuffledQuestions(shuffled);
  };

  React.useEffect(() => {
    initializeQuiz();
  }, []);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === shuffledQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    initializeQuiz();
  };

  const getScoreMessage = () => {
    const percentage = (score / shuffledQuestions.length) * 100;
    if (percentage >= 80) return "Excellent! You're a DBT expert! 🏆";
    if (percentage >= 60) return "Good job! You know DBT well! 👍";
    if (percentage >= 40) return "Not bad! Keep learning about DBT! 📚";
    return "Keep practicing! Learn more about DBT! 💪";
  };

  if (quizCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h3>
          <p className="text-lg text-gray-600 mb-4">
            Your Score: {score}/{shuffledQuestions.length} ({Math.round((score/shuffledQuestions.length)*100)}%)
          </p>
          <p className="text-lg font-medium text-blue-600 mb-6">
            {getScoreMessage()}
          </p>
          <Button onClick={resetQuiz} icon={RotateCcw}>
            Take Quiz Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {shuffledQuestions.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            Score: {score}/{shuffledQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {shuffledQuestions.length > 0 && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {shuffledQuestions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3">
              {shuffledQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? showResult
                        ? index === shuffledQuestions[currentQuestion].correct
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-red-500 bg-red-50 text-red-800'
                        : 'border-blue-500 bg-blue-50'
                      : showResult && index === shuffledQuestions[currentQuestion].correct
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <span>
                        {index === shuffledQuestions[currentQuestion].correct ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : null}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showResult && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Explanation:</strong> {shuffledQuestions[currentQuestion].explanation}
              </p>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null || showResult}
        >
          {currentQuestion === shuffledQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </Card>
  );
};

export default DBTQuiz;