import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, Users, BookOpen, Target, Home } from "lucide-react";
import AdminCreateContent from "../components/AdminPage/AdminCreateContent";
import AdminQuiz from "../components/AdminPage/AdminQuiz";
import AdminTrustee from "../components/AdminPage/AdminTrustee";
import AdminSettings from "../components/AdminPage/AdminSetting";
import { Link } from "react-router-dom";

const Admin = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <Card className="relative bg-gradient-to-r from-slate-800 to-gray-800 border border-slate-200 shadow-sm rounded-lg overflow-hidden">
          <CardHeader className="relative z-10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-3 text-2xl font-semibold text-white">
                  <Settings className="w-7 h-7 text-slate-300" />
                  <span>Admin Panel</span>
                </CardTitle>
                <CardDescription className="text-slate-300 text-base mt-2">
                  Manage content, quizzes, trustees, and platform settings with ease
                </CardDescription>
              </div>
              
              {/* Home Navigation Button */}
             <Link to="/">
             <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-slate-300 text-white hover:bg-slate-700 hover:border-slate-200 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
             </Link>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs Navigation */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            {[
              { value: "content", icon: BookOpen, label: "Content" },
              { value: "quizzes", icon: Target, label: "Quizzes" },
              { value: "trustees", icon: Users, label: "Trustees" },
              { value: "settings", icon: Settings, label: "Settings" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center space-x-2 px-4 py-2.5 text-slate-600 font-medium rounded-md transition-all duration-200 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-50"
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="content" className="mt-6">
            <Card className="bg-white border border-slate-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                  <span>Manage Content</span>
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Create, edit, and organize educational content for the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCreateContent />
                {/* Placeholder for testing */}
           
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="mt-6">
            <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-gray-600" />
                  <span>Manage Quizzes</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Design and update quizzes to test user knowledge.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminQuiz />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trustees" className="mt-6">
            <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span>Manage Trustees</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Add or remove trustees to manage platform administration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminTrustee />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>Platform Settings</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure platform-wide settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;