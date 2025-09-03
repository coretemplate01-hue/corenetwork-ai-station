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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Mobile-First Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Crown className="h-5 w-5 text-primary" />
              <Diamond className="h-2 w-2 text-primary absolute -top-0.5 -right-0.5" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hidden sm:block">
              Crown Diamond Station
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">กลับ</span>
              </Button>
            </Link>
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <Monitor className="h-3 w-3" />
              <span>นำเสนอ</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 max-w-6xl">
        {currentContent ? (
          <div className="space-y-4">
            {/* Video Section - Full Width & Prominent */}
            <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="relative">
                {/* Video Container */}
                <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                  {currentContent.video_url ? (
                    (() => {
                      const url = currentContent.video_url;
                      
                      // YouTube URL handling
                      if (url.includes('youtube.com') || url.includes('youtu.be')) {
                        let videoId = '';
                        
                        if (url.includes('youtube.com/watch?v=')) {
                          videoId = url.split('watch?v=')[1].split('&')[0];
                        } else if (url.includes('youtube.com/embed/')) {
                          videoId = url.split('embed/')[1].split('?')[0];
                        } else if (url.includes('youtu.be/')) {
                          videoId = url.split('youtu.be/')[1].split('?')[0];
                        }
                        
                        if (videoId) {
                          return (
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              title={currentContent.title}
                            />
                          );
                        }
                      }
                      
                      // Regular video file
                      if (url.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
                        return (
                          <video
                            src={url}
                            controls
                            className="w-full h-full object-cover bg-black"
                            preload="metadata"
                            playsInline
                          >
                            <p className="text-white p-4 text-center">
                              เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
                            </p>
                          </video>
                        );
                      }
                      
                      // Fallback
                      return (
                        <div className="flex items-center justify-center h-full bg-muted">
                          <div className="text-center p-6">
                            <Monitor className="h-12 w-12 text-primary mx-auto mb-3" />
                            <p className="text-muted-foreground mb-2 text-sm">รูปแบบวิดีโอไม่รองรับ</p>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="text-xs"
                            >
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                เปิดดูในหน้าต่างใหม่
                              </a>
                            </Button>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                      <div className="text-center p-6">
                        <Monitor className="h-12 w-12 text-primary mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">ไม่มีวิดีโอ</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                  <h1 className="font-bold text-lg mb-1 line-clamp-2">{currentContent.title}</h1>
                  {contentLibrary.length > 1 && (
                    <p className="text-xs text-white/80">
                      {currentIndex + 1} / {contentLibrary.length}
                    </p>
                  )}
                </div>
              </div>

              {/* Content Details */}
              <CardContent className="p-4">
                <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                  {currentContent.description}
                </p>
                
                {/* Keywords */}
                {currentContent.keywords && currentContent.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {currentContent.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Navigation Controls - Mobile Optimized */}
                {contentLibrary.length > 1 && (
                  <div className="flex justify-between items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateContent('prev')}
                      className="flex-1 h-9"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      ก่อนหน้า
                    </Button>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground px-2">
                      <span className="font-medium">{currentIndex + 1}</span>
                      <span>/</span>
                      <span>{contentLibrary.length}</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateContent('next')}
                      className="flex-1 h-9"
                    >
                      ถัดไป
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Control - Mobile Optimized */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Diamond className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">ควบคุม AI</h3>
                </div>
                
                {/* Command Input */}
                <div className="flex gap-2 mb-3">
                  <Input
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="พิมพ์คำสั่งของคุณ..."
                    className="flex-1 h-9"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleCommand}
                    disabled={isLoading || !command.trim()}
                    size="sm"
                    className="h-9 px-3"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Send className="h-3 w-3" />
                    )}
                  </Button>
                </div>

                {/* Quick Commands */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
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
                      className="text-xs h-8 justify-start text-muted-foreground hover:text-primary"
                    >
                      {cmd}
                    </Button>
                  ))}
                </div>

                {/* AI Responses */}
                {(aiResponse || suggestion) && (
                  <div className="space-y-2">
                    {aiResponse && (
                      <div className="bg-muted/50 rounded-md p-3">
                        <p className="text-xs font-medium text-foreground mb-1">AI ตอบ:</p>
                        <p className="text-xs text-muted-foreground">{aiResponse}</p>
                      </div>
                    )}
                    {suggestion && (
                      <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                        <p className="text-xs font-medium text-primary mb-1">คำแนะนำ:</p>
                        <p className="text-xs text-primary/80">{suggestion}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Welcome State - Mobile Optimized */
          <div className="text-center py-12">
            <Crown className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              ยินดีต้อนรับสู่ Crown Diamond Station
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              ใช้คำสั่ง AI เพื่อค้นหาและดูวิดีโอการนำเสนอ
            </p>
            
            {/* Quick Start Input */}
            <Card className="max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <div className="flex gap-2 mb-3">
                  <Input
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="เช่น: ขอดูวิดีโอการตลาด"
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleCommand}
                    disabled={isLoading || !command.trim()}
                    size="sm"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="grid gap-2">
                  {[
                    "ขอดูวิดีโอเกี่ยวกับการตลาด",
                    "อยากรู้เรื่องการทำแบรนด์"
                  ].map((cmd) => (
                    <Button
                      key={cmd}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCommand(cmd)}
                      className="text-xs justify-start text-muted-foreground hover:text-primary"
                    >
                      {cmd}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Presentation;