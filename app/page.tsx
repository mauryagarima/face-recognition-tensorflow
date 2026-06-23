"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner() {

  const waitForScanRef = useRef(false)
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (waitForScanRef.current) return
        waitForScanRef.current = true
        console.log("QR Code:", decodedText);
        const decodedTextSplitValue = decodedText.split("/")
        const apiRes = await fetch("/api/attendence", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            qr: decodedTextSplitValue[decodedTextSplitValue.length - 1]
          })
        })
        if (apiRes.ok) {
          alert("Attendence marked successfully")
        } else {
          const data = await apiRes.json()
          alert(data.message || "Failed to mark attendence")
        }
        waitForScanRef.current = false

        // Stop after successful scan
        // scanner.clear();
      },
      (error) => {
        // Ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => { });
    };
  }, []);

  return <div id="reader"></div>;
}