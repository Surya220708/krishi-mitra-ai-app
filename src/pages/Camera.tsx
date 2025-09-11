import { useState, useRef, useCallback, useEffect } from "react";
import { Camera as CameraIcon, Upload, Scan, AlertTriangle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/ui/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import farmerPhone from "@/assets/farmer-phone.jpg";

interface DetectionResult {
  disease: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  remedy: string;
  prevention: string;
}

const Camera = () => {
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleScan = () => {
    setIsScanning(true);
    setResult(null);
    
    // Simulate scanning process
    setTimeout(() => {
      setResult({
        disease: "Leaf Blight",
        confidence: 92,
        severity: "Medium",
        remedy: "Apply copper fungicide spray every 7-10 days. Remove affected leaves immediately.",
        prevention: "Ensure proper spacing between plants, avoid overhead watering, and use resistant varieties."
      });
      setIsScanning(false);
    }, 3000);
  };

  const handleUpload = () => {
    // Simulate file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files?.[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          setCapturedImage(e.target?.result as string);
          handleScan();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        handleScan();
      }
    }
  }, [stopCamera]);

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-golden to-golden/80 text-golden-foreground p-6 pt-12">
        <h1 className="text-2xl font-bold mb-2 animate-fade-in">{t('camera.title')}</h1>
        <p className="text-golden-foreground/90">
          {t('camera.subtitle')}
        </p>
      </div>

      <div className="px-6 py-6">
        {!showCamera && !result && !isScanning && (
          <>
            {/* Scan Options */}
            <div className="grid gap-4 mb-8">
              <Button 
                onClick={startCamera}
                className="btn-hero h-16 text-lg animate-slide-up"
              >
                <CameraIcon size={24} className="mr-3" />
                Open Camera
              </Button>
              
              <Button 
                onClick={handleUpload}
                variant="outline"
                className="h-16 text-lg border-2 border-primary text-primary hover:bg-primary/10 animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <Upload size={24} className="mr-3" />
                Upload from Gallery
              </Button>
            </div>

            {/* Instructions */}
            <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Scan className="text-primary" size={20} />
                How to get best results
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">1</span>
                  </div>
                  <p>Take a clear, well-lit photo of the affected leaf or plant part</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">2</span>
                  </div>
                  <p>Ensure the diseased area is clearly visible and in focus</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">3</span>
                  </div>
                  <p>Avoid shadows and capture from multiple angles if needed</p>
                </div>
              </div>
            </Card>

            {/* Example Image */}
            <Card className="card-farm mt-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <h4 className="font-semibold mb-3">Example scan:</h4>
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={farmerPhone} 
                  alt="Example crop scan" 
                  className="w-full h-40 object-cover"
                />
              </div>
            </Card>
          </>
        )}

        {showCamera && !isScanning && !result && (
          <div className="space-y-6">
            {/* Camera Interface */}
            <Card className="card-farm">
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Camera overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 border-2 border-white/50 rounded-lg">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                    Focus on affected crop area
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={capturePhoto}
                  className="btn-hero animate-pulse-glow"
                >
                  <CameraIcon size={20} className="mr-2" />
                  Capture Photo
                </Button>
                
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  className="px-6"
                >
                  <X size={20} className="mr-2" />
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {isScanning && (
          <div className="space-y-6 animate-slide-up">
            {/* Show captured image during analysis */}
            {capturedImage && (
              <Card className="card-farm">
                <h4 className="font-semibold mb-3">Captured Image:</h4>
                <div className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src={capturedImage} 
                    alt="Captured crop" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              </Card>
            )}
            
            <Card className="card-farm text-center">
              <div className="py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scan className="text-primary animate-spin" size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Analyzing your crop...</h3>
                <p className="text-muted-foreground">
                  Our AI is examining the image for diseases and pests
                </p>
                
                <div className="flex justify-center mt-6">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-slide-up">
            {/* Detection Result */}
            <Card className="card-farm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <h3 className="font-bold text-lg">Detection Complete</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.confidence}% confidence
                  </p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-red-800">{result.disease}</h4>
                  <Badge className={getSeverityColor(result.severity)}>
                    {result.severity} Risk
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Treatment */}
            <Card className="card-farm">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="text-golden" size={20} />
                Immediate Treatment
              </h4>
              <div className="bg-golden/10 border border-golden/30 rounded-lg p-4">
                <p className="text-sm leading-relaxed">{result.remedy}</p>
              </div>
            </Card>

            {/* Prevention */}
            <Card className="card-farm">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <CheckCircle className="text-primary" size={20} />
                Future Prevention
              </h4>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-sm leading-relaxed">{result.prevention}</p>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setResult(null);
                  setShowCamera(false);
                }}
                className="btn-hero flex-1"
              >
                Scan Another
              </Button>
              
              <Button
                variant="outline"
                className="px-6 border-2 border-primary text-primary hover:bg-primary/10"
              >
                Save Result
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Camera;