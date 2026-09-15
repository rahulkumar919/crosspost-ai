"use client";
/**
 * Root landing page wrapper.
 * LandingPage is loaded with ssr:false to prevent hydration mismatches
 * caused by browser extensions (e.g. Foxified) injecting DOM nodes.
 */
import dynamic from "next/dynamic";

const LandingPage = dynamic(() => import("./landing"), { ssr: false });

export default function Page() {
  return <LandingPage />;
}
