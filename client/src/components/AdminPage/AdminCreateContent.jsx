import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { useLearnBlock } from "@/context/LearnBlockContext";
import useCreateContent from "@/hooks/useCreateContent";

const AdminCreateContent = () => {
  const { learnBlocks } = useLearnBlock();
  const { createContent, isCreating, getContentMetadata } = useCreateContent();
  const [newContent, setNewContent] = useState({
    title: "",
    body: "",
    sources: "",
    pointReward: "",
    description: "",
    readTime: "",
    difficulty: "Beginner",
    category: "Blockchain",
  });

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    const success = await createContent(newContent);
    if (success) {
      setNewContent({
        title: "",
        body: "",
        sources: "",
        pointReward: "",
        description: "",
        readTime: "",
        difficulty: "Beginner",
        category: "Blockchain",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Content */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-green-600" />
            <span>Create New Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContentSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  placeholder="Enter content title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pointReward">Point Reward</Label>
                <Input
                  id="pointReward"
                  type="number"
                  value={newContent.pointReward}
                  onChange={(e) => setNewContent({ ...newContent, pointReward: e.target.value })}
                  placeholder="Points to award"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newContent.description}
                onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                placeholder="Enter a brief description of the content"
                rows={3}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  value={newContent.readTime}
                  onChange={(e) => setNewContent({ ...newContent, readTime: e.target.value })}
                  placeholder="e.g., 15 min"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={newContent.difficulty}
                  onValueChange={(value) => setNewContent({ ...newContent, difficulty: value })}
                >
                  <SelectTrigger className="bg-slate-800/20 border-slate-600/20 text-slate-100">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newContent.category}
                onValueChange={(value) => setNewContent({ ...newContent, category: value })}
              >
                <SelectTrigger className="bg-slate-800/20 border-slate-600/20 text-slate-100">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {["Blockchain", "Development", "DeFi", "NFTs", "Security", "Scaling"].map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Content Body</Label>
              <Textarea
                id="body"
                value={newContent.body}
                onChange={(e) => setNewContent({ ...newContent, body: e.target.value })}
                placeholder="Enter the main content..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sources">Sources (comma-separated)</Label>
              <Input
                id="sources"
                value={newContent.sources}
                onChange={(e) => setNewContent({ ...newContent, sources: e.target.value })}
                placeholder="https://source1.com, https://source2.com"
              />
            </div>

            <Button
              type="submit"
              disabled={isCreating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreating ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Content
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Content */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Existing Content</CardTitle>
          <CardDescription>Manage published and draft content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learnBlocks.map((content) => {
              const metadata = getContentMetadata(content.id);
              return (
                <div key={content.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{content.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-slate-600">{content.pointReward} points</span>
                      <span className="text-sm text-slate-600">{metadata.category || 'Uncategorized'}</span>
                      <Badge variant="secondary">Published</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCreateContent;