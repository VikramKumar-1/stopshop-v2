"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type Region = string;

interface RegionContextType {
  region: Region;
  currency: string;
  symbol: string;
  setRegion: (region: Region) => void;
  convertPrice: (priceInInr: number) => string;
  convertWeight: (specs: string) => string;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

// ISO 3166-1 Alpha-2 to Currency Code and Symbol Database for 190+ countries
export const currencyDatabase: Record<string, { c: string; s: string; p?: "suffix" }> = {
  AF: { c: "AFN", s: "؋" }, AL: { c: "ALL", s: "Lek" }, DZ: { c: "DZD", s: "د.ج" }, AD: { c: "EUR", s: "€" }, AO: { c: "AOA", s: "Kz" },
  AG: { c: "XCD", s: "$" }, AR: { c: "ARS", s: "$" }, AM: { c: "AMD", s: "֏" }, AU: { c: "AUD", s: "A$" }, AT: { c: "EUR", s: "€" },
  AZ: { c: "AZN", s: "₼" }, BS: { c: "BSD", s: "$" }, BH: { c: "BHD", s: "د.ب" }, BD: { c: "BDT", s: "৳" }, BB: { c: "BBD", s: "$" },
  BY: { c: "BYN", s: "Br" }, BE: { c: "EUR", s: "€" }, BZ: { c: "BZD", s: "$" }, BJ: { c: "XOF", s: "CFA" }, BT: { c: "BTN", s: "Nu." },
  BO: { c: "BOB", s: "Bs." }, BA: { c: "BAM", s: "KM" }, BW: { c: "BWP", s: "P" }, BR: { c: "BRL", s: "R$" }, BN: { c: "BND", s: "$" },
  BG: { c: "BGN", s: "лв" }, BF: { c: "XOF", s: "CFA" }, BI: { c: "BIF", s: "FBu" }, KH: { c: "KHR", s: "៛" }, CM: { c: "XAF", s: "FCFA" },
  CA: { c: "CAD", s: "C$" }, CV: { c: "CVE", s: "Esc" }, CF: { c: "XAF", s: "FCFA" }, TD: { c: "XAF", s: "FCFA" }, CL: { c: "CLP", s: "$" },
  CN: { c: "CNY", s: "¥" }, CO: { c: "COP", s: "$" }, KM: { c: "KMF", s: "CF" }, CD: { c: "CDF", s: "FC" }, CG: { c: "XAF", s: "FCFA" },
  CR: { c: "CRC", s: "₡" }, HR: { c: "EUR", s: "€" }, CU: { c: "CUP", s: "$" }, CY: { c: "EUR", s: "€" }, CZ: { c: "CZK", s: "Kč" },
  DK: { c: "DKK", s: "kr" }, DJ: { c: "DJF", s: "Fdj" }, DM: { c: "XCD", s: "$" }, DO: { c: "DOP", s: "$" }, EC: { c: "USD", s: "$" },
  EG: { c: "EGP", s: "E£" }, SV: { c: "USD", s: "$" }, GQ: { c: "XAF", s: "FCFA" }, ER: { c: "ERN", s: "Nfk" }, EE: { c: "EUR", s: "€" },
  SZ: { c: "SZL", s: "L" }, ET: { c: "ETB", s: "Br" }, FJ: { c: "FJD", s: "$" }, FI: { c: "EUR", s: "€" }, FR: { c: "EUR", s: "€" },
  GA: { c: "XAF", s: "FCFA" }, GM: { c: "GMD", s: "D" }, GE: { c: "GEL", s: "₾" }, DE: { c: "EUR", s: "€" }, GH: { c: "GHS", s: "₵" },
  GR: { c: "EUR", s: "€" }, GD: { c: "XCD", s: "$" }, GT: { c: "GTQ", s: "Q" }, GN: { c: "GNF", s: "FG" }, GW: { c: "XOF", s: "CFA" },
  GY: { c: "GYD", s: "$" }, HT: { c: "HTG", s: "G" }, HN: { c: "HNL", s: "L" }, HK: { c: "HKD", s: "HK$" }, HU: { c: "HUF", s: "Ft" },
  IS: { c: "ISK", s: "kr" }, IN: { c: "INR", s: "₹" }, ID: { c: "IDR", s: "Rp" }, IR: { c: "IRR", s: "﷼" }, IQ: { c: "IQD", s: "د.ع" },
  IE: { c: "EUR", s: "€" }, IL: { c: "ILS", s: "₪" }, IT: { c: "EUR", s: "€" }, JM: { c: "JMD", s: "$" }, JP: { c: "JPY", s: "¥" },
  JO: { c: "JOD", s: "د.ا" }, KZ: { c: "KZT", s: "₸" }, KE: { c: "KES", s: "KSh" }, KI: { c: "AUD", s: "$" }, KP: { c: "KPW", s: "₩" },
  KR: { c: "KRW", s: "₩" }, KW: { c: "KWD", s: "د.ك" }, KG: { c: "KGS", s: "сом" }, LA: { c: "LAK", s: "₭" }, LV: { c: "EUR", s: "€" },
  LB: { c: "LBP", s: "L£" }, LS: { c: "LSL", s: "L" }, LR: { c: "LRD", s: "$" }, LY: { c: "LYD", s: "ل.د" }, LI: { c: "CHF", s: "CHF" },
  LT: { c: "EUR", s: "€" }, LU: { c: "EUR", s: "€" }, MG: { c: "MGA", s: "Ar" }, MW: { c: "MWK", s: "MK" }, MY: { c: "MYR", s: "RM" },
  MV: { c: "MVR", s: "Rf" }, ML: { c: "XOF", s: "CFA" }, MT: { c: "EUR", s: "€" }, MH: { c: "USD", s: "$" }, MR: { c: "MRU", s: "UM" },
  MU: { c: "MUR", s: "₨" }, MX: { c: "MXN", s: "$" }, FM: { c: "USD", s: "$" }, MD: { c: "MDL", s: "L" }, MC: { c: "EUR", s: "€" },
  MN: { c: "MNT", s: "₮" }, ME: { c: "EUR", s: "€" }, MA: { c: "MAD", s: "د.م." }, MZ: { c: "MZN", s: "MT" }, MM: { c: "MMK", s: "K" },
  NA: { c: "NAD", s: "$" }, NR: { c: "AUD", s: "$" }, NP: { c: "NPR", s: "₨" }, NL: { c: "EUR", s: "€" }, NZ: { c: "NZD", s: "NZ$" },
  NI: { c: "NIO", s: "C$" }, NE: { c: "XOF", s: "CFA" }, NG: { c: "NGN", s: "₦" }, MK: { c: "MKD", s: "ден" }, NO: { c: "NOK", s: "kr" },
  OM: { c: "OMR", s: "ر.ع." }, PK: { c: "PKR", s: "₨" }, PW: { c: "USD", s: "$" }, PS: { c: "ILS", s: "₪" }, PA: { c: "PAB", s: "B/." },
  PG: { c: "PGK", s: "K" }, PY: { c: "PYG", s: "₲" }, PE: { c: "PEN", s: "S/." }, PH: { c: "PHP", s: "₱" }, PL: { c: "PLN", s: "zł" },
  PT: { c: "EUR", s: "€" }, QA: { c: "QAR", s: "ر.ق" }, RO: { c: "RON", s: "lei" }, RU: { c: "RUB", s: "₽" }, RW: { c: "RWF", s: "FRw" },
  KN: { c: "XCD", s: "$" }, LC: { c: "XCD", s: "$" }, VC: { c: "XCD", s: "$" }, WS: { c: "WST", s: "T" }, SM: { c: "EUR", s: "€" },
  ST: { c: "STN", s: "Db" }, SA: { c: "SAR", s: "SR", p: "suffix" }, SN: { c: "XOF", s: "CFA" }, RS: { c: "RSD", s: "дин." },
  SC: { c: "SCR", s: "₨" }, SL: { c: "SLL", s: "Le" }, SG: { c: "SGD", s: "S$" }, SK: { c: "EUR", s: "€" }, SI: { c: "EUR", s: "€" },
  SB: { c: "SBD", s: "$" }, SO: { c: "SOS", s: "S" }, ZA: { c: "ZAR", s: "R" }, ES: { c: "EUR", s: "€" }, LK: { c: "LKR", s: "₨" },
  SD: { c: "SDG", s: "S£" }, SR: { c: "SRD", s: "$" }, SE: { c: "SEK", s: "kr" }, CH: { c: "CHF", s: "CHF" }, SY: { c: "SYP", s: "£S" },
  TW: { c: "TWD", s: "NT$" }, TJ: { c: "TJS", s: "SM" }, TZ: { c: "TZS", s: "TSh" }, TH: { c: "THB", s: "฿" }, TL: { c: "USD", s: "$" },
  TG: { c: "XOF", s: "CFA" }, TO: { c: "TOP", s: "T$" }, TT: { c: "TTD", s: "$" }, TN: { c: "TND", s: "د.ت" }, TR: { c: "TRY", s: "₺" },
  TM: { c: "TMT", s: "T" }, TV: { c: "AUD", s: "$" }, UG: { c: "UGX", s: "USh" }, UA: { c: "UAH", s: "₴" }, AE: { c: "AED", s: "د.إ", p: "suffix" },
  GB: { c: "GBP", s: "£" }, US: { c: "USD", s: "$" }, UY: { c: "UYU", s: "$U" }, UZ: { c: "UZS", s: "soʻm" }, VU: { c: "VUV", s: "VT" },
  VA: { c: "EUR", s: "€" }, VE: { c: "VES", s: "Bs.S" }, VN: { c: "VND", s: "₫" }, YE: { c: "YER", s: "﷼" }, ZM: { c: "ZMW", s: "ZK" },
  ZW: { c: "ZWL", s: "$" }
};

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region, setRegionState] = useState<Region>("IN");
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

  useEffect(() => {
    const stored = localStorage.getItem("stopshop_region") as Region;
    if (stored && currencyDatabase[stored]) {
      setRegionState(stored);
      return;
    }

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
    const config = currencyDatabase[region] || { c: "USD", s: "$" };
    // Safe fallbacks in case API fails
    const defaultRates: Record<string, number> = {
      INR: 1.0,
      USD: 1 / 83.5,
      EUR: 1 / 90.0,
      GBP: 1 / 105.0,
      AED: 1 / 22.7,
      CAD: 1 / 61.0,
      AUD: 1 / 55.0,
      SAR: 1 / 22.2,
      SGD: 1 / 61.5,
      JPY: 1.88
    };

    const rate = rates[config.c] || defaultRates[config.c] || 1 / 83.5;
    const converted = Math.round(priceInInr * rate);
    
    if (config.p === "suffix") {
      return `${converted.toLocaleString()} ${config.s}`;
    }
    return `${config.s}${converted.toLocaleString()}`;
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
        currency: (currencyDatabase[region] || { c: "USD" }).c,
        symbol: (currencyDatabase[region] || { s: "$" }).s,
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
