import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Trophy } from "lucide-react"

const testimonials = [
  {
    name: "Alex Chen",
    role: "Smart Contract Developer",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "LearnBlock transformed my understanding of DeFi. The rewards system kept me motivated throughout my learning journey!",
    tokens: "2,450 LEARN",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Blockchain Analyst",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The community aspect is incredible. Learning alongside others and earning tokens made the experience so much better.",
    tokens: "1,890 LEARN",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Web3 Entrepreneur",
    avatar: "/placeholder.svg?height=60&width=60",
    content: "From zero blockchain knowledge to launching my own DApp. LearnBlock's structured approach is unmatched.",
    tokens: "3,120 LEARN",
    rating: 5,
  },
]

const leaderboard = [
  { rank: 1, name: "CryptoMaster", tokens: "15,420", badge: "🥇" },
  { rank: 2, name: "BlockchainPro", tokens: "12,890", badge: "🥈" },
  { rank: 3, name: "Web3Wizard", tokens: "11,250", badge: "🥉" },
  { rank: 4, name: "DeFiExplorer", tokens: "9,870", badge: "🏆" },
  { rank: 5, name: "SmartContractDev", tokens: "8,640", badge: "⭐" },
]

const Testimonial = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Testimonials */}
          <div>
            <div className="text-center lg:text-left mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Learners Say</h2>
              <p className="text-xl text-gray-600">Join thousands of successful blockchain learners</p>
            </div>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{testimonial.role}</span>
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                        ))}
                      </div>

                      <p className="text-gray-600 mb-3">{testimonial.content}</p>

                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 font-semibold">{testimonial.tokens} earned</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <div className="text-center lg:text-left mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Top Learners</h2>
              <p className="text-xl text-gray-600">See who's leading the learning revolution</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{user.badge}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">Rank #{user.rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-400">{user.tokens}</div>
                      <div className="text-sm text-gray-500">LEARN tokens</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonial
