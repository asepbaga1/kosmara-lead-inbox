import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { MessageCircle, Play, Bot, Zap, Shield } from "lucide-react";

interface HeroSectionProps {
  onChatClick: () => void;
}

export function HeroSection({ onChatClick }: HeroSectionProps) {
  const { language } = useLanguage();

  const content = {
    id: {
      badge: "💬 Dipercaya 2,300+ UMKM Indonesia",
      headline: "Capek Jawab Chat 'Harga Berapa Kak?' Sampai Pegal, Tapi Gak Ada yang Jadi Beli?",
      subheadline: "KOSMARA otomatis saring calon pembeli serius dari yang cuma nanya-nanya. Hemat 5+ jam per hari, fokus closing ke yang beneran mau beli. Rata-rata closing rate naik 3x lipat.",
      ctaPrimary: "🎁 Coba Gratis 14 Hari",
      ctaPrimarySubtext: "Tanpa Kartu Kredit",
      ctaSecondary: "▶️ Lihat Demo 2 Menit",
      trust: [
        { icon: Bot, title: "🤖 AI Indonesia", desc: "Paham bahasa gaul & typo" },
        { icon: Zap, title: "⚡ Response < 3 Detik", desc: "Customer gak nunggu lama" },
        { icon: Shield, title: "🔒 Data 100% Aman", desc: "Tersertifikasi ISO 27001" },
      ]
    },
    en: {
      badge: "💬 Trusted by 2,300+ Indonesian SMEs",
      headline: "Tired of Answering 'How Much?' Chats All Day, But No One Actually Buys?",
      subheadline: "KOSMARA automatically filters serious buyers from tire-kickers. Save 5+ hours daily, focus on closing real buyers. Average closing rate increases 3x.",
      ctaPrimary: "🎁 Try Free for 14 Days",
      ctaPrimarySubtext: "No Credit Card Required",
      ctaSecondary: "▶️ Watch 2-Min Demo",
      trust: [
        { icon: Bot, title: "🤖 Indonesian AI", desc: "Understands slang & typos" },
        { icon: Zap, title: "⚡ Response < 3 Sec", desc: "Customers don't wait" },
        { icon: Shield, title: "🔒 100% Secure Data", desc: "ISO 27001 Certified" },
      ]
    }
  };

  const c = content[language] || content.id;

  return (
    <section className="bg-hero min-h-screen flex items-center pt-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/20 border border-secondary/30 mb-8 animate-fade-in">
            <span className="text-primary-foreground text-sm md:text-base font-semibold">{c.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up leading-tight">
            {c.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            {c.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-col items-center">
              <Button 
                size="lg"
                onClick={onChatClick}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-gold text-lg px-8 py-6 gap-2 font-bold"
              >
                {c.ctaPrimary}
              </Button>
              <span className="text-primary-foreground/60 text-sm mt-2">{c.ctaPrimarySubtext}</span>
            </div>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 gap-2"
            >
              {c.ctaSecondary}
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {c.trust.map((item, index) => (
              <div key={index} className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-secondary mb-1">{item.title}</div>
                <div className="text-sm text-primary-foreground/70">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
