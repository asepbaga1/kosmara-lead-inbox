import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "id" ? "en" : "id")}
      className="gap-2 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{language === "id" ? "EN" : "ID"}</span>
    </Button>
  );
}
