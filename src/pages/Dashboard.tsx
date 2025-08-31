import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Diamond, Brain, Video, History, Settings, Presentation } from "lucide-react";

const Dashboard = () => {
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