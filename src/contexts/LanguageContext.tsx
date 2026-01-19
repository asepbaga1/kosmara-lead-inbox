import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.home": { id: "Beranda", en: "Home" },
  "nav.howItWorks": { id: "Cara Kerja", en: "How It Works" },
  "nav.startChat": { id: "Mulai Chat", en: "Start Chat" },
  
  // Hero
  "hero.title": { id: "Saring Lead Anda dengan AI", en: "Filter Your Leads with AI" },
  "hero.subtitle": { id: "Jangan biarkan calon klien serius hilang dalam keramaian chat. KOSMARA menyaring percakapan, menyimpan lead berkualitas, dan memudahkan follow-up.", en: "Don't let serious prospects get lost in chat noise. KOSMARA filters conversations, stores quality leads, and makes follow-up easy." },
  "hero.cta": { id: "Mulai Chat Sekarang", en: "Start Chatting Now" },
  "hero.ctaSecondary": { id: "Lihat Cara Kerja", en: "See How It Works" },

  // Problem
  "problem.title": { id: "Masalah yang Anda Hadapi", en: "The Problem You're Facing" },
  "problem.subtitle": { id: "Chat datang. Ada yang serius. Ada yang tidak. Tanpa penyaringan, lead berharga hilang selamanya.", en: "Chats come in. Some are serious. Some are not. Without filtering, valuable leads disappear forever." },
  "problem.item1.title": { id: "Lead Hilang", en: "Lost Leads" },
  "problem.item1.desc": { id: "Chat WhatsApp menumpuk, lead potensial tenggelam dalam keramaian pesan.", en: "WhatsApp chats pile up, potential leads drown in message noise." },
  "problem.item2.title": { id: "Follow-up Berantakan", en: "Messy Follow-ups" },
  "problem.item2.desc": { id: "Tidak ada sistem untuk melacak siapa yang harus dihubungi dan kapan.", en: "No system to track who needs to be contacted and when." },
  "problem.item3.title": { id: "Waktu Terbuang", en: "Wasted Time" },
  "problem.item3.desc": { id: "Menghabiskan jam untuk menjawab pertanyaan dari orang yang tidak serius.", en: "Spending hours answering questions from people who aren't serious." },

  // Insight
  "insight.title": { id: "Insight Penting", en: "Key Insight" },
  "insight.text": { id: "Bisnis yang sukses tidak hanya mendapatkan banyak lead—mereka tahu mana lead yang layak dikejar.", en: "Successful businesses don't just get many leads—they know which leads are worth pursuing." },

  // Solution
  "solution.title": { id: "Solusi KOSMARA", en: "The KOSMARA Solution" },
  "solution.subtitle": { id: "AI yang menyaring, menyimpan, dan merapikan lead Anda", en: "AI that filters, stores, and organizes your leads" },
  "solution.feature1.title": { id: "Penyaringan Cerdas", en: "Smart Filtering" },
  "solution.feature1.desc": { id: "AI mengajukan pertanyaan terstruktur untuk mengidentifikasi lead serius.", en: "AI asks structured questions to identify serious leads." },
  "solution.feature2.title": { id: "Penyimpanan Aman", en: "Secure Storage" },
  "solution.feature2.desc": { id: "Lead berkualitas disimpan dengan persetujuan, siap untuk follow-up.", en: "Quality leads stored with consent, ready for follow-up." },
  "solution.feature3.title": { id: "Dashboard Rapi", en: "Clean Dashboard" },
  "solution.feature3.desc": { id: "Lihat semua lead dalam satu tempat, update status, export kapan saja.", en: "See all leads in one place, update status, export anytime." },

  // How It Works
  "how.title": { id: "Cara Kerja", en: "How It Works" },
  "how.step1.title": { id: "Pengunjung Memulai Chat", en: "Visitor Starts Chat" },
  "how.step1.desc": { id: "Calon klien mengklik tombol chat di website Anda.", en: "Prospect clicks the chat button on your website." },
  "how.step2.title": { id: "AI Mengajukan Pertanyaan", en: "AI Asks Questions" },
  "how.step2.desc": { id: "Pertanyaan terstruktur untuk memahami kebutuhan dan urgensi.", en: "Structured questions to understand needs and urgency." },
  "how.step3.title": { id: "Lead Disimpan", en: "Lead is Saved" },
  "how.step3.desc": { id: "Dengan persetujuan, ringkasan lead disimpan di database.", en: "With consent, lead summary is saved to database." },
  "how.step4.title": { id: "Follow-up via WhatsApp", en: "Follow-up via WhatsApp" },
  "how.step4.desc": { id: "Pesan ringkasan dikirim ke WhatsApp untuk tindak lanjut.", en: "Summary message sent to WhatsApp for action." },

  // Trust
  "trust.title": { id: "Kenapa KOSMARA?", en: "Why KOSMARA?" },
  "trust.item1": { id: "Dibuat untuk bisnis Indonesia", en: "Built for Indonesian businesses" },
  "trust.item2": { id: "Data Anda aman dan terenkripsi", en: "Your data is safe and encrypted" },
  "trust.item3": { id: "Tidak perlu setup rumit", en: "No complicated setup needed" },

  // Chat
  "chat.title": { id: "Chat dengan KOSMARA", en: "Chat with KOSMARA" },
  "chat.placeholder": { id: "Ketik pesan Anda...", en: "Type your message..." },
  "chat.send": { id: "Kirim", en: "Send" },
  "chat.startGreeting": { id: "Halo! Saya KOSMARA. Saya akan membantu memahami kebutuhan bisnis Anda. Apa tujuan utama bisnis Anda saat ini?", en: "Hello! I'm KOSMARA. I'll help understand your business needs. What is your main business goal right now?" },
  "chat.whatsappCta": { id: "Lanjut ke WhatsApp", en: "Continue to WhatsApp" },
  "chat.thinking": { id: "Sedang mengetik...", en: "Typing..." },

  // Dashboard
  "dashboard.title": { id: "Dashboard Lead", en: "Lead Dashboard" },
  "dashboard.export": { id: "Export CSV", en: "Export CSV" },
  "dashboard.filter": { id: "Filter Status", en: "Filter Status" },
  "dashboard.noLeads": { id: "Belum ada lead", en: "No leads yet" },
  "dashboard.status.new": { id: "Baru", en: "New" },
  "dashboard.status.in_progress": { id: "Sedang Diproses", en: "In Progress" },
  "dashboard.status.closed_won": { id: "Closed Won", en: "Closed Won" },
  "dashboard.status.closed_lost": { id: "Closed Lost", en: "Closed Lost" },
  "dashboard.status.all": { id: "Semua", en: "All" },
  "dashboard.logout": { id: "Keluar", en: "Logout" },

  // Auth
  "auth.login": { id: "Masuk", en: "Login" },
  "auth.email": { id: "Email", en: "Email" },
  "auth.password": { id: "Password", en: "Password" },
  "auth.loginButton": { id: "Masuk", en: "Login" },
  "auth.error": { id: "Email atau password salah", en: "Invalid email or password" },
  
  // Footer
  "footer.text": { id: "© 2024 KOSMARA. Semua hak dilindungi.", en: "© 2024 KOSMARA. All rights reserved." },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("id");

  useEffect(() => {
    const saved = localStorage.getItem("kosmara-language") as Language;
    if (saved && (saved === "id" || saved === "en")) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("kosmara-language", lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
