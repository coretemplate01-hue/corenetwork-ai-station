import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Diamond, Plus, Edit, Trash2, Video, History, Brain, Presentation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  keywords: string[];
  created_at: string;
}

interface PresentationHistory {
  id: string;
  presentation_id: string;
  command_text: string;
  ai_response: string;
  timestamp: string;
  content_displayed: ContentItem | null;
}

const PresentationManager = () => {
  const [contentLibrary, setContentLibrary] = useState<ContentItem[]>([]);
  const [history, setHistory] = useState<PresentationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    keywords: ""
  });

  useEffect(() => {
    loadContentLibrary();
    loadPresentationHistory();
  }, []);

  const loadContentLibrary = async () => {
    try {
      const { data, error } = await supabase
        .from('content_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContentLibrary(data || []);
    } catch (error) {
      console.error('Error loading content library:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดคลังเนื้อหาได้",
        variant: "destructive",
      });
    }
  };

  const loadPresentationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('presentation_history')
        .select(`
          *,
          content_displayed:content_library(*)
        `)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading presentation history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.video_url) {
      toast({
        title: "ข้อมูลไม่ครบ",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const keywords = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('content_library')
          .update({
            title: formData.title,
            description: formData.description,
            video_url: formData.video_url,
            keywords
          })
          .eq('id', editingItem.id);

        if (error) throw error;

        toast({
          title: "อัปเดตสำเร็จ",
          description: "เนื้อหาถูกอัปเดตเรียบร้อยแล้ว",
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from('content_library')
          .insert({
            title: formData.title,
            description: formData.description,
            video_url: formData.video_url,
            keywords
          });

        if (error) throw error;

        toast({
          title: "เพิ่มสำเร็จ",
          description: "เนื้อหาใหม่ถูกเพิ่มเข้าคลังแล้ว",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      loadContentLibrary();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกเนื้อหาได้",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      video_url: item.video_url,
      keywords: item.keywords?.join(', ') || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบเนื้อหานี้?')) return;

    try {
      const { error } = await supabase
        .from('content_library')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "ลบสำเร็จ",
        description: "เนื้อหาถูกลบออกจากคลังแล้ว",
      });
      loadContentLibrary();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบเนื้อหาได้",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", video_url: "", keywords: "" });
    setEditingItem(null);
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
                จัดการ AI Agent
              </h1>
              <p className="text-muted-foreground">บริหารจัดการคลังเนื้อหาและติดตามประวัติการนำเสนอ</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link to="/presentation">
              <Button className="bg-gradient-crown hover:shadow-crown">
                <Presentation className="mr-2 h-4 w-4" />
                เริ่มการนำเสนอ
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                กลับหน้าแรก
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Content Library Management */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card border-primary/10 shadow-diamond">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-primary" />
                    <CardTitle>คลังเนื้อหา</CardTitle>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        className="bg-gradient-crown hover:shadow-crown"
                        onClick={() => resetForm()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        เพิ่มเนื้อหา
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          {editingItem ? 'แก้ไขเนื้อหา' : 'เพิ่มเนื้อหาใหม่'}
                        </DialogTitle>
                        <DialogDescription>
                          กรอกข้อมูลเนื้อหาที่ต้องการเพิ่มเข้าคลัง
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">หัวข้อ</label>
                          <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="เช่น: แผนการตลาดดิจิทัล"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">คำอธิบาย</label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="อธิบายเนื้อหาของวิดีโอ..."
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">URL วิดีโอ</label>
                          <Input
                            type="url"
                            value={formData.video_url}
                            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                            placeholder="https://example.com/video"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">คำสำคัญ (คั่นด้วยจุลภาค)</label>
                          <Input
                            value={formData.keywords}
                            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                            placeholder="การตลาด, ดิจิทัล, โซเชียล"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            ยกเลิก
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "กำลังบันทึก..." : editingItem ? "อัปเดต" : "เพิ่ม"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>
                  จัดการวิดีโอและเนื้อหาที่ AI Agent จะใช้ในการนำเสนอ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentLibrary.map((item) => (
                    <Card key={item.id} className="border-primary/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                            {item.keywords && item.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {item.keywords.map((keyword, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {item.video_url}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {contentLibrary.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>ยังไม่มีเนื้อหาในคลัง</p>
                      <p className="text-sm">เพิ่มเนื้อหาแรกของคุณเพื่อเริ่มต้นใช้งาน</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Presentation History */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-primary/10 shadow-diamond">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-primary" />
                  <CardTitle>ประวัติการนำเสนอ</CardTitle>
                </div>
                <CardDescription>
                  คำสั่งและการตอบสนองของ AI ล่าสุด
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {history.map((item) => (
                    <Card key={item.id} className="border-primary/10">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-primary">คำสั่ง:</span>
                            <p className="text-sm text-foreground">{item.command_text}</p>
                          </div>
                          {item.ai_response && (
                            <div>
                              <span className="text-xs font-medium text-primary">AI ตอบ:</span>
                              <p className="text-sm text-muted-foreground">{item.ai_response}</p>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleString('th-TH')}
                            </span>
                            {item.content_displayed && (
                              <Badge variant="outline" className="text-xs">
                                <Brain className="h-3 w-3 mr-1" />
                                แสดงเนื้อหา
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {history.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">ยังไม่มีประวัติการนำเสนอ</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationManager;