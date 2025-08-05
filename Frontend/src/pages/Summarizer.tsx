// src/pages/Summarizer.tsx
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
import { ArrowLeft, Upload, FileText, Brain, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Summarizer = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState("");
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
      const uploadRes = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 100);

      setTimeout(async () => {
        const summarizeRes = await fetch("http://localhost:8000/summarize", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ content: "uploaded" }),
        });

        if (!summarizeRes.ok) throw new Error("Summarization failed");

        const data = await summarizeRes.json();
        const finalSummary = data.summary || "Summary not found.";
        setSummary(finalSummary);
        setIsUploading(false);

        // ✅ Save summary to history
        await fetch("http://localhost:8000/history/summarize", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_name: file.name,
            summary: finalSummary,
          }),
        });

        toast({
          title: "Summary Generated",
          description: "Your document has been successfully summarized!",
        });
      }, 2000);
    } catch (err) {
      setIsUploading(false);
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to upload or summarize document",
        variant: "destructive",
      });
    }
  };

  const handleDownloadSummary = () => {
    const element = document.createElement("a");
    const file = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${uploadedFile?.replace(".pdf", "")}_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Downloaded",
      description: "Summary has been downloaded successfully!",
    });
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
              <div className="w-10 h-10 bg-gradient-education rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Document Summarizer</h1>
                <p className="text-sm text-muted-foreground">
                  Upload and get AI-powered summaries
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload Document</span>
              </CardTitle>
              <CardDescription>
                Upload a PDF document to get an AI-generated summary
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
                    <p className="text-sm text-muted-foreground">Ready for processing</p>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Summary</span>
                </div>
                {summary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadSummary}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </CardTitle>
              <CardDescription>AI-generated summary of your document</CardDescription>
            </CardHeader>
            <CardContent>
              {summary ? (
                <Textarea
                  value={summary}
                  readOnly
                  className="min-h-[400px] resize-none"
                  placeholder="Your summary will appear here..."
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Brain className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No summary yet</p>
                  <p className="text-muted-foreground">
                    Upload a document to generate a summary
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Summarizer;
