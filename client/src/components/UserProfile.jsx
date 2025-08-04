import { memo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Target,
  Coins,
  Award,
  TrendingUp,
  Calendar,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useLearnBlock } from "@/context/learnBlockContext";
import { toast } from "react-toastify";

const UserProfile = memo(({ userProfile, userAddress }) => {
  const isProfileLoading = !userProfile;
  const defaultProfile = {
    userId: "N/A",
    articlesRead: "0",
    quizzesTaken: "0",
    totalPointsEarned: "0",
    totalPointsRedeemed: "0",
    badges: "0",
    goldenBadgeClaimed: false,
  };
  const profile = isProfileLoading ? defaultProfile : userProfile;

  const unredeemedPoints = isProfileLoading
    ? 0
    : parseInt(profile.totalPointsEarned) - parseInt(profile.totalPointsRedeemed);
  const completionRate =
    isProfileLoading || parseInt(profile.articlesRead) === 0
      ? 0
      : Math.round((parseInt(profile.quizzesTaken) / parseInt(profile.articlesRead)) * 100);

  const copyAddress = () => {
    navigator.clipboard.writeText(userAddress);
  };

  const { contract, refreshUserProfile } = useLearnBlock();
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaimXFI = async () => {
    if (!contract || isClaiming || unredeemedPoints === 0) {
        return;
    }

    setIsClaiming(true);


    try {
      // Ensure the function call is correct
      const tx = await contract.claimXFIReward({
        gasLimit: 200000, // Manually set gas limit
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        toast.success("XFI claimed successfully!");
        await refreshUserProfile();
      } else {
        throw new Error("Transaction reverted");
      }
    } catch (error) {
      toast.error("Failed to claim XFI. Check console for details or contract balance.");
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border border-emerald-400/20 backdrop-blur-xl text-white">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 ring-2 ring-emerald-400/50">
              <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-purple-500 text-white text-2xl">
                {userAddress ? userAddress.slice(2, 4).toUpperCase() : "??"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl text-slate-100">
                {isProfileLoading ? "Loading..." : `User #${profile.userId}`}
              </CardTitle>
              <CardDescription className="text-base text-slate-200">
                {isProfileLoading ? "Loading membership details..." : "Member since joining the platform"}
              </CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <code className="bg-slate-800/20 px-2 py-1 rounded text-sm text-emerald-300">
                  {userAddress || "Loading address..."}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyAddress}
                  className="bg-slate-800/20 border-slate-600/20 text-emerald-300 hover:bg-emerald-500/20"
                  disabled={!userAddress}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-800/20 border-slate-600/20 text-emerald-300 hover:bg-emerald-500/20"
                  disabled={!userAddress}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Articles Read</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-300">
              {isProfileLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : profile.articlesRead}
            </div>
            <p className="text-xs text-emerald-400">Knowledge gained</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-200">Quizzes Taken</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-300">
              {isProfileLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : profile.quizzesTaken}
            </div>
            <p className="text-xs text-green-400">{isProfileLoading ? "Loading..." : `${completionRate}% completion rate`}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Total Points</CardTitle>
            <Coins className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-300">
              {isProfileLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : profile.totalPointsEarned}
            </div>
            <p className="text-xs text-purple-400">{isProfileLoading ? "Loading..." : `${unredeemedPoints} unredeemed`}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-200">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-300">
              {isProfileLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : profile.badges}
            </div>
            <p className="text-xs text-orange-400">
              {isProfileLoading
                ? "Loading..."
                : profile.goldenBadgeClaimed
                ? "Golden unlocked!"
                : "Working towards golden"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-100">Learning Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2 text-slate-200">
                <span>Quiz Completion Rate</span>
                <span>{isProfileLoading ? "0%" : `${completionRate}%`}</span>
              </div>
              <Progress value={isProfileLoading ? 0 : completionRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2 text-slate-200">
                <span>Points to Next Badge</span>
                <span>{isProfileLoading ? "0" : 500 - (parseInt(profile.totalPointsEarned) % 500)}</span>
              </div>
              <Progress value={isProfileLoading ? 0 : (parseInt(profile.totalPointsEarned) % 500) / 5} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {isProfileLoading || parseInt(profile.articlesRead) === 0 ? "0" : (parseInt(profile.totalPointsEarned) / parseInt(profile.articlesRead)).toFixed(0)}
                </div>
                <div className="text-xs text-slate-300">Avg Points/Article</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-400">
                  {isProfileLoading || parseInt(profile.quizzesTaken) === 0 ? "0" : (parseInt(profile.totalPointsEarned) / parseInt(profile.quizzesTaken)).toFixed(0)}
                </div>
                <div className="text-xs text-slate-300">Avg Points/Quiz</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-green-400" />
              <span className="text-green-100">Rewards Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-500/10 border border-green-400/20 rounded-lg">
                <div className="text-xl font-bold text-green-400">{isProfileLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : profile.totalPointsEarned}</div>
                <div className="text-xs text-green-300">Total Earned</div>
              </div>
              <div className="text-center p-3 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                <div className="text-xl font-bold text-emerald-400">{isProfileLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : profile.totalPointsRedeemed}</div>
                <div className="text-xs text-emerald-300">Total Redeemed</div>
              </div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {isProfileLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : unredeemedPoints}
              </div>
              <div className="text-sm text-purple-300 mb-2">Points Available</div>
              <div className="text-xs text-slate-300">{isProfileLoading ? "0 XFI" : `≈ ${(unredeemedPoints * 0.1).toFixed(2)} XFI tokens`}</div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0"
              disabled={isProfileLoading || unredeemedPoints === 0 || isClaiming}
              onClick={handleClaimXFI}
            >
              {isClaiming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Claiming...
                </>
              ) : (
                `Claim ${isProfileLoading ? "0" : (unredeemedPoints * 0.1).toFixed(1)} XFI`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span className="text-purple-100">Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isProfileLoading ? (
              <div className="text-center py-4">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
                <p className="text-sm text-slate-300">Loading achievements...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-400/20 rounded-lg">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-100">Earned Badge #4 - Scholar</p>
                    <p className="text-xs text-slate-300">Reached 2000 points milestone</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30">Recent</Badge>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-100">Completed 8th Quiz</p>
                    <p className="text-xs text-slate-300">Blockchain Fundamentals - 300 points</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-500/10 border border-purple-400/20 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Coins className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-100">Redeemed 1000 Points</p>
                    <p className="text-xs text-slate-300">Claimed 100 XFI tokens</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}, (prevProps, nextProps) => prevProps.userProfile === nextProps.userProfile && prevProps.userAddress === nextProps.userAddress);

export default UserProfile;