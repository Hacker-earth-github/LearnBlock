import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Loader2,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import ContentLibrary from '@/components/ContentLibrary';
import QuizInterface from '@/components/QuizInterface';
import BadgeShowcase from '@/components/BadgeShowcase';
import UserProfile from '@/components/UserProfile'; // Add this import
import { useLearnBlock } from '@/context/LearnBlockContext';
import { useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'react-toastify';

function FloatingElement({ children, delay = 0, className = '' }) {
  return (
    <div
      className={`absolute animate-pulse ${className}`}
      style={{
        animation: `float 6s ease-in-out ${delay}s infinite`,
      }}
    >
      {children}
    </div>
  );
}

const Content = () => {
  console.log("Content component mounted or reloaded:", { timestamp: new Date().toISOString() });
  const {
    userProfile,
    isUserRegistered,
    registerUser,
    refreshUserProfile,
    isLoading,
    isRegistering,
    registrationError,
    unredeemedPoints,
    isPendingRegistration,
  } = useLearnBlock();
  const [errorMessage, setErrorMessage] = useState(null);
  const { address, isConnected } = useAppKitAccount();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);

  useEffect(() => {
    if (isConnected && address && !isLoading) {
      setShowRegistrationPrompt(!isUserRegistered && !isPendingRegistration);
    } else {
      setShowRegistrationPrompt(false);
    }
  }, [isConnected, address, isUserRegistered, isPendingRegistration, isLoading]);

  // Retry registration if content becomes available
  useEffect(() => {
    if (!isConnected || !address || isUserRegistered || isRegistering || !isPendingRegistration) return;

    const retryRegistration = async () => {
      try {
        const result = await registerUser();
        if (result.success && !result.pending) {
          setShowRegistrationPrompt(false);
          await refreshUserProfile();
          toast.success('Registration successful! Welcome to LearnBlock!', {
            position: 'top-right',
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error('Retry registration failed:', error);
      }
    };

    const interval = setInterval(retryRegistration, 30000); // Retry every 30 seconds
    return () => clearInterval(interval);
  }, [isConnected, address, isUserRegistered, isRegistering, isPendingRegistration, registerUser, refreshUserProfile]);

  const handleUserRegistration = async () => {
    console.log('Starting registration, address:', address, 'isConnected:', isConnected);
    setErrorMessage(null);
    try {
      const result = await registerUser();
      console.log('registerUser result:', result);
      if (result.success) {
        setShowRegistrationPrompt(false); // Close modal on success (even if pending)
        if (result.pending) {
          toast.info('Registration pending. You can browse the platform while waiting for content.', {
            position: 'top-right',
            autoClose: 5000,
          });
        } else {
          await refreshUserProfile();
          toast.success('Registration successful! Welcome to LearnBlock!', {
            position: 'top-right',
            autoClose: 5000,
          });
        }
      } else {
        const errorMsg = result.error || 'Registration failed. Please try again.';
        setErrorMessage(errorMsg);
        toast.error(errorMsg, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Registration failed:', JSON.stringify(error, null, 2));
      const errorMsg = error.message || 'An unexpected error occurred during registration.';
      setErrorMessage(errorMsg);
      toast.error(errorMsg, {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };


const [showLoading, setShowLoading] = useState(false);


if (showLoading) {
  console.log("Rendering loading UI:", { isConnected, isLoading, address, userProfile, isPendingRegistration });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-100">Loading your profile...</h2>
        <p className="text-slate-300">Please wait while we sync your data</p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '4s' }}
        />
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

      {/* Header */}
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
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
                    LearnBlock
                  </h1>
                  <p className="text-xs text-slate-400">Blockchain Education</p>
                </div>
              </div>
              {(isConnected && (isUserRegistered || isPendingRegistration)) ? (
                <nav className="hidden md:flex items-center space-x-6">
                  {['Overview', 'Courses', 'Quizzes', 'Badges'].map((item) => (
                    <button
                      key={item}
                      className="relative text-slate-300 hover:text-emerald-400 font-medium transition-all duration-300 group"
                    >
                      {item}
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                    </button>
                  ))}
                </nav>
              ) : null}
            </div>
            <div className="flex items-center space-x-4">
              {(isConnected && (isUserRegistered || isPendingRegistration)) ? (
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
                      {unredeemedPoints || 0} Points
                    </Badge>
                    <Avatar className="w-9 h-9 ring-2 ring-emerald-400/30 shadow-md">
                      <AvatarFallback className="bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 text-white text-sm font-bold">
                        {address ? address.slice(2, 4).toUpperCase() : '??'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <appkit-button />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Registration Prompt Modal */}
      {showRegistrationPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-slate-800 border-slate-700 shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-100">Welcome to LearnBlock!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Start your learning journey to register your profile on the blockchain and earn XFI tokens and NFT badges!
              </p>
              {(errorMessage || registrationError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errorMessage || registrationError?.message || 'Registration failed. Please try again.'}
                    {registrationError?.message.includes('No content available') && (
                      <p className="mt-2 text-sm">
                        No learning content is currently available. You can still browse the platform, and registration will complete automatically when content is added.
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-3">
                <Button
                  onClick={handleUserRegistration}
                  disabled={isRegistering}
                  className="w-full bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white py-3 rounded-xl font-bold shadow-lg"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Start Learning to Register
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-400">
                  This will register your profile by interacting with a learning module on the blockchain
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!isConnected ? (
        // Landing Page
        <div className="relative">
          <div className="relative min-h-screen overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/images/blockchain-hero.png)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-emerald-900/80 to-purple-900/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
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
                <div className="inline-flex items-center space-x-3 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-6 py-3 mb-8 backdrop-blur-xl shadow-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full animate-pulse" />
                  <span className="text-emerald-300 text-sm font-medium">🚀 Powered by Blockchain Technology</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
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
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
                  <div className="group relative bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                    <Rocket className="w-6 h-6 mr-3 group-hover:animate-bounce relative z-10 inline" />
                    <span className="relative z-10">Connect Wallet to Start</span>
                    <Sparkles className="w-6 h-6 ml-3 group-hover:animate-spin relative z-10 inline" />
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-2 border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 px-10 py-5 text-xl font-bold rounded-2xl backdrop-blur-xl hover:border-emerald-400/50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { number: '100M+', label: 'Developers', color: 'from-emerald-400 to-emerald-600', bg: 'bg-slate-800/30', border: 'border-slate-700/50' },
                    { number: '4M+', label: 'Organizations', color: 'from-purple-400 to-purple-600', bg: 'bg-slate-800/30', border: 'border-slate-700/50' },
                    { number: '420M+', label: 'Repositories', color: 'from-sky-400 to-sky-600', bg: 'bg-slate-800/30', border: 'border-slate-700/50' },
                    { number: '90%', label: 'Fortune 100', color: 'from-yellow-400 to-orange-500', bg: 'bg-slate-800/30', border: 'border-slate-700/50' },
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
                onClick={<appkit-button/>}
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
   
      ) : (isUserRegistered || isPendingRegistration) ? (
        // Main Dashboard
        <div className="max-w-7xl mx-auto px-4 py-8">
          {isPendingRegistration && (
            <Alert className="mb-6 bg-yellow-900/20 border-yellow-500/30 text-left">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300">
                Your profile is pending registration due to no available content. You can browse the platform, but some features (e.g., earning points or badges) will be available once content is added.
              </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              <Card className="border-0 shadow-lg overflow-hidden relative bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl">
                <CardContent className="relative z-10 p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="w-20 h-20 ring-4 ring-emerald-400/30 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 text-white text-xl font-black">
                        {address ? address.slice(2, 4).toUpperCase() : '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-slate-100">
                        {isUserRegistered && userProfile ? `User #${userProfile.userId}` : 'Guest User'}
                      </h3>
                      <p className="text-sm text-slate-400 font-mono bg-slate-700 px-2 py-1 rounded-lg">
                        {address}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-700/80 rounded-xl border border-slate-600/50">
                      <span className="text-slate-300 font-medium">Total Points</span>
                      <span className="text-xl font-bold text-slate-100">
                        {userProfile ? userProfile.totalPointsEarned : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-700/80 to-slate-600/80 rounded-xl border border-slate-500/50">
                      <span className="text-slate-300 font-medium">Available</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                        {unredeemedPoints || 0}
                      </span>
                    </div>
                    <Button
                      disabled={!isUserRegistered || !unredeemedPoints || unredeemedPoints === '0'}
                      className="w-full bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <Gem className="w-5 h-5 mr-2" />
                      Claim {((unredeemedPoints || 0) * 0.1).toFixed(1)} XFI
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                      label: 'Articles',
                      value: userProfile ? userProfile.articlesRead : 0,
                      color: 'text-emerald-400',
                      bg: 'bg-slate-700',
                      border: 'border-slate-600',
                    },
                    {
                      icon: Target,
                      label: 'Quizzes',
                      value: userProfile ? userProfile.quizzesTaken : 0,
                      color: 'text-purple-400',
                      bg: 'bg-slate-700',
                      border: 'border-slate-600',
                    },
                    {
                      icon: Award,
                      label: 'Badges',
                      value: userProfile ? userProfile.badges : 0,
                      color: 'text-sky-400',
                      bg: 'bg-slate-700',
                      border: 'border-slate-600',
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
                    { value: 'dashboard', icon: Activity, label: 'Overview' },
                    { value: 'content', icon: BookOpen, label: 'Courses' },
                    { value: 'quiz', icon: Target, label: 'Quizzes' },
                    { value: 'badges', icon: Award, label: 'Badges' },
                    { value: 'profile', icon: Users, label: 'Profile' },
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
                  {/* Dashboard content */}
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
                  <UserProfile userProfile={userProfile} userAddress={address} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        // Registration Required State
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-slate-800/95 backdrop-blur-xl border-slate-700 shadow-2xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 rounded-full flex items-center justify-center mx-auto">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-100 mb-2">Almost There!</h2>
                <p className="text-slate-300 leading-relaxed">
                  Your wallet is connected. Complete your registration to access the learning platform.
                </p>
              </div>
              {(errorMessage || registrationError) && (
                <Alert className="bg-red-900/20 border-red-500/30 text-left">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    {errorMessage || registrationError?.message || 'Registration failed. Please try again.'}
                    {registrationError?.message.includes('No content available') && (
                      <p className="mt-2 text-sm">
                        No learning content is currently available. You can still browse the platform, and registration will complete automatically when content is added.
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleUserRegistration}
                disabled={isRegistering}
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white py-4 text-lg font-bold rounded-xl shadow-lg"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Your Profile...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Complete Registration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Content;