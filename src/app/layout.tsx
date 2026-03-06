"use client";

// import type { Metadata } from "next";
import "./globals.css";
import React, { useEffect } from "react";
import ReactGA from 'react-ga4';
const TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;


console.log("[CLIENT COMPONENT LOG] NEXT_PUBLIC_GA_MEASUREMENT_ID:", TRACKING_ID);



// export const metadata: Metadata = {
//   title: "Grocery Shopping Feedback",
//   description: "Grocery shopping feedback and analysis application",
// };


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // This code block will ONLY run on the client-side after the component mounts
    if (TRACKING_ID) {
      try {
        ReactGA.initialize(TRACKING_ID);
        console.log("[CLIENT-SIDE LOG] Google Analytics initialized with ID:", TRACKING_ID);

        // Optional: Send an initial pageview after initialization
        // ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });

      } catch (error) {
        console.error("[CLIENT-SIDE LOG] Error initializing Google Analytics:", error);
      }
    } else {
      console.warn("[CLIENT-SIDE LOG] Google Analytics Tracking ID is not set in the browser. Tracking will be disabled.");
    }
  }, []); // The empty dependency array [] means this useEffect runs once when the component mounts client-side

  return (
    <html lang="en">
      {/*
        You can add <head> elements here if needed, but for GA,
        react-ga4 handles script injection.
        If you had other <head> items from the original layout,
        ensure they are still handled appropriately.
        The standard Next.js <Head> component from 'next/head' is for the Pages Router.
        In App Router, <head> tags are usually co-located with `metadata` or in the `<html>` tag.
      */}
      <body>{children}</body>
    </html>
  );
}