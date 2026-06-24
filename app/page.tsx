"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Link from "next/link";

export default function QRScanner() {
  const waitForScanRef = useRef(false);

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
        if (waitForScanRef.current) return;
        waitForScanRef.current = true;
        console.log("QR Code:", decodedText);
        const decodedTextSplitValue = decodedText.split("/");
        const apiRes = await fetch("/api/attendence", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qr: decodedTextSplitValue[decodedTextSplitValue.length - 1],
          }),
        });
        if (apiRes.ok) {
          alert("Attendance marked successfully");
        } else {
          const data = await apiRes.json();
          alert(data.message || "Failed to mark attendance");
        }
        waitForScanRef.current = false;

        // Stop after successful scan
        // scanner.clear();
      },
      () => {
        // Ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">
        <Link className="home-logo" href="/" aria-label="ISTS Services home">
          <span className="home-logo-mark">IS</span>
          <span className="home-logo-copy">
            <strong>ISTS</strong>
            <span>Services</span>
          </span>
        </Link>

        <Link className="home-signin" href="/signin">
          Sign in
        </Link>
      </header>

      <main className="home-main">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero-copy">
            <p className="home-kicker">Smart attendance</p>
            <h1 id="home-title">Scan student QR codes in seconds.</h1>
            <p>
              Use the camera scanner below to mark attendance quickly and keep
              classroom records moving without extra paperwork.
            </p>
          </div>

          <div className="home-status-panel" aria-label="Attendance summary">
            <div>
              <span>Today</span>
              <strong>Live scan ready</strong>
            </div>
            <div>
              <span>Mode</span>
              <strong>QR attendance</strong>
            </div>
          </div>
        </section>

        <section className="scanner-section" aria-labelledby="scanner-title">
          <div className="scanner-heading">
            <div>
              <p className="home-kicker">Camera scanner</p>
              <h2 id="scanner-title">Place the QR code inside the frame</h2>
            </div>
            <span className="scanner-badge">Ready</span>
          </div>

          <div className="scanner-shell">
            <div id="reader"></div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div>Copyright © 2026</div>
        <nav aria-label="Legal links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-use">Terms of Use</Link>
        </nav>
      </footer>
    </div>
  );
}
