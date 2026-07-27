
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  role: 'role',
  createdAt: 'createdAt',
  mobile: 'mobile',
  location: 'location',
  artisanId: 'artisanId',
  parentVendorId: 'parentVendorId',
  gstin: 'gstin',
  aadhaar: 'aadhaar',
  pan: 'pan',
  aadhaarUrl: 'aadhaarUrl',
  panUrl: 'panUrl',
  docUrl: 'docUrl',
  vendorStatus: 'vendorStatus',
  rejectionReason: 'rejectionReason',
  allowedCategories: 'allowedCategories',
  razorpayAccountId: 'razorpayAccountId',
  payoutsPaused: 'payoutsPaused'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  image: 'image'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  specs: 'specs',
  image: 'image',
  images: 'images',
  prices: 'prices',
  price: 'price',
  mrp: 'mrp',
  discount: 'discount',
  rating: 'rating',
  reviews: 'reviews',
  categoryName: 'categoryName',
  material: 'material',
  stock: 'stock',
  featured: 'featured',
  newLaunch: 'newLaunch',
  active: 'active',
  createdAt: 'createdAt',
  vendorId: 'vendorId',
  crossSellIds: 'crossSellIds',
  bundleDiscountType: 'bundleDiscountType',
  bundleDiscountValue: 'bundleDiscountValue'
};

exports.Prisma.InquiryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  companyName: 'companyName',
  country: 'country',
  items: 'items',
  message: 'message',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  orderNumber: 'orderNumber',
  userId: 'userId',
  paymentMethod: 'paymentMethod',
  paymentGateway: 'paymentGateway',
  paymentStatus: 'paymentStatus',
  razorpayPaymentId: 'razorpayPaymentId',
  paymentOrderId: 'paymentOrderId',
  paymentData: 'paymentData',
  subtotalPaise: 'subtotalPaise',
  shippingPaise: 'shippingPaise',
  codChargePaise: 'codChargePaise',
  taxPaise: 'taxPaise',
  totalPaise: 'totalPaise',
  currency: 'currency',
  commissionRate: 'commissionRate',
  commissionPaise: 'commissionPaise',
  vendorPayoutPaise: 'vendorPayoutPaise',
  settlementStatus: 'settlementStatus',
  settlementDate: 'settlementDate',
  shippingName: 'shippingName',
  shippingPhone: 'shippingPhone',
  shippingEmail: 'shippingEmail',
  shippingAddress: 'shippingAddress',
  shippingCity: 'shippingCity',
  shippingState: 'shippingState',
  shippingPincode: 'shippingPincode',
  shippingCountry: 'shippingCountry',
  status: 'status',
  deliveryDate: 'deliveryDate',
  deliveredAt: 'deliveredAt',
  trackingId: 'trackingId',
  returnWindowDays: 'returnWindowDays',
  shiprocketOrderId: 'shiprocketOrderId',
  shiprocketShipmentId: 'shiprocketShipmentId',
  awbCode: 'awbCode',
  courierName: 'courierName',
  courierId: 'courierId',
  shippingLabelUrl: 'shippingLabelUrl',
  manifestUrl: 'manifestUrl',
  estimatedDelivery: 'estimatedDelivery',
  shiprocketStatus: 'shiprocketStatus',
  returnShiprocketId: 'returnShiprocketId',
  returnAwbCode: 'returnAwbCode',
  returnCourierName: 'returnCourierName',
  couponCode: 'couponCode',
  discountPaise: 'discountPaise',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  vendorId: 'vendorId',
  quantity: 'quantity',
  unitPaise: 'unitPaise',
  totalPaise: 'totalPaise',
  productName: 'productName',
  productImage: 'productImage',
  productMaterial: 'productMaterial',
  returnQuantity: 'returnQuantity',
  returnStatus: 'returnStatus',
  stockRestored: 'stockRestored',
  dispatchImages: 'dispatchImages'
};

exports.Prisma.ReturnRequestScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  userId: 'userId',
  reason: 'reason',
  reasonDetail: 'reasonDetail',
  returnImages: 'returnImages',
  returnItems: 'returnItems',
  status: 'status',
  adminNotes: 'adminNotes',
  qcNotes: 'qcNotes',
  qcImages: 'qcImages',
  vendorQcNotes: 'vendorQcNotes',
  vendorQcImages: 'vendorQcImages',
  rejectionReason: 'rejectionReason',
  refundAmount: 'refundAmount',
  refundMethod: 'refundMethod',
  refundStatus: 'refundStatus',
  refundId: 'refundId',
  refundedAt: 'refundedAt',
  stockRestored: 'stockRestored',
  vendorDeliveredAt: 'vendorDeliveredAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SettlementScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  vendorId: 'vendorId',
  orderAmountPaise: 'orderAmountPaise',
  commissionPaise: 'commissionPaise',
  vendorPayoutPaise: 'vendorPayoutPaise',
  status: 'status',
  holdUntil: 'holdUntil',
  settledAt: 'settledAt',
  vendorPaymentRef: 'vendorPaymentRef',
  vendorPaymentMode: 'vendorPaymentMode',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AddressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  label: 'label',
  name: 'name',
  phone: 'phone',
  address: 'address',
  city: 'city',
  state: 'state',
  pincode: 'pincode',
  country: 'country',
  isDefault: 'isDefault',
  createdAt: 'createdAt'
};

exports.Prisma.AdminSettingsScalarFieldEnum = {
  id: 'id',
  defaultCommissionRate: 'defaultCommissionRate',
  taxRate: 'taxRate',
  commissionGstRate: 'commissionGstRate',
  commissionSacCode: 'commissionSacCode',
  companyName: 'companyName',
  companyAddress: 'companyAddress',
  companyGstin: 'companyGstin',
  companyPan: 'companyPan',
  companyCity: 'companyCity',
  companyState: 'companyState',
  companyCountry: 'companyCountry',
  companyPincode: 'companyPincode',
  invoiceTemplate: 'invoiceTemplate',
  lockdownMode: 'lockdownMode',
  shippingFreeAbove: 'shippingFreeAbove',
  shippingChargePaise: 'shippingChargePaise',
  codShippingChargePaise: 'codShippingChargePaise',
  internationalShippingPaise: 'internationalShippingPaise',
  codEnabled: 'codEnabled',
  codMaxAmountPaise: 'codMaxAmountPaise',
  codSurchargePaise: 'codSurchargePaise',
  returnWindowDays: 'returnWindowDays',
  returnEnabled: 'returnEnabled',
  vendorReturnSlaHours: 'vendorReturnSlaHours',
  payoutSchedule: 'payoutSchedule',
  payoutCustomDays: 'payoutCustomDays',
  lastPayoutRun: 'lastPayoutRun',
  shiprocketPickupLocation: 'shiprocketPickupLocation',
  shiprocketAutoAssign: 'shiprocketAutoAssign',
  shiprocketCourierPriority: 'shiprocketCourierPriority',
  homepageSections: 'homepageSections',
  mobileBanners: 'mobileBanners',
  updatedAt: 'updatedAt'
};

exports.Prisma.CustomPayoutScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  productId: 'productId',
  amountPaise: 'amountPaise',
  status: 'status',
  paymentRef: 'paymentRef',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SystemLogScalarFieldEnum = {
  id: 'id',
  level: 'level',
  category: 'category',
  message: 'message',
  details: 'details',
  resolved: 'resolved',
  createdAt: 'createdAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  userId: 'userId',
  orderId: 'orderId',
  rating: 'rating',
  title: 'title',
  comment: 'comment',
  images: 'images',
  isVerified: 'isVerified',
  isApproved: 'isApproved',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CouponScalarFieldEnum = {
  id: 'id',
  code: 'code',
  description: 'description',
  creatorRole: 'creatorRole',
  vendorId: 'vendorId',
  vendorStatus: 'vendorStatus',
  discountType: 'discountType',
  discountValue: 'discountValue',
  maxDiscountPaise: 'maxDiscountPaise',
  minOrderPaise: 'minOrderPaise',
  maxUses: 'maxUses',
  maxUsesPerUser: 'maxUsesPerUser',
  usedCount: 'usedCount',
  isFirstOrderOnly: 'isFirstOrderOnly',
  allowDomestic: 'allowDomestic',
  allowInternational: 'allowInternational',
  isActive: 'isActive',
  isAutoApply: 'isAutoApply',
  startsAt: 'startsAt',
  expiresAt: 'expiresAt',
  applicableCategories: 'applicableCategories',
  applicableMaterials: 'applicableMaterials',
  minItems: 'minItems',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserIntentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId',
  vendorId: 'vendorId',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  hasPurchased: 'hasPurchased',
  isDismissed: 'isDismissed'
};

exports.Prisma.TargetedOfferScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  userId: 'userId',
  productId: 'productId',
  couponCode: 'couponCode',
  discountPct: 'discountPct',
  discountAmt: 'discountAmt',
  expiresAt: 'expiresAt',
  isActive: 'isActive',
  isClaimed: 'isClaimed',
  createdAt: 'createdAt'
};

exports.Prisma.ProductViewScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId',
  sessionId: 'sessionId',
  createdAt: 'createdAt'
};

exports.Prisma.ProductPairScalarFieldEnum = {
  id: 'id',
  productA: 'productA',
  productB: 'productB',
  score: 'score'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartItemScalarFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  productId: 'productId',
  quantity: 'quantity',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.IPBlacklistScalarFieldEnum = {
  id: 'id',
  ip: 'ip',
  reason: 'reason',
  createdAt: 'createdAt'
};

exports.Prisma.SupportTicketScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  mobile: 'mobile',
  description: 'description',
  status: 'status',
  adminNotes: 'adminNotes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  User: 'User',
  Category: 'Category',
  Product: 'Product',
  Inquiry: 'Inquiry',
  Order: 'Order',
  OrderItem: 'OrderItem',
  ReturnRequest: 'ReturnRequest',
  Settlement: 'Settlement',
  Address: 'Address',
  AdminSettings: 'AdminSettings',
  CustomPayout: 'CustomPayout',
  SystemLog: 'SystemLog',
  Review: 'Review',
  Coupon: 'Coupon',
  UserIntent: 'UserIntent',
  TargetedOffer: 'TargetedOffer',
  ProductView: 'ProductView',
  ProductPair: 'ProductPair',
  Cart: 'Cart',
  CartItem: 'CartItem',
  IPBlacklist: 'IPBlacklist',
  SupportTicket: 'SupportTicket'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
