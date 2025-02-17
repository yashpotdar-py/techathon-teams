"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import "@/app/globals.css";

export default function Home() {
  const router = useRouter();
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.classList.add("fade-in");
    }
  }, []);

  const handleGridClick = () => {
    if (headingRef.current) {
      headingRef.current.classList.add('grow-and-fade');
      setTimeout(() => {
        router.push("/grid");
      }, 900); // Slightly before animation ends
    }
  };

  return (
    <div className="home-container">
      <div className="welcome-text">Welcome To</div>
      <div className="main-heading" ref={headingRef} onClick={handleGridClick}>
        Techathon <span className="highlight">2.0</span>
      </div>
      <div className="button-container">
        <Link href="/teamStatus">
          <button className="status-button">Check Team Status</button>
        </Link>
      </div>
    </div>
  );
}
