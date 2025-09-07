import fetch from "node-fetch";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { fileName, fileContent } = JSON.parse(event.body);

    if (!fileName || !fileContent) {
      return { statusCode: 400, body: "Missing file data" };
    }

    const repoOwner = "YOUR_GITHUB_USERNAME";
    const repoName = "YOUR_REPO_NAME";
    const branch = "main"; // or "master"

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/pdfs/${fileName}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Upload ${fileName}`,
        content: fileContent,
        branch: branch
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ File uploaded to GitHub",
        url: result.content.html_url
      })
    };

  } catch (err) {
    return { statusCode: 500, body: "Upload failed: " + err.message };
  }
}
