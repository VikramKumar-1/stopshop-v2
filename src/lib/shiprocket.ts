// Shiprocket API wrapper

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export const SHIPROCKET_CONFIG = {
  email: process.env.SHIPROCKET_EMAIL || "",
  password: process.env.SHIPROCKET_PASSWORD || "",
};

export const isShiprocketConfigured = () => 
  SHIPROCKET_CONFIG.email !== "" && 
  SHIPROCKET_CONFIG.password !== "" && 
  !SHIPROCKET_CONFIG.email.includes("your-shiprocket-email");

export const ShiprocketService = {
  async getToken(): Promise<string> {
    if (!isShiprocketConfigured()) throw new Error("Shiprocket not configured in ENV");
    
    // Use cached token if valid (expires in 10 days, we refresh after 9 days)
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      return cachedToken;
    }

    const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: SHIPROCKET_CONFIG.email, password: SHIPROCKET_CONFIG.password }),
    });

    if (!res.ok) throw new Error("Failed to authenticate with Shiprocket");
    
    const data = await res.json();
    cachedToken = data.token;
    tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // 9 days in ms
    return cachedToken as string;
  },

  async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getToken();
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
    
    const res = await fetch(`${SHIPROCKET_BASE}${endpoint}`, { ...options, headers });
    if (!res.ok) {
       const errData = await res.json().catch(() => null);
       throw new Error(`Shiprocket API Error: ${res.statusText} ${JSON.stringify(errData)}`);
    }
    return res.json();
  },

  // 1. Create order in Shiprocket
  async createOrder(order: any, items: any[], pickupLocation: string): Promise<{ shiprocket_order_id: number; shipment_id: number }> {
    if (!isShiprocketConfigured()) return { shiprocket_order_id: Math.floor(Math.random() * 100000), shipment_id: Math.floor(Math.random() * 100000) };

    const payload = {
      order_id: order.orderNumber,
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location: pickupLocation,
      billing_customer_name: order.shippingName,
      billing_last_name: "",
      billing_address: order.shippingAddress,
      billing_city: order.shippingCity,
      billing_pincode: order.shippingPincode,
      billing_state: order.shippingState,
      billing_country: order.shippingCountry,
      billing_email: order.shippingEmail,
      billing_phone: order.shippingPhone,
      shipping_is_billing: true,
      order_items: items.map(i => ({
        name: i.productName,
        sku: `SKU-${i.productId}`,
        units: i.quantity,
        selling_price: i.unitPaise / 100,
      })),
      payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
      sub_total: order.subtotalPaise / 100,
      length: 10, // Default dimensions in cm
      breadth: 10,
      height: 10,
      weight: 1.0, // Default weight in kg
    };

    const data = await this.request('/orders/create/adhoc', {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return { shiprocket_order_id: data.order_id, shipment_id: data.shipment_id };
  },

  // 2. Auto-assign courier
  async assignCourier(shipmentId: number): Promise<{ awb_code: string; courier_name: string; courier_id: number }> {
    if (!isShiprocketConfigured()) return { awb_code: `AWB${Math.floor(Math.random() * 10000000)}`, courier_name: "Test Courier", courier_id: 1 };

    const data = await this.request('/courier/assign/awb', {
      method: "POST",
      body: JSON.stringify({ shipment_id: shipmentId })
    });
    return {
      awb_code: data.response.data.awb_code,
      courier_name: data.response.data.courier_name,
      courier_id: data.response.data.courier_company_id
    };
  },

  // 4. Generate label
  async generateLabel(shipmentId: number): Promise<string> {
    if (!isShiprocketConfigured()) return "https://example.com/mock-label.pdf";

    const data = await this.request('/courier/generate/label', {
      method: "POST",
      body: JSON.stringify({ shipment_id: [shipmentId] })
    });
    return data.label_created === 1 ? data.label_url : "";
  },

  // 6. Schedule pickup
  async schedulePickup(shipmentId: number): Promise<{ pickup_scheduled_date: string }> {
    if (!isShiprocketConfigured()) return { pickup_scheduled_date: new Date().toISOString() };

    const data = await this.request('/courier/generate/pickup', {
      method: "POST",
      body: JSON.stringify({ shipment_id: [shipmentId] })
    });
    return { pickup_scheduled_date: data.response.pickup_scheduled_date };
  },

  // 8. Create Return Order
  async createReturnOrder(order: any, returnItems: any[], pickupLocation: string): Promise<{ shiprocket_order_id: number; shipment_id: number }> {
     if (!isShiprocketConfigured()) return { shiprocket_order_id: Math.floor(Math.random() * 100000), shipment_id: Math.floor(Math.random() * 100000) };
     
     const payload = {
      order_id: `${order.orderNumber}-RET`,
      order_date: new Date().toISOString().split('T')[0],
      pickup_customer_name: order.shippingName,
      pickup_address: order.shippingAddress,
      pickup_city: order.shippingCity,
      pickup_state: order.shippingState,
      pickup_country: order.shippingCountry,
      pickup_pincode: order.shippingPincode,
      pickup_email: order.shippingEmail,
      pickup_phone: order.shippingPhone,
      shipping_customer_name: "Vendor Return",
      shipping_address: pickupLocation, // Return back to vendor warehouse
      shipping_city: "Vendor City",
      shipping_state: "Vendor State",
      shipping_country: "India",
      shipping_pincode: "110001",
      order_items: returnItems.map(i => ({
        name: i.productName,
        sku: `SKU-${i.productId}`,
        units: i.quantity,
        selling_price: i.unitPaise / 100,
      })),
      payment_method: "Prepaid",
      sub_total: order.subtotalPaise / 100,
      length: 10, breadth: 10, height: 10, weight: 1.0,
    };

    const data = await this.request('/orders/create/return', {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return { shiprocket_order_id: data.order_id, shipment_id: data.shipment_id };
  }
};
