import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Save } from "lucide-react";
import { useLearnBlock } from "@/context/useLearnBlock";
import useAddQuizQuestion from "@/hooks/useAddQuestion";

const AdminQuiz = () => {
  const { isConnected, address, getContent } = useLearnBlock();
  const { addQuizQuestion, isAddingQuestion, error } = useAddQuizQuestion();
  const [newQuestion, setNewQuestion] = useState({
    contentId: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });
  const [contentError, setContentError] = useState(null);

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

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (newQuestion.options.some((option) => option.trim() === "")) {
      setContentError("All answer options must be filled.");
      return;
    }
    const isValidContentId = await validateContentId(newQuestion.contentId);
    if (!isValidContentId) {
      setContentError("Invalid content ID. Please ensure the content exists.");
      return;
    }
    const success = await addQuizQuestion(newQuestion);
    if (success) {
      setNewQuestion({
        contentId: "",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      });
      setContentError(null);
    }
  };

  if (!isConnected || !address) {
    return (
      <Alert variant="destructive" className="border-gray-200 bg-gray-50">
        <AlertDescription className="text-gray-800">Please connect your wallet to add quiz questions.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {(error || contentError) && (
        <Alert variant="destructive" className="border-gray-200 bg-gray-50">
          <AlertDescription className="text-gray-800">{error || contentError}</AlertDescription>
        </Alert>
      )}

      {/* Add Quiz Question */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Plus className="w-5 h-5 text-gray-600" />
            <span>Add Quiz Question</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="contentId" className="text-gray-700 font-medium">Content ID</Label>
              <Input
                id="contentId"
                type="number"
                value={newQuestion.contentId}
                onChange={(e) => setNewQuestion({ ...newQuestion, contentId: e.target.value })}
                placeholder="Enter content ID"
                min="1"
                required
                className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 placeholder:text-black text-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question" className="text-gray-700 font-medium">Question</Label>
              <Textarea
                id="question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="Enter the quiz question..."
                rows={3}
                required
                className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 placeholder:text-black text-black"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Answer Options</Label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                    required
                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 placeholder:text-black text-black"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant={newQuestion.correctAnswer === index ? "default" : "outline"}
                    onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                    className={
                      newQuestion.correctAnswer === index 
                        ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-800" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    {newQuestion.correctAnswer === index ? "Correct" : "Mark Correct"}
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isAddingQuestion}
              onClick={handleQuestionSubmit}
              className="bg-gray-800 hover:bg-gray-700 text-white border-0"
            >
              {isAddingQuestion ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Add Question
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuiz;