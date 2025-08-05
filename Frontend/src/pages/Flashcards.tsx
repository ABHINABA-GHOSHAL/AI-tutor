import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload, FileText, CreditCard, RotateCcw, Shuffle, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

const Flashcards = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());
  const [correctCards, setCorrectCards] = useState<Set<number>>(new Set());
  const [numQuestions, setNumQuestions] = useState(5);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadedFile(file.name);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "No File",
        description: "Please upload a PDF file first.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("num_questions", numQuestions.toString());

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await fetch("http://localhost:8000/generate_flashcards/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Flashcard generation failed");

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 100);

      const data = await res.json();
      setTimeout(async () => {
        setFlashcards(data.flashcards);
        setCurrentCard(0);
        setIsFlipped(false);
        setStudiedCards(new Set());
        setCorrectCards(new Set());
        setIsUploading(false);
        toast({ title: "Flashcards Generated", description: "Study session ready!" });

        // ✅ Save history to MongoDB
        await fetch("http://localhost:8000/history/flashcards", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_name: uploadedFile,
            flashcards: data.flashcards,
          }),
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const handleKnowCard = () => {
    const cardId = flashcards[currentCard].id;
    setStudiedCards((prev) => new Set(prev).add(cardId));
    setCorrectCards((prev) => new Set(prev).add(cardId));
    toast({ title: "Marked Known", description: "Card marked as known." });
    handleNext();
  };

  const handleDontKnowCard = () => {
    const cardId = flashcards[currentCard].id;
    setStudiedCards((prev) => new Set(prev).add(cardId));
    setCorrectCards((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
    toast({ title: "Needs Practice", description: "Card marked for review.", variant: "destructive" });
    handleNext();
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    setCurrentCard(randomIndex);
    setIsFlipped(false);
    toast({ title: "Shuffled!", description: "Random flashcard shown." });
  };

  const resetProgress = () => {
    setStudiedCards(new Set());
    setCorrectCards(new Set());
    setCurrentCard(0);
    setIsFlipped(false);
    toast({ title: "Progress Reset", description: "Starting over!" });
  };

  const progressPercentage = flashcards.length > 0 ? (studiedCards.size / flashcards.length) * 100 : 0;
  const accuracyPercentage = studiedCards.size > 0 ? (correctCards.size / studiedCards.size) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-education rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Flashcards</h1>
                <p className="text-sm text-muted-foreground">Upload a PDF to generate flashcards</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload PDF</span>
            </CardTitle>
            <CardDescription>Generate flashcards from your document.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Choose PDF file</p>
                <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
              </label>
            </div>

            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              min={1}
              max={50}
              className="w-full border rounded px-3 py-2"
              placeholder="Number of flashcards"
            />

            <Button onClick={handleSubmit} disabled={!selectedFile || isUploading}>
              {isUploading ? "Generating..." : "Submit"}
            </Button>

            {isUploading && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Generating Flashcards...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </CardContent>
        </Card>

        {flashcards.length > 0 && studiedCards.size >= flashcards.length && (
          <Card className="shadow-soft mt-6 text-center">
            <CardHeader>
              <CardTitle>All Flashcards Reviewed 🎉</CardTitle>
              <CardDescription>You’ve gone through all cards in this session.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={resetProgress}>Restart Session</Button>
            </CardContent>
          </Card>
        )}

        {flashcards.length > 0 && studiedCards.size < flashcards.length && (
          <Card className="shadow-soft mt-6">
            <CardHeader>
              <CardTitle>Flashcard Study</CardTitle>
              <CardDescription>Flip, review, and track your learning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Progress: {Math.round(progressPercentage)}%</span>
                <span>Accuracy: {Math.round(accuracyPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} />

              <div
                className="min-h-[150px] bg-muted/30 rounded-lg p-8 text-center cursor-pointer"
                onClick={handleFlip}
              >
                <p className="text-lg font-medium mb-2">
                  {isFlipped ? flashcards[currentCard].back : flashcards[currentCard].front}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isFlipped ? "Answer" : "Click to reveal answer"}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={handlePrevious}>Previous</Button>
                {isFlipped && (
                  <div className="flex space-x-3">
                    <Button variant="destructive" onClick={handleDontKnowCard} className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4" />
                      <span>Don't Know</span>
                    </Button>
                    <Button variant="default" onClick={handleKnowCard} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>I Know This</span>
                    </Button>
                  </div>
                )}
                <Button onClick={handleNext}>Next</Button>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={handleShuffle}>
                  <Shuffle className="w-4 h-4 mr-1" />
                  Shuffle
                </Button>
                <Button variant="outline" onClick={resetProgress}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
