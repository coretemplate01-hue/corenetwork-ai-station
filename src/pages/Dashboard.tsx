import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Monitor, 
  Settings, 
  BarChart3, 
  Users, 
  Video, 
  Brain,
  ArrowLeft,
  Calendar,
  Clock
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">AI Presentation Dashboard</h1>
              </div>
            </div>
            <Link to="/presentation">
              <Button className="bg-primary hover:bg-primary-hover">
                <Monitor className="mr-2 h-4 w-4" />
                Start Presentation
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Presentations</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Responses</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Library</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Training videos ready</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">Presentation effectiveness</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-elevated hover:shadow-presentation transition-smooth cursor-pointer">
            <CardHeader>
              <Monitor className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Presentation Manager</CardTitle>
              <CardDescription>
                จัดการ AI Agent และดูประวัติการนำเสนอที่ผ่านมา
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard/presentation-manager">
                <Button className="w-full bg-primary hover:bg-primary-hover">
                  Open Manager
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-elevated hover:shadow-presentation transition-smooth cursor-pointer">
            <CardHeader>
              <Video className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Content Library</CardTitle>
              <CardDescription>
                จัดการวิดีโอ Training และเนื้อหาสำหรับการนำเสนอ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-elevated hover:shadow-presentation transition-smooth cursor-pointer">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                วิเคราะห์ประสิทธิภาพการนำเสนอและการตอบสนองของผู้ชม
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-accent/50">
                <Monitor className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Business Expansion Presentation</p>
                  <p className="text-sm text-muted-foreground">2 hours ago • 45 minutes duration</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-accent/50">
                <Brain className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">AI Training Data Updated</p>
                  <p className="text-sm text-muted-foreground">1 day ago • 7 videos processed</p>
                </div>
                <Button variant="outline" size="sm">Review</Button>
              </div>
              
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-accent/50">
                <Users className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Client Meeting Preparation</p>
                  <p className="text-sm text-muted-foreground">3 days ago • Content generated</p>
                </div>
                <Button variant="outline" size="sm">Open</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;