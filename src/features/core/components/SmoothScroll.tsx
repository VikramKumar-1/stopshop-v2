"use client";
import React from "react";

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  // Completely removed Lenis smooth scrolling for buttery-smooth native hardware-accelerated 60/120FPS scroll
  return <>{children}</>;
};
