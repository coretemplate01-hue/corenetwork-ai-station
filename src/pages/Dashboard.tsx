import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Diamond, Brain, Video, History, Settings, Presentation, Upload, Sparkles, Loader2 } from "lucide-react";

const Dashboard = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSaveFindTune = async () => {
    if (!prompt.trim()) {
      toast({
        title: "กรุณาใส่ prompt",
        description: "โปรดเขียน prompt ก่อนบันทึก",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "กรุณาเข้าสู่ระบบ",
          description: "โปรดเข้าสู่ระบบก่อนใช้งาน",
          variant: "destructive",
        });
        return;
      }

      // Deactivate existing prompts
      await supabase
        .from('ai_prompts')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Save new prompt
      const { error } = await supabase
        .from('ai_prompts')
        .insert({
          user_id: user.id,
          prompt_text: prompt,
          is_active: true,
        });

      if (error) throw error;

      // Upload and process documents
      for (const file of uploadedFiles) {
        await uploadAndProcessDocument(file, user.id);
      }

      toast({
        title: "บันทึกสำเร็จ",
        description: "Fine-tune AI เรียบร้อยแล้ว",
      });

      setPrompt('');
      setUploadedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error saving fine-tune:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึก Fine-tune ได้",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAndProcessDocument = async (file: File, userId: string) => {
    // Upload file to storage
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Save document metadata
    const { data: docData, error: docError } = await supabase
      .from('knowledge_documents')
      .insert({
        user_id: userId,
        filename: file.name,
        file_path: fileName,
      })
      .select('id')
      .single();

    if (docError) throw docError;

    // Process document (extract text and create embeddings)
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.functions.invoke('process-document', {
      body: { documentId: docData.id },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleTestAI = async () => {
    if (!prompt.trim()) {
      toast({
        title: "กรุณาใส่ prompt ก่อน",
        description: "โปรดเขียน prompt และบันทึกก่อนทดสอบ",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('ai-content-finder', {
        body: { 
          command: 'ทดสอบ AI ที่ได้รับการ fine-tune แล้ว',
          presentationId: null 
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "ทดสอบ AI สำเร็จ",
        description: data.aiResponse || 'AI ตอบสนองแล้ว',
      });
    } catch (error) {
      console.error('Error testing AI:', error);
      toast({
        title: "เกิดข้อผิดพลาดในการทดสอบ",
        description: "ไม่สามารถทดสอบ AI ได้",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Crown className="h-8 w-8 text-primary" />
              <Diamond className="h-4 w-4 text-primary-light absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-crown bg-clip-text text-transparent">
                Crown Diamond Station
              </h1>
              <p className="text-muted-foreground">Dashboard จัดการระบบ AI Presentation Agent</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
              กลับหน้าแรก
            </Button>
          </Link>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Start Presentation */}
          <Card className="bg-gradient-card border-primary/10 shadow-diamond hover:shadow-crown transition-elegant group">
            <CardHeader>
              <Presentation className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-elegant" />
              <CardTitle className="text-foreground">เริ่มการนำเสนอ</CardTitle>
              <CardDescription className="text-muted-foreground">
                เข้าสู่หน้าจอการนำเสนอและใช้งาน AI Agent ทันที
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/presentation">
                <Button className="w-full bg-gradient-crown hover:shadow-crown transition-elegant">
                  เริ่มนำเสนอเลย
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Manage AI Agent */}
          <Card className="bg-gradient-card border-primary/10 shadow-diamond hover:shadow-crown transition-elegant group">
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-elegant" />
              <CardTitle className="text-foreground">จัดการ AI Agent</CardTitle>
              <CardDescription className="text-muted-foreground">
                บริหารคลังเนื้อหา ดูประวัติ และตั้งค่า AI Agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/presentation-manager">
                <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 transition-elegant">
                  เข้าสู่ระบบจัดการ
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Fine-tune AI */}
          <Card className="bg-gradient-card border-primary/10 shadow-diamond hover:shadow-crown transition-elegant group col-span-full">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-elegant" />
              <CardTitle className="text-foreground">Fine-tune AI</CardTitle>
              <CardDescription className="text-muted-foreground">
                ปรับแต่ง AI ด้วย prompt และอัพโหลดเอกสารเพื่อเรียนรู้ข้อมูลธุรกิจ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Custom Prompt</label>
                  <Textarea 
                    placeholder="เขียน prompt เพื่อปรับแต่งพฤติกรรมของ AI เช่น บริบทธุรกิจ, รูปแบบการตอบ, หรือข้อมูลเฉพาะที่ต้องการให้ AI จำ..."
                    className="min-h-[100px] resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">อัพโหลดเอกสาร</label>
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors">
                    <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">ลากไฟล์มาวางหรือคลิกเพื่อเลือก</p>
                    <Input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      id="document-upload" 
                      multiple 
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                    />
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      เลือกไฟล์
                    </Button>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-2 text-sm text-foreground">
                        {uploadedFiles.length} ไฟล์ที่เลือก: {uploadedFiles.map(f => f.name).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  className="bg-gradient-crown hover:shadow-crown transition-elegant"
                  onClick={handleSaveFindTune}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  บันทึก Fine-tune
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary/20 text-primary hover:bg-primary/10"
                  onClick={handleTestAI}
                >
                  ทดสอบ AI
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Library */}
          <Card className="bg-gradient-card border-primary/10 shadow-diamond hover:shadow-crown transition-elegant group">
            <CardHeader>
              <Video className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-elegant" />
              <CardTitle className="text-foreground">คลังเนื้อหา</CardTitle>
              <CardDescription className="text-muted-foreground">
                จัดการวิดีโอและเนื้อหาที่ AI จะใช้ในการนำเสนอ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/presentation-manager">
                <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 transition-elegant">
                  จัดการคลังเนื้อหา
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Presentation History */}
          <Card className="bg-gradient-card border-primary/10 shadow-diamond hover:shadow-crown transition-elegant group">
            <CardHeader>
              <History className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-elegant" />
              <CardTitle className="text-foreground">ประวัติการนำเสนอ</CardTitle>
              <CardDescription className="text-muted-foreground">
                ดูประวัติคำสั่งและการตอบสนองของ AI ที่ผ่านมา
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/presentation-manager">
                <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 transition-elegant">
                  ดูประวัติ
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="bg-gradient-card border-primary/10 shadow-diamond hover:shadow-crown transition-elegant group">
            <CardHeader>
              <Settings className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-elegant" />
              <CardTitle className="text-foreground">ตั้งค่าระบบ</CardTitle>
              <CardDescription className="text-muted-foreground">
                กำหนดค่าการทำงานของ AI Agent และระบบ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 transition-elegant" disabled>
                กำลังพัฒนา
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-card border-primary/10 shadow-diamond col-span-full md:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Crown className="h-5 w-5 text-primary mr-2" />
                สถิติการใช้งาน
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                ข้อมูลการใช้งานระบบ AI Presentation Agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">เนื้อหาในคลัง</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">การนำเสนอ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">คำสั่ง AI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">ผู้เข้าร่วม</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-gradient-card border-primary/10 shadow-diamond">
            <CardHeader>
              <CardTitle className="text-foreground">เริ่มต้นใช้งานอย่างรวดเร็ว</CardTitle>
              <CardDescription className="text-muted-foreground">
                ขั้นตอนการตั้งค่าและใช้งานระบบ AI Presentation Agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">เพิ่มเนื้อหา</h4>
                    <p className="text-sm text-muted-foreground">เพิ่มวิดีโอและคำอธิบายลงในคลังเนื้อหา</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">ทดสอบ AI</h4>
                    <p className="text-sm text-muted-foreground">ลองใช้คำสั่ง AI เพื่อหาเนื้อหาที่ต้องการ</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">เริ่มนำเสนอ</h4>
                    <p className="text-sm text-muted-foreground">ใช้งานจริงกับลูกค้าหรือผู้ร่วมงาน</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;