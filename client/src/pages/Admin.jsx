import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, Users, BookOpen, Target, Trash2, Edit, Save, X, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useLearnBlock } from "@/context/LearnBlockContext";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const Admin = () => {
    const { contract, readOnlyContract, getContent, allContentIds, address, isConnected } = useLearnBlock();
    const [newContent, setNewContent] = useState({
        title: "",
        body: "",
        sources: "",
        pointReward: "",
    });
    const [newQuestion, setNewQuestion] = useState({
        contentId: "",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
    });
    const [contents, setContents] = useState([]);
    const [trustees, setTrustees] = useState([]);
    const [isTrustee, setIsTrustee] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [contractBalance, setContractBalance] = useState("0"); // New state for contract balance

    // Fetch contract balance
    useEffect(() => {
        const fetchContractBalance = async () => {
            if (!readOnlyContract || !contract?.address) {
                setContractBalance("0");
                return;
            }
            setIsLoading(true);
            try {
                const balance = await readOnlyContract.provider.getBalance(contract.address);
                setContractBalance(ethers.utils.formatEther(balance));
            } catch (error) {
                console.error("Error fetching contract balance:", JSON.stringify(error, null, 2));
                toast.error("Failed to fetch contract balance.");
                setContractBalance("0");
            } finally {
                setIsLoading(false);
            }
        };

        fetchContractBalance();
    }, [readOnlyContract, contract]);

    // Load content and trustees
    const loadContents = async () => {
        if (!readOnlyContract || !allContentIds) return;
        setIsLoading(true);
        try {
            const contentPromises = allContentIds.map(async (id) => {
                const content = await getContent(id);
                if (content) {
                    const quizQuestions = await readOnlyContract.getQuizQuestions(id);
                    return {
                        id,
                        title: content.title,
                        pointReward: content.pointReward,
                        quizQuestions: quizQuestions.questions.length,
                        status: "Published", // Assume published if exists
                    };
                }
                return null;
            });
            const loadedContents = await Promise.all(contentPromises);
            setContents(loadedContents.filter((content) => content !== null));
        } catch (error) {
            console.error("Error loading contents:", JSON.stringify(error, null, 2));
            toast.error("Failed to load contents.");
        } finally {
            setIsLoading(false);
        }
    };

    const loadTrustees = async () => {
        if (!readOnlyContract) return;
        try {
            const trusteeList = await readOnlyContract.getTrustees();
            setTrustees(trusteeList.map((addr, index) => ({
                address: addr,
                role: index === 0 ? "Admin" : "Content Creator", // Simplified role assignment
                addedDate: "Unknown", // Update with actual data if stored in contract
            })));
            setIsTrustee(trusteeList.includes(address));
        } catch (error) {
            console.error("Error loading trustees:", JSON.stringify(error, null, 2));
            toast.error("Failed to load trustees.");
        }
    };

    useEffect(() => {
        if (readOnlyContract && allContentIds.length > 0) {
            loadContents();
        }
    }, [readOnlyContract, allContentIds]);

    useEffect(() => {
        if (readOnlyContract && address) {
            loadTrustees();
        }
    }, [readOnlyContract, address]);

    const handleContentSubmit = async (e) => {
        e.preventDefault();
        if (!contract || !isTrustee) {
            toast.error("Only trustees can create content.");
            return;
        }
        setIsLoading(true);
        try {
            const sourcesArray = newContent.sources
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s !== "");
            const tx = await contract.registerContent(
                newContent.title,
                newContent.body,
                sourcesArray,
                parseInt(newContent.pointReward)
            );
            await tx.wait();
            toast.success("Content created successfully!");
            setNewContent({ title: "", body: "", sources: "", pointReward: "" });
            await loadContents();
        } catch (error) {
            console.error("Error creating content:", JSON.stringify(error, null, 2));
            toast.error("Failed to create content: " + (error.message || "Unknown error"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        if (!contract || !isTrustee) {
            toast.error("Only trustees can add quiz questions.");
            return;
        }
        setIsLoading(true);
        try {
            const tx = await contract.addQuizQuestion(
                parseInt(newQuestion.contentId),
                newQuestion.question,
                newQuestion.options,
                parseInt(newQuestion.correctAnswer)
            );
            await tx.wait();
            toast.success("Quiz question added successfully!");
            setNewQuestion({
                contentId: "",
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
            });
            await loadContents();
        } catch (error) {
            console.error("Error adding quiz question:", JSON.stringify(error, null, 2));
            toast.error("Failed to add quiz question: " + (error.message || "Unknown error"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
            </div>

            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/">
                                <Button variant="outline" className="bg-black/20 border-white/20 text-blue-300 hover:bg-blue-500/20">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Platform
                                </Button>
                            </Link>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                        LearnBlock Admin
                                    </h1>
                                    <p className="text-sm text-blue-200">Platform Management</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6 relative z-10">
                {/* Admin Header */}
                <Card className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-400/20 backdrop-blur-xl text-white mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Settings className="w-6 h-6 text-purple-400" />
                            <span className="text-purple-100">Admin Dashboard</span>
                        </CardTitle>
                        <CardDescription className="text-purple-200">
                            {isTrustee ? "Manage content, quizzes, and platform settings" : "You need trustee permissions to manage the platform."}
                        </CardDescription>
                    </CardHeader>
                </Card>

                {!isTrustee ? (
                    <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-white">
                        <CardContent className="p-6 text-center">
                            <p className="text-red-300">Access Denied: Only trustees can access the admin panel.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Tabs defaultValue="content" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-xl border border-white/10">
                            <TabsTrigger
                                value="content"
                                className="flex items-center space-x-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>Content</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="quizzes"
                                className="flex items-center space-x-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                            >
                                <Target className="w-4 h-4" />
                                <span>Quizzes</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="trustees"
                                className="flex items-center space-x-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                            >
                                <Users className="w-4 h-4" />
                                <span>Trustees</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="flex items-center space-x-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                            >
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-6">
                            {/* Create New Content */}
                            <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Plus className="w-5 h-5 text-green-400" />
                                        <span className="text-green-100">Create New Content</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleContentSubmit} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title" className="text-blue-200">
                                                    Title
                                                </Label>
                                                <Input
                                                    id="title"
                                                    value={newContent.title}
                                                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                                                    placeholder="Enter content title"
                                                    className="bg-black/20 border-white/20 text-blue-100 placeholder:text-blue-400"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pointReward" className="text-blue-200">
                                                    Point Reward
                                                </Label>
                                                <Input
                                                    id="pointReward"
                                                    type="number"
                                                    value={newContent.pointReward}
                                                    onChange={(e) => setNewContent({ ...newContent, pointReward: e.target.value })}
                                                    placeholder="Points to award"
                                                    className="bg-black/20 border-white/20 text-blue-100 placeholder:text-blue-400"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="body" className="text-blue-200">
                                                Content Body
                                            </Label>
                                            <Textarea
                                                id="body"
                                                value={newContent.body}
                                                onChange={(e) => setNewContent({ ...newContent, body: e.target.value })}
                                                placeholder="Enter the main content..."
                                                rows={6}
                                                className="bg-black/20 border-white/20 text-blue-100 placeholder:text-blue-400"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="sources" className="text-blue-200">
                                                Sources (comma-separated)
                                            </Label>
                                            <Input
                                                id="sources"
                                                value={newContent.sources}
                                                onChange={(e) => setNewContent({ ...newContent, sources: e.target.value })}
                                                placeholder="https://source1.com, https://source2.com"
                                                className="bg-black/20 border-white/20 text-blue-100 placeholder:text-blue-400"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isLoading ? "Creating..." : "Create Content"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Existing Content */}
                            <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle className="text-blue-100">Existing Content</CardTitle>
                                    <CardDescription className="text-blue-200">Manage published and draft content</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <p className="text-blue-200">Loading contents...</p>
                                    ) : contents.length === 0 ? (
                                        <p className="text-blue-200">No content available.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {contents.map((content) => (
                                                <div
                                                    key={content.id}
                                                    className="flex items-center justify-between p-4 bg-slate-500/10 border border-white/10 rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-blue-100">{content.title}</h3>
                                                        <div className="flex items-center space-x-4 mt-1">
                                                            <span className="text-sm text-blue-300">{content.pointReward} points</span>
                                                            <span className="text-sm text-blue-300">{content.quizQuestions} quiz questions</span>
                                                            <Badge
                                                                variant={content.status === "Published" ? "default" : "secondary"}
                                                                className={
                                                                    content.status === "Published"
                                                                        ? "bg-green-500/20 text-green-300 border-green-400/30"
                                                                        : "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                                                                }
                                                            >
                                                                {content.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="bg-black/20 border-white/20 text-blue-300 hover:bg-blue-500/20"
                                                            onClick={() => toast.info("Edit functionality not available in current contract.")}
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="bg-black/20 border-red-400/30 text-red-400 hover:bg-red-500/20"
                                                            onClick={() => toast.info("Delete functionality not available in current contract.")}
                                                        >
                                                            <Trast className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="quizzes" className="space-y-6">
                            {/* Add Quiz Question */}
                            <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Plus className="w-5 h-5 text-blue-400" />
                                        <span className="text-blue-100">Add Quiz Question</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleQuestionSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="contentId" className="text-blue-200">
                                                Content ID
                                            </Label>
                                            <Input
                                                id="contentId"
                                                type="number"
                                                value={newQuestion.contentId}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, contentId: e.target.value })}
                                                placeholder="Enter content ID"
                                                className="bg-black/20 border-white/20 text-blue-100 placeholder:text-blue-400"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="question" className="text-blue-200">
                                                Question
                                            </Label>
                                            <Textarea
                                                id="question"
                                                value={newQuestion.question}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                                                placeholder="Enter the quiz question..."
                                                rows={3}
                                                className="bg-black/20 border-white/20 text-blue-100 placeholder:text-blue-400"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-blue-200">Answer Options</Label>
                                            {newQuestion.options.map((option, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <Input
                                                        value={option}
                                                        onChange={(e) => {
                                                            const newOptions = [...newQuestion.options];
                                                            newOptions[index] = e.target.value;
                                                            setNewQuestion({ ...newQuestion, options: newOptions });
                                                        }}
                                                        placeholder={`Option ${index + 1}`}
                                                        className="bg-black/20 border-white/20 text-blue-100 placeholder:text-blue-400"
                                                        required
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={newQuestion.correctAnswer === index ? "default" : "outline"}
                                                        onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                                                        className={
                                                            newQuestion.correctAnswer === index
                                                                ? "bg-gradient-to-r from-green-500 to-green-600 border-0"
                                                                : "bg-black/20 border-white/20 text-blue-300 hover:bg-blue-500/20"
                                                        }
                                                    >
                                                        {newQuestion.correctAnswer === index ? "Correct" : "Mark Correct"}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isLoading ? "Adding..." : "Add Question"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="trustees" className="space-y-6">
                            {/* Current Trustees */}
                            <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle className="text-blue-100">Current Trustees</CardTitle>
                                    <CardDescription className="text-blue-200">
                                        Manage platform trustees and their permissions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {trustees.map((trustee, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-slate-500/10 border border-white/10 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-mono text-sm text-blue-200">{trustee.address}</div>
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                                                            {trustee.role}
                                                        </Badge>
                                                        <span className="text-sm text-blue-300">Added: {trustee.addedDate}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="bg-black/20 border-red-400/30 text-red-400 hover:bg-red-500/20"
                                                    onClick={() => toast.info("Remove trustee functionality not available in current contract.")}
                                                >
                                                    <X className="w-3 h-3 mr-1" />
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Add New Trustee */}
                            <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Plus className="w-5 h-5 text-green-400" />
                                        <span className="text-green-100">Add New Trustee</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="trusteeAddress" className="text-blue-200">
                                                Wallet Address
                                            </Label>
                                            <Input
                                                id="trusteeAddress"
                                                placeholder="0x..."
                                                className="font-mono bg-black/20 border-white/20 text-blue-100 placeholder:text-blue-400"
                                            />
                                        </div>
                                        <Button
                                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0"
                                            onClick={() => toast.info("Add trustee functionality not available in current contract.")}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Trustee
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-6">
                            {/* Platform Settings */}
                            <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle className="text-blue-100">Platform Settings</CardTitle>
                                    <CardDescription className="text-blue-200">Configure platform parameters and rewards</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-blue-100">Reward Configuration</h3>
                                            <div className="space-y-2">
                                                <Label className="text-blue-200">XFI per Point</Label>
                                                <Input
                                                    defaultValue="0.1"
                                                    type="number"
                                                    step="0.01"
                                                    className="bg-black/20 border-white/20 text-blue-100"
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-blue-200">Points per Badge</Label>
                                                <Input
                                                    defaultValue="500"
                                                    type="number"
                                                    className="bg-black/20 border-white/20 text-blue-100"
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-blue-200">Golden Badge Threshold</Label>
                                                <Input
                                                    defaultValue="5"
                                                    type="number"
                                                    className="bg-black/20 border-white/20 text-blue-100"
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-blue-100">Contract Information</h3>
                                            <div className="space-y-2">
                                                <Label className="text-blue-200">Contract Address</Label>
                                                <Input
                                                    value={contract?.address || "Not available"}
                                                    readOnly
                                                    className="font-mono bg-slate-500/10 border-white/10 text-blue-200"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-blue-200">Contract Balance</Label>
                                                <Input
                                                    value={isLoading ? "Loading..." : `${contractBalance} XFI`}
                                                    readOnly
                                                    className="bg-slate-500/10 border-white/10 text-blue-200"
                                                />
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full bg-black/20 border-white/20 text-blue-300 hover:bg-blue-500/20"
                                                onClick={() => toast.info("Fund contract functionality not implemented in frontend yet.")}
                                            >
                                                <Coins className="w-4 h-4 mr-2" />
                                                Fund Contract
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-0"
                                        onClick={() => toast.info("Settings update not available in current contract.")}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Settings
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
};

export default Admin;