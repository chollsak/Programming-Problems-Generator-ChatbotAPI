import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your `.env.local` contains this key
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { language, difficulty, topics, isAnotherProblem } = body;

  if (!topics || topics.length === 0) {
    return NextResponse.json({ error: 'Please select at least one topic.' }, { status: 400 });
  }

  // Create a string of selected topics to include in the prompt
  const topicsString = topics.join(', ');

  let prompt = '';

  if (language === 'th') {
    prompt = `ขอโจทย์ Programming ระดับมหาลัย ระดับ ${difficulty} ที่เกี่ยวข้องกับหัวข้อ ${topicsString} อธิบายคำอธิบายของปัญหา ตัวอย่างTestcase 3 ชุด ผลลัพธ์ตัวอย่าง 3 ชุด ชื่อโจทย์ และตัวอย่างโค้ดโปรแกรม`;

    if (isAnotherProblem) {
      prompt = `ขอโจทย์ใหม่เพิ่มเติม ระดับมหาลัย ระดับ ${difficulty} ที่เกี่ยวข้องกับหัวข้อ ${topicsString} พร้อมคำอธิบาย ตัวอย่าง Testcase 3 ชุด และโค้ดโปรแกรมตัวอย่าง`;
    }
  } else {
    prompt = `Give me a ${difficulty} level university Programming problem related to the following topics: ${topicsString}. Provide problem descriptions, 3 example test cases, 3 example outputs, name of the problem, and example source code.`;

    if (isAnotherProblem) {
      prompt = `Give me more new ${difficulty} level university Programming problems related to the following topics: ${topicsString}. Include detailed descriptions, 3 example test cases, example outputs, and source code.`;
    }
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.choices[0].message?.content ?? 'No response.';
    return NextResponse.json({ response: content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate problem.' }, { status: 500 });
  }
}
