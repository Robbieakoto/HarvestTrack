
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScanLine, CameraOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Html5QrcodeScanner, Html5QrcodeScanType, type QrcodeErrorCallback, type QrcodeSuccessCallback } from 'html5-qrcode';

interface QrScannerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const SCANNER_ELEMENT_ID = "html5qr-code-reader";

export default function QrScannerModal({ isOpen, onOpenChange }: QrScannerModalProps) {
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scannerInitializing, setScannerInitializing] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
   // To prevent multiple initializations if the effect runs fast
  const initStartedRef = useRef(false);


  useEffect(() => {
    if (isOpen) {
      setScannerInitializing(true);
      initStartedRef.current = false; // Reset for current modal opening

      const initializeScanner = async () => {
        if (initStartedRef.current) return; // Already trying to init
        initStartedRef.current = true;

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          toast({
            variant: 'destructive',
            title: 'Camera Not Supported',
            description: 'Your browser does not support camera access.',
          });
          setHasCameraPermission(false);
          setScannerInitializing(false);
          initStartedRef.current = false;
          return;
        }

        try {
          // Pre-check permission silently. Html5QrcodeScanner will also request.
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop()); // Important to release this temporary stream
          setHasCameraPermission(true);

          if (document.getElementById(SCANNER_ELEMENT_ID) && !scannerRef.current) {
            const html5QrcodeScanner = new Html5QrcodeScanner(
              SCANNER_ELEMENT_ID,
              {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                rememberLastUsedCamera: true,
              },
              /* verbose= */ false
            );

            const qrCodeSuccessCallback: QrcodeSuccessCallback = (decodedText, decodedResult) => {
              if (scannerRef.current) { // Ensure it's still our active scanner
                toast({
                  title: 'QR Code Scanned!',
                  description: `Data: ${decodedText}`,
                });
                onOpenChange(false); // This will trigger the cleanup in the 'else' block below
              }
            };

            const qrCodeErrorCallback: QrcodeErrorCallback = (errorMessage) => {
              // Log or handle errors. html5-qrcode is often silent for "QR code not found."
              // console.warn(`QR Code scan error: ${errorMessage}`);
            };
            
            html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
            scannerRef.current = html5QrcodeScanner;
          }
        } catch (error) {
          console.error('Error accessing camera or starting scanner:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        } finally {
          setScannerInitializing(false);
          initStartedRef.current = false;
        }
      };

      // Delay slightly to allow modal to render the target div
      const timeoutId = setTimeout(initializeScanner, 100);
      return () => clearTimeout(timeoutId);

    } else {
      // Cleanup when modal is closed (isOpen becomes false)
      if (scannerRef.current) {
        scannerRef.current.clear()
          .catch(error => console.error("Failed to clear html5QrcodeScanner:", error))
          .finally(() => {
            scannerRef.current = null;
            // Ensure the div is clean for next time
            const readerDiv = document.getElementById(SCANNER_ELEMENT_ID);
            if (readerDiv) readerDiv.innerHTML = "";
          });
      }
      setHasCameraPermission(null); // Reset permission status
      setScannerInitializing(false);
      initStartedRef.current = false;
    }

    // This return is for the main effect cleanup (component unmount)
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner on unmount:", error);
        });
        scannerRef.current = null;
      }
      initStartedRef.current = false;
    };
  }, [isOpen, onOpenChange, toast]);

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
          {scannerInitializing && (
            <div className="w-full h-64 bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
              <p>Initializing scanner...</p>
            </div>
          )}

          {!scannerInitializing && hasCameraPermission === false && (
            <Alert variant="destructive" className="w-full">
              <CameraOff className="h-5 w-5" />
              <AlertTitle>Camera Access Denied</AlertTitle>
              <AlertDescription>
                HarvestTrack needs camera access to scan QR codes. 
                Please enable camera permissions for this site in your browser settings and try again.
              </AlertDescription>
            </Alert>
          )}
          
          {/* The div for Html5QrcodeScanner to attach to */}
          {/* Render this div even if permission is not yet granted or denied, so it's there when needed */}
          <div id={SCANNER_ELEMENT_ID} className={`w-full aspect-square max-h-[400px] rounded-md ${hasCameraPermission === true && !scannerInitializing ? 'block' : 'hidden'}`}>
            {/* Html5QrcodeScanner will render its UI here */}
          </div>
           {!scannerInitializing && hasCameraPermission === null && !isOpen && (
             <div className="w-full h-64 bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                <p>Ready to scan when opened.</p>
            </div>
           )}
            {!scannerInitializing && hasCameraPermission === null && isOpen && (
             <div className="w-full h-64 bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                <p>Requesting camera permission...</p>
            </div>
           )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
