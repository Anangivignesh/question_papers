const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    const { fileName, fileContent } = JSON.parse(event.body);

    if (!fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing fileName or fileContent" }),
      };
    }

    const repoOwner = "Anangivignesh";   // <-- change this
    const repoName = "question_papers";          // <-- change this
    const branch = "main";                      // or "master"
    const folder = "pdfs";                      // folder where PDFs will be stored

    const githubToken = process.env.GITHUB_TOKEN;

    // 1. Get the current SHA if file already exists (needed for updates)
    const filePath = `${folder}/${fileName}`;
    const getUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`;
    let sha = null;

    const getResponse = await fetch(getUrl, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }

    // 2. Commit the new file
    const putUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    const putResponse = await fetch(putUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: `Add ${fileName}`,
        content: fileContent,
        branch: branch,
        sha: sha || undefined,
      }),
    });

    if (!putResponse.ok) {
      const error = await putResponse.json();
      return {
        statusCode: putResponse.status,
        body: JSON.stringify({ message: error.message }),
      };
    }

    const result = await putResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully",
        url: result.content.html_url,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
