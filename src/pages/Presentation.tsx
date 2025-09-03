import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Diamond, Send, ChevronLeft, ChevronRight, Monitor, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  keywords: string[];
}

interface AIResponse {
  success: boolean;
  aiResponse: string;
  suggestion: string;
  selectedContent: ContentItem | null;
  contentLibrary: ContentItem[];
  error?: string;
}

const Presentation = () => {
  const [currentContent, setCurrentContent] = useState<ContentItem | null>(null);
  const [command, setCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [contentLibrary, setContentLibrary] = useState<ContentItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [presentationId, setPresentationId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializePresentation();
  }, []);

  const initializePresentation = async () => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Create a new presentation session for authenticated user
        const { data, error } = await supabase
          .from('presentations')
          .insert({
            title: `การนำเสนอ ${new Date().toLocaleString('th-TH')}`,
            presenter_name: 'ผู้นำเสนอ',
            status: 'active',
            user_id: user.id
          })
          .select()
          .single();

        if (error) throw error;
        setPresentationId(data.id);
      } else {
        // For demo purposes, generate a temporary session ID
        setPresentationId(crypto.randomUUID());
      }

      // Load initial content library
      const { data: content, error: contentError } = await supabase
        .from('content_library')
        .select('*');

      if (contentError) throw contentError;
      setContentLibrary(content || []);

    } catch (error) {
      console.error('Error initializing presentation:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเริ่มการนำเสนอได้",
        variant: "destructive",
      });
    }
  };

  const handleCommand = async () => {
    if (!command.trim()) return;

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('ai-content-finder', {
        body: {
          command: command.trim(),
          presentationId
        }
      });

      if (response.error) throw response.error;

      const result: AIResponse = response.data;
      
      if (result.success) {
        setAiResponse(result.aiResponse);
        setSuggestion(result.suggestion);
        
        if (result.selectedContent) {
          setCurrentContent(result.selectedContent);
          const index = result.contentLibrary.findIndex(item => item.id === result.selectedContent!.id);
          setCurrentIndex(index >= 0 ? index : 0);
        }
        
        setContentLibrary(result.contentLibrary);
        setCommand("");

        toast({
          title: "AI ตอบสนองแล้ว",
          description: "พบเนื้อหาที่เหมาะสมสำหรับการนำเสนอ",
        });
      } else {
        throw new Error(result.error || 'Unknown error');
      }

    } catch (error) {
      console.error('Error processing command:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถประมวลผลคำสั่งได้",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateContent = (direction: 'prev' | 'next') => {
    if (contentLibrary.length === 0) return;

    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : contentLibrary.length - 1;
    } else {
      newIndex = currentIndex < contentLibrary.length - 1 ? currentIndex + 1 : 0;
    }

    setCurrentIndex(newIndex);
    setCurrentContent(contentLibrary[newIndex]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommand();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Clean Header */}
      <header className="px-6 py-4 border-b border-primary/10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Crown className="h-6 w-6 text-primary" />
              <Diamond className="h-3 w-3 text-primary-light absolute -top-1 -right-1" />
            </div>
            <span className="text-lg font-semibold bg-gradient-crown bg-clip-text text-transparent">
              Crown Diamond Station
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                กลับหน้าแรก
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">โหมดการนำเสนอ</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex">
        {/* Content Display Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {currentContent ? (
              <Card className="bg-gradient-card border-primary/10 shadow-crown">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-4">
                      {currentContent.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      {currentContent.description}
                    </p>
                    {currentContent.keywords && currentContent.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {currentContent.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-primary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Display */}
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <Monitor className="h-16 w-16 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">วิดีโอจะแสดงที่นี่</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        URL: {currentContent.video_url}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => navigateContent('prev')}
                      className="border-primary/20 text-primary hover:bg-primary/10"
                      disabled={contentLibrary.length <= 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      ก่อนหน้า
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      {currentIndex + 1} / {contentLibrary.length}
                    </span>
                    
                    <Button
                      variant="outline"
                      onClick={() => navigateContent('next')}
                      className="border-primary/20 text-primary hover:bg-primary/10"
                      disabled={contentLibrary.length <= 1}
                    >
                      ถัดไป
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-card border-primary/10 shadow-diamond">
                <CardContent className="p-8 text-center">
                  <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    ยินดีต้อนรับสู่ Crown Diamond Station
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    ใช้คำสั่ง AI ในช่องด้านล่างเพื่อเริ่มการนำเสนอ
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ตัวอย่าง: "ขอดูเนื้อหาเกี่ยวกับการตลาดดิจิทัล" หรือ "อยากรู้เรื่องการทำแบรนด์"
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* AI Control Panel */}
        <div className="w-80 border-l border-primary/10 bg-background/50 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Diamond className="h-5 w-5 text-primary mr-2" />
              ระบบควบคุม AI
            </h3>
            
            <div className="space-y-4">
              {/* Command Input */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  พิมพ์คำสั่งของคุณ
                </label>
                <div className="flex gap-2">
                  <Input
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="เช่น: ขอดูวิดีโอเกี่ยวกับการตลาด"
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleCommand}
                    disabled={isLoading || !command.trim()}
                    size="icon"
                    className="bg-gradient-crown hover:shadow-crown"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* AI Response */}
              {aiResponse && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    คำตอบจาก AI
                  </label>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                    {aiResponse}
                  </div>
                </div>
              )}

              {/* AI Suggestion */}
              {suggestion && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    คำแนะนำ
                  </label>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm text-primary">
                    {suggestion}
                  </div>
                </div>
              )}

              <Separator />

              {/* Quick Commands */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  คำสั่งแนะนำ
                </label>
                <div className="space-y-2">
                  {[
                    "ขอดูวิดีโอเกี่ยวกับการตลาด",
                    "อยากรู้เรื่องการทำแบรนด์",
                    "ขอดูข้อมูลลูกค้า"
                  ].map((cmd) => (
                    <Button
                      key={cmd}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCommand(cmd)}
                      className="w-full justify-start text-left text-xs h-auto p-2 text-muted-foreground hover:text-primary"
                    >
                      {cmd}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Presentation;