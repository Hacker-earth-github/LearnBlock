import React from "react"
import { BookOpen, Coins, Gift, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: BookOpen,
    title: "Learn",
    description: "Complete courses, quizzes, and interactive lessons to master blockchain concepts",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Coins,
    title: "Earn Points",
    description: "Gain LEARN tokens for every milestone, quiz completion, and community contribution",
    color: "from-orange-400 to-orange-600",
  },
  {
    icon: Gift,
    title: "Redeem Tokens",
    description: "Exchange your tokens for NFT certificates, exclusive content, or real-world rewards",
    color: "from-purple-400 to-purple-600",
  },
]

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey from learning to earning in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-orange-500" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
