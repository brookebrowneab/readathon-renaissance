import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, X, Loader2, SwitchCamera } from "lucide-react";
import { toast } from "sonner";

interface BarcodeScannerProps {
  onScan: (isbn: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onScan, onClose }: BarcodeScannerProps) => {
  const [isStarting, setIsStarting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(false);
  const isMountedRef = useRef(true);

  const stopScanner = async () => {
    if (scannerRef.current && isRunningRef.current) {
      try {
        isRunningRef.current = false;
        await scannerRef.current.stop();
      } catch (e) {
        // Scanner may already be stopped - ignore
        console.debug("Scanner stop ignored:", e);
      }
    }
  };

  const startScanner = async () => {
    if (!containerRef.current || !isMountedRef.current) return;

    try {
      setIsStarting(true);
      setError(null);

      // Stop existing scanner if running
      await stopScanner();

      const scanner = new Html5Qrcode("barcode-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode },
        {
          fps: 10,
          qrbox: { width: 250, height: 100 },
          aspectRatio: 1.5,
        },
        (decodedText) => {
          // Check if it looks like an ISBN (10 or 13 digits)
          const cleanCode = decodedText.replace(/[-\s]/g, '');
          if (/^(97[89])?\d{9}[\dXx]$/.test(cleanCode)) {
            isRunningRef.current = false;
            scanner.stop().then(() => {
              if (isMountedRef.current) {
                onScan(cleanCode);
              }
            }).catch(() => {});
          }
        },
        () => {
          // Ignore scan failures - they happen constantly while searching
        }
      );

      isRunningRef.current = true;
      if (isMountedRef.current) {
        setIsStarting(false);
      }
    } catch (err) {
      console.error("Scanner error:", err);
      isRunningRef.current = false;
      if (isMountedRef.current) {
        setError("Couldn't access camera. Please check permissions.");
        setIsStarting(false);
      }
    }
  };

  const toggleCamera = async () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  useEffect(() => {
    isMountedRef.current = true;
    startScanner();

    return () => {
      isMountedRef.current = false;
      stopScanner();
    };
  }, [facingMode]);

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 bg-gradient-to-b from-black/70 to-transparent">
          <span className="text-white text-sm font-medium">Scan book barcode</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={toggleCamera}
            >
              <SwitchCamera className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scanner container */}
        <div
          id="barcode-reader"
          ref={containerRef}
          className="w-full min-h-[300px] bg-black"
        />

        {/* Loading overlay */}
        {isStarting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-white">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm">Starting camera...</p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4">
            <div className="text-center text-white">
              <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm mb-3">{error}</p>
              <Button variant="secondary" size="sm" onClick={startScanner}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Scan guide */}
        {!isStarting && !error && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white text-xs text-center">
              Point at the barcode on the back of the book
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
