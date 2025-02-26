"use client";

import { useState } from "react";
import { MainLandingPage } from "@/components/MainLandingPage";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  if (isSignedIn) {
    return <Dashboard />;
  }

  return <MainLandingPage onSignIn={() => setIsSignedIn(true)} />;
}
