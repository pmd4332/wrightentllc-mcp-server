require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MCP Server — tools endpoint
app.post('/mcp', async (req, res) => {
  const { tool, input } = req.body;

  try {
    let result;

    switch (tool) {
      case 'generateVideo':
        result = await generateVideo(input);
        break;
      case 'generatePoster':
        result = await generatePoster(input);
        break;
      case 'generateWebPage':
        result = await generateWebPage(input);
        break;
      case 'checkVideoStatus':
        result = await checkVideoStatus(input);
        break;
      default:
        return res.status(400).json({ error: `Unknown tool: ${tool}` });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(`Error in ${tool}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Tool: Generate Video
async function generateVideo(input) {
  const { prompt, duration = 10 } = input;

  if (!prompt) throw new Error('prompt is required');

  return {
    jobId: `job_${Date.now()}`,
    prompt,
    duration,
    status: 'queued',
    message: 'Video queued. Check status with checkVideoStatus using the jobId.',
  };
}

// Tool: Generate Poster
async function generatePoster(input) {
  const { prompt, style = 'modern' } = input;

  if (!prompt) throw new Error('prompt is required');

  return {
    jobId: `poster_${Date.now()}`,
    prompt,
    style,
    status: 'queued',
    message: 'Poster generation queued.',
  };
}

// Tool: Generate Web Page
async function generateWebPage(input) {
  const { prompt, style = 'minimal' } = input;

  if (!prompt) throw new Error('prompt is required');

  return {
    jobId: `webpage_${Date.now()}`,
    prompt,
    style,
    html: '<html><body><h1>Generated Page</h1><p>Coming soon...</p></body></html>',
    message: 'Web page generated.',
  };
}

// Tool: Check Video Status
async function checkVideoStatus(input) {
  const { jobId } = input;

  if (!jobId) throw new Error('jobId is required');

  return {
    jobId,
    status: 'processing',
    progress: 50,
    message: 'Video is still processing.',
  };
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'wrightentllc-mcp-server' });
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
