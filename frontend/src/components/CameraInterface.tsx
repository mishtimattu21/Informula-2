
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, RotateCcw, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CameraInterfaceProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraInterface: React.FC<CameraInterfaceProps> = ({ onCapture, onClose }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to scan ingredients.",
        variant: "destructive"
      });
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const usePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-background border-2 border-emerald-500">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Scan Ingredient Label</h3>
            <Button onClick={stopCamera} variant="ghost" size="sm">
              <X size={20} />
            </Button>
          </div>

          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
            {!isStreaming && !capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Camera size={64} className="mb-4 opacity-50" />
                <p className="text-lg mb-4">Ready to scan ingredient labels</p>
                <Button onClick={startCamera} className="bg-emerald-500 hover:bg-emerald-600">
                  <Camera className="mr-2" size={16} />
                  Start Camera
                </Button>
              </div>
            )}

            {isStreaming && !capturedImage && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-emerald-500 w-80 h-48 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-emerald-500"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-emerald-500"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-emerald-500"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-emerald-500"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                    Align ingredient list within the frame
                  </p>
                </div>
              </>
            )}

            {capturedImage && (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="flex justify-center gap-4">
            {isStreaming && !capturedImage && (
              <Button 
                onClick={captureImage}
                className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 text-lg"
              >
                <Zap className="mr-2" size={20} />
                Capture
              </Button>
            )}

            {capturedImage && (
              <>
                <Button onClick={retakePhoto} variant="outline" className="px-6 py-3">
                  <RotateCcw className="mr-2" size={16} />
                  Retake
                </Button>
                <Button onClick={usePhoto} className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3">
                  <Camera className="mr-2" size={16} />
                  Use Photo
                </Button>
              </>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraInterface;