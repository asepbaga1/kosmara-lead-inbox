import { useLanguage } from "@/contexts/LanguageContext";
import { Lightbulb } from "lucide-react";

export function InsightSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/20 mb-6">
            <Lightbulb className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t("insight.title")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("insight.text")}
          </p>
        </div>
      </div>
    </section>
  );
}
