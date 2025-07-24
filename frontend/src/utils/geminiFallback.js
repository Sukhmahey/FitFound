export async function parseResumeWithGeminiAsync(file) {
  const geminiKey = process.env.REACT_APP_Resume_GM;

  const base64 = await fileToBase64(file);
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64.split(",")[1], 
                },
              },
              {
                text: "Extract plain text content from this resume image or PDF.",
              },
            ],
          },
        ],
      }),
    }
  );

  const result = await response.json();
  return (
    result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}