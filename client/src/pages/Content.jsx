import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Trophy,
  Award,
  Users,
  TrendingUp,
  Wallet,
  CheckCircle,
  Target,
  Play,
  Activity,
  Search,
  Bell,
  Plus,
  Sparkles,
  Zap,
  Star,
  Rocket,
  Crown,
  Gem,
} from "lucide-react"
import ContentLibrary from "@/components/ContentLibrary"
import QuizInterface from "@/components/QuizInterface"
import BadgeShowcase from "@/components/BadgeShowcase"
import UserProfile from "@/components/UserProfile"

function FloatingElement({ children, delay = 0, className = "" }) {
  return (
    <div
      className={`absolute animate-pulse ${className}`}
      style={{
        animation: `float 6s ease-in-out ${delay}s infinite`,
      }}
    >
      {children}
    </div>
  )
}


const Content = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [userProfile, setUserProfile] = useState({
    userId: 1,
    articlesRead: 12,
    quizzesTaken: 8,
    totalPointsEarned: 2400,
    totalPointsRedeemed: 1000,
    badges: 4,
    goldenBadgeClaimed: false,
  })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const connectWallet = async () => {
    setIsConnected(true)
    setUserAddress("0x1234...5678")
  }

  const unredeemedPoints = userProfile.totalPointsEarned - userProfile.totalPointsRedeemed

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />

        {/* Floating Icons */}
        <FloatingElement delay={0} className="top-32 left-1/4">
          <Sparkles className="w-8 h-8 text-emerald-400/50" />
        </FloatingElement>
        <FloatingElement delay={2} className="top-64 right-1/4">
          <Zap className="w-6 h-6 text-purple-400/50" />
        </FloatingElement>
        <FloatingElement delay={4} className="bottom-64 left-1/5">
          <Star className="w-10 h-10 text-sky-400/50" />
        </FloatingElement>
        <FloatingElement delay={1} className="top-1/2 right-1/5">
          <Crown className="w-7 h-7 text-yellow-400/50" />
        </FloatingElement>
      </div>

      {/* Dark Header */}
      <header className="relative bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-sky-500/10" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
                    LearnBlock
                  </h1>
                  <p className="text-xs text-slate-400">Blockchain Education</p>
                </div>
              </div>

              {isConnected && (
                <nav className="hidden md:flex items-center space-x-6">
                  {["Overview", "Courses", "Quizzes", "Badges"].map((item) => (
                    <button
                      key={item}
                      className="relative text-slate-300 hover:text-emerald-400 font-medium transition-all duration-300 group"
                    >
                      {item}
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                    </button>
                  ))}
                </nav>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <>
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64 shadow-sm text-slate-100 placeholder:text-slate-400"
                      />
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-emerald-900/30 rounded-xl text-slate-300">
                      <Bell className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-purple-900/30 rounded-xl text-slate-300">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1 rounded-full shadow-sm">
                      <Gem className="w-3 h-3 mr-1" />
                      {unredeemedPoints} Points
                    </Badge>
                    <Avatar className="w-9 h-9 ring-2 ring-emerald-400/30 shadow-md">
                      <AvatarFallback className="bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 text-white text-sm font-bold">
                        {userAddress.slice(2, 4).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </>
              ) : (
                <Button
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl px-6"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {!isConnected ? (
        // Dark Landing Page
        <div className="relative">
          {/* Hero Section */}
          <div className="relative min-h-screen overflow-hidden">
            {/* Background Image with Dark Overlays */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url(/images/blockchain-hero.png)",
              }}
            />

            {/* Dark Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-emerald-900/80 to-purple-900/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Subtle Animated Particles */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `sparkle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 flex items-center min-h-screen">
              <div className="text-center max-w-5xl mx-auto">
                {/* Dark Badge */}
                <div className="inline-flex items-center space-x-3 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-6 py-3 mb-8 backdrop-blur-xl shadow-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full animate-pulse" />
                  <span className="text-emerald-300 text-sm font-medium">🚀 Powered by Blockchain Technology</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>

                {/* Main Heading with Dark Theme Colors */}
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight">
                  <span className="block bg-gradient-to-r from-emerald-300 via-purple-300 to-sky-300 bg-clip-text text-transparent drop-shadow-sm">
                    Learn
                  </span>
                  <span className="block bg-gradient-to-r from-purple-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm">
                    Blockchain
                  </span>
                  <span className="block bg-gradient-to-r from-sky-300 via-emerald-300 to-purple-300 bg-clip-text text-transparent drop-shadow-sm">
                    Earn Crypto
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed max-w-4xl mx-auto">
                  Join the future of education where knowledge becomes currency. Master blockchain technology,
                  <span className="text-emerald-300 font-semibold"> earn XFI tokens</span>, and
                  <span className="text-purple-300 font-semibold"> collect exclusive NFT badges</span>.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
                  <Button
                    onClick={connectWallet}
                    size="lg"
                    className="group relative bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <Rocket className="w-6 h-6 mr-3 group-hover:animate-bounce relative z-10" />
                    <span className="relative z-10">Start Learning Now</span>
                    <Sparkles className="w-6 h-6 ml-3 group-hover:animate-spin relative z-10" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-2 border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 px-10 py-5 text-xl font-bold rounded-2xl backdrop-blur-xl hover:border-emerald-400/50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </div>

                {/* Dark Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    {
                      number: "100M+",
                      label: "Developers",
                      color: "from-emerald-400 to-emerald-600",
                      bg: "bg-slate-800/30",
                      border: "border-slate-700/50",
                    },
                    {
                      number: "4M+",
                      label: "Organizations",
                      color: "from-purple-400 to-purple-600",
                      bg: "bg-slate-800/30",
                      border: "border-slate-700/50",
                    },
                    {
                      number: "420M+",
                      label: "Repositories",
                      color: "from-sky-400 to-sky-600",
                      bg: "bg-slate-800/30",
                      border: "border-slate-700/50",
                    },
                    {
                      number: "90%",
                      label: "Fortune 100",
                      color: "from-yellow-400 to-orange-500",
                      bg: "bg-slate-800/30",
                      border: "border-slate-700/50",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`group text-center ${stat.bg} backdrop-blur-md rounded-2xl p-8 border ${stat.border} hover:shadow-lg transition-all duration-500 hover:scale-105`}
                    >
                      <div
                        className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {stat.number}
                      </div>
                      <div className="text-slate-300 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="relative py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  The Future of Learning
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Experience blockchain education like never before with our revolutionary platform
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: BookOpen,
                    title: "Interactive Learning",
                    description: "Master blockchain concepts through immersive tutorials and real-world projects",
                    gradient: "from-emerald-400 to-purple-500",
                    bgGradient: "from-emerald-900/20 to-purple-900/20",
                    border: "border-emerald-500/20",
                  },
                  {
                    icon: Target,
                    title: "Skill Assessment",
                    description:
                      "Test your knowledge with comprehensive quizzes and earn rewards for every achievement",
                    gradient: "from-purple-400 to-sky-400",
                    bgGradient: "from-purple-900/20 to-sky-900/20",
                    border: "border-purple-500/20",
                  },
                  {
                    icon: Award,
                    title: "Earn Rewards",
                    description: "Convert your learning into XFI tokens and collect exclusive NFT badges",
                    gradient: "from-sky-400 to-emerald-400",
                    bgGradient: "from-sky-900/20 to-emerald-900/20",
                    border: "border-sky-500/20",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className={`group border ${feature.border} shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl overflow-hidden relative`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent" />
                    <CardHeader className="relative z-10">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-slate-100 mb-4">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-slate-300 leading-relaxed text-lg">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-purple-600 to-sky-500" />
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Transform Your Future? 🚀</h3>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Join thousands of developers already earning while they learn on LearnBlock
              </p>
              <Button
                onClick={connectWallet}
                size="lg"
                className="bg-white text-slate-800 hover:bg-slate-100 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <Crown className="w-6 h-6 mr-3" />
                Get Started for Free
                <Sparkles className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Dark Dashboard
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* User Profile Card */}
              <Card className="border-0 shadow-lg overflow-hidden relative bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl">
                <CardContent className="relative z-10 p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="w-20 h-20 ring-4 ring-emerald-400/30 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 text-white text-xl font-black">
                        {userAddress.slice(2, 4).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-slate-100">User #{userProfile.userId}</h3>
                      <p className="text-sm text-slate-400 font-mono bg-slate-700 px-2 py-1 rounded-lg">
                        {userAddress}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-700/80 rounded-xl border border-slate-600/50">
                      <span className="text-slate-300 font-medium">Total Points</span>
                      <span className="text-xl font-bold text-slate-100">{userProfile.totalPointsEarned}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-700/80 to-slate-600/80 rounded-xl border border-slate-500/50">
                      <span className="text-slate-300 font-medium">Available</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                        {unredeemedPoints}
                      </span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <Gem className="w-5 h-5 mr-2" />
                      Claim {(unredeemedPoints * 0.1).toFixed(1)} XFI
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-0 shadow-lg bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-100 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-emerald-400" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      icon: BookOpen,
                      label: "Articles",
                      value: userProfile.articlesRead,
                      color: "text-emerald-400",
                      bg: "bg-slate-700",
                      border: "border-slate-600",
                    },
                    {
                      icon: Target,
                      label: "Quizzes",
                      value: userProfile.quizzesTaken,
                      color: "text-purple-400",
                      bg: "bg-slate-700",
                      border: "border-slate-600",
                    },
                    {
                      icon: Award,
                      label: "Badges",
                      value: userProfile.badges,
                      color: "text-sky-400",
                      bg: "bg-slate-700",
                      border: "border-slate-600",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 ${stat.bg}/80 rounded-xl border ${stat.border}/50 hover:shadow-sm transition-all duration-300`}
                    >
                      <div className="flex items-center space-x-3">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-slate-300 font-medium">{stat.label}</span>
                      </div>
                      <span className="text-xl font-bold text-slate-100">{stat.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-slate-800/80 border border-slate-700 p-2 shadow-lg backdrop-blur-xl rounded-2xl">
                  {[
                    { value: "dashboard", icon: Activity, label: "Overview" },
                    { value: "content", icon: BookOpen, label: "Courses" },
                    { value: "quiz", icon: Target, label: "Quizzes" },
                    { value: "badges", icon: Award, label: "Badges" },
                    { value: "profile", icon: Users, label: "Profile" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-400 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-medium transition-all duration-300 text-slate-300"
                    >
                      <tab.icon className="w-5 h-5 mr-2" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="dashboard" className="space-y-8">
                  {/* Activity Feed */}
                  <Card className="border-0 shadow-lg bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-slate-100 flex items-center">
                        <Activity className="w-6 h-6 mr-3 text-emerald-400" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          {
                            icon: CheckCircle,
                            title: "Completed Blockchain Fundamentals Quiz",
                            subtitle: "Earned 300 points • 2 hours ago",
                            color: "bg-green-900/30 text-green-400",
                            border: "border-green-500/20",
                          },
                          {
                            icon: BookOpen,
                            title: "Read Smart Contract Security Best Practices",
                            subtitle: "5 hours ago",
                            color: "bg-blue-900/30 text-blue-400",
                            border: "border-blue-500/20",
                          },
                          {
                            icon: Award,
                            title: "Earned Scholar Badge",
                            subtitle: "Reached 2000 points milestone • 1 day ago",
                            color: "bg-purple-900/30 text-purple-400",
                            border: "border-purple-500/20",
                          },
                        ].map((activity, index) => (
                          <div
                            key={index}
                            className={`flex items-start space-x-4 p-4 bg-slate-700 rounded-xl border ${activity.border} hover:shadow-sm transition-all duration-300 group`}
                          >
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.color} border ${activity.border} group-hover:scale-110 transition-transform duration-300`}
                            >
                              <activity.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-100 mb-1">{activity.title}</p>
                              <p className="text-sm text-slate-400">{activity.subtitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Cards */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-900/20 via-orange-900/20 to-red-900/20 backdrop-blur-xl overflow-hidden relative border border-yellow-500/20">
                      <CardHeader className="relative z-10">
                        <CardTitle className="text-xl font-bold text-slate-100 flex items-center">
                          <Trophy className="w-6 h-6 mr-3 text-yellow-400" />
                          Badge Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="space-y-4">
                          <div className="flex justify-between text-lg">
                            <span className="text-slate-300 font-medium">Next badge in</span>
                            <span className="font-bold text-slate-100">
                              {500 - (userProfile.totalPointsEarned % 500)} points
                            </span>
                          </div>
                          <Progress value={(userProfile.totalPointsEarned % 500) / 5} className="h-3 rounded-full" />
                          <div className="flex justify-between text-sm text-slate-400">
                            <span>{userProfile.totalPointsEarned % 500}/500</span>
                            <span>Badge #{userProfile.badges + 1}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-xl overflow-hidden relative border border-blue-500/20">
                      <CardHeader className="relative z-10">
                        <CardTitle className="text-xl font-bold text-slate-100 flex items-center">
                          <Zap className="w-6 h-6 mr-3 text-emerald-400" />
                          Learning Streak
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="text-center">
                          <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 bg-clip-text text-transparent mb-2">
                            7
                          </div>
                          <div className="text-lg text-slate-300 font-medium mb-2">days in a row</div>
                          <div className="text-sm text-slate-400">Keep it up! You're on fire 🔥</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="content">
                  <ContentLibrary />
                </TabsContent>

                <TabsContent value="quiz">
                  <QuizInterface />
                </TabsContent>

                <TabsContent value="badges">
                  <BadgeShowcase userProfile={userProfile} />
                </TabsContent>

                <TabsContent value="profile">
                  <UserProfile userProfile={userProfile} userAddress={userAddress} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  )

}

export default Content