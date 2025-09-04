import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Settings, Zap, Crown, Presentation, Diamond } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Crown className="h-8 w-8 text-primary" />
              <Diamond className="h-4 w-4 text-primary-light absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold bg-gradient-crown bg-clip-text text-transparent">Crown Diamond Station</span>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 transition-elegant">
              <Settings className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              <Crown className="h-16 w-16 text-primary drop-shadow-lg" />
              <Diamond className="h-8 w-8 text-primary-glow absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-crown bg-clip-text text-transparent">
              Crown Diamond Station
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-primary mb-8 font-medium">
            ขอต้อนรับสู่ธุรกิจ WCI-CoreNetwork
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            ระบบนำเสนอขั้นสูงด้วยปัญญาประดิษฐ์ที่ช่วยให้การสื่อสารธุรกิจของคุณมีประสิทธิภาพสูงสุด 
            พร้อมเทคโนโลยีที่ทันสมัยและใช้งานง่าย
          </p>
          <Link to="/presentation">
            <Button size="lg" className="bg-gradient-crown hover:shadow-crown text-primary-foreground px-8 py-4 text-lg transition-elegant shadow-diamond">
              <Presentation className="mr-3 h-6 w-6" />
              AI Sponsor
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gradient-card border-primary/10 shadow-diamond hover:shadow-crown transition-elegant group">
            <CardHeader>
              <Monitor className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-elegant" />
              <CardTitle className="text-foreground">หน้าจอการนำเสนอ</CardTitle>
              <CardDescription className="text-muted-foreground">
                หน้าจอแสดงผลที่สะอาดตา ไม่มีเมนูหรือ Footer เพื่อให้ผู้ชมจดจ่อกับเนื้อหา
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/presentation">
                <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 transition-elegant">
                  ดูหน้าการนำเสนอ
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-primary/10 shadow-diamond hover:shadow-crown transition-elegant group">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-elegant" />
              <CardTitle className="text-foreground">ระบบควบคุม AI</CardTitle>
              <CardDescription className="text-muted-foreground">
                ส่วนควบคุมสำหรับคุณเพื่อพิมพ์คำสั่งให้ AI Agent และจัดการการนำเสนอ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/presentation-manager">
                <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 transition-elegant">
                  จัดการ AI Agent
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-primary/10 shadow-diamond hover:shadow-crown transition-elegant group">
            <CardHeader>
              <Settings className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-elegant" />
              <CardTitle className="text-foreground">Dashboard จัดการ</CardTitle>
              <CardDescription className="text-muted-foreground">
                บริหารจัดการ AI Agent และดูประวัติการนำเสนอที่ผ่านมา
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 transition-elegant">
                  เข้าสู่ Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-muted-foreground">
        <p>© 2024 Crown Diamond Station - WCI-CoreNetwork. ระบบนำเสนอขั้นสูงด้วยเทคโนโลยี AI</p>
      </footer>
    </div>
  );
};

export default Index;