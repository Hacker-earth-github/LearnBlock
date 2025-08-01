import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save } from "lucide-react"

const AdminQuiz = () => {
  const [newQuestion, setNewQuestion] = useState({
    contentId: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  })

  const handleQuestionSubmit = (e) => {
    e.preventDefault()
    console.log("Adding question:", newQuestion)
    setNewQuestion({
      contentId: "",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    })
  }

  return (
    <div className="space-y-6">
      {/* Add Quiz Question */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-blue-600" />
            <span>Add Quiz Question</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contentId">Content ID</Label>
              <Input
                id="contentId"
                type="number"
                value={newQuestion.contentId}
                onChange={(e) => setNewQuestion({ ...newQuestion, contentId: e.target.value })}
                placeholder="Enter content ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="Enter the quiz question..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Answer Options</Label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options]
                      newOptions[index] = e.target.value
                      setNewQuestion({ ...newQuestion, options: newOptions })
                    }}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant={newQuestion.correctAnswer === index ? "default" : "outline"}
                    onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                  >
                    {newQuestion.correctAnswer === index ? "Correct" : "Mark Correct"}
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminQuiz