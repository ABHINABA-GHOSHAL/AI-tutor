import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Brain, 
  MessageCircle, 
  CreditCard, 
  FileText, 
  ArrowRight,
  Upload,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const features = [
    {
      icon: Upload,
      title: "Smart PDF Upload",
      description: "Upload any PDF and watch it transform into an interactive learning experience"
    },
    {
      icon: Brain,
      title: "AI-Powered Summaries", 
      description: "Get concise, intelligent summaries of your study materials in seconds"
    },
    {
      icon: MessageCircle,
      title: "Interactive Chat",
      description: "Ask questions about your content and get instant, contextual answers"
    },
    {
      icon: CreditCard,
      title: "Smart Flashcards",
      description: "Automatically generated flashcards to reinforce key concepts"
    },
    {
      icon: FileText,
      title: "Custom Quizzes",
      description: "Test your knowledge with AI-generated quizzes tailored to your content"
    },
    {
      icon: Sparkles,
      title: "Personalized Learning",
      description: "Adaptive learning paths that adjust to your progress and style"
    }
  ];

  const benefits = [
    "Transform static PDFs into interactive learning",
    "Save hours with AI-powered summaries",
    "Test knowledge with custom quizzes",
    "Get instant answers to any question",
    "Track progress and improve retention"
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-education rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-education bg-clip-text text-transparent">
                  AI Tutor
                </h1>
                <p className="text-xs text-muted-foreground">Learn Smarter</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="education">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-gradient-education/10 text-primary border-0">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Learning
                </Badge>
                <h1 className="text-5xl font-bold leading-tight">
                  Transform Your
                  <span className="bg-gradient-education bg-clip-text text-transparent block">
                    Learning Experience
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Turn any PDF into an intelligent tutor with AI-powered summaries, 
                  flashcards, quizzes, and interactive Q&A. Learn faster, retain more.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button variant="education" size="lg" className="text-lg px-8">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                
              </div>

              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-education-green flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="w-full h-80 bg-gradient-education rounded-2xl shadow-glow flex items-center justify-center">
                  <div className="text-center text-white">
                    <Brain className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-medium">AI Learning Platform</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-education rounded-2xl blur-3xl opacity-20 animate-pulse-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-education bg-clip-text text-transparent"> Excel</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by advanced AI technology to create the most effective learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gradient-education rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-education opacity-90"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Revolutionize Your Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Learn Smarter with AI-Tutor
          </p>
          <Link to="/signup">
            <Button variant="hero" size="lg" className="text-lg px-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-education rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-education bg-clip-text text-transparent">
              AI Tutor
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2025 AI Tutor. Made by AbHinaba Ghoshal
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;