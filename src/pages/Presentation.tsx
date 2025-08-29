import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Mic, MicOff, Settings, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [aiCommand, setAiCommand] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [presentationContent, setPresentationContent] = useState("");
  const { toast } = useToast();

  const handleNextSlide = () => {
    setCurrentSlide(prev => prev + 1);
    toast({
      title: "Next Slide",
      description: `Moved to slide ${currentSlide + 1}`,
    });
  };

  const handlePrevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => prev - 1);
      toast({
        title: "Previous Slide",
        description: `Moved to slide ${currentSlide - 1}`,
      });
    }
  };

  const handleAiCommand = () => {
    if (!aiCommand.trim()) return;
    
    // Simulate AI response
    setPresentationContent(`AI Response to: "${aiCommand}"\n\nThis is where the AI agent would respond with relevant content, summaries, or display videos from your content library.`);
    
    toast({
      title: "AI Command Processed",
      description: "AI Agent is processing your request...",
    });
    
    setAiCommand("");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Voice recording has been stopped" : "Voice recording is now active",
    });
  };

  return (
    <div className="min-h-screen bg-presentation-bg text-presentation-fg">
      {/* Minimal Control Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-presentation-card/95 backdrop-blur-sm border-b border-presentation-border">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-presentation-fg hover:bg-presentation-bg/50">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <span className="text-sm font-medium">Slide {currentSlide}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevSlide}
              disabled={currentSlide === 1}
              className="text-presentation-fg hover:bg-presentation-bg/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextSlide}
              className="text-presentation-fg hover:bg-presentation-bg/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-presentation-border mx-2" />
            <Link to="/dashboard/presentation-manager">
              <Button variant="ghost" size="sm" className="text-presentation-fg hover:bg-presentation-bg/50">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Presentation Area */}
      <div className="pt-16 p-8 grid grid-cols-12 gap-6 h-screen">
        {/* Content Display Area */}
        <div className="col-span-8">
          <Card className="h-full bg-presentation-card border-presentation-border shadow-presentation">
            <CardContent className="p-8 h-full flex items-center justify-center">
              {presentationContent ? (
                <div className="text-center space-y-6 max-w-4xl">
                  <div className="whitespace-pre-wrap text-lg leading-relaxed text-presentation-fg">
                    {presentationContent}
                  </div>
                  <div className="aspect-video bg-presentation-bg/50 rounded-lg flex items-center justify-center border-2 border-dashed border-presentation-border">
                    <p className="text-presentation-fg/60">Video Content Area</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-bold text-presentation-fg mb-4">
                    AI Presentation Agent
                  </h2>
                  <p className="text-xl text-presentation-fg/70 max-w-2xl">
                    ใช้คำสั่งด้านขวาเพื่อให้ AI Agent ช่วยนำเสนอเนื้อหา แสดงวิดีโอ หรือสรุปข้อมูล
                  </p>
                  <div className="aspect-video bg-presentation-bg/30 rounded-lg flex items-center justify-center border-2 border-dashed border-presentation-border">
                    <p className="text-presentation-fg/40">Ready for AI content</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Control Panel */}
        <div className="col-span-4 space-y-6">
          <Card className="bg-presentation-card border-presentation-border shadow-elevated">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-presentation-fg mb-4">AI Command Center</h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="พิมพ์คำสั่งให้ AI Agent..."
                    value={aiCommand}
                    onChange={(e) => setAiCommand(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAiCommand()}
                    className="bg-presentation-bg border-presentation-border text-presentation-fg placeholder:text-presentation-fg/50"
                  />
                  <Button
                    onClick={toggleRecording}
                    variant={isRecording ? "destructive" : "outline"}
                    size="icon"
                    className={isRecording ? "" : "border-presentation-border text-presentation-fg hover:bg-presentation-bg/50"}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                <Button 
                  onClick={handleAiCommand}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                  disabled={!aiCommand.trim()}
                >
                  Send Command
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-presentation-card border-presentation-border shadow-elevated">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-presentation-fg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-presentation-border text-presentation-fg hover:bg-presentation-bg/50"
                  onClick={() => setAiCommand("แสดงวิดีโอ training เรื่อง business expansion")}
                >
                  📹 แสดงวิดีโอ Training
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-presentation-border text-presentation-fg hover:bg-presentation-bg/50"
                  onClick={() => setAiCommand("สรุปเนื้อหาสำหรับลูกค้า")}
                >
                  📄 สรุปเนื้อหา
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-presentation-border text-presentation-fg hover:bg-presentation-bg/50"
                  onClick={() => setAiCommand("แสดงข้อมูลเปรียบเทียบ")}
                >
                  📊 แสดงข้อมูล
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-presentation-card border-presentation-border shadow-elevated">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-presentation-fg mb-4">Presentation Status</h3>
              <div className="space-y-2 text-sm text-presentation-fg/70">
                <div className="flex justify-between">
                  <span>Current Slide:</span>
                  <span className="text-primary">{currentSlide}</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Status:</span>
                  <span className="text-green-400">●</span>
                </div>
                <div className="flex justify-between">
                  <span>Recording:</span>
                  <span className={isRecording ? "text-red-400" : "text-presentation-fg/40"}>
                    {isRecording ? "● REC" : "○ OFF"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Presentation;