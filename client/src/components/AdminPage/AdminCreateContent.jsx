import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Save, BookOpen, Award, Sparkles, Zap, Star, Crown, AlertCircle } from "lucide-react";
import { useLearnBlock } from "@/context/LearnBlockContext";
import useCreateContent from "@/hooks/useCreateContent";
import useAddQuizQuestion from "@/hooks/useAddQuestion";
import { toast } from "react-toastify";

const AdminCreateContent = () => {
  const { learnBlocks, loadAllContentIds, contract, address, isConnected } = useLearnBlock();
  const { createContent, updateContent, deleteContent, isCreating, isUpdating, isDeleting, error: contentError, getContentMetadata } = useCreateContent();
  const { addQuizQuestion, isAddingQuestion, error: quizError } = useAddQuizQuestion();
  const [newContent, setNewContent] = useState({
    title: "",
    body: "",
    sources: "",
    pointReward: "",
    readTime: "",
    difficulty: "Beginner",
    category: "Blockchain",
  });
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);
  const [editingContentId, setEditingContentId] = useState(null);
  const [isTrustee, setIsTrustee] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const checkTrustee = async () => {
      if (!contract || !address) return;
      try {
        const trusteeStatus = await contract.isTrustee(address);
        setIsTrustee(trusteeStatus);
      } catch (err) {
        console.error("Error checking trustee status:", err);
        toast.error("Failed to verify trustee status.", { position: "top-right", autoClose: 5000 });
        setIsTrustee(false);
      }
    };
    checkTrustee();
  }, [contract, address]);

  const handleContentChange = (field, value) => {
    setNewContent((prev) => ({ ...prev, [field]: value }));
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

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!isTrustee) {
      toast.error("Unauthorized: Only trustees can create or edit content.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (!newContent.title || !newContent.body || !newContent.pointReward || !newContent.readTime || !newContent.difficulty || !newContent.category) {
      setFormError("All required content fields must be filled.");
      toast.error("All required content fields must be filled.", { position: "top-right", autoClose: 5000 });
      return;
    }
    if (isNaN(newContent.pointReward) || Number(newContent.pointReward) < 0) {
      setFormError("Point reward must be a non-negative number.");
      toast.error("Point reward must be a non-negative number.", { position: "top-right", autoClose: 5000 });
      return;
    }

    for (const question of questions) {
      if (question.question || question.options.some((opt) => opt.trim())) {
        if (!question.question || question.options.some((opt) => !opt.trim()) || question.correctAnswer >= question.options.length) {
          setFormError("All questions and answer options must be filled, and correct answer must be valid.");
          toast.error("All questions and answer options must be filled, and correct answer must be valid.", { position: "top-right", autoClose: 5000 });
          return;
        }
      }
    }

    const contentPayload = {
      title: newContent.title,
      body: newContent.body,
      sources: newContent.sources.split(",").map((s) => s.trim()).filter((s) => s),
      pointReward: Number(newContent.pointReward),
      readTime: newContent.readTime,
      difficulty: newContent.difficulty,
      category: newContent.category,
    };

    const success = editingContentId
      ? await updateContent(editingContentId, contentPayload)
      : await createContent(contentPayload);

    if (!success || !success.contentId) {
      setFormError("Failed to save content. Please try again.");
      toast.error("Failed to save content. Please try again.", { position: "top-right", autoClose: 5000 });
      return;
    }

    for (const question of questions) {
      if (question.question && question.options.every((opt) => opt.trim())) {
        const quizSuccess = await addQuizQuestion({
          contentId: success.contentId,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
        });
        if (!quizSuccess) {
          setFormError("Failed to add one or more quiz questions.");
          toast.error("Failed to add one or more quiz questions.", { position: "top-right", autoClose: 5000 });
          return;
        }
      }
    }

    setNewContent({
      title: "",
      body: "",
      sources: "",
      pointReward: "",
      readTime: "",
      difficulty: "Beginner",
      category: "Blockchain",
    });
    setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
    setEditingContentId(null);
    await loadAllContentIds();
    toast.success(editingContentId ? "Content updated successfully!" : "Content created successfully!", {
      position: "top-right",
      autoClose: 5000,
    });
  };

  const handleEdit = async (content) => {
    setEditingContentId(content.id);
    const metadata = getContentMetadata(content.id);
    setNewContent({
      title: content.title,
      body: content.body,
      sources: content.sources.join(", "),
      pointReward: content.pointReward.toString(),
      readTime: metadata.readTime || "15 min",
      difficulty: metadata.difficulty || "Beginner",
      category: metadata.category || "Blockchain",
    });
    setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const handleDelete = async (contentId) => {
    if (!isTrustee) {
      toast.error("Unauthorized: Only trustees can delete content.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    if (window.confirm("Are you sure you want to delete this content?")) {
      const success = await deleteContent(contentId);
      if (success) {
        await loadAllContentIds();
        toast.success("Content deleted successfully!", { position: "top-right", autoClose: 5000 });
      } else {
        toast.error("Failed to delete content.", { position: "top-right", autoClose: 5000 });
      }
    }
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

  if (!isTrustee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-slate-800/95 backdrop-blur-xl border-slate-700 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Unauthorized</h2>
              <p className="text-slate-300 leading-relaxed">Only trustees can manage content and quizzes.</p>
            </div>
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
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">LearnBlock Admin</h1>
                  <p className="text-xs text-slate-400">Manage Blockchain Education</p>
                </div>
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
        {(contentError || quizError || formError) && (
          <Alert className="mb-6 bg-red-900/20 border-red-500/30 text-left">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{contentError || quizError || formError}</AlertDescription>
          </Alert>
        )}
        <Card className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-100 flex items-center">
              <Plus className="w-6 h-6 mr-2 text-emerald-400" />
              {editingContentId ? "Edit Content" : "Create New Content"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContentSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">Title</Label>
                  <Input
                    id="title"
                    value={newContent.title}
                    onChange={(e) => handleContentChange("title", e.target.value)}
                    placeholder="Enter content title"
                    className="bg-slate-700/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pointReward" className="text-slate-300">Point Reward</Label>
                  <Input
                    id="pointReward"
                    type="number"
                    value={newContent.pointReward}
                    onChange={(e) => handleContentChange("pointReward", e.target.value)}
                    placeholder="Points to award"
                    className="bg-slate-700/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="readTime" className="text-slate-300">Read Time</Label>
                  <Input
                    id="readTime"
                    value={newContent.readTime}
                    onChange={(e) => handleContentChange("readTime", e.target.value)}
                    placeholder="e.g., 15 min"
                    className="bg-slate-700/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-slate-300">Difficulty</Label>
                  <Select
                    value={newContent.difficulty}
                    onValueChange={(value) => handleContentChange("difficulty", value)}
                  >
                    <SelectTrigger className="bg-slate-700/80 border-slate-600 text-slate-100">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-slate-100">
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-300">Category</Label>
                <Select
                  value={newContent.category}
                  onValueChange={(value) => handleContentChange("category", value)}
                >
                  <SelectTrigger className="bg-slate-700/80 border-slate-600 text-slate-100">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-slate-100">
                    {["Blockchain", "Development", "DeFi", "NFTs", "Security", "Scaling"].map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="body" className="text-slate-300">Content Body</Label>
                <Textarea
                  id="body"
                  value={newContent.body}
                  onChange={(e) => handleContentChange("body", e.target.value)}
                  placeholder="Enter the main content..."
                  className="bg-slate-700/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sources" className="text-slate-300">Sources (comma-separated)</Label>
                <Input
                  id="sources"
                  value={newContent.sources}
                  onChange={(e) => handleContentChange("sources", e.target.value)}
                  placeholder="https://source1.com, https://source2.com"
                  className="bg-slate-700/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />
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
                        className="bg-slate-600/80 border-slate-500 text-slate-100 placeholder:text-slate-400"
                        required={question.options.some((opt) => opt.trim())}
                      />
                      <div className="space-y-2">
                        <Label className="text-slate-300">Answer Options</Label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2">
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                              className="bg-slate-600/80 border-slate-500 text-slate-100 placeholder:text-slate-400"
                              required={question.question.trim() || question.options.some((opt, i) => i !== oIndex && opt.trim())}
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
                disabled={isCreating || isUpdating || isAddingQuestion}
                className="w-full bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {(isCreating || isUpdating || isAddingQuestion) ? (
                  <>
                    <Save className="w-5 h-5 mr-2 animate-spin" />
                    {editingContentId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {editingContentId ? "Update Content & Questions" : "Create Content & Questions"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="mt-6 bg-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-100 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-emerald-400" />
              Existing Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {learnBlocks.map((content) => {
                const metadata = getContentMetadata(content.id);
                return (
                  <div key={content.id} className="flex items-center justify-between p-4 bg-slate-700/80 border border-slate-600/50 rounded-xl hover:shadow-sm transition-all duration-300">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-100">{content.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-slate-300">{content.pointReward} points</span>
                        <span className="text-sm text-slate-300">{metadata?.category || "Uncategorized"}</span>
                        <Badge className="bg-emerald-400/20 text-emerald-400 border-emerald-400/50">Published</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(content)}
                        className="bg-slate-700/80 border-slate-600 text-emerald-400 hover:bg-emerald-400/20"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(content.id)}
                        disabled={isDeleting}
                        className="bg-slate-700/80 border-slate-600 text-red-400 hover:bg-red-400/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCreateContent;