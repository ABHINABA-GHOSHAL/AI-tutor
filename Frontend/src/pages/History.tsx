import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Brain,
  BookOpen,
  Edit2,
  Trash2,
  Download,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const History = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [summarizerHistory, setSummarizerHistory] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [flashcardHistory, setFlashcardHistory] = useState([]); // NEW
  const [editingItem, setEditingItem] = useState<{ type: string; id: string } | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:8000/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        const summaries = data.history.filter((item: any) => item.type === "summarizer");
        const quizzes = data.history.filter((item: any) => item.type === "quiz");
        const flashcards = data.history.filter((item: any) => item.type === "flashcards"); // NEW

        setSummarizerHistory(
          summaries.map((item: any) => ({
            id: item._id,
            name: item.file_name,
            date: new Date(item.timestamp).toLocaleDateString(),
            type: "PDF",
          }))
        );

        setQuizHistory(
          quizzes.map((item: any) => ({
            id: item._id,
            name: item.file_name,
            date: new Date(item.timestamp).toLocaleDateString(),
            type: "PDF",
          }))
        );

        setFlashcardHistory(
          flashcards.map((item: any) => ({
            id: item._id,
            name: item.file_name,
            date: new Date(item.timestamp).toLocaleDateString(),
            type: "PDF",
          }))
        ); // NEW
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };
    fetchHistory();
  }, []);

  const handleRename = (type: string, id: string, currentName: string) => {
    setEditingItem({ type, id });
    setNewName(currentName);
  };

  const saveRename = () => {
    if (!editingItem || !newName.trim()) return;
    const { type, id } = editingItem;
    if (type === "summarizer") {
      setSummarizerHistory(prev =>
        prev.map(item => item.id === id ? { ...item, name: newName } : item)
      );
    } else if (type === "quiz") {
      setQuizHistory(prev =>
        prev.map(item => item.id === id ? { ...item, name: newName } : item)
      );
    } else if (type === "flashcards") {
      setFlashcardHistory(prev =>
        prev.map(item => item.id === id ? { ...item, name: newName } : item)
      );
    } // NEW
    setEditingItem(null);
    setNewName("");

    toast({
      title: "Renamed Successfully",
      description: "Item has been renamed successfully!",
    });
  };

  const deleteItem = async (type: string, id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/history/${type}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to delete item");
      }

      if (type === "summarizer") {
        setSummarizerHistory(prev => prev.filter(item => item.id !== id));
      } else if (type === "quiz") {
        setQuizHistory(prev => prev.filter(item => item.id !== id));
      } else if (type === "flashcards") {
        setFlashcardHistory(prev => prev.filter(item => item.id !== id));
      } // NEW

      toast({
        title: "Deleted",
        description: "Item has been deleted successfully!",
      });
    } catch (err) {
      console.error("Delete failed", err);
      toast({
        title: "Delete failed",
        description: "Unable to delete the item from the server.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (type: string, id: string, name: string) => {
    try {
      const res = await fetch(`http://localhost:8000/history/${type}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      let content = "";
      if (type === "quiz") content = data.quiz;
      else if (type === "summarizer") content = data.summary;
      else if (type === "flashcards") {
        content = (data.flashcards || []).map((fc: any, i: number) => `Q${i + 1}: ${fc.front}\nA: ${fc.back}`).join("\n\n");
      }

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}_${type}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      toast({
        title: "Download failed",
        description: "Unable to fetch or save the file.",
        variant: "destructive",
      });
    }
  };

  const HistoryCard = ({ item, type, icon: Icon }: any) => (
    <Card className="shadow-soft hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 bg-gradient-education rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              {editingItem?.type === type && editingItem?.id === item.id ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-8"
                    onKeyPress={(e) => e.key === "Enter" && saveRename()}
                  />
                  <Button size="sm" onClick={saveRename}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-foreground">{item.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{item.date}</span>
                    {item.type && <span>{item.type}</span>}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => handleRename(type, item.id, item.name)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteItem(type, item.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDownload(type, item.id, item.name)}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">History</h1>
                <p className="text-sm text-muted-foreground">View and manage your activity history</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="summarizer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6">
            <TabsTrigger value="summarizer" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Summarizer</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span>Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center space-x-2"> {/* NEW */}
              <BookOpen className="w-4 h-4" />
              <span>Flashcards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summarizer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Summarizer History</CardTitle>
                <CardDescription>View your previously summarized documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {summarizerHistory.map((item: any) => (
                  <HistoryCard key={item.id} item={item} type="summarizer" icon={Brain} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Quiz History</CardTitle>
                <CardDescription>View your previously generated quizzes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quizHistory.map((item: any) => (
                  <HistoryCard key={item.id} item={item} type="quiz" icon={HelpCircle} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcards" className="space-y-4"> {/* NEW */}
            <Card>
              <CardHeader>
                <CardTitle>Flashcard History</CardTitle>
                <CardDescription>View your previously generated flashcards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {flashcardHistory.map((item: any) => (
                  <HistoryCard key={item.id} item={item} type="flashcards" icon={BookOpen} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default History;
