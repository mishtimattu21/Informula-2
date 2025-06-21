import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { toast } from '@/hooks/use-toast';
import CameraInterface from '../components/CameraInterface';

const DecodePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'upload' | 'type'>('scan');
  const [ingredients, setIngredients] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      toast({
        title: "Image uploaded successfully!",
        description: "Ready to analyze ingredients from your image.",
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleCameraCapture = (imageData: string) => {
    setCapturedImage(imageData);
    toast({
      title: "Image captured successfully!",
      description: "Ready to analyze ingredients from your photo.",
    });
  };

  const handleAnalyze = () => {
    if (activeTab === 'type' && !ingredients.trim()) {
      toast({
        title: "No ingredients entered",
        description: "Please enter some ingredients to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'upload' && !uploadedFile) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image to analyze.",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'scan' && !capturedImage) {
      toast({
        title: "No image captured",
        description: "Please capture an image to analyze.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Analysis starting...",
      description: "Processing your ingredients with AI.",
    });

    // Simulate analysis delay
    setTimeout(() => {
      navigate('/results');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-50/30 dark:to-emerald-950/30">
      {/* Header */}
      <div className="border-b border-border/40 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent"
            >
              Informula
            </button>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="rounded-full p-2"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Decode Your Ingredients
            </h1>
            <p className="text-lg text-foreground/70">
              Choose your preferred method to analyze product ingredients
            </p>
          </div>

          {/* Method Selection Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 flex space-x-2">
              {[
                { id: 'scan', label: 'Scan/Camera', icon: '📱' },
                { id: 'upload', label: 'Upload Image', icon: '📤' },
                { id: 'type', label: 'Type Ingredients', icon: '⌨️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                      : 'text-foreground/70 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <Card className="rounded-2xl shadow-lg border-2 border-emerald-200 dark:border-emerald-800 mb-8">
            <CardContent className="p-8">
              {activeTab === 'scan' && (
                <div className="text-center space-y-6">
                  {!capturedImage ? (
                    <>
                      <div className="w-32 h-32 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                        <Camera className="w-16 h-16 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold">Scan Ingredient Labels</h3>
                      <p className="text-foreground/70 max-w-md mx-auto">
                        Use your device camera to scan ingredient lists directly from product packaging
                      </p>
                      <div className="space-y-4">
                        <Button 
                          onClick={() => setShowCamera(true)}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl"
                        >
                          <Camera className="mr-2" size={16} />
                          Open Camera
                        </Button>
                        <br />
                        <Button 
                          variant="outline"
                          className="px-8 py-3 rounded-xl border-2 border-emerald-200 dark:border-emerald-800"
                          onClick={() => document.getElementById('gallery-upload')?.click()}
                        >
                          Choose from Gallery
                        </Button>
                        <input
                          id="gallery-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setCapturedImage(event.target.result as string);
                                }
                              };
                              reader.readAsDataURL(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Image Captured</h3>
                      <div className="max-w-md mx-auto">
                        <img 
                          src={capturedImage} 
                          alt="Captured ingredient label" 
                          className="w-full rounded-xl border-2 border-emerald-200 dark:border-emerald-800"
                        />
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button 
                          onClick={() => setCapturedImage(null)}
                          variant="outline"
                          className="px-6 py-2 rounded-xl"
                        >
                          Retake
                        </Button>
                        <Button 
                          onClick={() => setShowCamera(true)}
                          variant="outline"
                          className="px-6 py-2 rounded-xl"
                        >
                          Take Another
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      isDragging 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
                    }`}
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
                    <h3 className="text-xl font-semibold mb-2">Drop your image here</h3>
                    <p className="text-foreground/70 mb-4">or click to browse files</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button 
                        variant="outline"
                        className="cursor-pointer px-6 py-2 rounded-xl border-2 border-emerald-200 dark:border-emerald-800"
                        asChild
                      >
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </div>

                  {uploadedFile && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">📷</span>
                        </div>
                        <div>
                          <p className="font-medium">{uploadedFile.name}</p>
                          <p className="text-sm text-foreground/70">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setUploadedFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'type' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Enter Ingredients</h3>
                    <Textarea
                      placeholder="Type or paste ingredient list here... 
Example: Water, Sodium Lauryl Sulfate, Cocamidopropyl Betaine, Sodium Chloride, Glycerin, Citric Acid, Sodium Benzoate..."
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      className="min-h-[200px] rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 transition-colors text-base"
                    />
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4">
                    <h4 className="font-medium mb-2">💡 Tips for better results:</h4>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      <li>• Separate ingredients with commas</li>
                      <li>• Include the complete ingredient list</li>
                      <li>• Check spelling for accurate analysis</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analyze Button */}
          <div className="text-center">
            <Button 
              onClick={handleAnalyze}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-12 py-6 text-lg rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">🔬</span>
              Analyze Ingredients
            </Button>
          </div>
        </div>
      </div>

      {/* Camera Interface Modal */}
      {showCamera && (
        <CameraInterface
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default DecodePage;
