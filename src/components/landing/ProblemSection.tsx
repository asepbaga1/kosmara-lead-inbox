import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, Clock, UserX } from "lucide-react";

export function ProblemSection() {
  const { t } = useLanguage();

  const problems = [
    {
      icon: UserX,
      titleKey: "problem.item1.title",
      descKey: "problem.item1.desc",
    },
    {
      icon: AlertTriangle,
      titleKey: "problem.item2.title",
      descKey: "problem.item2.desc",
    },
    {
      icon: Clock,
      titleKey: "problem.item3.title",
      descKey: "problem.item3.desc",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("problem.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("problem.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-destructive/30 transition-all duration-300 hover:shadow-elevated"
            >
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <problem.icon className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {t(problem.titleKey)}
              </h3>
              <p className="text-muted-foreground">
                {t(problem.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
