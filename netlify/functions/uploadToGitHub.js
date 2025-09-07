const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  try {
    const { fileName, fileContent } = JSON.parse(event.body);

    if (!fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing fileName or fileContent" })
      };
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const owner = "Anangivignesh";   // 👈 your GitHub username
    const repo = "question_papers";  // 👈 your repo name
    const path = `pdfs/${fileName}`; // file goes to /pdfs folder
    const branch = "master";

    // check if file already exists
    let sha;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch
      });
      sha = data.sha;
    } catch (e) {
      // file does not exist → ignore
    }

    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Upload ${fileName}`,
      content: fileContent,
      branch,
      sha
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "File uploaded successfully",
        url: `https://github.com/${owner}/${repo}/blob/${branch}/${path}`
      })
    };

  } catch (err) {
    console.error("Upload error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message || "Unknown error" })
    };
  }
};
