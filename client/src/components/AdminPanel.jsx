
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Settings, Users, BookOpen, Target, Trash2, Edit, Save, X } from "lucide-react"

const AdminPanel = () => {
  const [newContent, setNewContent] = useState({
    title: "",
    body: "",
    sources: "",
    pointReward: "",
  })

  const [newQuestion, setNewQuestion] = useState({
    contentId: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  })

  const mockContents = [
    {
      id: 1,
      title: "Introduction to Blockchain Technology",
      pointReward: 200,
      quizQuestions: 3,
      status: "Published",
    },
    {
      id: 2,
      title: "Smart Contract Development with Solidity",
      pointReward: 400,
      quizQuestions: 5,
      status: "Draft",
    },
    {
      id: 3,
      title: "DeFi Protocols and Yield Farming",
      pointReward: 300,
      quizQuestions: 4,
      status: "Published",
    },
  ]

  const mockTrustees = [
    { address: "0x1234...5678", role: "Admin", addedDate: "2024-01-15" },
    { address: "0x9abc...def0", role: "Content Creator", addedDate: "2024-02-01" },
    { address: "0x5678...9abc", role: "Moderator", addedDate: "2024-02-15" },
  ]

  const handleContentSubmit = (e) => {
    e.preventDefault()
    console.log("Creating content:", newContent)
    // Reset form
    setNewContent({ title: "", body: "", sources: "", pointReward: "" })
  }

  const handleQuestionSubmit = (e) => {
    e.preventDefault()
    console.log("Adding question:", newQuestion)
    // Reset form
    setNewQuestion({
      contentId: "",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    })
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-purple-600" />
            <span>Admin Panel</span>
          </CardTitle>
          <CardDescription>Manage content, quizzes, and platform settings</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Quizzes</span>
          </TabsTrigger>
          <TabsTrigger value="trustees" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Trustees</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {/* Create New Content */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-green-600" />
                <span>Create New Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContentSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newContent.title}
                      onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                      placeholder="Enter content title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pointReward">Point Reward</Label>
                    <Input
                      id="pointReward"
                      type="number"
                      value={newContent.pointReward}
                      onChange={(e) => setNewContent({ ...newContent, pointReward: e.target.value })}
                      placeholder="Points to award"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Content Body</Label>
                  <Textarea
                    id="body"
                    value={newContent.body}
                    onChange={(e) => setNewContent({ ...newContent, body: e.target.value })}
                    placeholder="Enter the main content..."
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sources">Sources (comma-separated)</Label>
                  <Input
                    id="sources"
                    value={newContent.sources}
                    onChange={(e) => setNewContent({ ...newContent, sources: e.target.value })}
                    placeholder="https://source1.com, https://source2.com"
                  />
                </div>

                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Create Content
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Content */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Existing Content</CardTitle>
              <CardDescription>Manage published and draft content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockContents.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{content.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-slate-600">{content.pointReward} points</span>
                        <span className="text-sm text-slate-600">{content.quizQuestions} quiz questions</span>
                        <Badge variant={content.status === "Published" ? "default" : "secondary"}>
                          {content.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="trustees" className="space-y-6">
          {/* Current Trustees */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Current Trustees</CardTitle>
              <CardDescription>Manage platform trustees and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTrustees.map((trustee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-mono text-sm">{trustee.address}</div>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge>{trustee.role}</Badge>
                        <span className="text-sm text-slate-600">Added: {trustee.addedDate}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                      <X className="w-3 h-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add New Trustee */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-green-600" />
                <span>Add New Trustee</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trusteeAddress">Wallet Address</Label>
                  <Input id="trusteeAddress" placeholder="0x..." className="font-mono" />
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trustee
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Platform Settings */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure platform parameters and rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Reward Configuration</h3>
                  <div className="space-y-2">
                    <Label>XFI per Point</Label>
                    <Input defaultValue="0.1" type="number" step="0.01" />
                  </div>
                  <div className="space-y-2">
                    <Label>Points per Badge</Label>
                    <Input defaultValue="500" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Golden Badge Threshold</Label>
                    <Input defaultValue="5" type="number" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Contract Information</h3>
                  <div className="space-y-2">
                    <Label>Contract Address</Label>
                    <Input value="0x1234567890abcdef..." readOnly className="font-mono bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contract Balance</Label>
                    <Input value="1,250.5 XFI" readOnly className="bg-slate-50" />
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Fund Contract
                  </Button>
                </div>
              </div>

              <Button className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPanel