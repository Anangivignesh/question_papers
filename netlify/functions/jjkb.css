import { Blob } from "@netlify/blobs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Extract file info from body
    const body = JSON.parse(event.body);
    const { fileName, fileContent } = body;

    if (!fileName || !fileContent) {
      return { statusCode: 400, body: "Missing file data" };
    }

    // Save PDF to Netlify Blobs
    const blob = new Blob();
    await blob.set(fileName, Buffer.from(fileContent, "base64"), {
      contentType: "application/pdf",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "File uploaded", name: fileName }),
    };
  } catch (err) {
    return { statusCode: 500, body: "Upload failed: " + err.message };
  }
}
