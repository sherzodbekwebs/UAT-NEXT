import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // SDK ishlatmasdan to'g'ridan-to'g'ri Google API'ga fetch qilamiz
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: data.error.code });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ answer: aiResponse });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}