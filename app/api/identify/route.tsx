import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    // if (!process.env.GOOGLE_API_KEY) {
    //   throw new Error('Google API key is not configured');
    // }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(
      "AIzaSyDV2ioDO9qcxFXIXbV-uW2f-pdfTrNUQuE",
    );

    // Using gemini-1.5-flash as specified in the error message
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert image to byte array
    const imageBytes = await image.arrayBuffer();

    // Create image part as per Gemini's requirements
    const imagePart = {
      inlineData: {
        data: Buffer.from(imageBytes).toString("base64"),
        mimeType: image.type,
      },
    };

    // Structured prompt with more specific instructions
    const prompt = `You are a plant identification expert. Please analyze the provided plant image and return ONLY a JSON response in exactly this format:
    {
      "name": "Common plant name",
      "scientificName": "Scientific/Latin name",
      "description": "A brief 1-2 sentence description",
      "careInstructions": [
        "Light requirement",
        "Water needs",
        "Soil preference"
      ]
    }
    Do not include any additional text or explanations outside of the JSON structure.`;

    // Generate content
    const result = await model.generateContent([prompt, imagePart]);

    const response = await result.response;
    const text = response.text();

    console.log("Raw API response:", text); // For debugging

    // Attempt to parse JSON response
    let plantInfo;
    try {
      // First try direct JSON parsing
      plantInfo = JSON.parse(text);
    } catch (e) {
      console.error("Initial JSON parsing failed:", e);

      // Try to extract JSON from text if direct parsing fails
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          plantInfo = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Fallback JSON parsing failed:", e);
          throw new Error("Invalid response format from API");
        }
      } else {
        // If no JSON is found, attempt to structure the response
        const lines = text.split("\n").filter((line) => line.trim());
        plantInfo = {
          name: lines[0] || "Unknown plant",
          scientificName: lines[1] || "Scientific name not available",
          description: lines[2] || "No description available",
          careInstructions: lines.slice(3) || [
            "Care instructions not available",
          ],
        };
      }
    }

    // Validate and ensure all required fields exist
    plantInfo = {
      name: plantInfo.name || "Unknown plant",
      scientificName:
        plantInfo.scientificName || "Scientific name not available",
      description: plantInfo.description || "No description available",
      careInstructions: Array.isArray(plantInfo.careInstructions)
        ? plantInfo.careInstructions
        : ["Care instructions not available"],
    };

    return Response.json(plantInfo);
  } catch (error) {
    console.error("Detailed error:", error);

    return Response.json(
      {
        error: "Failed to identify plant",
        details: error.message,
        technicalDetails:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      {
        status: 500,
      },
    );
  }
}
