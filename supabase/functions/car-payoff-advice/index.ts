import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const {
      question,
      currentDebt,
      baseDebtToday,
      apr,
      monthlyPayment,
      totalSaved,
      paidWeeklyExtra,
      pendingWeeklyExtra,
      monthlyPaid,
      totalAppliedPayments,
      projectedDebt,
      monthsUntilPayoff,
    } = await req.json();
    const gatewayApiKey = Deno.env.get("AI_GATEWAY_API_KEY");
    const gatewayUrl = Deno.env.get("AI_GATEWAY_URL");
    if (!gatewayApiKey) throw new Error("AI_GATEWAY_API_KEY is not configured");
    if (!gatewayUrl) throw new Error("AI_GATEWAY_URL is not configured");

    const userQuestion = typeof question === "string" && question.trim().length > 0
      ? question.trim()
      : "Me conviene abonar ahora o esperar a diciembre?";

    const prompt = `You are a personal finance advisor. Answer the user's specific car payoff question in Spanish.

Car Loan Details:
- Current debt after applied payments: $${Number(currentDebt).toFixed(2)}
- Base debt today before applied payments: $${Number(baseDebtToday ?? currentDebt).toFixed(2)}
- APR: ${apr}%
- Monthly payment: $${monthlyPayment}
- Monthly payment marked paid: ${monthlyPaid ? "yes" : "no"}
- Total applied payments: $${Number(totalAppliedPayments ?? 0).toFixed(2)}
- Weekly extra already paid this month: $${Number(paidWeeklyExtra ?? 0).toFixed(2)}
- Weekly extra still pending this month: $${Number(pendingWeeklyExtra ?? 0).toFixed(2)}
- Cash available for extra car payoff: $${Number(totalSaved ?? 0).toFixed(2)}
- Projected debt if pending weekly extra is paid: $${Number(projectedDebt ?? currentDebt).toFixed(2)}
- Months until planned payoff (December 2026): ~${monthsUntilPayoff}

User question:
${userQuestion}

Consider:
- Interest savings from paying early vs keeping cash liquid
- Emergency fund implications
- Give a clear practical answer with numbers when useful
- If the user asks for a calculation, show the calculation briefly

Keep response under 220 words. Be direct and practical.`;

    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${gatewayApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a bilingual personal finance advisor. Always respond in Spanish." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const advice = data.choices?.[0]?.message?.content || "No recommendation available.";

    return new Response(JSON.stringify({ advice }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("car-payoff-advice error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
