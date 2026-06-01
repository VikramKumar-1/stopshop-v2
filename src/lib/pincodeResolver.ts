// Local lookup database for Indian Pincodes

const THREE_DIGIT_MAP: Record<string, { city: string; state: string }> = {
  // Uttar Pradesh / Uttarakhand (20-28)
  "244": { city: "Moradabad", state: "Uttar Pradesh" },
  "201": { city: "Noida / Ghaziabad", state: "Uttar Pradesh" },
  "208": { city: "Kanpur", state: "Uttar Pradesh" },
  "226": { city: "Lucknow", state: "Uttar Pradesh" },
  "248": { city: "Dehradun", state: "Uttarakhand" },
  "273": { city: "Gorakhpur", state: "Uttar Pradesh" },
  "282": { city: "Agra", state: "Uttar Pradesh" },
  "250": { city: "Meerut", state: "Uttar Pradesh" },
  "211": { city: "Allahabad (Prayagraj)", state: "Uttar Pradesh" },
  "221": { city: "Varanasi", state: "Uttar Pradesh" },
  "247": { city: "Saharanpur", state: "Uttar Pradesh" },

  // Bihar / Jharkhand (80-85)
  "800": { city: "Patna", state: "Bihar" },
  "842": { city: "Muzaffarpur", state: "Bihar" },
  "843": { city: "Sitamarhi", state: "Bihar" },
  "824": { city: "Aurangabad / Gaya region", state: "Bihar" },
  "834": { city: "Ranchi", state: "Jharkhand" },
  "831": { city: "Jamshedpur", state: "Jharkhand" },
  "826": { city: "Dhanbad", state: "Jharkhand" },
  "841": { city: "Chapra", state: "Bihar" },
  "812": { city: "Bhagalpur", state: "Bihar" },
  "823": { city: "Gaya", state: "Bihar" },
  "846": { city: "Darbhanga", state: "Bihar" },

  // Rajasthan (30-34)
  "302": { city: "Jaipur", state: "Rajasthan" },
  "342": { city: "Jodhpur", state: "Rajasthan" },
  "305": { city: "Ajmer", state: "Rajasthan" },
  "324": { city: "Kota", state: "Rajasthan" },
  "313": { city: "Udaipur", state: "Rajasthan" },
  "301": { city: "Alwar", state: "Rajasthan" },
  "335": { city: "Sri Ganganagar", state: "Rajasthan" },
  "344": { city: "Barmer", state: "Rajasthan" },

  // Delhi (11)
  "110": { city: "New Delhi", state: "Delhi" },

  // Haryana (12-13)
  "122": { city: "Gurugram", state: "Haryana" },
  "121": { city: "Faridabad", state: "Haryana" },
  "131": { city: "Sonipat", state: "Haryana" },
  "134": { city: "Panchkula", state: "Haryana" },

  // Punjab / Chandigarh (14-16)
  "160": { city: "Chandigarh", state: "Punjab" },
  "141": { city: "Ludhiana", state: "Punjab" },
  "143": { city: "Amritsar", state: "Punjab" },
  "144": { city: "Jalandhar", state: "Punjab" },
  "147": { city: "Patiala", state: "Punjab" },

  // Gujarat (36-39)
  "380": { city: "Ahmedabad", state: "Gujarat" },
  "390": { city: "Vadodara", state: "Gujarat" },
  "395": { city: "Surat", state: "Gujarat" },
  "360": { city: "Rajkot", state: "Gujarat" },
  "370": { city: "Bhuj", state: "Gujarat" },

  // Maharashtra (40-44)
  "400": { city: "Mumbai", state: "Maharashtra" },
  "411": { city: "Pune", state: "Maharashtra" },
  "440": { city: "Nagpur", state: "Maharashtra" },
  "422": { city: "Nashik", state: "Maharashtra" },
  "431": { city: "Chhatrapati Sambhajinagar (Aurangabad)", state: "Maharashtra" },
  "416": { city: "Kolhapur", state: "Maharashtra" },

  // Karnataka (56-59)
  "560": { city: "Bengaluru", state: "Karnataka" },
  "570": { city: "Mysuru", state: "Karnataka" },
  "575": { city: "Mangaluru", state: "Karnataka" },
  "590": { city: "Belagavi", state: "Karnataka" },
  "580": { city: "Hubballi-Dharwad", state: "Karnataka" },

  // Andhra / Telangana (50-53)
  "500": { city: "Hyderabad", state: "Telangana" },
  "530": { city: "Visakhapatnam", state: "Andhra Pradesh" },
  "520": { city: "Vijayawada", state: "Andhra Pradesh" },
  "517": { city: "Tirupati", state: "Andhra Pradesh" },

  // Tamil Nadu (60-64)
  "600": { city: "Chennai", state: "Tamil Nadu" },
  "641": { city: "Coimbatore", state: "Tamil Nadu" },
  "625": { city: "Madurai", state: "Tamil Nadu" },
  "620": { city: "Tiruchirappalli", state: "Tamil Nadu" },

  // Kerala (67-69)
  "682": { city: "Kochi", state: "Kerala" },
  "695": { city: "Thiruvananthapuram", state: "Kerala" },
  "673": { city: "Kozhikode", state: "Kerala" },

  // West Bengal (70-74)
  "700": { city: "Kolkata", state: "West Bengal" },
  "711": { city: "Howrah", state: "West Bengal" },
  "734": { city: "Siliguri", state: "West Bengal" },

  // Madhya Pradesh / Chhattisgarh (45-49)
  "452": { city: "Indore", state: "Madhya Pradesh" },
  "462": { city: "Bhopal", state: "Madhya Pradesh" },
  "482": { city: "Jabalpur", state: "Madhya Pradesh" },
  "492": { city: "Raipur", state: "Chhattisgarh" },
};

export function getStateByPincodePrefix(pincode: string): string {
  if (!pincode || pincode.length < 2) return "";
  const prefix2 = parseInt(pincode.slice(0, 2), 10);
  if (prefix2 === 11) return "Delhi";
  if (prefix2 >= 12 && prefix2 <= 13) return "Haryana";
  if (prefix2 >= 14 && prefix2 <= 16) return "Punjab";
  if (prefix2 === 17) return "Himachal Pradesh";
  if (prefix2 >= 18 && prefix2 <= 19) return "Jammu & Kashmir";
  if (prefix2 >= 20 && prefix2 <= 28) return "Uttar Pradesh";
  if (prefix2 >= 30 && prefix2 <= 34) return "Rajasthan";
  if (prefix2 >= 36 && prefix2 <= 39) return "Gujarat";
  if (prefix2 >= 40 && prefix2 <= 44) return "Maharashtra";
  if (prefix2 >= 45 && prefix2 <= 48) return "Madhya Pradesh";
  if (prefix2 === 49) return "Chhattisgarh";
  if (prefix2 >= 50 && prefix2 <= 53) return "Andhra Pradesh";
  if (prefix2 >= 56 && prefix2 <= 59) return "Karnataka";
  if (prefix2 >= 60 && prefix2 <= 64) return "Tamil Nadu";
  if (prefix2 >= 67 && prefix2 <= 69) return "Kerala";
  if (prefix2 >= 70 && prefix2 <= 74) return "West Bengal";
  if (prefix2 >= 75 && prefix2 <= 77) return "Odisha";
  if (prefix2 === 78) return "Assam";
  if (prefix2 === 79) return "Northeast States";
  if (prefix2 >= 80 && prefix2 <= 85) return "Bihar";
  return "";
}

export function resolvePincodeOffline(pincode: string): { city: string; state: string; country: string } | null {
  if (!pincode || pincode.length < 3) return null;
  const prefix3 = pincode.slice(0, 3);
  
  // Exact 3-digit sorting district match
  if (THREE_DIGIT_MAP[prefix3]) {
    return {
      city: THREE_DIGIT_MAP[prefix3].city,
      state: THREE_DIGIT_MAP[prefix3].state,
      country: "India",
    };
  }

  // Fallback state mapping using the first two digits
  const state = getStateByPincodePrefix(pincode);
  if (state) {
    return {
      city: "", // User can type their specific city/district
      state: state,
      country: "India",
    };
  }

  return null;
}

export function parseLocation(locationStr: string) {
  if (!locationStr) {
    return { city: "", state: "", country: "", pincode: "", address: "" };
  }
  
  if (locationStr.includes("|")) {
    const parts = locationStr.split("|").map(p => p.trim());
    while (parts.length < 5) {
      parts.push("");
    }
    return {
      city: parts[0],
      state: parts[1],
      country: parts[2],
      pincode: parts[3],
      address: parts[4]
    };
  }
  
  // Fallback parsing for old comma formats
  const pinMatch = locationStr.match(/\b\d{6}\b/);
  const pincode = pinMatch ? pinMatch[0] : "";
  const cleanStr = locationStr.replace(/\s*-\s*\d{6}/, "");
  const commaParts = cleanStr.split(",");
  if (commaParts.length >= 3) {
    return {
      city: commaParts[0].trim(),
      state: commaParts[1].trim(),
      country: commaParts[2].trim(),
      pincode,
      address: ""
    };
  }
  return {
    city: "Moradabad",
    state: "Uttar Pradesh",
    country: "India",
    pincode,
    address: cleanStr || ""
  };
}
