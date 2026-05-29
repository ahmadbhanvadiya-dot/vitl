import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY!
);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Extract medicines from this prescription.

Return ONLY JSON array format like:

[
  {
    "medicine_name": "",
    "dosage": "",
    "timing": ""
  }
]
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: body.image,
        },
      },
    ]);

    const response = result.response.text();

    return Response.json({
      success: true,
      data: response,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error,
    });
  }
}