import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CreditCard, RotateCcw, CheckCircle, XCircle, Shuffle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

const Flashcards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());
  const [correctCards, setCorrectCards] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock flashcard data
  const flashcards: Flashcard[] = [
    {
      id: 1,
      front: "What is the derivative of x²?",
      back: "2x",
      category: "Calculus"
    },
    {
      id: 2,
      front: "What is the speed of light in vacuum?",
      back: "3 × 10⁸ m/s",
      category: "Physics"
    },
    {
      id: 3,
      front: "What is photosynthesis?",
      back: "The process by which plants convert light energy into chemical energy",
      category: "Biology"
    },
    {
      id: 4,
      front: "What is the quadratic formula?",
      back: "x = (-b ± √(b²-4ac)) / 2a",
      category: "Algebra"
    },
    {
      id: 5,
      front: "What is Newton's first law?",
      back: "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force",
      category: "Physics"
    }
  ];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    } else {
      // Loop back to first card
      setCurrentCard(0);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    } else {
      // Loop to last card
      setCurrentCard(flashcards.length - 1);
      setIsFlipped(false);
    }
  };

  const handleKnowCard = () => {
    const cardId = flashcards[currentCard].id;
    setStudiedCards(prev => new Set([...prev, cardId]));
    setCorrectCards(prev => new Set([...prev, cardId]));
    
    toast({
      title: "Great!",
      description: "Card marked as known",
    });
    
    handleNext();
  };

  const handleDontKnowCard = () => {
    const cardId = flashcards[currentCard].id;
    setStudiedCards(prev => new Set([...prev, cardId]));
    // Remove from correct cards if it was there
    setCorrectCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
    
    toast({
      title: "Keep practicing!",
      description: "Card marked for review",
      variant: "destructive"
    });
    
    handleNext();
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    setCurrentCard(randomIndex);
    setIsFlipped(false);
    
    toast({
      title: "Shuffled!",
      description: "Showing a random card",
    });
  };

  const resetProgress = () => {
    setStudiedCards(new Set());
    setCorrectCards(new Set());
    setCurrentCard(0);
    setIsFlipped(false);
    
    toast({
      title: "Progress Reset",
      description: "Starting fresh with all cards",
    });
  };

  const progressPercentage = (studiedCards.size / flashcards.length) * 100;
  const accuracyPercentage = studiedCards.size > 0 ? (correctCards.size / studiedCards.size) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-education rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Flashcards</h1>
                <p className="text-sm text-muted-foreground">Study with interactive flashcards</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{currentCard + 1}/{flashcards.length}</p>
              <p className="text-sm text-muted-foreground">Current Card</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
              <p className="text-sm text-muted-foreground">Progress</p>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{Math.round(accuracyPercentage)}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Flashcard */}
        <Card className="shadow-soft mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Badge variant="outline">{flashcards[currentCard].category}</Badge>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleShuffle}>
                  <Shuffle className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={resetProgress}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="min-h-[200px] bg-muted/30 rounded-lg p-8 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-muted/50"
              onClick={handleFlip}
            >
              <div className="text-center">
                <p className="text-lg font-medium mb-4">
                  {isFlipped ? flashcards[currentCard].back : flashcards[currentCard].front}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isFlipped ? "Answer" : "Click to reveal answer"}
                </p>
              </div>
            </div>

            {/* Navigation and Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>

              {isFlipped && (
                <div className="flex space-x-3">
                  <Button 
                    variant="destructive" 
                    onClick={handleDontKnowCard}
                    className="flex items-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Don't Know</span>
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={handleKnowCard}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>I Know This</span>
                  </Button>
                </div>
              )}

              <Button onClick={handleNext}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Study Summary */}
        {studiedCards.size > 0 && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Study Session Summary</CardTitle>
              <CardDescription>Your performance so far</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {correctCards.size}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">Cards Known</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {studiedCards.size - correctCards.size}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">Need Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Flashcards;