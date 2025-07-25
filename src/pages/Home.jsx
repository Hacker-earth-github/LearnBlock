import React from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Star, Users, BookOpen } from "lucide-react"

const Home = () => {
  return (
    <>
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-md fixed top-0 left-0 z-50">
        <h1 className="text-2xl font-bold text-gray-800">LearnBlock</h1>
        <Button
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 text-md font-semibold rounded-xl shadow-md transition-all duration-300"
        >
          
          <appkit-button />
        </Button>
      </header>

      {/* Main Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-32 bg-white">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-blue-500/5 to-orange-500/5" />

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-500/10 rounded-full blur-xl animate-pulse delay-500" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Learn Blockchain.{" "}
            <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              Earn Rewards.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            LearnBlock is a Web3-based EdTech platform that rewards you for learning and contributing to blockchain
            communities.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5 text-orange-500" />
              <span>10K+ Learners</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>50+ Courses</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="w-5 h-5 text-orange-500" />
              <span>$100K+ Rewards Distributed</span>
            </div>
          </div>

          {/* Explore Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 bg-transparent"
            >
              Explore Courses
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
