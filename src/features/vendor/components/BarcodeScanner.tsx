"use client";
import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X } from "lucide-react";

export default function BarcodeScanner({ onScan, onClose }: { onScan: (text: string) => void, onClose: () => void }) {
  const [error, setError] = useState("");

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    const config = { 
      fps: 15, 
      qrbox: { width: 280, height: 160 },
      aspectRatio: 1.0
    };

    scanner.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        if (scanner.isScanning) {
          scanner.stop().then(() => onScan(decodedText)).catch(console.error);
        }
      },
      (err) => {
        // continuous scanning frame check
      }
    ).catch(err => {
      setError("Camera permission denied or camera not accessible.");
    });

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
        <X size={24} />
      </button>
      <h3 className="text-white font-bold mb-6 flex items-center gap-2">
        <Camera className="text-orange-500" /> Scan Order Barcode
      </h3>
      <div id="reader" className="w-full max-w-sm rounded-3xl overflow-hidden bg-black border-2 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)]"></div>
      {error && <p className="text-red-500 mt-4 text-xs font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{error}</p>}
      <p className="text-white/60 text-[11px] mt-6 text-center max-w-xs">
        Point your camera at the barcode on the shipping label. It will scan automatically.
      </p>
    </div>
  );
}
