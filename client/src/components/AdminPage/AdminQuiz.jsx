import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Save, Trash2, BookOpen, Award, Sparkles, Zap, Star, Crown, AlertCircle } from "lucide-react";
import { useLearnBlock } from "@/context/LearnBlockContext";
import useAddQuizQuestion from "@/hooks/useAddQuestion";

const AdminContent = () => {
  const { isConnected, address, getContent } = useLearnBlock();
  const { addQuizQuestion, isAddingQuestion, error: quizError } = useAddQuizQuestion();
  const [content, setContent] = useState({
    title: "",
    type: "",
    points: "",
  });
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);
  const [formError, setFormError] = useState(null);

  // Placeholder for content creation; replace with actual logic
  const addContent = async ({ title, type, points }) => {
    try {
      // Simulate content creation (replace with your actual implementation, e.g., from useLearnBlock)
      console.log("Adding content:", { title, type, points });
      // Example: await yourContentCreationFunction({ title, type, points });
      return { contentId: Math.floor(Math.random() * 1000) }; // Mock contentId
    } catch (err) {
      console.error("Error adding content:", err);
      return null;
    }
  };

  const validateContentId = async (contentId) => {
    if (!contentId) return false;
    try {
      const content = await getContent(contentId);
      return content && content.exists;
    } catch (err) {
      console.error("Error validating contentId:", err);
      return false;
    }
  };

  const handleContentChange = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = optionIndex;
    setQuestions(newQuestions);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validate content fields
    if (!content.title || !content.type || !content.points) {
      setFormError("All content fields must be filled.");
      return;
    }
    if (isNaN(content.points) || Number(content.points) <= 0) {
      setFormError("Points must be a positive number.");
      return;
    }

    // Validate quiz questions
    for (const question of questions) {
      if (!question.question || question.options.some((opt) => !opt.trim())) {
        setFormError("All questions and answer options must be filled.");
        return;
      }
    }

    // Add content
    const contentResult = await addContent({
      title: content.title,
      type: content.type,
      points: Number(content.points),
    });

    if (!contentResult || !contentResult.contentId) {
      setFormError("Failed to add content. Please try again.");
      return;
    }

    // Add quiz questions
    for (const question of questions) {
      const isValidContentId = await validateContentId(contentResult.contentId);
      if (!isValidContentId) {
        setFormError("Invalid content ID after creation.");
        return;
      }
      const success = await addQuizQuestion({
        contentId: contentResult.contentId,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
      });
      if (!success) {
        setFormError("Failed to add one or more quiz questions.");
        return;
      }
    }

    // Reset form on success
    setContent({ title: "", type: "", points: "" });
    setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-slate-800/95 backdrop-blur-xl border-slate-700 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Connect Wallet</h2>
              <p className="text-slate-300 leading-relaxed">Please connect your wallet to manage content and quizzes.</p>
            </div>
            <Button size="lg" className="w-full bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white py-4 text-lg font-bold rounded-xl shadow-lg">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-1/4 animate-pulse" style={{ animation: `float 6s ease-in-out 0s infinite` }}>
          <Sparkles className="w-8 h-8 text-emerald-400/50" />
        </div>
        <div className="absolute top-64 right-1/4 animate-pulse" style={{ animation: `float 6s ease-in-out 2s infinite` }}>
          <Zap className="w-6 h-6 text-purple-400/50" />
        </div>
        <div className="absolute bottom-64 left-1/5 animate-pulse" style={{ animation: `float 6s ease-in-out 4s infinite` }}>
          <Star className="w-10 h-10 text-sky-400/50" />
        </div>
        <div className="absolute top-1/2 right-1/5 animate-pulse" style={{ animation: `float 6s ease-in-out 1s infinite` }}>
          <Crown className="w-7 h-7 text-yellow-400/50" />
        </div>
      </div>
      <header className="relative bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-sky-500/10" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">LearnBlock Admin</h1>
                <p className="text-xs text-slate-400">Manage Blockchain Education</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar className="w-9 h-9 ring-2 ring-emerald-400/30 shadow-md">
                <AvatarFallback className="bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 text-white text-sm font-bold">
                  {address ? address.slice(2, 4).toUpperCase() : "??"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {(quizError || formError) && (
          <Alert className="mb-6 bg-red-900/20 border-red-500/30 text-left">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{quizError || formError}</AlertDescription>
          </Alert>
        )}
        <Card className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-100 flex items-center">
              <Plus className="w-6 h-6 mr-2 text-emerald-400" />
              Create New Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">Content Title</Label>
                  <Input
                    id="title"
                    value={content.title}
                    onChange={(e) => handleContentChange("title", e.target.value)}
                    placeholder="Enter content title"
                    className="bg-slate-700/80 border-slate-600 text-slate-100 placeholder-slate-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-300">Content Type</Label>
                  <Input
                    id="type"
                    value={content.type}
                    onChange={(e) => handleContentChange("type", e.target.value)}
                    placeholder="e.g., Article, Video"
                    className="bg-slate-700/80 border-slate-600 text-slate-100 placeholder-slate-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points" className="text-slate-300">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={content.points}
                    onChange={(e) => handleContentChange("points", e.target.value)}
                    placeholder="Enter points for completion"
                    min="1"
                    className="bg-slate-700/80 border-slate-600 text-slate-100 placeholder-slate-400"
                    required
                  />
                </div>
              </div>
              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <Label className="text-xl font-bold text-slate-100 flex items-center">
                    <Award className="w-6 h-6 mr-2 text-sky-400" />
                    Quiz Questions
                  </Label>
                  <Button
                    type="button"
                    onClick={addNewQuestion}
                    className="bg-gradient-to-r from-emerald-400 to-purple-500 hover:from-emerald-500 hover:to-purple-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>
                {questions.map((question, qIndex) => (
                  <Card key={qIndex} className="bg-slate-700/80 border-slate-600/50">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Question {qIndex + 1}</Label>
                        {questions.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeQuestion(qIndex)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        value={question.question}
                        onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                        placeholder="Enter quiz question"
                        className="bg-slate-600/80 border-slate-500 text-slate-100 placeholder-slate-400"
                        required
                      />
                      <div className="space-y-2">
                        <Label className="text-slate-300">Answer Options</Label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2">
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                              className="bg-slate-600/80 border-slate-500 text-slate-100 placeholder-slate-400"
                              required
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant={question.correctAnswer === oIndex ? "default" : "outline"}
                              onClick={() => handleCorrectAnswerChange(qIndex, oIndex)}
                              className={question.correctAnswer === oIndex ? "bg-gradient-to-r from-emerald-400 to-purple-500 hover:from-emerald-500 hover:to-purple-600 text-white" : "border-slate-500 text-slate-300"}
                            >
                              {question.correctAnswer === oIndex ? "Correct" : "Mark Correct"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button
                type="submit"
                disabled={isAddingQuestion}
                className="w-full bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {isAddingQuestion ? (
                  <>
                    <Save className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Content & Questions
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminContent;