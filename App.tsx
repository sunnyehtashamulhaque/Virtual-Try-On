
import React, { useState, useCallback } from 'react';
import { AppStep, ImageState } from './types';
import { generateTryOnImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import Spinner from './components/Spinner';
import { ProductIcon, ModelIcon } from './components/icons';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.PRODUCT_UPLOAD);
  const [productImage, setProductImage] = useState<ImageState | null>(null);
  const [modelImage, setModelImage] = useState<ImageState | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProductUpload = useCallback((image: ImageState) => {
    setProductImage(image);
  }, []);

  const handleModelUpload = useCallback((image: ImageState) => {
    setModelImage(image);
  }, []);

  const handleGenerate = async () => {
    if (!productImage || !modelImage) {
      setError("Both product and model images are required.");
      return;
    }
    setError(null);
    setStep(AppStep.GENERATING);
    try {
      const resultBase64 = await generateTryOnImage(modelImage, productImage);
      setGeneratedImage(resultBase64);
      setStep(AppStep.RESULT);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      setStep(AppStep.MODEL_UPLOAD);
    }
  };

  const handleReset = () => {
    setStep(AppStep.PRODUCT_UPLOAD);
    setProductImage(null);
    setModelImage(null);
    setGeneratedImage(null);
    setError(null);
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.PRODUCT_UPLOAD:
        return (
          <div className="w-full flex flex-col items-center gap-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Step 1: Upload Product Image</h2>
              <p className="mt-4 text-lg text-gray-300">Select a photo of the clothing item you want to try on.</p>
            </div>
            <ImageUploader
              id="product-uploader"
              onImageUpload={handleProductUpload}
              title="Upload Fashion Product"
              description="PNG, JPG, or WEBP files."
              icon={<ProductIcon className="w-16 h-16"/>}
              previewUrl={productImage?.previewUrl}
            />
            {productImage && (
              <button
                onClick={() => setStep(AppStep.MODEL_UPLOAD)}
                className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 transform hover:scale-105"
              >
                Next: Upload Model
              </button>
            )}
          </div>
        );

      case AppStep.MODEL_UPLOAD:
        return (
          <div className="w-full flex flex-col items-center gap-8">
            <div className="text-center">
               <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Step 2: Upload Model Image</h2>
               <p className="mt-4 text-lg text-gray-300">Now, provide a photo of the person who will wear the item.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start">
                {productImage && <img src={productImage.previewUrl} alt="Product" className="h-40 w-auto rounded-lg shadow-md border-2 border-indigo-500"/>}
                <ImageUploader
                  id="model-uploader"
                  onImageUpload={handleModelUpload}
                  title="Upload Model"
                  description="A clear, front-facing photo works best."
                  icon={<ModelIcon className="w-16 h-16"/>}
                  previewUrl={modelImage?.previewUrl}
                />
            </div>
            {error && <p className="text-red-400 text-center">{error}</p>}
            <div className="flex gap-4">
                <button
                onClick={() => setStep(AppStep.PRODUCT_UPLOAD)}
                className="rounded-md bg-gray-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={!modelImage}
                className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
              >
                Generate Try-On
              </button>
            </div>
          </div>
        );

      case AppStep.GENERATING:
        return (
          <div className="flex flex-col items-center justify-center gap-6 text-white text-center">
            <Spinner />
            <h2 className="text-2xl font-semibold">Working our magic...</h2>
            <p className="text-gray-300">Generating your virtual try-on. This may take a moment.</p>
          </div>
        );

      case AppStep.RESULT:
        return (
          <div className="w-full flex flex-col items-center gap-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Here's Your Virtual Try-On!</h2>
                <p className="mt-4 text-lg text-gray-300">The AI has combined the images.</p>
            </div>
            {generatedImage && (
              <img
                src={`data:image/png;base64,${generatedImage}`}
                alt="Generated try-on"
                className="max-w-full md:max-w-2xl max-h-[70vh] w-auto h-auto object-contain rounded-lg shadow-2xl border-4 border-indigo-500"
              />
            )}
            <button
              onClick={handleReset}
              className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 transform hover:scale-105"
            >
              Start Over
            </button>
          </div>
        );
    }
  };

  return (
    <div className="relative isolate min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#2d3748_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <header className="absolute top-0 left-0 p-6">
         <h1 className="text-2xl font-bold text-white">Virtual Try-On Studio ✨</h1>
      </header>
      <main className="flex-grow flex items-center justify-center w-full">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        Powered by Gemini API
      </footer>
    </div>
  );
};

export default App;
