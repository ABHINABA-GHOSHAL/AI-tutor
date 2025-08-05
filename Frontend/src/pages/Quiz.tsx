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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, FileText, FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Quiz = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [quiz, setQuiz] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file.name);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload the file
      const uploadRes = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 100);

      // Wait for progress animation
      setTimeout(async () => {
        const quizRes = await fetch("http://localhost:8000/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            content: "uploaded", // dummy value; backend uses last uploaded file
            num_questions: "10",
          }),
        });

        if (!quizRes.ok) throw new Error("Quiz generation failed");

        const data = await quizRes.json();
        setQuiz(data.quiz || "No quiz generated.");
        setIsUploading(false);

        await fetch("http://localhost:8000/history/quiz", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_name: file.name,
            quiz: data.quiz,
          }),
        });

        toast({
          title: "Quiz Generated",
          description: "MCQs have been successfully generated!",
        });
      }, 2000);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to upload or generate quiz.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
                <FileQuestion className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Document Quiz
                </h1>
                <p className="text-sm text-muted-foreground">
                  Upload a PDF to generate MCQs
                </p>
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
              <span>Upload Document</span>
            </CardTitle>
            <CardDescription>
              Upload a PDF to generate multiple-choice questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Choose PDF file</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to browse
                </p>
              </label>
            </div>

            {uploadedFile && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium">{uploadedFile}</p>
                  <p className="text-sm text-muted-foreground">
                    Ready to generate quiz
                  </p>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating Quiz...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {quiz && (
          <Card className="shadow-soft mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileQuestion className="w-5 h-5" />
                <span>Generated Quiz</span>
              </CardTitle>
              <CardDescription>
                Here are your AI-generated questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={quiz}
                readOnly
                className="min-h-[400px] resize-none"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Quiz;
