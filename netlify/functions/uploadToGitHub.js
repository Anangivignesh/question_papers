const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
    }

    const { fileName, fileContent } = JSON.parse(event.body);

    if (!fileName || !fileContent) {
      return { statusCode: 400, body: JSON.stringify({ message: "Missing fileName or fileContent" }) };
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const repoOwner = "Anangivignesh";
    const repoName = "question_papers";
    const branch = "master";
    const filePath = `pdfs/${fileName}`;

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    const commitMessage = `Add ${fileName}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "NetlifyFunction"
      },
      body: JSON.stringify({
        message: commitMessage,
        content: fileContent,
        branch: branch
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GitHub API error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: data.message || "GitHub upload failed", details: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Upload successful", url: data.content.html_url })
    };

  } catch (err) {
    console.error("Server error:", err);
    return { statusCode: 500, body: JSON.stringify({ message: "Internal Server Error", error: err.message }) };
  }
};
