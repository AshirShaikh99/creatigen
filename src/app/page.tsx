"use client";

import { useState } from "react";
import { LandingPage as MainLandingPage } from "@/components/MainLandingPage";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = () => {
    setIsSignedIn(true);
  };

  return <MainLandingPage />;
}
