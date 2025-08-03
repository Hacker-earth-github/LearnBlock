
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { useLearnBlock } from "@/context/LearnBlockContext";
import useCreateContent from "@/hooks/useCreateContent";

const AdminCreateContent = () => {
  const { learnBlocks, loadAllContentIds, contract, address, isConnected } = useLearnBlock();
  const { createContent, updateContent, deleteContent, isCreating, isUpdating, isDeleting, error, getContentMetadata } = useCreateContent();
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
  const [editingContentId, setEditingContentId] = useState(null);
  const [isTrustee, setIsTrustee] = useState(false);

  // Check if user is a trustee
  useEffect(() => {
    const checkTrustee = async () => {
      if (!contract || !address) return;
      try {
        const trusteeStatus = await contract.isTrustee(address);
        setIsTrustee(trusteeStatus);
      } catch (err) {
        console.error("Error checking trustee status:", err);
        setIsTrustee(false);
      }
    };
    checkTrustee();
  }, [contract, address]);

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    if (!isTrustee) {
      toast.error("Unauthorized: Only trustees can create or edit content.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const success = editingContentId
      ? await updateContent(editingContentId, newContent)
      : await createContent(newContent);
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
      setEditingContentId(null);
    }
  };

  const handleEdit = (content) => {
    setEditingContentId(content.id);
    const metadata = getContentMetadata(content.id);
    setNewContent({
      title: content.title,
      body: content.body,
      sources: content.sources.join(", "),
      pointReward: content.pointReward,
      description: metadata.description,
      readTime: metadata.readTime,
      difficulty: metadata.difficulty,
      category: metadata.category,
    });
  };

  const handleDelete = async (contentId) => {
    if (!isTrustee) {
      toast.error("Unauthorized: Only trustees can delete content.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    if (window.confirm("Are you sure you want to delete this content?")) {
      await deleteContent(contentId);
    }
  };

  if (!isConnected || !address) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Please connect your wallet to manage content.</AlertDescription>
      </Alert>
    );
  }

  if (!isTrustee) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Unauthorized: Only trustees can manage content.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="bg-red-100 border-red-400 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Create/Edit Content */}
      <Card className="bg-gray-50 border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Plus className="w-5 h-5 text-blue-600" />
            <span>{editingContentId ? "Edit Content" : "Create New Content"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContentSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-800">Title</Label>
                <Input
                  id="title"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  placeholder="Enter content title"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pointReward" className="text-gray-800">Point Reward</Label>
                <Input
                  id="pointReward"
                  type="number"
                  value={newContent.pointReward}
                  onChange={(e) => setNewContent({ ...newContent, pointReward: e.target.value })}
                  placeholder="Points to award"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-800">Description</Label>
              <Textarea
                id="description"
                value={newContent.description}
                onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                placeholder="Enter a brief description of the content"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                rows={3}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="readTime" className="text-gray-800">Read Time</Label>
                <Input
                  id="readTime"
                  value={newContent.readTime}
                  onChange={(e) => setNewContent({ ...newContent, readTime: e.target.value })}
                  placeholder="e.g., 15 min"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-gray-800">Difficulty</Label>
                <Select
                  value={newContent.difficulty}
                  onValueChange={(value) => setNewContent({ ...newContent, difficulty: value })}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
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
              <Label htmlFor="category" className="text-gray-800">Category</Label>
              <Select
                value={newContent.category}
                onValueChange={(value) => setNewContent({ ...newContent, category: value })}
              >
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
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
              <Label htmlFor="body" className="text-gray-800">Content Body</Label>
              <Textarea
                id="body"
                value={newContent.body}
                onChange={(e) => setNewContent({ ...newContent, body: e.target.value })}
                placeholder="Enter the main content..."
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sources" className="text-gray-800">Sources (comma-separated)</Label>
              <Input
                id="sources"
                value={newContent.sources}
                onChange={(e) => setNewContent({ ...newContent, sources: e.target.value })}
                placeholder="https://source1.com, https://source2.com"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {(isCreating || isUpdating) ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-spin" />
                  {editingContentId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingContentId ? "Update Content" : "Create Content"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Content */}
      <Card className="bg-gray-50 border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Existing Content</CardTitle>
          <CardDescription className="text-gray-600">Manage published and draft content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learnBlocks.map((content) => {
              const metadata = getContentMetadata(content.id);
              return (
                <div key={content.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{content.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">{content.pointReward} points</span>
                      <span className="text-sm text-gray-600">{metadata?.category || 'Uncategorized'}</span>
                      <Badge className="bg-green-100 text-green-800 border-green-300">Published</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(content)}
                      className="bg-white border-gray-300 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(content.id)}
                      disabled={isDeleting}
                      className="bg-white border-gray-300 text-red-600 hover:bg-red-50"
                    >
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
