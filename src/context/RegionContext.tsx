"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type Region = string;

interface RegionContextType {
  region: Region;
  isLoaded: boolean;
  currency: string;
  symbol: string;
  setRegion: (region: Region) => void;
  convertPrice: (priceInInr: number, product?: any, isMrp?: boolean, targetRegion?: string) => string;
  formatPrice: (value: number, targetRegion?: string) => string;
  getRawPrice: (priceInInr: number, product?: any, isMrp?: boolean, targetRegion?: string) => number;
  convertWeight: (specs: string) => string;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

import { currencyDatabase } from "@/lib/currencyData";
export { currencyDatabase };

export const RegionProvider: React.FC<{ children: React.ReactNode; initialRegion?: string }> = ({ children, initialRegion = "IN" }) => {
  const [region, setRegionState] = useState<Region>(initialRegion);
  const [isLoaded, setIsLoaded] = useState<boolean>(true); // Start as true to prevent flicker since we have server-side region
  const [rates, setRates] = useState<Record<string, number>>({});

  // Fetch live exchange rates relative to INR on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/INR");
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates) {
            setRates(data.rates);
          }
        }
      } catch (e) {
        console.error("Live exchange rates fetch error:", e);
      }
    };
    fetchRates();
  }, []);

  const setRegion = (newRegion: Region) => {
    setRegionState(newRegion);
    localStorage.setItem("stopshop_region", newRegion);
    document.cookie = `stopshop_region=${newRegion}; path=/; max-age=31536000`;
  };

  const normalizeRegion = (raw?: string): string => {
    if (!raw) return region;
    const clean = raw.trim().toUpperCase();
    const map: Record<string, string> = {
      "UNITED STATES": "US", "USA": "US",
      "UNITED KINGDOM": "GB", "UK": "GB", "GREAT BRITAIN": "GB",
      "UNITED ARAB EMIRATES": "AE", "UAE": "AE",
      "CANADA": "CA", "AUSTRALIA": "AU", "SAUDI ARABIA": "SA",
      "SINGAPORE": "SG", "JAPAN": "JP", "INDIA": "IN"
    };
    return map[clean] || clean;
  };

  const getRawPrice = (priceInInr: number, product?: any, isMrp?: boolean, targetRegion?: string): number => {
    const activeRegion = normalizeRegion(targetRegion);
    if (product) {
      let pricesObj: any = null;
      if (product.prices) {
        if (typeof product.prices === "string") {
          try {
            pricesObj = JSON.parse(product.prices);
          } catch (e) {}
        } else {
          pricesObj = product.prices;
        }
      }
      const targetConfig = pricesObj ? (pricesObj[activeRegion] || pricesObj[targetRegion || ""]) : null;
      if (targetConfig && targetConfig.mrp !== undefined) {
        const customMrp = parseFloat(targetConfig.mrp);
        if (!isNaN(customMrp)) {
          if (isMrp) {
            return customMrp;
          } else {
            const regDiscountVal = targetConfig.discount;
            const discount = (regDiscountVal !== undefined && regDiscountVal !== null && regDiscountVal !== "")
              ? parseFloat(regDiscountVal)
              : (parseFloat(product.discount) || 0);
            return customMrp - (customMrp * discount / 100);
          }
        }
      }
    }
    const defaultRates: Record<string, number> = {
      INR: 1.0,
      USD: 1 / 96.0,
      EUR: 1 / 104.0,
      GBP: 1 / 120.0,
      AED: 1 / 26.0,
      CAD: 1 / 70.0,
      AUD: 1 / 62.0,
      SAR: 1 / 25.5,
      SGD: 1 / 71.0,
      JPY: 0.62
    };
    const config = currencyDatabase[activeRegion] || { c: "USD" };
    const rate = rates[config.c] || defaultRates[config.c] || 1 / 96.0;
    return Math.round(priceInInr * rate);
  };

  const formatPrice = (value: number, targetRegion?: string): string => {
    const activeRegion = normalizeRegion(targetRegion);
    const config = currencyDatabase[activeRegion] || { c: "USD", s: "$" };
    const formatted = value % 1 === 0 ? value.toLocaleString() : value.toFixed(2);
    if (config.p === "suffix") {
      return `${formatted} ${config.s}`;
    }
    return `${config.s}${formatted}`;
  };

  const convertPrice = (priceInInr: number, product?: any, isMrp?: boolean, targetRegion?: string): string => {
    const rawPrice = getRawPrice(priceInInr, product, isMrp, targetRegion);
    return formatPrice(rawPrice, targetRegion);
  };

  const convertWeight = (specs: string): string => {
    if (!specs) return "";
    const isUsa = region === "US";
    
    return specs.replace(/(\d+(?:\.\d+)?)\s*(Kg|Gm|Lbs|Ton)/gi, (match, valStr, unit) => {
      const value = parseFloat(valStr);
      if (isNaN(value)) return match;
      
      const lowerUnit = unit.toLowerCase();
      if (isUsa) {
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
        isLoaded,
        currency: (currencyDatabase[region] || { c: "USD" }).c,
        symbol: (currencyDatabase[region] || { s: "$" }).s,
        setRegion,
        convertPrice,
        formatPrice,
        getRawPrice,
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
