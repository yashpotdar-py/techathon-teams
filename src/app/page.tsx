"use client";
// import Link from "next/link";
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
      headingRef.current.classList.remove('fade-in'); // Remove any existing animations
      headingRef.current.classList.add('grow-and-fade');
      setTimeout(() => {
        router.push("/grid");
      }, 1000); // Match the animation duration
    }
  };

  return (
    <div className="home-container">
      <div className="welcome-text">Welcome To</div>
      <div 
        className="main-heading" 
        ref={headingRef} 
        onClick={handleGridClick}
      >
        Techathon <span className="highlight">2.0</span>
      </div>
    </div>
  );
}
