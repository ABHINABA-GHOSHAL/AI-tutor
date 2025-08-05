
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  MessageCircle, 
  Brain, 
  CreditCard, 
  FileText, 
  BookOpen,
  BarChart3,
  Clock,
  Trophy,
  GraduationCap,
  Plus,
  Home,
  LogOut,
  User,
  Edit
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = () => {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    navigate('/');
  };

  const handleViewProfile = () => {
    toast({
      title: "View Profile",
      description: "Profile view feature coming soon!",
    });
  };

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile", 
      description: "Profile editing feature coming soon!",
    });
  };
  
  // Mock data
  const recentDocuments = [
    { id: 1, name: "Physics Chapter 1", pages: 24, uploadedAt: "2 hours ago", progress: 85 },
    { id: 2, name: "Calculus Notes", pages: 18, uploadedAt: "1 day ago", progress: 60 },
    { id: 3, name: "Biology Textbook", pages: 156, uploadedAt: "3 days ago", progress: 45 },
  ];

  const stats = [
    { label: "Documents", value: "12", icon: FileText, color: "text-education-blue" },
    { label: "Study Sessions", value: "48", icon: Clock, color: "text-education-purple" },
    { label: "Quizzes Completed", value: "23", icon: Trophy, color: "text-education-green" },
    { label: "Average Score", value: "87%", icon: BarChart3, color: "text-education-orange" },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "upload":
        navigate('/summarizer');
        break;
      case "chat":
        navigate('/chat');
        break;
      case "quiz":
        navigate('/quiz');
        break;
      case "flashcards":
        navigate('/flashcards');
        break;
      default:
        toast({
          title: "Feature",
          description: "This feature is coming soon!",
        });
    }
  };

  const quickActions = [
    { 
      title: "Upload Document", 
      description: "Add new study material", 
      icon: Upload, 
      variant: "education" as const,
      action: "upload"
    },
    { 
      title: "Start Chat", 
      description: "Ask questions about your content", 
      icon: MessageCircle, 
      variant: "learning" as const,
      action: "chat"
    },
    { 
      title: "Generate Quiz", 
      description: "Test your knowledge", 
      icon: Brain, 
      variant: "quiz" as const,
      action: "quiz"
    },
    { 
      title: "Study Flashcards", 
      description: "Review key concepts", 
      icon: CreditCard, 
      variant: "default" as const,
      action: "flashcards"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-education rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Tutor</h1>
                <p className="text-sm text-muted-foreground">Learn Smarter, Not Harder</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-8 h-8 bg-gradient-education rounded-full cursor-pointer hover:opacity-80 transition-opacity"></div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleViewProfile}>
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEditProfile}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-education rounded-2xl overflow-hidden mb-8 shadow-medium">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 p-8 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Welcome back! Ready to learn?
                </h2>
                <p className="text-lg mb-6 text-white/90">
                  Transform your PDFs into interactive learning experiences with AI-powered summaries, quizzes, and personalized tutoring.
                </p>
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
                  onClick={() => handleQuickAction("upload")}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Upload New Document
                </Button>
              </div>
              <div className="hidden lg:block">
                <div className="w-full h-48 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center">
                  <Brain className="w-16 h-16 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Start your learning session</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quickActions.map((action, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center">
                                <action.icon className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1">{action.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                                <Button 
                                  variant={action.variant} 
                                  size="sm"
                                  onClick={() => handleQuickAction(action.action)}
                                >
                                  Get Started
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Documents */}
              <div>
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Recent Documents</CardTitle>
                    <CardDescription>Continue where you left off</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentDocuments.map((doc) => (
                      <div key={doc.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{doc.name}</h4>
                            <p className="text-sm text-muted-foreground">{doc.pages} pages • {doc.uploadedAt}</p>
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Progress</span>
                                <span className="text-xs font-medium">{doc.progress}%</span>
                              </div>
                              <Progress value={doc.progress} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                     <Button variant="outline" className="w-full" onClick={() => navigate('/history')}>
                       <Clock className="w-4 h-4 mr-2" />
                       View History
                     </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Document Library</CardTitle>
                <CardDescription>Manage your study materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentDocuments.map((doc) => (
                    <Card key={doc.id} className="cursor-pointer hover:shadow-medium transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{doc.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{doc.pages} pages</p>
                            <Badge variant="outline" className="text-xs">
                              {doc.progress}% Complete
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Quiz Center</CardTitle>
                <CardDescription>Test your knowledge and track progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No quizzes yet</h3>
                  <p className="text-muted-foreground mb-4">Upload a document to generate quizzes</p>
                  <Button onClick={() => handleQuickAction("quiz")}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Learning Analytics</CardTitle>
                <CardDescription>Track your learning progress and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
                    <p className="text-muted-foreground">Coming soon</p>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Study Time</h3>
                    <p className="text-muted-foreground">Coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;