import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 bg-navy-dark border-t border-primary-foreground/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-lg">K</span>
            </div>
            <span className="font-display font-bold text-lg text-primary-foreground">KOSMARA</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">
            {t("footer.text")}
          </p>
        </div>
      </div>
    </footer>
  );
}
