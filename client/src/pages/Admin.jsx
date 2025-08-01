import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Users, BookOpen, Target } from "lucide-react"
import AdminCreateContent from "../components/AdminPage/AdminCreateContent"
import AdminQuiz from "../components/AdminPage/AdminQuiz"
import AdminTrustee from "../components/AdminPage/AdminTrustee"
import AdminSettings from "../components/AdminPage/AdminSetting"

const Admin = () => {
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

        <TabsContent value="content">
          <AdminCreateContent />
        </TabsContent>
        <TabsContent value="quizzes">
          <AdminQuiz />
        </TabsContent>
        <TabsContent value="trustees">
          <AdminTrustee />
        </TabsContent>
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Admin