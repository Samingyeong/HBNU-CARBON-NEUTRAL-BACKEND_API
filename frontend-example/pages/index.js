import Head from 'next/head';
import ImageAnalyzer from '../ImageAnalyzer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Carbon Neutral Image Analyzer</title>
        <meta name="description" content="Analyze images for carbon footprint and environmental impact" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-10">
        <div className="container mx-auto">
          <ImageAnalyzer />
        </div>
      </main>

      <footer className="py-6 text-center text-gray-600">
        <p>Carbon Neutral Project - HBNU</p>
      </footer>
    </div>
  );
}
