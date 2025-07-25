import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Trophy, Clock, Target, Zap } from "lucide-react"


const mockQuiz = {
  contentId: 1,
  title: "Blockchain Fundamentals Quiz",
  description: "Test your knowledge of blockchain basics",
  pointReward: 300,
  questions: [
    {
      question: "What is a blockchain?",
      options: [
        "A centralized database",
        "A distributed ledger technology",
        "A type of cryptocurrency",
        "A programming language",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is the primary purpose of mining in blockchain?",
      options: [
        "To create new cryptocurrencies",
        "To validate transactions and secure the network",
        "To store data efficiently",
        "To reduce transaction fees",
      ],
      correctAnswer: 1,
    },
    {
      question: "What makes blockchain transactions immutable?",
      options: [
        "Government regulations",
        "Cryptographic hashing and consensus mechanisms",
        "High transaction fees",
        "Limited network access",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is a smart contract?",
      options: [
        "A legal document",
        "A self-executing contract with terms directly written into code",
        "A type of cryptocurrency wallet",
        "A blockchain mining algorithm",
      ],
      correctAnswer: 1,
    },
    {
      question: "Which consensus mechanism does Bitcoin use?",
      options: ["Proof of Stake", "Proof of Work", "Delegated Proof of Stake", "Proof of Authority"],
      correctAnswer: 1,
    },
  ],
}

const QuizInterface = () => {
const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    selectedAnswers.forEach((answer, index) => {
      if (answer === mockQuiz.questions[index].correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const score = calculateScore()
  const percentage = Math.round((score / mockQuiz.questions.length) * 100)

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 via-purple-500 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-100">{mockQuiz.title}</CardTitle>
            <CardDescription className="text-base text-slate-200">{mockQuiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-slate-300">{mockQuiz.questions.length}</div>
                <div className="text-sm text-slate-400">Questions</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-300">{mockQuiz.pointReward}</div>
                <div className="text-sm text-green-400">Points</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-300">~10</div>
                <div className="text-sm text-purple-400">Minutes</div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-400/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold text-emerald-200 mb-2">Quiz Instructions:</h3>
              <ul className="text-sm text-emerald-300 space-y-1">
                <li>• Answer all questions to complete the quiz</li>
                <li>• You can navigate back and forth between questions</li>
                <li>• Earn points based on correct answers</li>
                <li>• You can only take this quiz once</li>
              </ul>
            </div>

            <Button
              onClick={() => setQuizStarted(true)}
              className="w-full bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 border-0"
              size="lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
          <CardHeader className="text-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                percentage >= 80 ? "bg-green-500/20" : percentage >= 60 ? "bg-yellow-500/20" : "bg-red-500/20"
              }`}
            >
              <Trophy
                className={`w-10 h-10 ${
                  percentage >= 80 ? "text-green-400" : percentage >= 60 ? "text-yellow-400" : "text-red-400"
                }`}
              />
            </div>
            <CardTitle className="text-2xl text-slate-100">Quiz Complete!</CardTitle>
            <CardDescription className="text-slate-200">
              You scored {score} out of {mockQuiz.questions.length} questions correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div
                className={`text-4xl font-bold mb-2 ${
                  percentage >= 80 ? "text-green-400" : percentage >= 60 ? "text-yellow-400" : "text-red-400"
                }`}
              >
                {percentage}%
              </div>
              <Progress value={percentage} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{score}</div>
                <div className="text-sm text-green-300">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                <div className="text-2xl font-bold text-emerald-400">
                  {Math.round((score / mockQuiz.questions.length) * mockQuiz.pointReward)}
                </div>
                <div className="text-sm text-emerald-300">Points Earned</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-slate-100">Review Your Answers:</h3>
              {mockQuiz.questions.map((question, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/10 rounded-lg">
                  {selectedAnswers[index] === question.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-100">{question.question}</p>
                    <p className="text-xs text-slate-300">Your answer: {question.options[selectedAnswers[index]]}</p>
                    {selectedAnswers[index] !== question.correctAnswer && (
                      <p className="text-xs text-green-400">Correct: {question.options[question.correctAnswer]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => {
                  setQuizStarted(false)
                  setShowResults(false)
                  setCurrentQuestion(0)
                  setSelectedAnswers([])
                }}
                variant="outline"
                className="flex-1 bg-slate-800/20 border-slate-600/20 text-emerald-300 hover:bg-emerald-500/20"
              >
                Take Another Quiz
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0">
                Claim Points
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = mockQuiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / mockQuiz.questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-100">
                Question {currentQuestion + 1} of {mockQuiz.questions.length}
              </CardTitle>
              <CardDescription className="text-slate-200">{mockQuiz.title}</CardDescription>
            </div>
            <Badge
              variant="outline"
              className="flex items-center space-x-1 bg-slate-800/20 border-slate-600/20 text-emerald-300"
            >
              <Clock className="w-3 h-3" />
              <span>10:00</span>
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-100">{currentQ.question}</h3>
            <RadioGroup
              value={selectedAnswers[currentQuestion]?.toString()}
              onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-emerald-500/10 border border-transparent hover:border-emerald-400/20"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-slate-200">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="bg-slate-800/20 border-slate-600/20 text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 border-0 disabled:opacity-50"
            >
              {currentQuestion === mockQuiz.questions.length - 1 ? "Finish Quiz" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

}

export default QuizInterface