const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { fileName, fileContent } = JSON.parse(event.body);

    if (!fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing fileName or fileContent" }),
      };
    }

    const repoOwner = "Anangivignesh"; // 👈 change
    const repoName = "question_papers";        // 👈 change
    const branch = "main";                    // or "master" if your repo uses that

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/pdfs/${fileName}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload ${fileName}`,
        content: fileContent,
        branch: branch,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GitHub API Error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: data.message || "Unknown GitHub error" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ url: data.content.html_url }),
    };
  } catch (err) {
    console.error("Function Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
