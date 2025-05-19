# Carbon Neutral Frontend Example

This is an example Next.js frontend application that demonstrates how to integrate with the Carbon Neutral Backend API.

## Features

- Image upload and preview
- Multiple analysis types (carbon footprint, labels, text, objects)
- Display of analysis results
- Responsive design

## Prerequisites

- Node.js 14+ and npm/yarn
- Carbon Neutral Backend API running (see main project README)

## Setup

1. Create a new Next.js project:
   ```bash
   npx create-next-app carbon-neutral-frontend
   cd carbon-neutral-frontend
   ```

2. Install required dependencies:
   ```bash
   npm install axios formidable
   # or
   yarn add axios formidable
   ```

3. Copy the example files from this directory to your Next.js project:
   - `ImageAnalyzer.jsx` → root directory
   - `api/analyze-image.js` → pages/api/ directory
   - `pages/index.js` → pages/ directory

4. Configure environment variables:
   - Create a `.env.local` file in the project root
   - Add the following variables:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000
     API_URL=http://localhost:8000
     ```

## Running the Frontend

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000

## How It Works

1. The `ImageAnalyzer` component provides a user interface for uploading and analyzing images
2. When a user submits an image, it's sent to the FastAPI backend for processing
3. The backend analyzes the image using Google Vision API and returns the results
4. The frontend displays the analysis results in a user-friendly format

## Direct API Integration

The `ImageAnalyzer.jsx` component demonstrates direct API integration with the backend. This approach works well for client-side applications.

## API Route Integration

The `api/analyze-image.js` file demonstrates how to create a Next.js API route that proxies requests to the backend. This approach is useful when:

- You need to hide the backend URL from the client
- You want to add additional processing or authentication
- You need to avoid CORS issues

## Customization

Feel free to customize these examples to fit your specific needs:

- Add authentication
- Implement more sophisticated error handling
- Enhance the UI with additional components
- Add more analysis options

## Styling

The examples use basic Tailwind CSS classes. To use Tailwind CSS:

1. Install Tailwind CSS:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. Configure Tailwind CSS in `tailwind.config.js`:
   ```js
   module.exports = {
     content: [
       "./pages/**/*.{js,ts,jsx,tsx}",
       "./components/**/*.{js,ts,jsx,tsx}",
       "./*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. Add Tailwind directives to your CSS in `styles/globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
