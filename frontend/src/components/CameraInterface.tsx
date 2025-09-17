import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, RotateCcw, Zap, RefreshCw, Smartphone, Monitor } from 'lucide-react';

interface CameraInterfaceProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraInterface: React.FC<CameraInterfaceProps> = ({ onCapture, onClose }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini'];
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
             ('ontouchstart' in window) || 
             (navigator.maxTouchPoints > 0);
    };
    setIsMobile(checkMobile());
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Auto-start with FRONT camera for a simple UX (flip icon toggles to back)
  useEffect(() => {
    if (!isStreaming && !capturedImage) {
      const timer = setTimeout(() => startCameraWithMode('user'), 250);
      return () => clearTimeout(timer);
    }
  }, [isMobile, isStreaming, capturedImage]);

  const enumerateDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      setVideoDevices(videoInputs);
      return videoInputs;
    } catch (error) {
      console.error('Error enumerating devices:', error);
      return [];
    }
  };

  const startCamera = async (preferredFacingMode?: 'environment' | 'user') => {
    const mode = preferredFacingMode || facingMode;
    
    const tryStartStream = async (constraints: MediaStreamConstraints) => {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.log('Video play error (usually safe to ignore):', playError);
        }
      }
      return stream;
    };

    try {
      // Strategy 1: Try with exact facingMode (works well on mobile)
      try {
        await tryStartStream({
          video: {
            facingMode: mode === 'environment' ? { exact: 'environment' } : { exact: 'user' },
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 }
          }
        });
        setFacingMode(mode);
        return;
      } catch (exactError) {
        console.log('Exact facingMode failed, trying ideal:', exactError);
      }

      // Strategy 2: Try with ideal facingMode
      try {
        await tryStartStream({
          video: {
            facingMode: mode === 'environment' ? { ideal: 'environment' } : { ideal: 'user' },
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 }
          }
        });
        setFacingMode(mode);
        return;
      } catch (idealError) {
        console.log('Ideal facingMode failed, enumerating devices:', idealError);
      }

      // Strategy 3: Enumerate devices and select appropriate one
      const devices = await enumerateDevices();
      if (devices.length > 0) {
        // For back camera, prefer devices with "back", "rear", "environment" in label
        // For front camera, prefer devices with "front", "user", "facing" in label
        let targetDevice;
        
        if (mode === 'environment') {
          targetDevice = devices.find(d => 
            /back|rear|environment|camera 0/i.test(d.label)
          ) || devices[devices.length - 1]; // Last device is often back camera
        } else {
          targetDevice = devices.find(d => 
            /front|user|facing|selfie|camera 1/i.test(d.label)
          ) || devices[0]; // First device is often front camera
        }

        if (targetDevice) {
          await tryStartStream({
            video: {
              deviceId: { exact: targetDevice.deviceId },
              width: { ideal: 1920, min: 640 },
              height: { ideal: 1080, min: 480 }
            }
          });
          setSelectedDeviceId(targetDevice.deviceId);
          setFacingMode(mode);
          return;
        }
      }

      // Strategy 4: Fallback to any available camera
      await tryStartStream({
        video: {
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 }
        }
      });
      
    } catch (error: any) {
      console.error('Camera error:', error);
      let errorMessage = 'Unable to access camera';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please ensure a camera is connected.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not supported. Trying different settings...';
      }
      
      // Show error to user (you might want to implement a proper toast/notification system)
      alert(errorMessage);
    }
  };

  const startCameraWithMode = async (mode: 'environment' | 'user') => {
    // Stop current stream if running
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    
    // Start with new mode
    await startCamera(mode);
  };

  const startCameraWithDevice = async (deviceId: string) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setSelectedDeviceId(deviceId);
        
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.log('Video play error (usually safe to ignore):', playError);
        }
      }
    } catch (error: any) {
      console.error('Device switch error:', error);
      alert(`Failed to switch camera: ${error.message || 'Unknown error'}`);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 with good quality
        const imageData = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(imageData);
        
        // Stop the video stream after capture
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        setIsStreaming(false);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setZoom(1);
    setRotation(0);
    // Restart camera with the last used mode
    startCameraWithMode(facingMode);
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

  const switchCamera = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    await startCameraWithMode(nextMode);
  };

  const rotatePreview = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const cropAndUse = async () => {
    if (!capturedImage || !canvasRef.current) return;
    
    const img = new Image();
    img.src = capturedImage;
    
    await new Promise((resolve) => {
      img.onload = () => resolve(null);
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set output dimensions
    const outputWidth = 1280;
    const outputHeight = 720;
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Clear canvas
    ctx.clearRect(0, 0, outputWidth, outputHeight);
    
    // Apply transformations
    ctx.save();
    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-outputWidth / 2, -outputHeight / 2);

    // Calculate source rectangle with zoom
    const sourceWidth = img.width / zoom;
    const sourceHeight = img.height / zoom;
    const sourceX = (img.width - sourceWidth) / 2;
    const sourceY = (img.height - sourceHeight) / 2;

    // Draw the cropped and transformed image
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, outputWidth, outputHeight
    );
    
    ctx.restore();

    const processedImage = canvas.toDataURL('image/jpeg', 0.9);
    onCapture(processedImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-4xl bg-background border-2 border-emerald-500 max-h-[95vh] overflow-auto">
        <CardContent className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Camera size={24} />
              Scan Ingredient Label
              {isMobile && <Smartphone size={16} className="text-emerald-500" />}
            </h3>
            <Button onClick={stopCamera} variant="ghost" size="sm">
              <X size={20} />
            </Button>
          </div>

            {/* Camera View */}
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
            {/* Initial state - brief initializing overlay */}
            {!isStreaming && !capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <Camera size={48} className="mb-2 opacity-60" />
                <p className="text-sm opacity-80">Initializing camera…</p>
              </div>
            )}

            {/* Streaming state */}
            {isStreaming && !capturedImage && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-emerald-500 w-72 sm:w-80 h-40 sm:h-48 rounded-lg relative bg-emerald-500/5">
                    {/* Corner markers */}
                    <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-4 border-t-4 border-emerald-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-4 border-t-4 border-emerald-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-4 border-b-4 border-emerald-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-4 border-b-4 border-emerald-400"></div>
                    
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-emerald-400 text-xs sm:text-sm font-medium bg-black/50 px-2 py-1 rounded">
                        Ingredient List
                      </span>
                    </div>
                  </div>
                </div>

                {/* Small flip icon (like ChatGPT) */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={switchCamera}
                    className="h-9 w-9 rounded-full bg-black/40 hover:bg-black/55 text-white flex items-center justify-center backdrop-blur-sm"
                    aria-label="Flip camera"
                    title="Flip camera"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>

                {/* Bottom instruction */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row items-center gap-2">
                  <p className="text-white text-xs sm:text-sm bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm text-center">
                    Align ingredient list within the frame
                  </p>
                  <Button 
                    onClick={switchCamera} 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white/20 text-white hover:bg-white/30 text-xs"
                  >
                    <RefreshCw size={14} className="mr-1" />
                    Switch
                  </Button>
                </div>
              </>
            )}

            {/* Captured image preview */}
            {capturedImage && (
              <>
                <img
                  src={capturedImage}
                  alt="Captured ingredient label"
                  className="w-full h-full object-contain transition-transform duration-200"
                  style={{ 
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                />
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs rounded-md px-2 py-1 backdrop-blur-sm">
                  Preview • Zoom: {zoom.toFixed(1)}x • Rotation: {rotation}°
                </div>
              </>
            )}
          </div>

          {/* Control buttons */}
          <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
            {isStreaming && !capturedImage && (
              <>
                {/* Capture button only */}
                <Button 
                  onClick={captureImage}
                  className="bg-emerald-500 hover:bg-emerald-600 px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold"
                >
                  <Zap className="mr-2" size={20} />
                  Capture Label
                </Button>
              </>
            )}

            {capturedImage && (
              <>
                {/* Retake button */}
                <Button 
                  onClick={retakePhoto} 
                  variant="outline" 
                  className="px-4 sm:px-6 py-2 sm:py-3"
                >
                  <RotateCcw className="mr-2" size={16} />
                  Retake
                </Button>
                
                {/* Zoom control */}
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-background">
                  <label className="text-sm font-medium">Zoom:</label>
                  <input 
                    type="range" 
                    min={0.5} 
                    max={3} 
                    step={0.1} 
                    value={zoom} 
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-20 sm:w-24"
                  />
                  <span className="text-xs text-gray-600 w-8">{zoom.toFixed(1)}x</span>
                </div>
                
                {/* Rotate button */}
                <Button 
                  onClick={rotatePreview} 
                  variant="secondary" 
                  className="px-4 sm:px-6 py-2 sm:py-3"
                >
                  <RotateCcw className="mr-2" size={16} />
                  Rotate
                </Button>
                
                {/* Use photo button */}
                <Button 
                  onClick={cropAndUse} 
                  className="bg-emerald-500 hover:bg-emerald-600 px-4 sm:px-6 py-2 sm:py-3"
                >
                  <Camera className="mr-2" size={16} />
                  Use Photo
                </Button>
              </>
            )}
          </div>

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraInterface;