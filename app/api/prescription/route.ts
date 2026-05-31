import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent([
      `
      Extract all medicines from this prescription.

      Return only:

      Medicine Name
      Dosage
      Timing

      Keep the response simple.
      `,
      {
        inlineData: {
          mimeType: body.mimeType,
          data: body.image,
        },
      },
    ]);

    return Response.json({
      success: true,
      text: result.response.text(),
    });

  } catch (error: any) {

  console.error("GEMINI ERROR:", error);

  return Response.json(
    {
      success: false,
      error: error?.message || "Unknown error",
    },
    {
      status: 500,
    }
  );

}