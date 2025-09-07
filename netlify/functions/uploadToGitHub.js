const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method not allowed" }),
      };
    }

    const { fileName, fileContent } = JSON.parse(event.body || "{}");

    if (!fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing fileName or fileContent" }),
      };
    }

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Missing GitHub token" }),
      };
    }

    const repoOwner = "Anangivignesh";
    const repoName = "question_papers";
    const branch = "master";

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/pdfs/${fileName}`;
    const commitMessage = `Add ${fileName}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: fileContent,
        branch: branch,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: data.message || "GitHub upload failed" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ url: data.content.html_url }),
    };
  } catch (error) {
    console.error("Upload failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};
