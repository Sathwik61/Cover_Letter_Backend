import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, jobRole, companyName, jd } = body;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY, // Never hardcode
    });

    const chatCompletion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `My name: ${name}, Job role: ${jobRole}, Applying company name: ${companyName}, Job description: "${jd}", My skill: ${jobRole}. Give me a cover letter. Don't explain anything. Just give me the cover letter. and dont give blank spaces or spaces to fill something in the cover letter. Just give me the cover letter. Don't give any other information. Just give me the cover letter. and dont give here is your response or something directly the cover letter you give.`,
        },
        {
          role: "user",
          content: "",
        },
      ],
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const coverLetter = chatCompletion.choices?.[0]?.message?.content || "Error generating cover letter";

    return NextResponse.json({ message: "success", coverLetter });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "error", error: error }, { status: 500 });
  }
}
