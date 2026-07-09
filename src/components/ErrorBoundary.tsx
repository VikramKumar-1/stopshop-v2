"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI if desired,
    // or just render children normally if we are doing "silent telemetry"
    return { hasError: false }; 
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);

    // Send the crash log to our telemetry API (Silent to the user)
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'FRONTEND_CRASH',
        level: 'ERROR',
        message: error.message,
        details: {
           stack: error.stack,
           componentStack: errorInfo.componentStack
        }
      })
    }).catch(e => console.error("Telemetry failure", e));
  }

  public render() {
    // We are doing silent telemetry, so we don't block the UI entirely if we can avoid it.
    // Next.js handles its own error overlays in dev, but in prod this will catch and log them.
    return this.props.children;
  }
}
