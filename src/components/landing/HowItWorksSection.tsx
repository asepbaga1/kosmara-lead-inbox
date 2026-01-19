import { useLanguage } from "@/contexts/LanguageContext";
import { MessageSquare, Brain, Save, Send } from "lucide-react";

export function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: MessageSquare,
      titleKey: "how.step1.title",
      descKey: "how.step1.desc",
      number: "01",
    },
    {
      icon: Brain,
      titleKey: "how.step2.title",
      descKey: "how.step2.desc",
      number: "02",
    },
    {
      icon: Save,
      titleKey: "how.step3.title",
      descKey: "how.step3.desc",
      number: "03",
    },
    {
      icon: Send,
      titleKey: "how.step4.title",
      descKey: "how.step4.desc",
      number: "04",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("how.title")}
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative p-6 rounded-2xl bg-card border border-border group hover:border-primary/30 transition-all duration-300 hover:shadow-elevated"
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shadow-md">
                  {step.number}
                </div>
                
                <div className="flex items-start gap-4 pt-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <step.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t(step.descKey)}
                    </p>
                  </div>
                </div>

                {/* Connector line (hidden on last item in each row) */}
                {index < 3 && index !== 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
