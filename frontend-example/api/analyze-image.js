import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';

// API base URL - should be configured based on your environment
const API_BASE_URL = process.env.API_URL || 'http://localhost:8000';

// Configure Next.js to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the incoming form data
    const form = new formidable.IncomingForm();
    
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    // Get the uploaded file
    const file = files.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the analysis type from the query parameters or use a default
    const analysisType = req.query.type || 'carbon-footprint';
    
    // Determine which endpoint to use based on analysis type
    let endpoint = '';
    switch (analysisType) {
      case 'labels':
        endpoint = '/analyze-image/';
        break;
      case 'text':
        endpoint = '/detect-text/';
        break;
      case 'objects':
        endpoint = '/detect-objects/';
        break;
      case 'carbon-footprint':
        endpoint = '/analyze-carbon-footprint/';
        break;
      default:
        endpoint = '/analyze-carbon-footprint/';
    }

    // Create form data to send to the FastAPI backend
    const formData = new FormData();
    
    // Read the file and append it to the form data
    const fileData = fs.readFileSync(file.filepath);
    formData.append('file', new Blob([fileData]), file.originalFilename);

    // Send the request to the FastAPI backend
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the response from the FastAPI backend
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error processing image:', error);
    return res.status(500).json({ 
      error: 'Error processing image',
      details: error.response?.data?.detail || error.message 
    });
  }
}
