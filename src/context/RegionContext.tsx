"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type Region = "IN" | "US" | "GB" | "CA" | "AU" | "AE" | "SA" | "SG" | "EU" | "JP";

interface RegionContextType {
  region: Region;
  currency: string;
  symbol: string;
  setRegion: (region: Region) => void;
  convertPrice: (priceInInr: number) => string;
  convertWeight: (specs: string) => string;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const regionConfigs = {
  IN: { currency: "INR", symbol: "₹", rate: 1.0 },
  US: { currency: "USD", symbol: "$", rate: 1 / 83.5 },
  GB: { currency: "GBP", symbol: "£", rate: 1 / 105.0 },
  CA: { currency: "CAD", symbol: "C$", rate: 1 / 61.0 },
  AU: { currency: "AUD", symbol: "A$", rate: 1 / 55.0 },
  AE: { currency: "AED", symbol: "د.إ", rate: 1 / 22.7 },
  SA: { currency: "SAR", symbol: "SR", rate: 1 / 22.2 },
  SG: { currency: "SGD", symbol: "S$", rate: 1 / 61.5 },
  EU: { currency: "EUR", symbol: "€", rate: 1 / 90.0 },
  JP: { currency: "JPY", symbol: "¥", rate: 1.88 }
};

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region, setRegionState] = useState<Region>("IN");

  useEffect(() => {
    // Check local storage first
    const stored = localStorage.getItem("stopshop_region") as Region;
    if (stored && regionConfigs[stored]) {
      setRegionState(stored);
      return;
    }

    // Try automatic browser detection via timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes("London") || tz.includes("Belfast")) {
        setRegionState("GB");
      } else if (tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Montreal") || tz.includes("Winnipeg")) {
        setRegionState("CA");
      } else if (tz.includes("Sydney") || tz.includes("Melbourne") || tz.includes("Brisbane") || tz.includes("Adelaide") || tz.includes("Perth")) {
        setRegionState("AU");
      } else if (tz.includes("Singapore")) {
        setRegionState("SG");
      } else if (tz.includes("Riyadh") || tz.includes("Jeddah")) {
        setRegionState("SA");
      } else if (tz.includes("America")) {
        setRegionState("US");
      } else if (tz.includes("Europe") || tz.includes("Paris") || tz.includes("Berlin") || tz.includes("Rome") || tz.includes("Madrid") || tz.includes("Amsterdam")) {
        setRegionState("EU");
      } else if (tz.includes("Dubai") || tz.includes("Abu_Dhabi") || tz.includes("Muscat")) {
        setRegionState("AE");
      } else if (tz.includes("Tokyo")) {
        setRegionState("JP");
      } else {
        setRegionState("IN");
      }
    } catch (e) {
      setRegionState("IN");
    }
  }, []);

  const setRegion = (newRegion: Region) => {
    setRegionState(newRegion);
    localStorage.setItem("stopshop_region", newRegion);
  };

  const convertPrice = (priceInInr: number): string => {
    const config = regionConfigs[region] || regionConfigs.IN;
    const converted = Math.round(priceInInr * config.rate);
    
    if (region === "AE") {
      return `${converted.toLocaleString()} ${config.symbol}`;
    }
    return `${config.symbol}${converted.toLocaleString()}`;
  };

  const convertWeight = (specs: string): string => {
    if (!specs) return "";
    
    // If the region is USA, prioritize Pounds (Lbs) unit
    const isUsa = region === "US";
    
    return specs.replace(/(\d+(?:\.\d+)?)\s*(Kg|Gm|Lbs|Ton)/gi, (match, valStr, unit) => {
      const value = parseFloat(valStr);
      if (isNaN(value)) return match;
      
      const lowerUnit = unit.toLowerCase();
      if (isUsa) {
        // Convert Metric to USA units
        if (lowerUnit === "kg") {
          return `${(value * 2.20462).toFixed(1)} Lbs`;
        } else if (lowerUnit === "gm") {
          return `${(value * 0.00220462).toFixed(1)} Lbs`;
        } else if (lowerUnit === "lbs") {
          return `${value} Lbs`;
        } else if (lowerUnit === "ton") {
          return `${(value * 2204.62).toFixed(0)} Lbs`;
        }
      } else {
        // Convert USA units to Metric (for everyone else)
        if (lowerUnit === "lbs") {
          return `${(value * 0.453592).toFixed(1)} Kg`;
        }
      }
      return match;
    });
  };

  return (
    <RegionContext.Provider
      value={{
        region,
        currency: regionConfigs[region].currency,
        symbol: regionConfigs[region].symbol,
        setRegion,
        convertPrice,
        convertWeight
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
};
