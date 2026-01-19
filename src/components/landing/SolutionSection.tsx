import { useLanguage } from "@/contexts/LanguageContext";
import { Filter, Database, LayoutDashboard, CheckCircle2 } from "lucide-react";

export function SolutionSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Filter,
      titleKey: "solution.feature1.title",
      descKey: "solution.feature1.desc",
      color: "bg-teal/10 text-teal",
    },
    {
      icon: Database,
      titleKey: "solution.feature2.title",
      descKey: "solution.feature2.desc",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: LayoutDashboard,
      titleKey: "solution.feature3.title",
      descKey: "solution.feature3.desc",
      color: "bg-primary/10 text-primary",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("solution.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("solution.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-elevated text-center"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-6`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {t(feature.titleKey)}
              </h3>
              <p className="text-muted-foreground">
                {t(feature.descKey)}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                <span>Included</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
