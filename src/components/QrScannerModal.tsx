"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanLine, CameraOff } from "lucide-react";
import Image from "next/image";

interface QrScannerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function QrScannerModal({ isOpen, onOpenChange }: QrScannerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <ScanLine className="h-6 w-6 text-primary" />
            Scan Produce QR Code
          </DialogTitle>
          <DialogDescription>
            Position the QR code within the frame. Scanning will update the produce checkpoint.
          </DialogDescription>
        </DialogHeader>
        <div className="my-6 flex flex-col items-center justify-center gap-4">
          <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Placeholder for camera feed */}
            <Image 
              src="https://placehold.co/400x300.png" // Generic placeholder
              alt="QR Scanner Placeholder"
              layout="fill"
              objectFit="cover"
              data-ai-hint="camera view"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                <CameraOff className="h-16 w-16 text-white/70 mb-2" />
                <p className="text-white/90 text-sm">Camera Access Required</p>
                <p className="text-white/70 text-xs">(This is a placeholder)</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            QR scanning functionality is not implemented in this demo.
          </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => {
            // Mock scan action
            alert("Mock QR Scan: Checkpoint Updated!");
            onOpenChange(false);
          }}>
            Simulate Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
