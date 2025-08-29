import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Brain, 
  Monitor, 
  Settings, 
  Play, 
  Pause,
  Trash2,
  Plus,
  Search,
  Calendar,
  Clock,
  Users
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PresentationManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const { toast } = useToast();

  const presentations = [
    {
      id: 1,
      title: "Business Expansion Strategy",
      date: "2024-01-15",
      duration: "45 min",
      status: "completed",
      aiResponses: 12,
      attendees: 8
    },
    {
      id: 2,
      title: "Product Launch Presentation",
      date: "2024-01-14",
      duration: "32 min",
      status: "completed",
      aiResponses: 8,
      attendees: 15
    },
    {
      id: 3,
      title: "Q1 Performance Review",
      date: "2024-01-12",
      duration: "28 min",
      status: "draft",
      aiResponses: 5,
      attendees: 0
    }
  ];

  const aiPrompts = [
    "แสดงวิดีโอ training เรื่อง business expansion",
    "สรุปเนื้อหาสำหรับลูกค้า",
    "แสดงข้อมูลเปรียบเทียบ",
    "เปิดวิดีโอการฝึกอบรม",
    "แสดงกราฟยอดขาย"
  ];

  const handleCreatePrompt = () => {
    if (!newPrompt.trim()) return;
    
    toast({
      title: "Prompt Added",
      description: "New AI prompt has been saved successfully",
    });
    
    setNewPrompt("");
  };

  const handleDeletePresentation = (id: number) => {
    toast({
      title: "Presentation Deleted",
      description: "Presentation has been removed from history",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Presentation Manager</h1>
              </div>
            </div>
            <Link to="/presentation">
              <Button className="bg-primary hover:bg-primary-hover">
                <Monitor className="mr-2 h-4 w-4" />
                New Presentation
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Prompt Management */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  AI Prompt Manager
                </CardTitle>
                <CardDescription>
                  จัดการคำสั่งสำหรับ AI Agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Create New Prompt</label>
                  <Textarea
                    placeholder="พิมพ์คำสั่งใหม่สำหรับ AI Agent..."
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button 
                    onClick={handleCreatePrompt}
                    className="w-full"
                    disabled={!newPrompt.trim()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Prompt
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Prompts</label>
                  <div className="space-y-2">
                    {aiPrompts.map((prompt, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-accent/50">
                        <Button variant="ghost" size="sm" className="flex-1 justify-start text-xs p-1">
                          {prompt}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>AI Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Agent Status</span>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Training Data</span>
                    <Badge variant="secondary">7 Videos</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm text-muted-foreground">0.8s avg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Presentation History */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Presentation History</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search presentations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {presentations
                    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((presentation) => (
                    <div key={presentation.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-smooth">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{presentation.title}</h3>
                            <Badge 
                              variant={presentation.status === 'completed' ? 'default' : 'secondary'}
                            >
                              {presentation.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{presentation.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{presentation.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Brain className="h-4 w-4" />
                              <span>{presentation.aiResponses} responses</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{presentation.attendees} attendees</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            {presentation.status === 'completed' ? (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Review
                              </>
                            ) : (
                              <>
                                <Monitor className="mr-2 h-4 w-4" />
                                Continue
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeletePresentation(presentation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Training Content</CardTitle>
                <CardDescription>
                  วิดีโอและเนื้อหาที่ใช้ในการฝึก AI Agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Training content will be available after Supabase integration</p>
                    <p className="text-sm">Connect to Supabase to manage video content library</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PresentationManager;