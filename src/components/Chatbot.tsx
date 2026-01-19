import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: t("chat.startGreeting") }]);
    }
  }, [isOpen, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const parseLeadSummary = (text: string) => {
    const match = text.match(/\[LEAD SUMMARY\]([\s\S]*?)\[END LEAD SUMMARY\]/);
    if (!match) return null;
    
    const content = match[1];
    const getValue = (key: string) => {
      const regex = new RegExp(`${key}:\\s*(.+?)(?:\\n|$)`, "i");
      const m = content.match(regex);
      return m ? m[1].trim() : "";
    };

    return {
      name: getValue("Name") || null,
      business_type: getValue("Business type"),
      business_goal: getValue("Business goal"),
      main_problem: getValue("Main problem"),
      urgency_level: getValue("Urgency"),
      whatsapp_number: getValue("WhatsApp") === "Not provided" ? null : getValue("WhatsApp"),
      language: getValue("Language")?.toLowerCase() === "en" ? "en" : "id",
      summary: getValue("Summary"),
      consent_given: getValue("ConsentGiven")?.toLowerCase() === "true",
    };
  };

  const saveLead = async (lead: ReturnType<typeof parseLeadSummary>) => {
    if (!lead || !lead.consent_given) return;
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ lead }),
      });
      setLeadSaved(true);
    } catch (e) { console.error("Failed to save lead:", e); }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: [...messages, userMsg], language }),
      });

      if (!resp.ok || !resp.body) throw new Error("Stream failed");
      
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {}
        }
      }

      const lead = parseLeadSummary(assistantContent);
      if (lead?.consent_given) await saveLead(lead);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally { setIsLoading(false); }
  };

  const getWhatsAppUrl = () => {
    const lastMsg = messages.filter(m => m.role === "assistant").pop()?.content || "";
    const text = encodeURIComponent(`Halo, saya dari website KOSMARA. ${lastMsg.slice(0, 500)}`);
    return `https://api.whatsapp.com/send/?phone=6285189134621&text=${text}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/50">
      <div className="bg-card w-full max-w-md h-[600px] max-h-[80vh] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-slide-up">
        <div className="bg-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-bold text-primary-foreground">KOSMARA</h3>
              <p className="text-xs text-primary-foreground/70">{isLoading ? t("chat.thinking") : "Online"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/10">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={msg.role === "user" ? "chat-bubble-user max-w-[80%]" : "chat-bubble-assistant max-w-[80%]"}>
                {msg.content.replace(/\[LEAD SUMMARY\][\s\S]*?\[END LEAD SUMMARY\]/g, "").trim()}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start"><div className="chat-bubble-assistant"><Loader2 className="h-4 w-4 animate-spin" /></div></div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {leadSaved && (
          <div className="px-4 pb-2">
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button className="w-full bg-success hover:bg-success/90 text-white gap-2">
                <MessageCircle className="h-4 w-4" />{t("chat.whatsappCta")}
              </Button>
            </a>
          </div>
        )}

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder={t("chat.placeholder")} disabled={isLoading} className="flex-1" />
            <Button onClick={sendMessage} disabled={isLoading || !input.trim()} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
