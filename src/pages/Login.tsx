import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Settings, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Developer mode
  const [devMode, setDevMode] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [devLoading, setDevLoading] = useState(false);
  const [devStatus, setDevStatus] = useState<{
    checking: boolean;
    adminExists?: boolean;
    hasAdminRole?: boolean;
    message?: string;
    error?: string;
  }>({ checking: false });

  // Listen for secret key combo: Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDevMode(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const { error } = await signIn(email, password);
    if (error) {
      setError(t("auth.error"));
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const checkAdminStatus = async () => {
    setDevStatus({ checking: true });
    try {
      const { data, error } = await supabase.functions.invoke('check-admin');
      
      if (error) {
        setDevStatus({ checking: false, error: error.message });
        return;
      }
      
      setDevStatus({
        checking: false,
        adminExists: data.exists,
        hasAdminRole: data.hasAdminRole,
        message: data.exists 
          ? `Admin exists (ID: ${data.userId?.slice(0, 8)}...), Role: ${data.hasAdminRole ? 'admin' : 'none'}`
          : 'Admin user does not exist'
      });
    } catch (err) {
      setDevStatus({ checking: false, error: String(err) });
    }
  };

  const createAdminUser = async () => {
    setDevLoading(true);
    setDevStatus({ checking: false });
    try {
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: { email: 'admin@kosmara.com', password: 'NewAdmin123!' }
      });
      
      if (error) {
        setDevStatus({ checking: false, error: error.message });
      } else if (data.error) {
        setDevStatus({ checking: false, error: data.error });
      } else {
        setDevStatus({ 
          checking: false, 
          adminExists: true,
          hasAdminRole: true,
          message: 'Admin user created successfully! Email: admin@kosmara.com, Password: NewAdmin123!'
        });
      }
    } catch (err) {
      setDevStatus({ checking: false, error: String(err) });
    }
    setDevLoading(false);
  };

  const resetAdminPassword = async () => {
    setDevLoading(true);
    setDevStatus({ checking: false });
    try {
      const { data, error } = await supabase.functions.invoke('reset-admin-password', {
        body: { newPassword: 'NewAdmin123!' }
      });
      
      if (error) {
        setDevStatus({ checking: false, error: error.message });
      } else if (data.error) {
        setDevStatus({ checking: false, error: data.error });
      } else {
        setDevStatus({ 
          checking: false, 
          message: 'Password reset successfully! New password: NewAdmin123!'
        });
      }
    } catch (err) {
      setDevStatus({ checking: false, error: String(err) });
    }
    setDevLoading(false);
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-2xl">K</span>
            </div>
          </div>
          <CardTitle className="font-display text-2xl">{t("auth.login")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("auth.loginButton")}
            </Button>
          </form>

          {/* Developer Mode Panel - Hidden by default, toggle with Ctrl+Shift+D */}
          {devMode && (
            <div className="mt-6 p-4 border border-dashed border-muted-foreground/50 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Developer Tools</span>
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={checkAdminStatus}
                  disabled={devStatus.checking || devLoading}
                >
                  {devStatus.checking ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-3 w-3" />
                  )}
                  Check Admin Status
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={createAdminUser}
                  disabled={devLoading}
                >
                  {devLoading ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <Settings className="mr-2 h-3 w-3" />
                  )}
                  Create Admin User
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={resetAdminPassword}
                  disabled={devLoading}
                >
                  {devLoading ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-3 w-3" />
                  )}
                  Reset Admin Password
                </Button>
              </div>
              
              {/* Status Display */}
              {(devStatus.message || devStatus.error) && (
                <div className={`mt-3 p-2 rounded text-xs ${devStatus.error ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                  {devStatus.error ? (
                    <div className="flex items-start gap-2">
                      <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{devStatus.error}</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{devStatus.message}</span>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-[10px] text-muted-foreground mt-2">
                Press Ctrl+Shift+D to hide this panel
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
