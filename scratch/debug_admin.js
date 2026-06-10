// Quick debug script to test all admin APIs
const BASE = "http://localhost:3000";

async function testEndpoint(name, url) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    const elapsed = Date.now() - start;
    const body = await res.text();
    console.log(`✅ ${name}: ${res.status} (${elapsed}ms) — ${body.substring(0, 100)}`);
  } catch (e) {
    const elapsed = Date.now() - start;
    console.log(`❌ ${name}: FAILED after ${elapsed}ms — ${e.message}`);
  }
}

(async () => {
  console.log("Testing admin panel endpoints...\n");
  await testEndpoint("auth/me", `${BASE}/api/auth/me`);
  await testEndpoint("orders", `${BASE}/api/orders?page=1&limit=10`);
  await testEndpoint("returns", `${BASE}/api/returns`);
  await testEndpoint("settlements", `${BASE}/api/admin/settlements`);
  await testEndpoint("settings", `${BASE}/api/admin/settings`);
  await testEndpoint("inquiries", `${BASE}/api/inquiries`);
  await testEndpoint("products", `${BASE}/api/products`);
  await testEndpoint("categories", `${BASE}/api/categories`);
  await testEndpoint("vendors", `${BASE}/api/admin/vendors`);
  console.log("\nDone!");
})();
