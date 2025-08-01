import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, Star, Search, CheckCircle, Zap, Brain, Globe } from "lucide-react";
import { useLearnBlock } from "@/context/LearnBlockContext";
import useReadArticle from "@/hooks/useReadArticle";
import useTakeQuiz from "@/hooks/useTakeQuiz";
import useCreateContent from "@/hooks/useCreateContent";

// Map categories to icons for consistency
const categoryIcons = {
  Blockchain: Globe,
  Development: Brain,
  DeFi: Zap,
  NFTs: Star,
  Security: Brain,
  Scaling: Zap,
};

const ContentLibrary = () => {
  const { learnBlocks, completedContent, isConnected } = useLearnBlock();
  const { readArticle, isReading } = useReadArticle();
  const { takeQuiz, isTakingQuiz } = useTakeQuiz();
  const { getContentMetadata } = useCreateContent();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedContent, setSelectedContent] = useState(null);

  const categories = ["All", "Blockchain", "Development", "DeFi", "NFTs", "Security", "Scaling"];

  const filteredContent = learnBlocks.map((content) => ({
    ...content,
    ...getContentMetadata(content.id),
  })).filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (content.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "Advanced":
        return "bg-red-500/20 text-red-300 border-red-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
    }
  };

  const handleReadArticle = async (contentId) => {
    const success = await readArticle(contentId);
    if (success) {
      setSelectedContent({ ...selectedContent, completed: true });
    }
  };

  const handleTakeQuiz = async (contentId) => {
    const success = await takeQuiz(contentId);
    if (success) {
      setSelectedContent({ ...selectedContent, completed: true });
    }
  };

  if (selectedContent) {
    const IconComponent = categoryIcons[selectedContent.category] || Globe;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setSelectedContent(null)}
            className="mb-4 bg-slate-800/20 border-slate-600/20 text-emerald-300 hover:bg-emerald-500/20"
          >
            ← Back to Library
          </Button>
        </div>

        <Card className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 text-white">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-slate-100">{selectedContent.title}</CardTitle>
                    <CardDescription className="text-base text-slate-200">
                      {selectedContent.description || "No description available."}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getDifficultyColor(selectedContent.difficulty || "Beginner")}>
                    {selectedContent.difficulty || "Beginner"}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-slate-300">
                    <Clock className="w-4 h-4" />
                    <span>{selectedContent.readTime || "15 min"}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-slate-300">
                    <Star className="w-4 h-4" />
                    <span>{selectedContent.pointReward} points</span>
                  </div>
                </div>
              </div>
              {selectedContent.completed && (
                <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none text-slate-100">
              <h3 className="text-slate-200">Introduction</h3>
              <p>{selectedContent.body || "This comprehensive guide will take you through the essential concepts and practical applications of the topic. You'll learn through real-world examples and hands-on exercises."}</p>

              <h3 className="text-slate-200">What You'll Learn</h3>
              <ul className="text-slate-200">
                <li>Core concepts and terminology</li>
                <li>Practical implementation strategies</li>
                <li>Best practices and common pitfalls</li>
                <li>Real-world use cases and examples</li>
              </ul>

              <h3 className="text-slate-200">Prerequisites</h3>
              <p>Basic understanding of blockchain technology and cryptocurrency concepts would be helpful but not required for this course.</p>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => handleReadArticle(selectedContent.id)}
                disabled={isReading || !isConnected || selectedContent.completed}
                className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 border-0"
              >
                {isReading ? (
                  <>
                    <BookOpen className="w-4 h-4 mr-2 animate-spin" />
                    Reading...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Reading
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleTakeQuiz(selectedContent.id)}
                disabled={isTakingQuiz || !isConnected || selectedContent.completed}
                variant="outline"
                className="bg-slate-800/20 border-slate-600/20 text-emerald-300 hover:bg-emerald-500/20"
              >
                {isTakingQuiz ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Take Quiz After Reading
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/20 backdrop-blur-xl border-slate-600/20 text-slate-100 placeholder:text-slate-400"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-gradient-to-r from-emerald-500 to-purple-600 border-0"
                  : "bg-slate-800/20 border-slate-600/20 text-emerald-300 hover:bg-emerald-500/20"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content) => {
          const IconComponent = categoryIcons[content.category] || Globe;
          const isCompleted = completedContent.includes(content.id.toString());
          return (
            <Card
              key={content.id}
              className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/10 hover:border-emerald-400/30 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-emerald-500/10"
              onClick={() => setSelectedContent({ ...content, completed: isCompleted })}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 text-slate-100 group-hover:text-slate-200">
                        {content.title}
                      </CardTitle>
                    </div>
                  </div>
                  {isCompleted && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
                </div>
                <CardDescription className="line-clamp-3 text-slate-200">
                  {content.description || "No description available."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(content.difficulty || "Beginner")}>
                      {content.difficulty || "Beginner"}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-slate-300">
                      <Clock className="w-3 h-3" />
                      <span>{content.readTime || "15 min"}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm font-medium text-slate-300">
                    <Star className="w-4 h-4" />
                    <span>{content.pointReward}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ContentLibrary;