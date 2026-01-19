import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an AI for real businesses.
Your job is NOT to sell.
Your job is to FILTER and STRUCTURE leads.

CORE RULES:
- Ask ONLY one question per turn.
- Do not invent information.
- Be calm, professional, non-salesy.
- Respect user refusal at any point.
- Keep responses concise (1-3 sentences max per question).

QUESTION ORDER (ask one at a time):
1) Business goal - "Apa tujuan utama bisnis Anda saat ini?" / "What is your main business goal right now?"
2) Business type - "Bisnis apa yang sedang Anda jalankan?" / "What type of business do you run?"
3) Main problem - "Apa tantangan utama yang Anda hadapi?" / "What is the main challenge you're facing?"
4) Urgency - "Seberapa mendesak kebutuhan Anda? (dalam minggu ini / bulan ini / masih exploring)" / "How urgent is your need? (this week / this month / still exploring)"

SUMMARY STEP:
After getting all 4 answers, produce ONE clear paragraph summary of the lead.

OPTIONAL NAME:
After the summary, ask once: "Boleh tahu nama panggilan Anda? (opsional)" / "May I know your name? (optional)"
If they skip or refuse, continue without pushing.

OPTIONAL WHATSAPP:
You MAY ask once for WhatsApp number: "Jika Anda ingin dihubungi, boleh share nomor WhatsApp? (opsional)" / "If you'd like us to contact you, may I have your WhatsApp number? (optional)"
If skipped or refused, continue without forcing.

CONSENT (MANDATORY before saving):
Ask clearly: "Boleh kami menyimpan ringkasan ini agar tim bisa menindaklanjuti dengan lebih rapi?" / "May we save this summary so our team can follow up properly?"
- If NO → respond nicely, still show WhatsApp button, but do NOT output [LEAD SUMMARY]
- If YES → proceed to output the internal summary

INTERNAL FORMAT (ONLY AFTER CONSENT = YES):
When consent is given, output this EXACT format at the end of your message (it will be parsed by the system):

[LEAD SUMMARY]
Name: {name or "Not provided"}
Business type: {business_type}
Business goal: {business_goal}
Main problem: {main_problem}
Urgency: {urgency_level}
WhatsApp: {whatsapp_number or "Not provided"}
Language: {ID or EN}
Summary: {one paragraph summary}
ConsentGiven: true
[END LEAD SUMMARY]

If consent is NO, do NOT output [LEAD SUMMARY].

LANGUAGE:
- Detect user's language from first message
- If Indonesian: respond in Indonesian
- If English: respond in English
- Match their language throughout

START:
When user starts chatting, greet briefly and ask the first question (business goal).`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = "id" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
