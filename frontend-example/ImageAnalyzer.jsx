import { useState } from 'react';
import axios from 'axios';

// API base URL - should be configured based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ImageAnalyzer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [analysisType, setAnalysisType] = useState('carbon-footprint');

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      
      // Reset previous results and errors
      setResult(null);
      setError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select an image file');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    try {
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
      
      // Send request to the API
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Set the result
      setResult(response.data);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err.response?.data?.detail || 'Error analyzing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render carbon footprint results
  const renderCarbonFootprintResults = () => {
    if (!result) return null;
    
    return (
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">Carbon Footprint Analysis</h3>
        <div className="mb-4">
          <p className="font-semibold">Assessment: 
            <span className={`ml-2 px-2 py-1 rounded ${
              result.assessment.includes('Positive') ? 'bg-green-100 text-green-800' : 
              result.assessment.includes('Neutral') ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {result.assessment}
            </span>
          </p>
          <p className="font-semibold">Total Carbon Score: {result.total_carbon_score.toFixed(2)}</p>
        </div>
        
        {result.carbon_impact_details.length > 0 ? (
          <div>
            <h4 className="font-semibold mb-2">Carbon Impact Details:</h4>
            <ul className="divide-y">
              {result.carbon_impact_details.map((item, index) => (
                <li key={index} className="py-2">
                  <p><span className="font-medium">Item:</span> {item.item}</p>
                  <p><span className="font-medium">Carbon Value:</span> {item.carbon_value}</p>
                  <p><span className="font-medium">Confidence:</span> {(item.confidence * 100).toFixed(2)}%</p>
                  <p><span className="font-medium">Weighted Impact:</span> {item.weighted_impact.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No specific carbon impact details found.</p>
        )}
      </div>
    );
  };

  // Render other analysis results
  const renderAnalysisResults = () => {
    if (!result) return null;
    
    if (analysisType === 'carbon-footprint') {
      return renderCarbonFootprintResults();
    }
    
    // For other analysis types
    return (
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">Analysis Results</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Carbon Neutral Image Analyzer</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Analysis Type:</label>
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="carbon-footprint">Carbon Footprint Analysis</option>
            <option value="labels">Label Detection</option>
            <option value="text">Text Detection</option>
            <option value="objects">Object Detection</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Upload an Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        
        {preview && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 rounded-lg shadow"
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || !file}
          className={`px-6 py-2 rounded-lg text-white font-medium ${
            loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </form>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}
      
      {renderAnalysisResults()}
    </div>
  );
}
