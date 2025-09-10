import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeImageFile, analyzeImage, analyzeText } from '@/services/api';
import { useUser } from '@clerk/clerk-react';
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
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [customProductType, setCustomProductType] = useState('');
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();
  const { isSignedIn, user } = useUser();

  const handleProductTypeChange = (value: string) => {
    setProductType(value);
    if (value !== 'other') {
      setCustomProductType('');
    }
  };

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
    setShowCamera(false);
    toast({
      title: "Image captured successfully!",
      description: "Ready to analyze ingredients from your photo.",
    });
  };

  const handleAnalyze = async () => {
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

    try {
      // Send Clerk user id so backend can pull profile from Supabase for personalized analysis
      const userId = isSignedIn && user ? user.id : undefined;
      let result: any;
      const finalProductType = productType === 'other' && customProductType ? customProductType : productType;
      
      if (activeTab === 'upload' && uploadedFile) {
        result = await analyzeImageFile(uploadedFile, userId, productName, finalProductType);
      } else if (activeTab === 'scan' && capturedImage) {
        result = await analyzeImage(capturedImage, userId, productName, finalProductType);
      } else if (activeTab === 'type') {
        result = await analyzeText(ingredients, userId, productName, finalProductType);
      }

      if (!result) throw new Error('No result');
      // Ensure object if backend returns JSON string
      if (typeof result === 'string') {
        try { result = JSON.parse(result); } catch {}
      }
      // Persist to navigation state or a store; navigating with state for now
      navigate('/results', { state: { analysis: result } });
    } catch (err: any) {
      toast({ title: 'Analysis failed', description: err.message || String(err), variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-50/30 dark:to-emerald-950/30">
      {/* Header */}
        <div className="container mx-auto px-4 py-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
        >
              Back to home
            </button>
            
            
        </div>
      

      {/* Main Content */}
      <div className="container mx-auto px-4 py-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent relative z-10 pb-2 leading-tight">
              Decode Your Ingredients
            </h1>
            
          </div>

          {/* Method Selection Tabs */}
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 flex space-x-2">
              {[
                { id: 'scan', label: 'Scan/Camera' },
                { id: 'upload', label: 'Upload Image' },
                { id: 'type', label: 'Type Ingredients' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl transition-all duration-500 ease-in-out flex items-center justify-center ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105'
                      : 'text-foreground/70 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700 hover:scale-102'
                  }`}
                >
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <Card className="rounded-2xl shadow-lg border-2 border-emerald-200 dark:border-emerald-800 mb-8">
            <CardContent className="p-8">
              {activeTab === 'scan' && (
                <div className="space-y-6">
                  <div className="text-center space-y-6">
                    {!capturedImage ? (
                      <>
                        <button
                          onClick={() => setShowCamera(true)}
                          className="w-32 h-32 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <Camera className="w-16 h-16 text-white" />
                        </button>
                        <p className="text-lg font-medium">Tap to Scan</p>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-semibold">Image Captured</h3>
                        <div className="max-w-sm mx-auto">
                          <img 
                            src={capturedImage} 
                            alt="Captured ingredient label" 
                            className="w-full h-48 object-cover rounded-xl border-2 border-emerald-200 dark:border-emerald-800 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              setModalImage(capturedImage);
                              setShowImageModal(true);
                            }}
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

                  {/* Product Information Fields */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Name (Optional)</label>
                        <Input
                          placeholder="e.g., Neutrogena Ultra Sheer Sunscreen"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Type (Optional)</label>
                        <Select value={productType} onValueChange={handleProductTypeChange}>
                          <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500">
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shampoo">Shampoo</SelectItem>
                            <SelectItem value="conditioner">Conditioner</SelectItem>
                            <SelectItem value="soap">Soap</SelectItem>
                            <SelectItem value="lotion">Lotion</SelectItem>
                            <SelectItem value="sunscreen">Sunscreen</SelectItem>
                            <SelectItem value="makeup">Makeup</SelectItem>
                            <SelectItem value="skincare">Skincare</SelectItem>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="beverage">Beverage</SelectItem>
                            <SelectItem value="supplement">Supplement</SelectItem>
                            <SelectItem value="cleaning">Cleaning Product</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {productType === 'other' && (
                          <Input
                            placeholder="Specify product type..."
                            value={customProductType}
                            onChange={(e) => setCustomProductType(e.target.value)}
                            className="mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>
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
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
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
                      <div className="max-w-sm mx-auto">
                        <img 
                          src={URL.createObjectURL(uploadedFile)} 
                          alt="Uploaded image preview" 
                          className="w-full h-48 object-cover rounded-xl border-2 border-emerald-200 dark:border-emerald-800 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            const imageUrl = URL.createObjectURL(uploadedFile);
                            setModalImage(imageUrl);
                            setShowImageModal(true);
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Product Information Fields */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Name (Optional)</label>
                        <Input
                          placeholder="e.g., Neutrogena Ultra Sheer Sunscreen"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Type (Optional)</label>
                        <Select value={productType} onValueChange={handleProductTypeChange}>
                          <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500">
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shampoo">Shampoo</SelectItem>
                            <SelectItem value="conditioner">Conditioner</SelectItem>
                            <SelectItem value="soap">Soap</SelectItem>
                            <SelectItem value="lotion">Lotion</SelectItem>
                            <SelectItem value="sunscreen">Sunscreen</SelectItem>
                            <SelectItem value="makeup">Makeup</SelectItem>
                            <SelectItem value="skincare">Skincare</SelectItem>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="beverage">Beverage</SelectItem>
                            <SelectItem value="supplement">Supplement</SelectItem>
                            <SelectItem value="cleaning">Cleaning Product</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {productType === 'other' && (
                          <Input
                            placeholder="Specify product type..."
                            value={customProductType}
                            onChange={(e) => setCustomProductType(e.target.value)}
                            className="mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>
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
                  
                  {/* <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4">
                    <h4 className="font-medium mb-2">💡 Tips for better results:</h4>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      <li>• Separate ingredients with commas</li>
                      <li>• Include the complete ingredient list</li>
                      <li>• Check spelling for accurate analysis</li>
                    </ul>
                  </div> */}

                  {/* Product Information Fields */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Name (Optional)</label>
                        <Input
                          placeholder="e.g., Neutrogena Ultra Sheer Sunscreen"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Type (Optional)</label>
                        <Select value={productType} onValueChange={handleProductTypeChange}>
                          <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500">
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shampoo">Shampoo</SelectItem>
                            <SelectItem value="conditioner">Conditioner</SelectItem>
                            <SelectItem value="soap">Soap</SelectItem>
                            <SelectItem value="lotion">Lotion</SelectItem>
                            <SelectItem value="sunscreen">Sunscreen</SelectItem>
                            <SelectItem value="makeup">Makeup</SelectItem>
                            <SelectItem value="skincare">Skincare</SelectItem>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="beverage">Beverage</SelectItem>
                            <SelectItem value="supplement">Supplement</SelectItem>
                            <SelectItem value="cleaning">Cleaning Product</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {productType === 'other' && (
                          <Input
                            placeholder="Specify product type..."
                            value={customProductType}
                            onChange={(e) => setCustomProductType(e.target.value)}
                            className="mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500"
                          />
                        )}
                      </div>
                    </div>
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
              Analyze Ingredients
            </Button>
          </div>
        </div>
      </div>

      {/* Camera Interface Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Camera</h3>
              
              {/* Camera Preview Area */}
              <div className="relative bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center">
                <video 
                  ref={(video) => {
                    if (video && showCamera) {
                      navigator.mediaDevices.getUserMedia({ video: true })
                        .then(stream => {
                          video.srcObject = stream;
                          video.play();
                        })
                        .catch(err => {
                          console.error('Camera access denied:', err);
                          toast({
                            title: "Camera access denied",
                            description: "Please allow camera access to capture images.",
                            variant: "destructive"
                          });
                        });
                    }
                  }}
                  className="w-full h-full object-cover rounded-xl"
                  autoPlay
                  playsInline
                />
              </div>

              {/* Capture Button */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => {
                    const video = document.querySelector('video');
                    if (video) {
                      const canvas = document.createElement('canvas');
                      canvas.width = video.videoWidth;
                      canvas.height = video.videoHeight;
                      const ctx = canvas.getContext('2d');
                      ctx?.drawImage(video, 0, 0);
                      const imageData = canvas.toDataURL('image/jpeg');
                      
                      // Stop camera stream
                      const stream = video.srcObject as MediaStream;
                      if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                      }
                      
                      handleCameraCapture(imageData);
                    }
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl"
                >
                  <Camera className="mr-2" size={16} />
                  Capture
                </Button>
                <Button
                  onClick={() => {
                    const video = document.querySelector('video');
                    if (video) {
                      const stream = video.srcObject as MediaStream;
                      if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                      }
                    }
                    setShowCamera(false);
                  }}
                  variant="outline"
                  className="px-8 py-3 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {showImageModal && modalImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={modalImage} 
              alt="Full size view" 
              className="max-w-full max-h-screen object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecodePage;