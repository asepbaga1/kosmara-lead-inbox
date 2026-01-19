import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onChatClick: () => void;
}

export function Navbar({ onChatClick }: NavbarProps) {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-lg">K</span>
            </div>
            <span className="font-display font-bold text-xl text-primary-foreground">KOSMARA</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium">
              {t("nav.howItWorks")}
            </a>
            <LanguageSwitcher />
            <Button 
              onClick={onChatClick}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-gold gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              {t("nav.startChat")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-primary-foreground"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/10 animate-slide-up">
            <div className="flex flex-col gap-4">
              <a 
                href="#how-it-works" 
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.howItWorks")}
              </a>
              <Button 
                onClick={() => {
                  onChatClick();
                  setMobileMenuOpen(false);
                }}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-gold gap-2 w-full"
              >
                <MessageCircle className="h-4 w-4" />
                {t("nav.startChat")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
