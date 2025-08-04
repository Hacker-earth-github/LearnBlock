// UserDashboard.jsx
import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  TrendingUp,
  Wallet,
  Users,
  Sparkles,
  Zap,
  Star,
  Crown,
  Loader2,
  AlertCircle,
  UserPlus,
  Rocket,
  Gem,
  Award,
} from "lucide-react";
import ContentLibrary from "@/components/ContentLibrary";
import BadgeShowcase from "@/components/BadgeShowcase";
import UserProfile from "@/components/UserProfile";
import { useLearnBlock } from "@/context/LearnBlockContext";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";

function FloatingElement({ children, delay = 0, className = "" }) {
  return (
    <div
      className={`absolute animate-pulse ${className}`}
      style={{ animation: `float 6s ease-in-out ${delay}s infinite` }}
    >
      {children}
    </div>
  );
}

const UserDashboardContent = memo(
  ({
    userProfile,
    unredeemedPoints,
    isUserRegistered,
    isPendingRegistration,
    refreshUserProfile,
    isLoading,
    handleUserRegistration,
    registrationError,
    address,
    isConnected,
    isRegistering,
    loadAllContentIds,
  }) => {
    const [activeTab, setActiveTab] = useState("content");
    const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);

    useEffect(() => {
      if (!isLoading && isConnected && address) {
        setShowRegistrationPrompt(!isUserRegistered && !isPendingRegistration);
      } else {
        setShowRegistrationPrompt(false);
      }
    }, [isUserRegistered, isPendingRegistration, isLoading, isConnected, address]);

    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };

    const handleRefresh = async () => {
      try {
        await Promise.all([refreshUserProfile(), loadAllContentIds()]);
        toast.success("Profile and content refreshed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        console.error("Error refreshing profile or content:", err);
        toast.error("Failed to refresh profile or content.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                {registrationError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{registrationError?.message || "Registration failed. Please try again."}</AlertDescription>
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
        {(isUserRegistered || isPendingRegistration) && (
          <>
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              className="mb-4 bg-gradient-to-r from-emerald-400 to-purple-500 hover:from-emerald-500 hover:to-purple-600 text-white py-2 px-4 rounded-lg"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Refresh Profile & Content"}
            </Button>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-80 space-y-6">
                <Card className="border-0 shadow-lg overflow-hidden relative bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl">
                  <CardContent className="relative z-10 p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="w-20 h-20 ring-4 ring-emerald-400/30 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 text-white text-xl font-black">
                          {address ? address.slice(2, 4).toUpperCase() : "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-slate-100">
                          {isUserRegistered && userProfile ? `User #${userProfile.userId}` : "Guest User"}
                        </h3>
                        <p className="text-sm text-slate-400 font-mono bg-slate-700 px-2 py-1 rounded-lg">
                          {address || "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-700/80 rounded-xl border border-slate-600/50">
                        <span className="text-slate-300 font-medium">Total Points</span>
                        <span className="text-xl font-bold text-slate-100">
                          {userProfile ? userProfile.totalPointsEarned || 0 : 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-700/80 to-slate-600/80 rounded-xl border border-slate-500/50">
                        <span className="text-slate-300 font-medium">Available</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                          {unredeemedPoints || 0}
                        </span>
                      </div>
                      <Button
                        disabled={!isUserRegistered || !unredeemedPoints || Number(unredeemedPoints) <= 0}
                        className="w-full bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <Gem className="w-5 h-5 mr-2" />
                        Claim {(Number(unredeemedPoints) * 0.1).toFixed(1) || 0} XFI
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
                        label: "Articles",
                        value: userProfile ? userProfile.articlesRead || 0 : 0,
                        color: "text-emerald-400",
                        bg: "bg-slate-700",
                        border: "border-slate-600",
                      },
                      {
                        icon: Award,
                        label: "Badges",
                        value: userProfile ? userProfile.badges || 0 : 0,
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
              <div className="flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                  <TabsList className="bg-slate-800/80 border border-slate-700 p-2 shadow-lg backdrop-blur-xl rounded-2xl">
                    {[
                      { value: "content", icon: BookOpen, label: "Courses" },
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
                  <TabsContent value="content">
                    <ContentLibrary />
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
            {isPendingRegistration && (
              <Alert className="mt-6 bg-yellow-900/20 border-yellow-500/30 text-left">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-300">
                  Your profile is pending registration due to no available content. You can browse the platform, but some features will be available once content is added.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.userProfile === nextProps.userProfile &&
      prevProps.unredeemedPoints === nextProps.unredeemedPoints &&
      prevProps.isUserRegistered === nextProps.isUserRegistered &&
      prevProps.isPendingRegistration === nextProps.isPendingRegistration &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.registrationError === nextProps.registrationError &&
      prevProps.address === nextProps.address &&
      prevProps.isConnected === nextProps.isConnected &&
      prevProps.isRegistering === nextProps.isRegistering &&
      prevProps.loadAllContentIds === nextProps.loadAllContentIds
    );
  }
);

const UserDashboard = () => {
  const {
    userProfile,
    isUserRegistered,
    registerUser: handleUserRegistration,
    refreshUserProfile,
    isLoading,
    registrationError,
    unredeemedPoints,
    isPendingRegistration,
    isRegistering,
    loadAllContentIds,
  } = useLearnBlock();
  const { address: appKitAddress, isConnected: appKitIsConnected } = useAppKitAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 transition-all duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
            </div>
            <div className="flex items-center space-x-4">
              {(isUserRegistered || isPendingRegistration) && (
                <Avatar className="w-9 h-9 ring-2 ring-emerald-400/30 shadow-md">
                  <AvatarFallback className="bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 text-white text-sm font-bold">
                    {address ? address.slice(2, 4).toUpperCase() : "??"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </header>
      {!isUserRegistered && !isPendingRegistration && !isConnected && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-slate-800/95 backdrop-blur-xl border-slate-700 shadow-2xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 rounded-full flex items-center justify-center mx-auto">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-100 mb-2">Almost There!</h2>
                <p className="text-slate-300 leading-relaxed">
                  Your wallet is not connected. Please connect to access the learning platform.
                </p>
              </div>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-400 via-purple-500 to-sky-400 hover:from-emerald-500 hover:via-purple-600 hover:to-sky-500 text-white py-4 text-lg font-bold rounded-xl shadow-lg"
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      {(isUserRegistered || isPendingRegistration || isConnected) && (
        <UserDashboardContent
          userProfile={userProfile}
          unredeemedPoints={unredeemedPoints}
          isUserRegistered={isUserRegistered}
          isPendingRegistration={isPendingRegistration}
          refreshUserProfile={refreshUserProfile}
          isLoading={isLoading}
          handleUserRegistration={handleUserRegistration}
          registrationError={registrationError}
          address={address}
          isConnected={isConnected}
          isRegistering={isRegistering}
          loadAllContentIds={loadAllContentIds}
        />
      )}
    </div>
  );
};

export default memo(UserDashboard);