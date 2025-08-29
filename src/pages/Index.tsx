import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Settings, Zap, Brain, Presentation } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-presentation-fg">AI Presentation Agent</span>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="text-presentation-fg border-presentation-border hover:bg-presentation-card">
              <Settings className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-presentation-fg mb-6">
            AI-Powered <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Presentation Agent
            </span>
          </h1>
          <p className="text-xl text-presentation-fg/80 mb-8 max-w-2xl mx-auto">
            ช่วยนำเสนอและขยายธุรกิจได้อย่างมีประสิทธิภาพด้วยปัญญาประดิษฐ์ที่ทันสมัย
          </p>
          <Link to="/presentation">
            <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-presentation transition-smooth">
              <Presentation className="mr-2 h-5 w-5" />
              เริ่มการนำเสนอ
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-presentation-card border-presentation-border shadow-elevated">
            <CardHeader>
              <Monitor className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-presentation-fg">หน้าจอการนำเสนอ</CardTitle>
              <CardDescription className="text-presentation-fg/70">
                หน้าจอแสดงผลที่สะอาดตา ไม่มีเมนูหรือ Footer เพื่อให้ผู้ชมจดจ่อกับเนื้อหา
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/presentation">
                <Button variant="outline" className="w-full text-presentation-fg border-presentation-border hover:bg-presentation-bg/50">
                  ดูหน้าการนำเสนอ
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-presentation-card border-presentation-border shadow-elevated">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-presentation-fg">ระบบควบคุม AI</CardTitle>
              <CardDescription className="text-presentation-fg/70">
                ส่วนควบคุมสำหรับคุณเพื่อพิมพ์คำสั่งให้ AI Agent และจัดการการนำเสนอ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/presentation-manager">
                <Button variant="outline" className="w-full text-presentation-fg border-presentation-border hover:bg-presentation-bg/50">
                  จัดการ AI Agent
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-presentation-card border-presentation-border shadow-elevated">
            <CardHeader>
              <Settings className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-presentation-fg">Dashboard จัดการ</CardTitle>
              <CardDescription className="text-presentation-fg/70">
                บริหารจัดการ AI Agent และดูประวัติการนำเสนอที่ผ่านมา
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full text-presentation-fg border-presentation-border hover:bg-presentation-bg/50">
                  เข้าสู่ Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-presentation-fg/60">
        <p>© 2024 AI Presentation Agent. Built with ❤️ for effective business presentations.</p>
      </footer>
    </div>
  );
};

export default Index;