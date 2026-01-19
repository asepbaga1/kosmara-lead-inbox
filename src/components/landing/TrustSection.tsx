import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Zap, Globe } from "lucide-react";

export function TrustSection() {
  const { t } = useLanguage();

  const trustItems = [
    { icon: Globe, textKey: "trust.item1" },
    { icon: Shield, textKey: "trust.item2" },
    { icon: Zap, textKey: "trust.item3" },
  ];

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground text-center mb-10">
          {t("trust.title")}
        </h2>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-primary-foreground/90 font-medium">
                {t(item.textKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
