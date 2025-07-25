import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Star, Trophy, Crown, Shield, Target } from "lucide-react"

const badgeTypes = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first quiz",
    icon: Target,
    color: "from-emerald-400 to-emerald-600",
    requirement: 500,
    earned: true,
  },
  {
    id: 2,
    name: "Knowledge Seeker",
    description: "Earn 1000 points",
    icon: Award,
    color: "from-green-400 to-green-600",
    requirement: 1000,
    earned: true,
  },
  {
    id: 3,
    name: "Quiz Master",
    description: "Complete 10 quizzes",
    icon: Shield,
    color: "from-purple-400 to-purple-600",
    requirement: 1500,
    earned: true,
  },
  {
    id: 4,
    name: "Scholar",
    description: "Earn 2000 points",
    icon: Star,
    color: "from-orange-400 to-orange-600",
    requirement: 2000,
    earned: true,
  },
  {
    id: 5,
    name: "Golden Scholar",
    description: "Reach 2500 points - Special NFT",
    icon: Crown,
    color: "from-yellow-400 to-yellow-600",
    requirement: 2500,
    earned: false,
    isGolden: true,
  },
]


const BadgeShowcase = ({userProfile}) => {
  const nextBadgePoints = 500 - (userProfile.totalPointsEarned % 500)
  const progressToNext = (userProfile.totalPointsEarned % 500) / 5

  return (
    <div className="space-y-6">
      {/* Progress to Next Badge */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border border-emerald-400/20 backdrop-blur-xl text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-slate-100">Badge Progress</span>
          </CardTitle>
          <CardDescription className="text-slate-200">
            You're {nextBadgePoints} points away from your next badge!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressToNext} className="h-4 mb-2" />
          <div className="flex justify-between text-sm text-slate-300">
            <span>{userProfile.totalPointsEarned % 500}/500 points</span>
            <span>Badge #{userProfile.badges + 1}</span>
          </div>
        </CardContent>
      </Card>

      {/* Badge Collection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badgeTypes.map((badge) => {
          const IconComponent = badge.icon
          const isEarned = userProfile.totalPointsEarned >= badge.requirement
          const isGolden = badge.isGolden && userProfile.goldenBadgeClaimed

          return (
            <Card
              key={badge.id}
              className={`relative overflow-hidden border-0 backdrop-blur-xl transition-all hover:shadow-xl ${
                isEarned ? "bg-slate-800/20 border border-slate-700/10" : "bg-slate-800/10 border border-slate-700/5"
              }`}
            >
              {isGolden && (
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-yellow-400">
                  <Star className="absolute -top-8 -right-6 w-4 h-4 text-white" />
                </div>
              )}

              <CardHeader className="text-center">
                <div
                  className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    isEarned ? `bg-gradient-to-r ${badge.color}` : "bg-slate-500/20"
                  }`}
                >
                  <IconComponent className={`w-10 h-10 ${isEarned ? "text-white" : "text-slate-500"}`} />
                </div>
                <CardTitle className={`text-lg ${isEarned ? "text-slate-100" : "text-slate-400"}`}>
                  {badge.name}
                </CardTitle>
                <CardDescription className={isEarned ? "text-slate-200" : "text-slate-500"}>
                  {badge.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                <div className="space-y-2">
                  <div className={`text-sm font-medium ${isEarned ? "text-green-400" : "text-slate-400"}`}>
                    {isEarned ? "Earned!" : `${badge.requirement} points required`}
                  </div>

                  {isEarned ? (
                    <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                      <Award className="w-3 h-3 mr-1" />
                      Collected
                    </Badge>
                  ) : (
                    <div className="space-y-2">
                      <Progress
                        value={Math.min((userProfile.totalPointsEarned / badge.requirement) * 100, 100)}
                        className="h-2"
                      />
                      <div className="text-xs text-slate-400">
                        {Math.max(0, badge.requirement - userProfile.totalPointsEarned)} points to go
                      </div>
                    </div>
                  )}

                  {isGolden && (
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 mt-2">
                      <Crown className="w-3 h-3 mr-1" />
                      Golden NFT
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Badge Stats */}
      <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
        <CardHeader>
          <CardTitle className="text-slate-100">Badge Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{userProfile.badges}</div>
              <div className="text-sm text-emerald-300">Badges Earned</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{Math.floor(userProfile.totalPointsEarned / 500)}</div>
              <div className="text-sm text-green-300">Total Possible</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{userProfile.goldenBadgeClaimed ? 1 : 0}</div>
              <div className="text-sm text-purple-300">Golden Badges</div>
            </div>
            <div className="text-center p-4 bg-orange-500/10 border border-orange-400/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">
                {Math.round((userProfile.badges / Math.floor(userProfile.totalPointsEarned / 500)) * 100) || 0}%
              </div>
              <div className="text-sm text-orange-300">Collection Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BadgeShowcase