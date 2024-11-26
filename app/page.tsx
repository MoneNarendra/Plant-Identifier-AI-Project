"use client";
import { useState } from "react";
import {
  Upload,
  Leaf,
  Droplets,
  Sun,
  Wind,
  ThermometerSun,
} from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError("Image size should be less than 4MB");
        return;
      }
      setError(null);
      setImage(file);
      setPreview(URL.createObjectURL(file));
      identifyPlant(file);
    }
  };

  const identifyPlant = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/identify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to identify plant");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error identifying plant:", error);
      setError("Failed to identify plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
          <main className="container mx-auto px-4 py-12 max-w-5xl">
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-xl p-8 mb-12">
              <div className="flex flex-col items-center justify-center">
                <label className="w-full max-w-md h-64 flex flex-col items-center justify-center border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <Upload className="w-12 h-12 text-green-500 mb-2" />
                  <p className="text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                    <br />
                    <span className="text-sm">PNG, JPG (max 4MB)</span>
                  </p>
                </label>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Preview */}
              {preview && (
                <div className="bg-white rounded-xl shadow-xl p-6 h-fit">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Uploaded Image
                  </h2>
                  <img
                    src={preview}
                    alt="Plant preview"
                    className="w-full rounded-lg object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              )}

              {/* Plant Information */}
              {loading && (
                <div className="bg-white rounded-xl shadow-xl p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                      Analyzing your plant...
                    </p>
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="bg-white rounded-xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-green-800 mb-2">
                    {result.name}
                  </h2>
                  <p className="text-gray-600 italic mb-4">
                    {result.scientificName}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600">{result.description}</p>
                  </div>

                  {/* Plant Characteristics Table */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Plant Characteristics
                    </h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <table className="w-full">
                        <tbody>
                          <tr className="border-b border-green-100">
                            <td className="py-2 flex items-center text-gray-700">
                              <Sun className="w-5 h-5 mr-2 text-green-600" />
                              Light Requirements
                            </td>
                            <td className="py-2 text-gray-600">
                              {result.careInstructions[0]}
                            </td>
                          </tr>
                          <tr className="border-b border-green-100">
                            <td className="py-2 flex items-center text-gray-700">
                              <Droplets className="w-5 h-5 mr-2 text-green-600" />
                              Water Needs
                            </td>
                            <td className="py-2 text-gray-600">
                              {result.careInstructions[1]}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 flex items-center text-gray-700">
                              <Wind className="w-5 h-5 mr-2 text-green-600" />
                              Soil Preference
                            </td>
                            <td className="py-2 text-gray-600">
                              {result.careInstructions[2]}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Care Tips */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Additional Care Tips
                    </h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <ul className="space-y-3">
                        {result.careInstructions.slice(3).map((tip, index) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-600"
                          >
                            <ThermometerSun className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Footer */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
