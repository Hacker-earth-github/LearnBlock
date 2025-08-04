import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, Clock, Star, Search, CheckCircle, Zap, Brain, Globe, AlertCircle } from "lucide-react";
import { useLearnBlock } from "@/context/useLearnBlock";
import useReadArticle from "@/hooks/useReadArticle";
import useTakeQuiz from "@/hooks/useTakeQuiz";
import useCreateContent from "@/hooks/useCreateContent";
import { toast } from "react-toastify";

const categoryIcons = {
  Blockchain: Globe,
  Development: Brain,
  DeFi: Zap,
  NFTs: Star,
  Security: Brain,
  Scaling: Zap,
};

const ContentLibrary = () => {
  const { learnBlocks, completedContent, isConnected, getQuizQuestions, getContent } = useLearnBlock();
  const { readArticle, isReading } = useReadArticle();
  const { takeQuiz, isTakingQuiz } = useTakeQuiz();
  const { getContentMetadata } = useCreateContent();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedContent, setSelectedContent] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizError, setQuizError] = useState(null);

  const categories = ["All", "Blockchain", "Development", "DeFi", "NFTs", "Security", "Scaling"];

  const filteredContent = learnBlocks.map((content) => {
    const metadata = getContentMetadata(content.id);
    return {
      ...content,
      description: content.body.slice(0, 150) + (content.body.length > 150 ? "..." : ""),
      category: metadata.category || "Blockchain",
      difficulty: metadata.difficulty || "Beginner",
      readTime: metadata.readTime || "15 min",
    };
  }).filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-300";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleReadArticle = async (contentId) => {
    const success = await readArticle(contentId);
    if (success) {
      setSelectedContent({ ...selectedContent, completed: true });
      toast.success("Article marked as read!", { position: "top-right", autoClose: 3000 });
    } else {
      toast.error("Failed to mark article as read.", { position: "top-right", autoClose: 5000 });
    }
  };

  const handleTakeQuiz = async (contentId) => {
    if (!Object.keys(userAnswers).length) {
      setQuizError("Please answer all questions before submitting.");
      return;
    }
    const success = await takeQuiz(contentId);
    if (success) {
      setSelectedContent({ ...selectedContent, completed: true });
      toast.success("Quiz submitted successfully!", { position: "top-right", autoClose: 3000 });
      setUserAnswers({});
    } else {
      toast.error("Failed to submit quiz.", { position: "top-right", autoClose: 5000 });
    }
  };

  const fetchQuizQuestions = useCallback(async (contentId) => {
    try {
      const { questions, options, correctIndexes } = await getQuizQuestions(contentId);
      setQuizQuestions(
        questions.map((question, index) => ({
          question,
          options: options[index],
          correctAnswerIndex: correctIndexes[index],
        }))
      );
    } catch (err) {
      console.error("Error fetching quiz questions:", err);
      setQuizError("Failed to load quiz questions.");
      toast.error("Failed to load quiz questions.", { position: "top-right", autoClose: 5000 });
    }
  }, [getQuizQuestions]);

  useEffect(() => {
    if (selectedContent) {
      fetchQuizQuestions(selectedContent.id);
    }
  }, [selectedContent, fetchQuizQuestions]);

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
    setQuizError(null);
  };

  if (selectedContent) {
    const IconComponent = categoryIcons[selectedContent.category] || Globe;
    const isCompleted = selectedContent.completed || completedContent.includes(selectedContent.id.toString());
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedContent(null);
              setQuizQuestions([]);
              setUserAnswers({});
              setQuizError(null);
            }}
            className="mb-4 bg-white border-gray-300 text-blue-600 hover:bg-blue-50"
          >
            ← Back to Library
          </Button>
        </div>
        <Card className="bg-gray-50 border-gray-200 text-gray-900">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900">{selectedContent.title}</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      {selectedContent.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getDifficultyColor(selectedContent.difficulty)}>
                    {selectedContent.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{selectedContent.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>{selectedContent.pointReward} points</span>
                  </div>
                </div>
              </div>
              {isCompleted && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none text-gray-800">
              <h3 className="text-gray-700">Content</h3>
              <p>{selectedContent.body}</p>
              {selectedContent.sources.length > 0 && (
                <>
                  <h3 className="text-gray-700">Sources</h3>
                  <ul className="text-gray-700">
                    {selectedContent.sources.map((source, index) => (
                      <li key={index}>
                        <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {source}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            {quizQuestions.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-700 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-blue-500" />
                  Quiz
                </h3>
                {quizError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{quizError}</AlertDescription>
                  </Alert>
                )}
                {quizQuestions.map((question, qIndex) => (
                  <Card key={qIndex} className="bg-white border-gray-200">
                    <CardContent className="p-4 space-y-4">
                      <h4 className="text-gray-800 font-medium">{question.question}</h4>
                      <RadioGroup
                        value={userAnswers[qIndex]?.toString()}
                        onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}
                        disabled={isTakingQuiz || !isConnected || isCompleted}
                      >
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                            <Label htmlFor={`q${qIndex}-o${oIndex}`} className="text-gray-700">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  onClick={() => handleTakeQuiz(selectedContent.id)}
                  disabled={isTakingQuiz || !isConnected || isCompleted}
                  className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                >
                  {isTakingQuiz ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Quiz
                    </>
                  )}
                </Button>
              </div>
            )}
            <div className="flex space-x-4">
              <Button
                onClick={() => handleReadArticle(selectedContent.id)}
                disabled={isReading || !isConnected || isCompleted}
                className="bg-blue-500 hover:bg-blue-600 text-white border-0"
              >
                {isReading ? (
                  <>
                    <BookOpen className="w-4 h-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Complete Reading
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-blue-500 text-white border-0"
                  : "bg-white border-gray-300 text-blue-600 hover:bg-blue-50"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content) => {
          const IconComponent = categoryIcons[content.category] || Globe;
          const isCompleted = completedContent.includes(content.id.toString());
          return (
            <Card
              key={content.id}
              className="bg-gray-50 border-gray-200 hover:border-blue-300 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-blue-200"
              onClick={async () => {
                try {
                  const { title, body, sources, pointReward } = await getContent(content.id);
                  setSelectedContent({
                    ...content,
                    title,
                    body,
                    sources,
                    pointReward,
                    completed: isCompleted,
                  });
                } catch (err) {
                  console.error("Error fetching content:", err);
                  toast.error("Failed to load content details.", { position: "top-right", autoClose: 5000 });
                }
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 text-gray-900 group-hover:text-blue-600">
                        {content.title}
                      </CardTitle>
                    </div>
                  </div>
                  {isCompleted && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                </div>
                <CardDescription className="line-clamp-3 text-gray-600">
                  {content.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(content.difficulty)}>
                      {content.difficulty}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{content.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm font-medium text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>{content.pointReward}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ContentLibrary;