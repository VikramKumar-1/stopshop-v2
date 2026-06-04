import fs from "fs";
import path from "path";

export interface Order {
  id: string;
  productId: number;
  productName: string;
  productImage: string;
  productMaterial: string;
  vendorId: number;
  quantity: number;
  totalAmount: number;
  status: "PENDING" | "PACKED" | "DISPATCHED" | "DELIVERED";
  deliveryDate: string;
  paymentId: string;
  paymentStatus: "PAID" | "PENDING";
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  shippingCountry: string;
  userEmail: string;
  createdAt: string;
}

const dbPath = path.join(process.cwd(), "src/lib/orders.json");

// Ensure database file exists
const ensureDb = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
  }
};

export const getOrders = (): Order[] => {
  ensureDb();
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data) as Order[];
  } catch (e) {
    console.error("Error reading orders db", e);
    return [];
  }
};

export const saveOrders = (orders: Order[]) => {
  ensureDb();
  try {
    fs.writeFileSync(dbPath, JSON.stringify(orders, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing to orders db", e);
  }
};

export const createOrder = (orderData: Omit<Order, "id" | "status" | "createdAt" | "deliveryDate">): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    ...orderData,
    id: `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    status: "PENDING",
    deliveryDate: "",
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
};

export const updateOrderStatus = (
  orderId: string, 
  status: "PENDING" | "PACKED" | "DISPATCHED" | "DELIVERED", 
  deliveryDate?: string
): Order | null => {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  orders[idx].status = status;
  if (deliveryDate !== undefined) {
    orders[idx].deliveryDate = deliveryDate;
  }
  saveOrders(orders);
  return orders[idx];
};
