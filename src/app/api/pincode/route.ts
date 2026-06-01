import { NextRequest, NextResponse } from "next/server";
import { resolvePincodeOffline } from "@/lib/pincodeResolver";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
  }

  // 1. Resolve using the smart offline local database (only if we have the specific city mapped!)
  const offlineResult = resolvePincodeOffline(code);
  if (offlineResult && offlineResult.city) {
    return NextResponse.json([
      {
        Status: "Success",
        PostOffice: [
          {
            District: offlineResult.city,
            State: offlineResult.state,
            Country: offlineResult.country,
          }
        ]
      }
    ]);
  }

  // 2. Fetch from external APIs to verify existence and get specific city
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${code}`, {
      cache: "no-store"
    });
    if (res.ok) {
      const data = await res.json();
      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        return NextResponse.json(data);
      }
    }

    // Try secondary open API if the primary gov API is down/rate-limited
    const backupRes = await fetch(`https://aniket-thapa.github.io/india-pincode-api/pincodes/${code}.json`, {
      cache: "no-store"
    });
    if (backupRes.ok) {
      const backupData = await backupRes.json();
      return NextResponse.json([
        {
          Status: "Success",
          PostOffice: [
            {
              District: backupData.district || backupData.city || "",
              State: backupData.state || "",
              Country: "India"
            }
          ]
        }
      ]);
    }

    // If both APIs failed to find this pincode, it does NOT exist in India.
    return NextResponse.json({ error: "Pincode does not exist in India" }, { status: 404 });
  } catch (error: any) {
    // If there is a network connection issue/timeout, fallback to state prefix check
    if (offlineResult) {
      return NextResponse.json([
        {
          Status: "Success",
          PostOffice: [
            {
              District: "",
              State: offlineResult.state,
              Country: offlineResult.country,
            }
          ]
        }
      ]);
    }
    return NextResponse.json({ error: "Failed to resolve pincode offline" }, { status: 500 });
  }
}
