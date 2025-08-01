import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, Award, Sparkles, Play } from 'lucide-react';

const Homepage = () => {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 min-h-screen">
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
            </div>
            <div className="flex items-center space-x-4">
              <appkit-button />
            </div>
          </div>
        </div>
      </header>

      {/* Landing Page */}
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
                  <appkit-button>
                    <Sparkles className="w-6 h-6 ml-3 group-hover:animate-spin relative z-10 inline" />
                  </appkit-button>
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
                size="lg"
                className="bg-white text-slate-800 hover:bg-slate-100 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <appkit-button />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;