import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Diamond, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardLoginProps {
  onLogin: () => void;
}

const DashboardLogin = ({ onLogin }: DashboardLoginProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (code === "dharanapassr") {
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: "ยินดีต้อนรับสู่ Dashboard",
      });
      onLogin();
    } else {
      toast({
        title: "รหัสผิด",
        description: "กรุณากรอกรหัสที่ถูกต้อง",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Card className="bg-gradient-card border-primary/10 shadow-diamond">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <Crown className="h-10 w-10 text-primary" />
                <Diamond className="h-5 w-5 text-primary-light absolute -top-1 -right-1" />
              </div>
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl bg-gradient-crown bg-clip-text text-transparent">
              เข้าสู่ Dashboard
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              กรุณากรอกรหัสเพื่อเข้าถึงระบบจัดการ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-foreground">รหัสเข้าใช้งาน</Label>
                <Input
                  id="code"
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="กรอกรหัสที่ได้รับ"
                  className="bg-background/50 border-primary/20 focus:border-primary"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-crown hover:shadow-crown transition-elegant"
                disabled={isLoading}
              >
                {isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardLogin;