
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model Inquiry
 * 
 */
export type Inquiry = $Result.DefaultSelection<Prisma.$InquiryPayload>
/**
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>
/**
 * Model OrderItem
 * 
 */
export type OrderItem = $Result.DefaultSelection<Prisma.$OrderItemPayload>
/**
 * Model ReturnRequest
 * 
 */
export type ReturnRequest = $Result.DefaultSelection<Prisma.$ReturnRequestPayload>
/**
 * Model Settlement
 * 
 */
export type Settlement = $Result.DefaultSelection<Prisma.$SettlementPayload>
/**
 * Model Address
 * 
 */
export type Address = $Result.DefaultSelection<Prisma.$AddressPayload>
/**
 * Model AdminSettings
 * 
 */
export type AdminSettings = $Result.DefaultSelection<Prisma.$AdminSettingsPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs>;

  /**
   * `prisma.inquiry`: Exposes CRUD operations for the **Inquiry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inquiries
    * const inquiries = await prisma.inquiry.findMany()
    * ```
    */
  get inquiry(): Prisma.InquiryDelegate<ExtArgs>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs>;

  /**
   * `prisma.orderItem`: Exposes CRUD operations for the **OrderItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrderItems
    * const orderItems = await prisma.orderItem.findMany()
    * ```
    */
  get orderItem(): Prisma.OrderItemDelegate<ExtArgs>;

  /**
   * `prisma.returnRequest`: Exposes CRUD operations for the **ReturnRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReturnRequests
    * const returnRequests = await prisma.returnRequest.findMany()
    * ```
    */
  get returnRequest(): Prisma.ReturnRequestDelegate<ExtArgs>;

  /**
   * `prisma.settlement`: Exposes CRUD operations for the **Settlement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settlements
    * const settlements = await prisma.settlement.findMany()
    * ```
    */
  get settlement(): Prisma.SettlementDelegate<ExtArgs>;

  /**
   * `prisma.address`: Exposes CRUD operations for the **Address** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Addresses
    * const addresses = await prisma.address.findMany()
    * ```
    */
  get address(): Prisma.AddressDelegate<ExtArgs>;

  /**
   * `prisma.adminSettings`: Exposes CRUD operations for the **AdminSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminSettings
    * const adminSettings = await prisma.adminSettings.findMany()
    * ```
    */
  get adminSettings(): Prisma.AdminSettingsDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Category: 'Category',
    Product: 'Product',
    Inquiry: 'Inquiry',
    Order: 'Order',
    OrderItem: 'OrderItem',
    ReturnRequest: 'ReturnRequest',
    Settlement: 'Settlement',
    Address: 'Address',
    AdminSettings: 'AdminSettings'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "category" | "product" | "inquiry" | "order" | "orderItem" | "returnRequest" | "settlement" | "address" | "adminSettings"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      Inquiry: {
        payload: Prisma.$InquiryPayload<ExtArgs>
        fields: Prisma.InquiryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InquiryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InquiryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          findFirst: {
            args: Prisma.InquiryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InquiryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          findMany: {
            args: Prisma.InquiryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>[]
          }
          create: {
            args: Prisma.InquiryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          createMany: {
            args: Prisma.InquiryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InquiryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          update: {
            args: Prisma.InquiryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          deleteMany: {
            args: Prisma.InquiryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InquiryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InquiryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          aggregate: {
            args: Prisma.InquiryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInquiry>
          }
          groupBy: {
            args: Prisma.InquiryGroupByArgs<ExtArgs>
            result: $Utils.Optional<InquiryGroupByOutputType>[]
          }
          count: {
            args: Prisma.InquiryCountArgs<ExtArgs>
            result: $Utils.Optional<InquiryCountAggregateOutputType> | number
          }
        }
      }
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
      OrderItem: {
        payload: Prisma.$OrderItemPayload<ExtArgs>
        fields: Prisma.OrderItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          findFirst: {
            args: Prisma.OrderItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          findMany: {
            args: Prisma.OrderItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>[]
          }
          create: {
            args: Prisma.OrderItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          createMany: {
            args: Prisma.OrderItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.OrderItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          update: {
            args: Prisma.OrderItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          deleteMany: {
            args: Prisma.OrderItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrderItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          aggregate: {
            args: Prisma.OrderItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderItem>
          }
          groupBy: {
            args: Prisma.OrderItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderItemCountArgs<ExtArgs>
            result: $Utils.Optional<OrderItemCountAggregateOutputType> | number
          }
        }
      }
      ReturnRequest: {
        payload: Prisma.$ReturnRequestPayload<ExtArgs>
        fields: Prisma.ReturnRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReturnRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReturnRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnRequestPayload>
          }
          findFirst: {
            args: Prisma.ReturnRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReturnRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnRequestPayload>
          }
          findMany: {
            args: Prisma.ReturnRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnRequestPayload>[]
          }
          create: {
            args: Prisma.ReturnRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnRequestPayload>
          }
          createMany: {
            args: Prisma.ReturnRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ReturnRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnRequestPayload>
          }
          update: {
            args: Prisma.ReturnRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnRequestPayload>
          }
          deleteMany: {
            args: Prisma.ReturnRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReturnRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReturnRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnRequestPayload>
          }
          aggregate: {
            args: Prisma.ReturnRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReturnRequest>
          }
          groupBy: {
            args: Prisma.ReturnRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReturnRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReturnRequestCountArgs<ExtArgs>
            result: $Utils.Optional<ReturnRequestCountAggregateOutputType> | number
          }
        }
      }
      Settlement: {
        payload: Prisma.$SettlementPayload<ExtArgs>
        fields: Prisma.SettlementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettlementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettlementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementPayload>
          }
          findFirst: {
            args: Prisma.SettlementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettlementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementPayload>
          }
          findMany: {
            args: Prisma.SettlementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementPayload>[]
          }
          create: {
            args: Prisma.SettlementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementPayload>
          }
          createMany: {
            args: Prisma.SettlementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SettlementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementPayload>
          }
          update: {
            args: Prisma.SettlementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementPayload>
          }
          deleteMany: {
            args: Prisma.SettlementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettlementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SettlementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementPayload>
          }
          aggregate: {
            args: Prisma.SettlementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSettlement>
          }
          groupBy: {
            args: Prisma.SettlementGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettlementGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettlementCountArgs<ExtArgs>
            result: $Utils.Optional<SettlementCountAggregateOutputType> | number
          }
        }
      }
      Address: {
        payload: Prisma.$AddressPayload<ExtArgs>
        fields: Prisma.AddressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AddressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AddressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          findFirst: {
            args: Prisma.AddressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AddressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          findMany: {
            args: Prisma.AddressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>[]
          }
          create: {
            args: Prisma.AddressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          createMany: {
            args: Prisma.AddressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AddressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          update: {
            args: Prisma.AddressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          deleteMany: {
            args: Prisma.AddressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AddressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AddressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          aggregate: {
            args: Prisma.AddressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAddress>
          }
          groupBy: {
            args: Prisma.AddressGroupByArgs<ExtArgs>
            result: $Utils.Optional<AddressGroupByOutputType>[]
          }
          count: {
            args: Prisma.AddressCountArgs<ExtArgs>
            result: $Utils.Optional<AddressCountAggregateOutputType> | number
          }
        }
      }
      AdminSettings: {
        payload: Prisma.$AdminSettingsPayload<ExtArgs>
        fields: Prisma.AdminSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          findFirst: {
            args: Prisma.AdminSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          findMany: {
            args: Prisma.AdminSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>[]
          }
          create: {
            args: Prisma.AdminSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          createMany: {
            args: Prisma.AdminSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AdminSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          update: {
            args: Prisma.AdminSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          deleteMany: {
            args: Prisma.AdminSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AdminSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          aggregate: {
            args: Prisma.AdminSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminSettings>
          }
          groupBy: {
            args: Prisma.AdminSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<AdminSettingsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    products: number
    orders: number
    addresses: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | UserCountOutputTypeCountProductsArgs
    orders?: boolean | UserCountOutputTypeCountOrdersArgs
    addresses?: boolean | UserCountOutputTypeCountAddressesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAddressesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AddressWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    products: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | CategoryCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    orderItems: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orderItems?: boolean | ProductCountOutputTypeCountOrderItemsArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountOrderItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderItemWhereInput
  }


  /**
   * Count Type OrderCountOutputType
   */

  export type OrderCountOutputType = {
    items: number
    settlements: number
  }

  export type OrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | OrderCountOutputTypeCountItemsArgs
    settlements?: boolean | OrderCountOutputTypeCountSettlementsArgs
  }

  // Custom InputTypes
  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCountOutputType
     */
    select?: OrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderItemWhereInput
  }

  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeCountSettlementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettlementWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    createdAt: Date | null
    mobile: string | null
    location: string | null
    artisanId: string | null
    gstin: string | null
    aadhaar: string | null
    pan: string | null
    aadhaarUrl: string | null
    panUrl: string | null
    docUrl: string | null
    vendorStatus: string | null
    rejectionReason: string | null
    allowedCategories: string | null
    razorpayAccountId: string | null
    payoutsPaused: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    createdAt: Date | null
    mobile: string | null
    location: string | null
    artisanId: string | null
    gstin: string | null
    aadhaar: string | null
    pan: string | null
    aadhaarUrl: string | null
    panUrl: string | null
    docUrl: string | null
    vendorStatus: string | null
    rejectionReason: string | null
    allowedCategories: string | null
    razorpayAccountId: string | null
    payoutsPaused: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    createdAt: number
    mobile: number
    location: number
    artisanId: number
    gstin: number
    aadhaar: number
    pan: number
    aadhaarUrl: number
    panUrl: number
    docUrl: number
    vendorStatus: number
    rejectionReason: number
    allowedCategories: number
    razorpayAccountId: number
    payoutsPaused: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    mobile?: true
    location?: true
    artisanId?: true
    gstin?: true
    aadhaar?: true
    pan?: true
    aadhaarUrl?: true
    panUrl?: true
    docUrl?: true
    vendorStatus?: true
    rejectionReason?: true
    allowedCategories?: true
    razorpayAccountId?: true
    payoutsPaused?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    mobile?: true
    location?: true
    artisanId?: true
    gstin?: true
    aadhaar?: true
    pan?: true
    aadhaarUrl?: true
    panUrl?: true
    docUrl?: true
    vendorStatus?: true
    rejectionReason?: true
    allowedCategories?: true
    razorpayAccountId?: true
    payoutsPaused?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    mobile?: true
    location?: true
    artisanId?: true
    gstin?: true
    aadhaar?: true
    pan?: true
    aadhaarUrl?: true
    panUrl?: true
    docUrl?: true
    vendorStatus?: true
    rejectionReason?: true
    allowedCategories?: true
    razorpayAccountId?: true
    payoutsPaused?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    name: string
    email: string
    password: string
    role: string
    createdAt: Date
    mobile: string | null
    location: string | null
    artisanId: string | null
    gstin: string | null
    aadhaar: string | null
    pan: string | null
    aadhaarUrl: string | null
    panUrl: string | null
    docUrl: string | null
    vendorStatus: string
    rejectionReason: string | null
    allowedCategories: string | null
    razorpayAccountId: string | null
    payoutsPaused: boolean
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    mobile?: boolean
    location?: boolean
    artisanId?: boolean
    gstin?: boolean
    aadhaar?: boolean
    pan?: boolean
    aadhaarUrl?: boolean
    panUrl?: boolean
    docUrl?: boolean
    vendorStatus?: boolean
    rejectionReason?: boolean
    allowedCategories?: boolean
    razorpayAccountId?: boolean
    payoutsPaused?: boolean
    products?: boolean | User$productsArgs<ExtArgs>
    orders?: boolean | User$ordersArgs<ExtArgs>
    addresses?: boolean | User$addressesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>


  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    mobile?: boolean
    location?: boolean
    artisanId?: boolean
    gstin?: boolean
    aadhaar?: boolean
    pan?: boolean
    aadhaarUrl?: boolean
    panUrl?: boolean
    docUrl?: boolean
    vendorStatus?: boolean
    rejectionReason?: boolean
    allowedCategories?: boolean
    razorpayAccountId?: boolean
    payoutsPaused?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | User$productsArgs<ExtArgs>
    orders?: boolean | User$ordersArgs<ExtArgs>
    addresses?: boolean | User$addressesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[]
      orders: Prisma.$OrderPayload<ExtArgs>[]
      addresses: Prisma.$AddressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      email: string
      password: string
      role: string
      createdAt: Date
      mobile: string | null
      location: string | null
      artisanId: string | null
      gstin: string | null
      aadhaar: string | null
      pan: string | null
      aadhaarUrl: string | null
      panUrl: string | null
      docUrl: string | null
      vendorStatus: string
      rejectionReason: string | null
      allowedCategories: string | null
      razorpayAccountId: string | null
      payoutsPaused: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends User$productsArgs<ExtArgs> = {}>(args?: Subset<T, User$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany"> | Null>
    orders<T extends User$ordersArgs<ExtArgs> = {}>(args?: Subset<T, User$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany"> | Null>
    addresses<T extends User$addressesArgs<ExtArgs> = {}>(args?: Subset<T, User$addressesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly mobile: FieldRef<"User", 'String'>
    readonly location: FieldRef<"User", 'String'>
    readonly artisanId: FieldRef<"User", 'String'>
    readonly gstin: FieldRef<"User", 'String'>
    readonly aadhaar: FieldRef<"User", 'String'>
    readonly pan: FieldRef<"User", 'String'>
    readonly aadhaarUrl: FieldRef<"User", 'String'>
    readonly panUrl: FieldRef<"User", 'String'>
    readonly docUrl: FieldRef<"User", 'String'>
    readonly vendorStatus: FieldRef<"User", 'String'>
    readonly rejectionReason: FieldRef<"User", 'String'>
    readonly allowedCategories: FieldRef<"User", 'String'>
    readonly razorpayAccountId: FieldRef<"User", 'String'>
    readonly payoutsPaused: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.products
   */
  export type User$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * User.orders
   */
  export type User$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * User.addresses
   */
  export type User$addressesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    where?: AddressWhereInput
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    cursor?: AddressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    image: string | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    image: string | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    image: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    image?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    image?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    image?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    name: string
    slug: string
    image: string
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    image?: boolean
    products?: boolean | Category$productsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>


  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    image?: boolean
  }

  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | Category$productsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      image: string
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends Category$productsArgs<ExtArgs> = {}>(args?: Subset<T, Category$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */ 
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'Int'>
    readonly name: FieldRef<"Category", 'String'>
    readonly slug: FieldRef<"Category", 'String'>
    readonly image: FieldRef<"Category", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
  }

  /**
   * Category.products
   */
  export type Category$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    id: number | null
    price: number | null
    mrp: number | null
    discount: number | null
    rating: number | null
    reviews: number | null
    stock: number | null
    vendorId: number | null
  }

  export type ProductSumAggregateOutputType = {
    id: number | null
    price: number | null
    mrp: number | null
    discount: number | null
    rating: number | null
    reviews: number | null
    stock: number | null
    vendorId: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    specs: string | null
    image: string | null
    price: number | null
    mrp: number | null
    discount: number | null
    rating: number | null
    reviews: number | null
    categoryName: string | null
    material: string | null
    stock: number | null
    featured: boolean | null
    newLaunch: boolean | null
    active: boolean | null
    createdAt: Date | null
    vendorId: number | null
  }

  export type ProductMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    specs: string | null
    image: string | null
    price: number | null
    mrp: number | null
    discount: number | null
    rating: number | null
    reviews: number | null
    categoryName: string | null
    material: string | null
    stock: number | null
    featured: boolean | null
    newLaunch: boolean | null
    active: boolean | null
    createdAt: Date | null
    vendorId: number | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    description: number
    specs: number
    image: number
    images: number
    prices: number
    price: number
    mrp: number
    discount: number
    rating: number
    reviews: number
    categoryName: number
    material: number
    stock: number
    featured: number
    newLaunch: number
    active: number
    createdAt: number
    vendorId: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    id?: true
    price?: true
    mrp?: true
    discount?: true
    rating?: true
    reviews?: true
    stock?: true
    vendorId?: true
  }

  export type ProductSumAggregateInputType = {
    id?: true
    price?: true
    mrp?: true
    discount?: true
    rating?: true
    reviews?: true
    stock?: true
    vendorId?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    specs?: true
    image?: true
    price?: true
    mrp?: true
    discount?: true
    rating?: true
    reviews?: true
    categoryName?: true
    material?: true
    stock?: true
    featured?: true
    newLaunch?: true
    active?: true
    createdAt?: true
    vendorId?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    specs?: true
    image?: true
    price?: true
    mrp?: true
    discount?: true
    rating?: true
    reviews?: true
    categoryName?: true
    material?: true
    stock?: true
    featured?: true
    newLaunch?: true
    active?: true
    createdAt?: true
    vendorId?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    specs?: true
    image?: true
    images?: true
    prices?: true
    price?: true
    mrp?: true
    discount?: true
    rating?: true
    reviews?: true
    categoryName?: true
    material?: true
    stock?: true
    featured?: true
    newLaunch?: true
    active?: true
    createdAt?: true
    vendorId?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: number
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images: JsonValue | null
    prices: JsonValue | null
    price: number
    mrp: number
    discount: number
    rating: number
    reviews: number
    categoryName: string
    material: string
    stock: number
    featured: boolean
    newLaunch: boolean
    active: boolean
    createdAt: Date
    vendorId: number | null
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    specs?: boolean
    image?: boolean
    images?: boolean
    prices?: boolean
    price?: boolean
    mrp?: boolean
    discount?: boolean
    rating?: boolean
    reviews?: boolean
    categoryName?: boolean
    material?: boolean
    stock?: boolean
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: boolean
    vendorId?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    vendor?: boolean | Product$vendorArgs<ExtArgs>
    orderItems?: boolean | Product$orderItemsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>


  export type ProductSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    specs?: boolean
    image?: boolean
    images?: boolean
    prices?: boolean
    price?: boolean
    mrp?: boolean
    discount?: boolean
    rating?: boolean
    reviews?: boolean
    categoryName?: boolean
    material?: boolean
    stock?: boolean
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: boolean
    vendorId?: boolean
  }

  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    vendor?: boolean | Product$vendorArgs<ExtArgs>
    orderItems?: boolean | Product$orderItemsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      category: Prisma.$CategoryPayload<ExtArgs>
      vendor: Prisma.$UserPayload<ExtArgs> | null
      orderItems: Prisma.$OrderItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      description: string
      specs: string
      image: string
      images: Prisma.JsonValue | null
      prices: Prisma.JsonValue | null
      price: number
      mrp: number
      discount: number
      rating: number
      reviews: number
      categoryName: string
      material: string
      stock: number
      featured: boolean
      newLaunch: boolean
      active: boolean
      createdAt: Date
      vendorId: number | null
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends CategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoryDefaultArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    vendor<T extends Product$vendorArgs<ExtArgs> = {}>(args?: Subset<T, Product$vendorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    orderItems<T extends Product$orderItemsArgs<ExtArgs> = {}>(args?: Subset<T, Product$orderItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */ 
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'Int'>
    readonly name: FieldRef<"Product", 'String'>
    readonly slug: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly specs: FieldRef<"Product", 'String'>
    readonly image: FieldRef<"Product", 'String'>
    readonly images: FieldRef<"Product", 'Json'>
    readonly prices: FieldRef<"Product", 'Json'>
    readonly price: FieldRef<"Product", 'Float'>
    readonly mrp: FieldRef<"Product", 'Float'>
    readonly discount: FieldRef<"Product", 'Float'>
    readonly rating: FieldRef<"Product", 'Float'>
    readonly reviews: FieldRef<"Product", 'Int'>
    readonly categoryName: FieldRef<"Product", 'String'>
    readonly material: FieldRef<"Product", 'String'>
    readonly stock: FieldRef<"Product", 'Int'>
    readonly featured: FieldRef<"Product", 'Boolean'>
    readonly newLaunch: FieldRef<"Product", 'Boolean'>
    readonly active: FieldRef<"Product", 'Boolean'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly vendorId: FieldRef<"Product", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
  }

  /**
   * Product.vendor
   */
  export type Product$vendorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Product.orderItems
   */
  export type Product$orderItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    where?: OrderItemWhereInput
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    cursor?: OrderItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model Inquiry
   */

  export type AggregateInquiry = {
    _count: InquiryCountAggregateOutputType | null
    _avg: InquiryAvgAggregateOutputType | null
    _sum: InquirySumAggregateOutputType | null
    _min: InquiryMinAggregateOutputType | null
    _max: InquiryMaxAggregateOutputType | null
  }

  export type InquiryAvgAggregateOutputType = {
    id: number | null
  }

  export type InquirySumAggregateOutputType = {
    id: number | null
  }

  export type InquiryMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    phone: string | null
    companyName: string | null
    country: string | null
    message: string | null
    status: string | null
    createdAt: Date | null
  }

  export type InquiryMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    phone: string | null
    companyName: string | null
    country: string | null
    message: string | null
    status: string | null
    createdAt: Date | null
  }

  export type InquiryCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    companyName: number
    country: number
    items: number
    message: number
    status: number
    createdAt: number
    _all: number
  }


  export type InquiryAvgAggregateInputType = {
    id?: true
  }

  export type InquirySumAggregateInputType = {
    id?: true
  }

  export type InquiryMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    companyName?: true
    country?: true
    message?: true
    status?: true
    createdAt?: true
  }

  export type InquiryMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    companyName?: true
    country?: true
    message?: true
    status?: true
    createdAt?: true
  }

  export type InquiryCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    companyName?: true
    country?: true
    items?: true
    message?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type InquiryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inquiry to aggregate.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inquiries
    **/
    _count?: true | InquiryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InquiryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InquirySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InquiryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InquiryMaxAggregateInputType
  }

  export type GetInquiryAggregateType<T extends InquiryAggregateArgs> = {
        [P in keyof T & keyof AggregateInquiry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInquiry[P]>
      : GetScalarType<T[P], AggregateInquiry[P]>
  }




  export type InquiryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InquiryWhereInput
    orderBy?: InquiryOrderByWithAggregationInput | InquiryOrderByWithAggregationInput[]
    by: InquiryScalarFieldEnum[] | InquiryScalarFieldEnum
    having?: InquiryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InquiryCountAggregateInputType | true
    _avg?: InquiryAvgAggregateInputType
    _sum?: InquirySumAggregateInputType
    _min?: InquiryMinAggregateInputType
    _max?: InquiryMaxAggregateInputType
  }

  export type InquiryGroupByOutputType = {
    id: number
    name: string
    email: string
    phone: string
    companyName: string | null
    country: string | null
    items: JsonValue | null
    message: string
    status: string
    createdAt: Date
    _count: InquiryCountAggregateOutputType | null
    _avg: InquiryAvgAggregateOutputType | null
    _sum: InquirySumAggregateOutputType | null
    _min: InquiryMinAggregateOutputType | null
    _max: InquiryMaxAggregateOutputType | null
  }

  type GetInquiryGroupByPayload<T extends InquiryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InquiryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InquiryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InquiryGroupByOutputType[P]>
            : GetScalarType<T[P], InquiryGroupByOutputType[P]>
        }
      >
    >


  export type InquirySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    companyName?: boolean
    country?: boolean
    items?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["inquiry"]>


  export type InquirySelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    companyName?: boolean
    country?: boolean
    items?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
  }


  export type $InquiryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inquiry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      email: string
      phone: string
      companyName: string | null
      country: string | null
      items: Prisma.JsonValue | null
      message: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["inquiry"]>
    composites: {}
  }

  type InquiryGetPayload<S extends boolean | null | undefined | InquiryDefaultArgs> = $Result.GetResult<Prisma.$InquiryPayload, S>

  type InquiryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InquiryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InquiryCountAggregateInputType | true
    }

  export interface InquiryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inquiry'], meta: { name: 'Inquiry' } }
    /**
     * Find zero or one Inquiry that matches the filter.
     * @param {InquiryFindUniqueArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InquiryFindUniqueArgs>(args: SelectSubset<T, InquiryFindUniqueArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Inquiry that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InquiryFindUniqueOrThrowArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InquiryFindUniqueOrThrowArgs>(args: SelectSubset<T, InquiryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Inquiry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryFindFirstArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InquiryFindFirstArgs>(args?: SelectSubset<T, InquiryFindFirstArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Inquiry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryFindFirstOrThrowArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InquiryFindFirstOrThrowArgs>(args?: SelectSubset<T, InquiryFindFirstOrThrowArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Inquiries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inquiries
     * const inquiries = await prisma.inquiry.findMany()
     * 
     * // Get first 10 Inquiries
     * const inquiries = await prisma.inquiry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inquiryWithIdOnly = await prisma.inquiry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InquiryFindManyArgs>(args?: SelectSubset<T, InquiryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Inquiry.
     * @param {InquiryCreateArgs} args - Arguments to create a Inquiry.
     * @example
     * // Create one Inquiry
     * const Inquiry = await prisma.inquiry.create({
     *   data: {
     *     // ... data to create a Inquiry
     *   }
     * })
     * 
     */
    create<T extends InquiryCreateArgs>(args: SelectSubset<T, InquiryCreateArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Inquiries.
     * @param {InquiryCreateManyArgs} args - Arguments to create many Inquiries.
     * @example
     * // Create many Inquiries
     * const inquiry = await prisma.inquiry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InquiryCreateManyArgs>(args?: SelectSubset<T, InquiryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Inquiry.
     * @param {InquiryDeleteArgs} args - Arguments to delete one Inquiry.
     * @example
     * // Delete one Inquiry
     * const Inquiry = await prisma.inquiry.delete({
     *   where: {
     *     // ... filter to delete one Inquiry
     *   }
     * })
     * 
     */
    delete<T extends InquiryDeleteArgs>(args: SelectSubset<T, InquiryDeleteArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Inquiry.
     * @param {InquiryUpdateArgs} args - Arguments to update one Inquiry.
     * @example
     * // Update one Inquiry
     * const inquiry = await prisma.inquiry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InquiryUpdateArgs>(args: SelectSubset<T, InquiryUpdateArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Inquiries.
     * @param {InquiryDeleteManyArgs} args - Arguments to filter Inquiries to delete.
     * @example
     * // Delete a few Inquiries
     * const { count } = await prisma.inquiry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InquiryDeleteManyArgs>(args?: SelectSubset<T, InquiryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inquiries
     * const inquiry = await prisma.inquiry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InquiryUpdateManyArgs>(args: SelectSubset<T, InquiryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Inquiry.
     * @param {InquiryUpsertArgs} args - Arguments to update or create a Inquiry.
     * @example
     * // Update or create a Inquiry
     * const inquiry = await prisma.inquiry.upsert({
     *   create: {
     *     // ... data to create a Inquiry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inquiry we want to update
     *   }
     * })
     */
    upsert<T extends InquiryUpsertArgs>(args: SelectSubset<T, InquiryUpsertArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Inquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryCountArgs} args - Arguments to filter Inquiries to count.
     * @example
     * // Count the number of Inquiries
     * const count = await prisma.inquiry.count({
     *   where: {
     *     // ... the filter for the Inquiries we want to count
     *   }
     * })
    **/
    count<T extends InquiryCountArgs>(
      args?: Subset<T, InquiryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InquiryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inquiry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InquiryAggregateArgs>(args: Subset<T, InquiryAggregateArgs>): Prisma.PrismaPromise<GetInquiryAggregateType<T>>

    /**
     * Group by Inquiry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InquiryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InquiryGroupByArgs['orderBy'] }
        : { orderBy?: InquiryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InquiryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInquiryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inquiry model
   */
  readonly fields: InquiryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inquiry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InquiryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Inquiry model
   */ 
  interface InquiryFieldRefs {
    readonly id: FieldRef<"Inquiry", 'Int'>
    readonly name: FieldRef<"Inquiry", 'String'>
    readonly email: FieldRef<"Inquiry", 'String'>
    readonly phone: FieldRef<"Inquiry", 'String'>
    readonly companyName: FieldRef<"Inquiry", 'String'>
    readonly country: FieldRef<"Inquiry", 'String'>
    readonly items: FieldRef<"Inquiry", 'Json'>
    readonly message: FieldRef<"Inquiry", 'String'>
    readonly status: FieldRef<"Inquiry", 'String'>
    readonly createdAt: FieldRef<"Inquiry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Inquiry findUnique
   */
  export type InquiryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry findUniqueOrThrow
   */
  export type InquiryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry findFirst
   */
  export type InquiryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inquiries.
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inquiries.
     */
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * Inquiry findFirstOrThrow
   */
  export type InquiryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inquiries.
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inquiries.
     */
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * Inquiry findMany
   */
  export type InquiryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Filter, which Inquiries to fetch.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inquiries.
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * Inquiry create
   */
  export type InquiryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * The data needed to create a Inquiry.
     */
    data: XOR<InquiryCreateInput, InquiryUncheckedCreateInput>
  }

  /**
   * Inquiry createMany
   */
  export type InquiryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inquiries.
     */
    data: InquiryCreateManyInput | InquiryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inquiry update
   */
  export type InquiryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * The data needed to update a Inquiry.
     */
    data: XOR<InquiryUpdateInput, InquiryUncheckedUpdateInput>
    /**
     * Choose, which Inquiry to update.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry updateMany
   */
  export type InquiryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inquiries.
     */
    data: XOR<InquiryUpdateManyMutationInput, InquiryUncheckedUpdateManyInput>
    /**
     * Filter which Inquiries to update
     */
    where?: InquiryWhereInput
  }

  /**
   * Inquiry upsert
   */
  export type InquiryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * The filter to search for the Inquiry to update in case it exists.
     */
    where: InquiryWhereUniqueInput
    /**
     * In case the Inquiry found by the `where` argument doesn't exist, create a new Inquiry with this data.
     */
    create: XOR<InquiryCreateInput, InquiryUncheckedCreateInput>
    /**
     * In case the Inquiry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InquiryUpdateInput, InquiryUncheckedUpdateInput>
  }

  /**
   * Inquiry delete
   */
  export type InquiryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Filter which Inquiry to delete.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry deleteMany
   */
  export type InquiryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inquiries to delete
     */
    where?: InquiryWhereInput
  }

  /**
   * Inquiry without action
   */
  export type InquiryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
  }


  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderAvgAggregateOutputType = {
    userId: number | null
    subtotalPaise: number | null
    shippingPaise: number | null
    codChargePaise: number | null
    taxPaise: number | null
    totalPaise: number | null
    commissionRate: number | null
    commissionPaise: number | null
    vendorPayoutPaise: number | null
    returnWindowDays: number | null
    shiprocketOrderId: number | null
    shiprocketShipmentId: number | null
    courierId: number | null
    returnShiprocketId: number | null
  }

  export type OrderSumAggregateOutputType = {
    userId: number | null
    subtotalPaise: number | null
    shippingPaise: number | null
    codChargePaise: number | null
    taxPaise: number | null
    totalPaise: number | null
    commissionRate: number | null
    commissionPaise: number | null
    vendorPayoutPaise: number | null
    returnWindowDays: number | null
    shiprocketOrderId: number | null
    shiprocketShipmentId: number | null
    courierId: number | null
    returnShiprocketId: number | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    orderNumber: string | null
    userId: number | null
    paymentMethod: string | null
    paymentGateway: string | null
    paymentStatus: string | null
    razorpayPaymentId: string | null
    paymentOrderId: string | null
    subtotalPaise: number | null
    shippingPaise: number | null
    codChargePaise: number | null
    taxPaise: number | null
    totalPaise: number | null
    currency: string | null
    commissionRate: number | null
    commissionPaise: number | null
    vendorPayoutPaise: number | null
    settlementStatus: string | null
    settlementDate: Date | null
    shippingName: string | null
    shippingPhone: string | null
    shippingEmail: string | null
    shippingAddress: string | null
    shippingCity: string | null
    shippingState: string | null
    shippingPincode: string | null
    shippingCountry: string | null
    status: string | null
    deliveryDate: Date | null
    deliveredAt: Date | null
    trackingId: string | null
    returnWindowDays: number | null
    shiprocketOrderId: number | null
    shiprocketShipmentId: number | null
    awbCode: string | null
    courierName: string | null
    courierId: number | null
    shippingLabelUrl: string | null
    manifestUrl: string | null
    estimatedDelivery: Date | null
    shiprocketStatus: string | null
    returnShiprocketId: number | null
    returnAwbCode: string | null
    returnCourierName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    orderNumber: string | null
    userId: number | null
    paymentMethod: string | null
    paymentGateway: string | null
    paymentStatus: string | null
    razorpayPaymentId: string | null
    paymentOrderId: string | null
    subtotalPaise: number | null
    shippingPaise: number | null
    codChargePaise: number | null
    taxPaise: number | null
    totalPaise: number | null
    currency: string | null
    commissionRate: number | null
    commissionPaise: number | null
    vendorPayoutPaise: number | null
    settlementStatus: string | null
    settlementDate: Date | null
    shippingName: string | null
    shippingPhone: string | null
    shippingEmail: string | null
    shippingAddress: string | null
    shippingCity: string | null
    shippingState: string | null
    shippingPincode: string | null
    shippingCountry: string | null
    status: string | null
    deliveryDate: Date | null
    deliveredAt: Date | null
    trackingId: string | null
    returnWindowDays: number | null
    shiprocketOrderId: number | null
    shiprocketShipmentId: number | null
    awbCode: string | null
    courierName: string | null
    courierId: number | null
    shippingLabelUrl: string | null
    manifestUrl: string | null
    estimatedDelivery: Date | null
    shiprocketStatus: string | null
    returnShiprocketId: number | null
    returnAwbCode: string | null
    returnCourierName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    orderNumber: number
    userId: number
    paymentMethod: number
    paymentGateway: number
    paymentStatus: number
    razorpayPaymentId: number
    paymentOrderId: number
    paymentData: number
    subtotalPaise: number
    shippingPaise: number
    codChargePaise: number
    taxPaise: number
    totalPaise: number
    currency: number
    commissionRate: number
    commissionPaise: number
    vendorPayoutPaise: number
    settlementStatus: number
    settlementDate: number
    shippingName: number
    shippingPhone: number
    shippingEmail: number
    shippingAddress: number
    shippingCity: number
    shippingState: number
    shippingPincode: number
    shippingCountry: number
    status: number
    deliveryDate: number
    deliveredAt: number
    trackingId: number
    returnWindowDays: number
    shiprocketOrderId: number
    shiprocketShipmentId: number
    awbCode: number
    courierName: number
    courierId: number
    shippingLabelUrl: number
    manifestUrl: number
    estimatedDelivery: number
    shiprocketStatus: number
    returnShiprocketId: number
    returnAwbCode: number
    returnCourierName: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrderAvgAggregateInputType = {
    userId?: true
    subtotalPaise?: true
    shippingPaise?: true
    codChargePaise?: true
    taxPaise?: true
    totalPaise?: true
    commissionRate?: true
    commissionPaise?: true
    vendorPayoutPaise?: true
    returnWindowDays?: true
    shiprocketOrderId?: true
    shiprocketShipmentId?: true
    courierId?: true
    returnShiprocketId?: true
  }

  export type OrderSumAggregateInputType = {
    userId?: true
    subtotalPaise?: true
    shippingPaise?: true
    codChargePaise?: true
    taxPaise?: true
    totalPaise?: true
    commissionRate?: true
    commissionPaise?: true
    vendorPayoutPaise?: true
    returnWindowDays?: true
    shiprocketOrderId?: true
    shiprocketShipmentId?: true
    courierId?: true
    returnShiprocketId?: true
  }

  export type OrderMinAggregateInputType = {
    id?: true
    orderNumber?: true
    userId?: true
    paymentMethod?: true
    paymentGateway?: true
    paymentStatus?: true
    razorpayPaymentId?: true
    paymentOrderId?: true
    subtotalPaise?: true
    shippingPaise?: true
    codChargePaise?: true
    taxPaise?: true
    totalPaise?: true
    currency?: true
    commissionRate?: true
    commissionPaise?: true
    vendorPayoutPaise?: true
    settlementStatus?: true
    settlementDate?: true
    shippingName?: true
    shippingPhone?: true
    shippingEmail?: true
    shippingAddress?: true
    shippingCity?: true
    shippingState?: true
    shippingPincode?: true
    shippingCountry?: true
    status?: true
    deliveryDate?: true
    deliveredAt?: true
    trackingId?: true
    returnWindowDays?: true
    shiprocketOrderId?: true
    shiprocketShipmentId?: true
    awbCode?: true
    courierName?: true
    courierId?: true
    shippingLabelUrl?: true
    manifestUrl?: true
    estimatedDelivery?: true
    shiprocketStatus?: true
    returnShiprocketId?: true
    returnAwbCode?: true
    returnCourierName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    orderNumber?: true
    userId?: true
    paymentMethod?: true
    paymentGateway?: true
    paymentStatus?: true
    razorpayPaymentId?: true
    paymentOrderId?: true
    subtotalPaise?: true
    shippingPaise?: true
    codChargePaise?: true
    taxPaise?: true
    totalPaise?: true
    currency?: true
    commissionRate?: true
    commissionPaise?: true
    vendorPayoutPaise?: true
    settlementStatus?: true
    settlementDate?: true
    shippingName?: true
    shippingPhone?: true
    shippingEmail?: true
    shippingAddress?: true
    shippingCity?: true
    shippingState?: true
    shippingPincode?: true
    shippingCountry?: true
    status?: true
    deliveryDate?: true
    deliveredAt?: true
    trackingId?: true
    returnWindowDays?: true
    shiprocketOrderId?: true
    shiprocketShipmentId?: true
    awbCode?: true
    courierName?: true
    courierId?: true
    shippingLabelUrl?: true
    manifestUrl?: true
    estimatedDelivery?: true
    shiprocketStatus?: true
    returnShiprocketId?: true
    returnAwbCode?: true
    returnCourierName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    orderNumber?: true
    userId?: true
    paymentMethod?: true
    paymentGateway?: true
    paymentStatus?: true
    razorpayPaymentId?: true
    paymentOrderId?: true
    paymentData?: true
    subtotalPaise?: true
    shippingPaise?: true
    codChargePaise?: true
    taxPaise?: true
    totalPaise?: true
    currency?: true
    commissionRate?: true
    commissionPaise?: true
    vendorPayoutPaise?: true
    settlementStatus?: true
    settlementDate?: true
    shippingName?: true
    shippingPhone?: true
    shippingEmail?: true
    shippingAddress?: true
    shippingCity?: true
    shippingState?: true
    shippingPincode?: true
    shippingCountry?: true
    status?: true
    deliveryDate?: true
    deliveredAt?: true
    trackingId?: true
    returnWindowDays?: true
    shiprocketOrderId?: true
    shiprocketShipmentId?: true
    awbCode?: true
    courierName?: true
    courierId?: true
    shippingLabelUrl?: true
    manifestUrl?: true
    estimatedDelivery?: true
    shiprocketStatus?: true
    returnShiprocketId?: true
    returnAwbCode?: true
    returnCourierName?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _avg?: OrderAvgAggregateInputType
    _sum?: OrderSumAggregateInputType
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    orderNumber: string
    userId: number
    paymentMethod: string
    paymentGateway: string | null
    paymentStatus: string
    razorpayPaymentId: string | null
    paymentOrderId: string | null
    paymentData: JsonValue | null
    subtotalPaise: number
    shippingPaise: number
    codChargePaise: number
    taxPaise: number
    totalPaise: number
    currency: string
    commissionRate: number
    commissionPaise: number
    vendorPayoutPaise: number
    settlementStatus: string
    settlementDate: Date | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry: string
    status: string
    deliveryDate: Date | null
    deliveredAt: Date | null
    trackingId: string | null
    returnWindowDays: number
    shiprocketOrderId: number | null
    shiprocketShipmentId: number | null
    awbCode: string | null
    courierName: string | null
    courierId: number | null
    shippingLabelUrl: string | null
    manifestUrl: string | null
    estimatedDelivery: Date | null
    shiprocketStatus: string | null
    returnShiprocketId: number | null
    returnAwbCode: string | null
    returnCourierName: string | null
    createdAt: Date
    updatedAt: Date
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    userId?: boolean
    paymentMethod?: boolean
    paymentGateway?: boolean
    paymentStatus?: boolean
    razorpayPaymentId?: boolean
    paymentOrderId?: boolean
    paymentData?: boolean
    subtotalPaise?: boolean
    shippingPaise?: boolean
    codChargePaise?: boolean
    taxPaise?: boolean
    totalPaise?: boolean
    currency?: boolean
    commissionRate?: boolean
    commissionPaise?: boolean
    vendorPayoutPaise?: boolean
    settlementStatus?: boolean
    settlementDate?: boolean
    shippingName?: boolean
    shippingPhone?: boolean
    shippingEmail?: boolean
    shippingAddress?: boolean
    shippingCity?: boolean
    shippingState?: boolean
    shippingPincode?: boolean
    shippingCountry?: boolean
    status?: boolean
    deliveryDate?: boolean
    deliveredAt?: boolean
    trackingId?: boolean
    returnWindowDays?: boolean
    shiprocketOrderId?: boolean
    shiprocketShipmentId?: boolean
    awbCode?: boolean
    courierName?: boolean
    courierId?: boolean
    shippingLabelUrl?: boolean
    manifestUrl?: boolean
    estimatedDelivery?: boolean
    shiprocketStatus?: boolean
    returnShiprocketId?: boolean
    returnAwbCode?: boolean
    returnCourierName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | Order$itemsArgs<ExtArgs>
    returnRequest?: boolean | Order$returnRequestArgs<ExtArgs>
    settlements?: boolean | Order$settlementsArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>


  export type OrderSelectScalar = {
    id?: boolean
    orderNumber?: boolean
    userId?: boolean
    paymentMethod?: boolean
    paymentGateway?: boolean
    paymentStatus?: boolean
    razorpayPaymentId?: boolean
    paymentOrderId?: boolean
    paymentData?: boolean
    subtotalPaise?: boolean
    shippingPaise?: boolean
    codChargePaise?: boolean
    taxPaise?: boolean
    totalPaise?: boolean
    currency?: boolean
    commissionRate?: boolean
    commissionPaise?: boolean
    vendorPayoutPaise?: boolean
    settlementStatus?: boolean
    settlementDate?: boolean
    shippingName?: boolean
    shippingPhone?: boolean
    shippingEmail?: boolean
    shippingAddress?: boolean
    shippingCity?: boolean
    shippingState?: boolean
    shippingPincode?: boolean
    shippingCountry?: boolean
    status?: boolean
    deliveryDate?: boolean
    deliveredAt?: boolean
    trackingId?: boolean
    returnWindowDays?: boolean
    shiprocketOrderId?: boolean
    shiprocketShipmentId?: boolean
    awbCode?: boolean
    courierName?: boolean
    courierId?: boolean
    shippingLabelUrl?: boolean
    manifestUrl?: boolean
    estimatedDelivery?: boolean
    shiprocketStatus?: boolean
    returnShiprocketId?: boolean
    returnAwbCode?: boolean
    returnCourierName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | Order$itemsArgs<ExtArgs>
    returnRequest?: boolean | Order$returnRequestArgs<ExtArgs>
    settlements?: boolean | Order$settlementsArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      items: Prisma.$OrderItemPayload<ExtArgs>[]
      returnRequest: Prisma.$ReturnRequestPayload<ExtArgs> | null
      settlements: Prisma.$SettlementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderNumber: string
      userId: number
      paymentMethod: string
      paymentGateway: string | null
      paymentStatus: string
      razorpayPaymentId: string | null
      paymentOrderId: string | null
      paymentData: Prisma.JsonValue | null
      subtotalPaise: number
      shippingPaise: number
      codChargePaise: number
      taxPaise: number
      totalPaise: number
      currency: string
      commissionRate: number
      commissionPaise: number
      vendorPayoutPaise: number
      settlementStatus: string
      settlementDate: Date | null
      shippingName: string
      shippingPhone: string
      shippingEmail: string
      shippingAddress: string
      shippingCity: string
      shippingState: string
      shippingPincode: string
      shippingCountry: string
      status: string
      deliveryDate: Date | null
      deliveredAt: Date | null
      trackingId: string | null
      returnWindowDays: number
      shiprocketOrderId: number | null
      shiprocketShipmentId: number | null
      awbCode: string | null
      courierName: string | null
      courierId: number | null
      shippingLabelUrl: string | null
      manifestUrl: string | null
      estimatedDelivery: Date | null
      shiprocketStatus: string | null
      returnShiprocketId: number | null
      returnAwbCode: string | null
      returnCourierName: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    items<T extends Order$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Order$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany"> | Null>
    returnRequest<T extends Order$returnRequestArgs<ExtArgs> = {}>(args?: Subset<T, Order$returnRequestArgs<ExtArgs>>): Prisma__ReturnRequestClient<$Result.GetResult<Prisma.$ReturnRequestPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    settlements<T extends Order$settlementsArgs<ExtArgs> = {}>(args?: Subset<T, Order$settlementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettlementPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Order model
   */ 
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly orderNumber: FieldRef<"Order", 'String'>
    readonly userId: FieldRef<"Order", 'Int'>
    readonly paymentMethod: FieldRef<"Order", 'String'>
    readonly paymentGateway: FieldRef<"Order", 'String'>
    readonly paymentStatus: FieldRef<"Order", 'String'>
    readonly razorpayPaymentId: FieldRef<"Order", 'String'>
    readonly paymentOrderId: FieldRef<"Order", 'String'>
    readonly paymentData: FieldRef<"Order", 'Json'>
    readonly subtotalPaise: FieldRef<"Order", 'Int'>
    readonly shippingPaise: FieldRef<"Order", 'Int'>
    readonly codChargePaise: FieldRef<"Order", 'Int'>
    readonly taxPaise: FieldRef<"Order", 'Int'>
    readonly totalPaise: FieldRef<"Order", 'Int'>
    readonly currency: FieldRef<"Order", 'String'>
    readonly commissionRate: FieldRef<"Order", 'Float'>
    readonly commissionPaise: FieldRef<"Order", 'Int'>
    readonly vendorPayoutPaise: FieldRef<"Order", 'Int'>
    readonly settlementStatus: FieldRef<"Order", 'String'>
    readonly settlementDate: FieldRef<"Order", 'DateTime'>
    readonly shippingName: FieldRef<"Order", 'String'>
    readonly shippingPhone: FieldRef<"Order", 'String'>
    readonly shippingEmail: FieldRef<"Order", 'String'>
    readonly shippingAddress: FieldRef<"Order", 'String'>
    readonly shippingCity: FieldRef<"Order", 'String'>
    readonly shippingState: FieldRef<"Order", 'String'>
    readonly shippingPincode: FieldRef<"Order", 'String'>
    readonly shippingCountry: FieldRef<"Order", 'String'>
    readonly status: FieldRef<"Order", 'String'>
    readonly deliveryDate: FieldRef<"Order", 'DateTime'>
    readonly deliveredAt: FieldRef<"Order", 'DateTime'>
    readonly trackingId: FieldRef<"Order", 'String'>
    readonly returnWindowDays: FieldRef<"Order", 'Int'>
    readonly shiprocketOrderId: FieldRef<"Order", 'Int'>
    readonly shiprocketShipmentId: FieldRef<"Order", 'Int'>
    readonly awbCode: FieldRef<"Order", 'String'>
    readonly courierName: FieldRef<"Order", 'String'>
    readonly courierId: FieldRef<"Order", 'Int'>
    readonly shippingLabelUrl: FieldRef<"Order", 'String'>
    readonly manifestUrl: FieldRef<"Order", 'String'>
    readonly estimatedDelivery: FieldRef<"Order", 'DateTime'>
    readonly shiprocketStatus: FieldRef<"Order", 'String'>
    readonly returnShiprocketId: FieldRef<"Order", 'Int'>
    readonly returnAwbCode: FieldRef<"Order", 'String'>
    readonly returnCourierName: FieldRef<"Order", 'String'>
    readonly createdAt: FieldRef<"Order", 'DateTime'>
    readonly updatedAt: FieldRef<"Order", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
  }

  /**
   * Order.items
   */
  export type Order$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    where?: OrderItemWhereInput
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    cursor?: OrderItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * Order.returnRequest
   */
  export type Order$returnRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnRequest
     */
    select?: ReturnRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnRequestInclude<ExtArgs> | null
    where?: ReturnRequestWhereInput
  }

  /**
   * Order.settlements
   */
  export type Order$settlementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settlement
     */
    select?: SettlementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettlementInclude<ExtArgs> | null
    where?: SettlementWhereInput
    orderBy?: SettlementOrderByWithRelationInput | SettlementOrderByWithRelationInput[]
    cursor?: SettlementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SettlementScalarFieldEnum | SettlementScalarFieldEnum[]
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
  }


  /**
   * Model OrderItem
   */

  export type AggregateOrderItem = {
    _count: OrderItemCountAggregateOutputType | null
    _avg: OrderItemAvgAggregateOutputType | null
    _sum: OrderItemSumAggregateOutputType | null
    _min: OrderItemMinAggregateOutputType | null
    _max: OrderItemMaxAggregateOutputType | null
  }

  export type OrderItemAvgAggregateOutputType = {
    id: number | null
    productId: number | null
    vendorId: number | null
    quantity: number | null
    unitPaise: number | null
    totalPaise: number | null
    returnQuantity: number | null
  }

  export type OrderItemSumAggregateOutputType = {
    id: number | null
    productId: number | null
    vendorId: number | null
    quantity: number | null
    unitPaise: number | null
    totalPaise: number | null
    returnQuantity: number | null
  }

  export type OrderItemMinAggregateOutputType = {
    id: number | null
    orderId: string | null
    productId: number | null
    vendorId: number | null
    quantity: number | null
    unitPaise: number | null
    totalPaise: number | null
    productName: string | null
    productImage: string | null
    productMaterial: string | null
    returnQuantity: number | null
    returnStatus: string | null
    stockRestored: boolean | null
  }

  export type OrderItemMaxAggregateOutputType = {
    id: number | null
    orderId: string | null
    productId: number | null
    vendorId: number | null
    quantity: number | null
    unitPaise: number | null
    totalPaise: number | null
    productName: string | null
    productImage: string | null
    productMaterial: string | null
    returnQuantity: number | null
    returnStatus: string | null
    stockRestored: boolean | null
  }

  export type OrderItemCountAggregateOutputType = {
    id: number
    orderId: number
    productId: number
    vendorId: number
    quantity: number
    unitPaise: number
    totalPaise: number
    productName: number
    productImage: number
    productMaterial: number
    returnQuantity: number
    returnStatus: number
    stockRestored: number
    dispatchImages: number
    _all: number
  }


  export type OrderItemAvgAggregateInputType = {
    id?: true
    productId?: true
    vendorId?: true
    quantity?: true
    unitPaise?: true
    totalPaise?: true
    returnQuantity?: true
  }

  export type OrderItemSumAggregateInputType = {
    id?: true
    productId?: true
    vendorId?: true
    quantity?: true
    unitPaise?: true
    totalPaise?: true
    returnQuantity?: true
  }

  export type OrderItemMinAggregateInputType = {
    id?: true
    orderId?: true
    productId?: true
    vendorId?: true
    quantity?: true
    unitPaise?: true
    totalPaise?: true
    productName?: true
    productImage?: true
    productMaterial?: true
    returnQuantity?: true
    returnStatus?: true
    stockRestored?: true
  }

  export type OrderItemMaxAggregateInputType = {
    id?: true
    orderId?: true
    productId?: true
    vendorId?: true
    quantity?: true
    unitPaise?: true
    totalPaise?: true
    productName?: true
    productImage?: true
    productMaterial?: true
    returnQuantity?: true
    returnStatus?: true
    stockRestored?: true
  }

  export type OrderItemCountAggregateInputType = {
    id?: true
    orderId?: true
    productId?: true
    vendorId?: true
    quantity?: true
    unitPaise?: true
    totalPaise?: true
    productName?: true
    productImage?: true
    productMaterial?: true
    returnQuantity?: true
    returnStatus?: true
    stockRestored?: true
    dispatchImages?: true
    _all?: true
  }

  export type OrderItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderItem to aggregate.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrderItems
    **/
    _count?: true | OrderItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderItemMaxAggregateInputType
  }

  export type GetOrderItemAggregateType<T extends OrderItemAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderItem[P]>
      : GetScalarType<T[P], AggregateOrderItem[P]>
  }




  export type OrderItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderItemWhereInput
    orderBy?: OrderItemOrderByWithAggregationInput | OrderItemOrderByWithAggregationInput[]
    by: OrderItemScalarFieldEnum[] | OrderItemScalarFieldEnum
    having?: OrderItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderItemCountAggregateInputType | true
    _avg?: OrderItemAvgAggregateInputType
    _sum?: OrderItemSumAggregateInputType
    _min?: OrderItemMinAggregateInputType
    _max?: OrderItemMaxAggregateInputType
  }

  export type OrderItemGroupByOutputType = {
    id: number
    orderId: string
    productId: number
    vendorId: number | null
    quantity: number
    unitPaise: number
    totalPaise: number
    productName: string
    productImage: string
    productMaterial: string
    returnQuantity: number
    returnStatus: string | null
    stockRestored: boolean
    dispatchImages: JsonValue | null
    _count: OrderItemCountAggregateOutputType | null
    _avg: OrderItemAvgAggregateOutputType | null
    _sum: OrderItemSumAggregateOutputType | null
    _min: OrderItemMinAggregateOutputType | null
    _max: OrderItemMaxAggregateOutputType | null
  }

  type GetOrderItemGroupByPayload<T extends OrderItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderItemGroupByOutputType[P]>
            : GetScalarType<T[P], OrderItemGroupByOutputType[P]>
        }
      >
    >


  export type OrderItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    productId?: boolean
    vendorId?: boolean
    quantity?: boolean
    unitPaise?: boolean
    totalPaise?: boolean
    productName?: boolean
    productImage?: boolean
    productMaterial?: boolean
    returnQuantity?: boolean
    returnStatus?: boolean
    stockRestored?: boolean
    dispatchImages?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderItem"]>


  export type OrderItemSelectScalar = {
    id?: boolean
    orderId?: boolean
    productId?: boolean
    vendorId?: boolean
    quantity?: boolean
    unitPaise?: boolean
    totalPaise?: boolean
    productName?: boolean
    productImage?: boolean
    productMaterial?: boolean
    returnQuantity?: boolean
    returnStatus?: boolean
    stockRestored?: boolean
    dispatchImages?: boolean
  }

  export type OrderItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $OrderItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrderItem"
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      orderId: string
      productId: number
      vendorId: number | null
      quantity: number
      unitPaise: number
      totalPaise: number
      productName: string
      productImage: string
      productMaterial: string
      returnQuantity: number
      returnStatus: string | null
      stockRestored: boolean
      dispatchImages: Prisma.JsonValue | null
    }, ExtArgs["result"]["orderItem"]>
    composites: {}
  }

  type OrderItemGetPayload<S extends boolean | null | undefined | OrderItemDefaultArgs> = $Result.GetResult<Prisma.$OrderItemPayload, S>

  type OrderItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrderItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrderItemCountAggregateInputType | true
    }

  export interface OrderItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrderItem'], meta: { name: 'OrderItem' } }
    /**
     * Find zero or one OrderItem that matches the filter.
     * @param {OrderItemFindUniqueArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderItemFindUniqueArgs>(args: SelectSubset<T, OrderItemFindUniqueArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one OrderItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrderItemFindUniqueOrThrowArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderItemFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first OrderItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindFirstArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderItemFindFirstArgs>(args?: SelectSubset<T, OrderItemFindFirstArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first OrderItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindFirstOrThrowArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderItemFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more OrderItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderItems
     * const orderItems = await prisma.orderItem.findMany()
     * 
     * // Get first 10 OrderItems
     * const orderItems = await prisma.orderItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderItemWithIdOnly = await prisma.orderItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderItemFindManyArgs>(args?: SelectSubset<T, OrderItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a OrderItem.
     * @param {OrderItemCreateArgs} args - Arguments to create a OrderItem.
     * @example
     * // Create one OrderItem
     * const OrderItem = await prisma.orderItem.create({
     *   data: {
     *     // ... data to create a OrderItem
     *   }
     * })
     * 
     */
    create<T extends OrderItemCreateArgs>(args: SelectSubset<T, OrderItemCreateArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many OrderItems.
     * @param {OrderItemCreateManyArgs} args - Arguments to create many OrderItems.
     * @example
     * // Create many OrderItems
     * const orderItem = await prisma.orderItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderItemCreateManyArgs>(args?: SelectSubset<T, OrderItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a OrderItem.
     * @param {OrderItemDeleteArgs} args - Arguments to delete one OrderItem.
     * @example
     * // Delete one OrderItem
     * const OrderItem = await prisma.orderItem.delete({
     *   where: {
     *     // ... filter to delete one OrderItem
     *   }
     * })
     * 
     */
    delete<T extends OrderItemDeleteArgs>(args: SelectSubset<T, OrderItemDeleteArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one OrderItem.
     * @param {OrderItemUpdateArgs} args - Arguments to update one OrderItem.
     * @example
     * // Update one OrderItem
     * const orderItem = await prisma.orderItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderItemUpdateArgs>(args: SelectSubset<T, OrderItemUpdateArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more OrderItems.
     * @param {OrderItemDeleteManyArgs} args - Arguments to filter OrderItems to delete.
     * @example
     * // Delete a few OrderItems
     * const { count } = await prisma.orderItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderItemDeleteManyArgs>(args?: SelectSubset<T, OrderItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderItems
     * const orderItem = await prisma.orderItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderItemUpdateManyArgs>(args: SelectSubset<T, OrderItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OrderItem.
     * @param {OrderItemUpsertArgs} args - Arguments to update or create a OrderItem.
     * @example
     * // Update or create a OrderItem
     * const orderItem = await prisma.orderItem.upsert({
     *   create: {
     *     // ... data to create a OrderItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderItem we want to update
     *   }
     * })
     */
    upsert<T extends OrderItemUpsertArgs>(args: SelectSubset<T, OrderItemUpsertArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of OrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemCountArgs} args - Arguments to filter OrderItems to count.
     * @example
     * // Count the number of OrderItems
     * const count = await prisma.orderItem.count({
     *   where: {
     *     // ... the filter for the OrderItems we want to count
     *   }
     * })
    **/
    count<T extends OrderItemCountArgs>(
      args?: Subset<T, OrderItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderItemAggregateArgs>(args: Subset<T, OrderItemAggregateArgs>): Prisma.PrismaPromise<GetOrderItemAggregateType<T>>

    /**
     * Group by OrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderItemGroupByArgs['orderBy'] }
        : { orderBy?: OrderItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrderItem model
   */
  readonly fields: OrderItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderDefaultArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrderItem model
   */ 
  interface OrderItemFieldRefs {
    readonly id: FieldRef<"OrderItem", 'Int'>
    readonly orderId: FieldRef<"OrderItem", 'String'>
    readonly productId: FieldRef<"OrderItem", 'Int'>
    readonly vendorId: FieldRef<"OrderItem", 'Int'>
    readonly quantity: FieldRef<"OrderItem", 'Int'>
    readonly unitPaise: FieldRef<"OrderItem", 'Int'>
    readonly totalPaise: FieldRef<"OrderItem", 'Int'>
    readonly productName: FieldRef<"OrderItem", 'String'>
    readonly productImage: FieldRef<"OrderItem", 'String'>
    readonly productMaterial: FieldRef<"OrderItem", 'String'>
    readonly returnQuantity: FieldRef<"OrderItem", 'Int'>
    readonly returnStatus: FieldRef<"OrderItem", 'String'>
    readonly stockRestored: FieldRef<"OrderItem", 'Boolean'>
    readonly dispatchImages: FieldRef<"OrderItem", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * OrderItem findUnique
   */
  export type OrderItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem findUniqueOrThrow
   */
  export type OrderItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem findFirst
   */
  export type OrderItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderItems.
     */
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * OrderItem findFirstOrThrow
   */
  export type OrderItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderItems.
     */
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * OrderItem findMany
   */
  export type OrderItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItems to fetch.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * OrderItem create
   */
  export type OrderItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * The data needed to create a OrderItem.
     */
    data: XOR<OrderItemCreateInput, OrderItemUncheckedCreateInput>
  }

  /**
   * OrderItem createMany
   */
  export type OrderItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrderItems.
     */
    data: OrderItemCreateManyInput | OrderItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrderItem update
   */
  export type OrderItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * The data needed to update a OrderItem.
     */
    data: XOR<OrderItemUpdateInput, OrderItemUncheckedUpdateInput>
    /**
     * Choose, which OrderItem to update.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem updateMany
   */
  export type OrderItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrderItems.
     */
    data: XOR<OrderItemUpdateManyMutationInput, OrderItemUncheckedUpdateManyInput>
    /**
     * Filter which OrderItems to update
     */
    where?: OrderItemWhereInput
  }

  /**
   * OrderItem upsert
   */
  export type OrderItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * The filter to search for the OrderItem to update in case it exists.
     */
    where: OrderItemWhereUniqueInput
    /**
     * In case the OrderItem found by the `where` argument doesn't exist, create a new OrderItem with this data.
     */
    create: XOR<OrderItemCreateInput, OrderItemUncheckedCreateInput>
    /**
     * In case the OrderItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderItemUpdateInput, OrderItemUncheckedUpdateInput>
  }

  /**
   * OrderItem delete
   */
  export type OrderItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter which OrderItem to delete.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem deleteMany
   */
  export type OrderItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderItems to delete
     */
    where?: OrderItemWhereInput
  }

  /**
   * OrderItem without action
   */
  export type OrderItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
  }


  /**
   * Model ReturnRequest
   */

  export type AggregateReturnRequest = {
    _count: ReturnRequestCountAggregateOutputType | null
    _avg: ReturnRequestAvgAggregateOutputType | null
    _sum: ReturnRequestSumAggregateOutputType | null
    _min: ReturnRequestMinAggregateOutputType | null
    _max: ReturnRequestMaxAggregateOutputType | null
  }

  export type ReturnRequestAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    refundAmount: number | null
  }

  export type ReturnRequestSumAggregateOutputType = {
    id: number | null
    userId: number | null
    refundAmount: number | null
  }

  export type ReturnRequestMinAggregateOutputType = {
    id: number | null
    orderId: string | null
    userId: number | null
    reason: string | null
    reasonDetail: string | null
    status: string | null
    adminNotes: string | null
    qcNotes: string | null
    vendorQcNotes: string | null
    rejectionReason: string | null
    refundAmount: number | null
    refundMethod: string | null
    refundStatus: string | null
    refundId: string | null
    refundedAt: Date | null
    stockRestored: boolean | null
    vendorDeliveredAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReturnRequestMaxAggregateOutputType = {
    id: number | null
    orderId: string | null
    userId: number | null
    reason: string | null
    reasonDetail: string | null
    status: string | null
    adminNotes: string | null
    qcNotes: string | null
    vendorQcNotes: string | null
    rejectionReason: string | null
    refundAmount: number | null
    refundMethod: string | null
    refundStatus: string | null
    refundId: string | null
    refundedAt: Date | null
    stockRestored: boolean | null
    vendorDeliveredAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReturnRequestCountAggregateOutputType = {
    id: number
    orderId: number
    userId: number
    reason: number
    reasonDetail: number
    returnImages: number
    returnItems: number
    status: number
    adminNotes: number
    qcNotes: number
    qcImages: number
    vendorQcNotes: number
    vendorQcImages: number
    rejectionReason: number
    refundAmount: number
    refundMethod: number
    refundStatus: number
    refundId: number
    refundedAt: number
    stockRestored: number
    vendorDeliveredAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReturnRequestAvgAggregateInputType = {
    id?: true
    userId?: true
    refundAmount?: true
  }

  export type ReturnRequestSumAggregateInputType = {
    id?: true
    userId?: true
    refundAmount?: true
  }

  export type ReturnRequestMinAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    reason?: true
    reasonDetail?: true
    status?: true
    adminNotes?: true
    qcNotes?: true
    vendorQcNotes?: true
    rejectionReason?: true
    refundAmount?: true
    refundMethod?: true
    refundStatus?: true
    refundId?: true
    refundedAt?: true
    stockRestored?: true
    vendorDeliveredAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReturnRequestMaxAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    reason?: true
    reasonDetail?: true
    status?: true
    adminNotes?: true
    qcNotes?: true
    vendorQcNotes?: true
    rejectionReason?: true
    refundAmount?: true
    refundMethod?: true
    refundStatus?: true
    refundId?: true
    refundedAt?: true
    stockRestored?: true
    vendorDeliveredAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReturnRequestCountAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    reason?: true
    reasonDetail?: true
    returnImages?: true
    returnItems?: true
    status?: true
    adminNotes?: true
    qcNotes?: true
    qcImages?: true
    vendorQcNotes?: true
    vendorQcImages?: true
    rejectionReason?: true
    refundAmount?: true
    refundMethod?: true
    refundStatus?: true
    refundId?: true
    refundedAt?: true
    stockRestored?: true
    vendorDeliveredAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReturnRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReturnRequest to aggregate.
     */
    where?: ReturnRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnRequests to fetch.
     */
    orderBy?: ReturnRequestOrderByWithRelationInput | ReturnRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReturnRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReturnRequests
    **/
    _count?: true | ReturnRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReturnRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReturnRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReturnRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReturnRequestMaxAggregateInputType
  }

  export type GetReturnRequestAggregateType<T extends ReturnRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateReturnRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReturnRequest[P]>
      : GetScalarType<T[P], AggregateReturnRequest[P]>
  }




  export type ReturnRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReturnRequestWhereInput
    orderBy?: ReturnRequestOrderByWithAggregationInput | ReturnRequestOrderByWithAggregationInput[]
    by: ReturnRequestScalarFieldEnum[] | ReturnRequestScalarFieldEnum
    having?: ReturnRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReturnRequestCountAggregateInputType | true
    _avg?: ReturnRequestAvgAggregateInputType
    _sum?: ReturnRequestSumAggregateInputType
    _min?: ReturnRequestMinAggregateInputType
    _max?: ReturnRequestMaxAggregateInputType
  }

  export type ReturnRequestGroupByOutputType = {
    id: number
    orderId: string
    userId: number
    reason: string
    reasonDetail: string | null
    returnImages: JsonValue | null
    returnItems: JsonValue
    status: string
    adminNotes: string | null
    qcNotes: string | null
    qcImages: JsonValue | null
    vendorQcNotes: string | null
    vendorQcImages: JsonValue | null
    rejectionReason: string | null
    refundAmount: number | null
    refundMethod: string | null
    refundStatus: string | null
    refundId: string | null
    refundedAt: Date | null
    stockRestored: boolean
    vendorDeliveredAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ReturnRequestCountAggregateOutputType | null
    _avg: ReturnRequestAvgAggregateOutputType | null
    _sum: ReturnRequestSumAggregateOutputType | null
    _min: ReturnRequestMinAggregateOutputType | null
    _max: ReturnRequestMaxAggregateOutputType | null
  }

  type GetReturnRequestGroupByPayload<T extends ReturnRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReturnRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReturnRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReturnRequestGroupByOutputType[P]>
            : GetScalarType<T[P], ReturnRequestGroupByOutputType[P]>
        }
      >
    >


  export type ReturnRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    userId?: boolean
    reason?: boolean
    reasonDetail?: boolean
    returnImages?: boolean
    returnItems?: boolean
    status?: boolean
    adminNotes?: boolean
    qcNotes?: boolean
    qcImages?: boolean
    vendorQcNotes?: boolean
    vendorQcImages?: boolean
    rejectionReason?: boolean
    refundAmount?: boolean
    refundMethod?: boolean
    refundStatus?: boolean
    refundId?: boolean
    refundedAt?: boolean
    stockRestored?: boolean
    vendorDeliveredAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["returnRequest"]>


  export type ReturnRequestSelectScalar = {
    id?: boolean
    orderId?: boolean
    userId?: boolean
    reason?: boolean
    reasonDetail?: boolean
    returnImages?: boolean
    returnItems?: boolean
    status?: boolean
    adminNotes?: boolean
    qcNotes?: boolean
    qcImages?: boolean
    vendorQcNotes?: boolean
    vendorQcImages?: boolean
    rejectionReason?: boolean
    refundAmount?: boolean
    refundMethod?: boolean
    refundStatus?: boolean
    refundId?: boolean
    refundedAt?: boolean
    stockRestored?: boolean
    vendorDeliveredAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReturnRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }

  export type $ReturnRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReturnRequest"
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      orderId: string
      userId: number
      reason: string
      reasonDetail: string | null
      returnImages: Prisma.JsonValue | null
      returnItems: Prisma.JsonValue
      status: string
      adminNotes: string | null
      qcNotes: string | null
      qcImages: Prisma.JsonValue | null
      vendorQcNotes: string | null
      vendorQcImages: Prisma.JsonValue | null
      rejectionReason: string | null
      refundAmount: number | null
      refundMethod: string | null
      refundStatus: string | null
      refundId: string | null
      refundedAt: Date | null
      stockRestored: boolean
      vendorDeliveredAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["returnRequest"]>
    composites: {}
  }

  type ReturnRequestGetPayload<S extends boolean | null | undefined | ReturnRequestDefaultArgs> = $Result.GetResult<Prisma.$ReturnRequestPayload, S>

  type ReturnRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReturnRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReturnRequestCountAggregateInputType | true
    }

  export interface ReturnRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReturnRequest'], meta: { name: 'ReturnRequest' } }
    /**
     * Find zero or one ReturnRequest that matches the filter.
     * @param {ReturnRequestFindUniqueArgs} args - Arguments to find a ReturnRequest
     * @example
     * // Get one ReturnRequest
     * const returnRequest = await prisma.returnRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReturnRequestFindUniqueArgs>(args: SelectSubset<T, ReturnRequestFindUniqueArgs<ExtArgs>>): Prisma__ReturnRequestClient<$Result.GetResult<Prisma.$ReturnRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReturnRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReturnRequestFindUniqueOrThrowArgs} args - Arguments to find a ReturnRequest
     * @example
     * // Get one ReturnRequest
     * const returnRequest = await prisma.returnRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReturnRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, ReturnRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReturnRequestClient<$Result.GetResult<Prisma.$ReturnRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReturnRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnRequestFindFirstArgs} args - Arguments to find a ReturnRequest
     * @example
     * // Get one ReturnRequest
     * const returnRequest = await prisma.returnRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReturnRequestFindFirstArgs>(args?: SelectSubset<T, ReturnRequestFindFirstArgs<ExtArgs>>): Prisma__ReturnRequestClient<$Result.GetResult<Prisma.$ReturnRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReturnRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnRequestFindFirstOrThrowArgs} args - Arguments to find a ReturnRequest
     * @example
     * // Get one ReturnRequest
     * const returnRequest = await prisma.returnRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReturnRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, ReturnRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReturnRequestClient<$Result.GetResult<Prisma.$ReturnRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReturnRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReturnRequests
     * const returnRequests = await prisma.returnRequest.findMany()
     * 
     * // Get first 10 ReturnRequests
     * const returnRequests = await prisma.returnRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const returnRequestWithIdOnly = await prisma.returnRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReturnRequestFindManyArgs>(args?: SelectSubset<T, ReturnRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReturnRequest.
     * @param {ReturnRequestCreateArgs} args - Arguments to create a ReturnRequest.
     * @example
     * // Create one ReturnRequest
     * const ReturnRequest = await prisma.returnRequest.create({
     *   data: {
     *     // ... data to create a ReturnRequest
     *   }
     * })
     * 
     */
    create<T extends ReturnRequestCreateArgs>(args: SelectSubset<T, ReturnRequestCreateArgs<ExtArgs>>): Prisma__ReturnRequestClient<$Result.GetResult<Prisma.$ReturnRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReturnRequests.
     * @param {ReturnRequestCreateManyArgs} args - Arguments to create many ReturnRequests.
     * @example
     * // Create many ReturnRequests
     * const returnRequest = await prisma.returnRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReturnRequestCreateManyArgs>(args?: SelectSubset<T, ReturnRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ReturnRequest.
     * @param {ReturnRequestDeleteArgs} args - Arguments to delete one ReturnRequest.
     * @example
     * // Delete one ReturnRequest
     * const ReturnRequest = await prisma.returnRequest.delete({
     *   where: {
     *     // ... filter to delete one ReturnRequest
     *   }
     * })
     * 
     */
    delete<T extends ReturnRequestDeleteArgs>(args: SelectSubset<T, ReturnRequestDeleteArgs<ExtArgs>>): Prisma__ReturnRequestClient<$Result.GetResult<Prisma.$ReturnRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReturnRequest.
     * @param {ReturnRequestUpdateArgs} args - Arguments to update one ReturnRequest.
     * @example
     * // Update one ReturnRequest
     * const returnRequest = await prisma.returnRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReturnRequestUpdateArgs>(args: SelectSubset<T, ReturnRequestUpdateArgs<ExtArgs>>): Prisma__ReturnRequestClient<$Result.GetResult<Prisma.$ReturnRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReturnRequests.
     * @param {ReturnRequestDeleteManyArgs} args - Arguments to filter ReturnRequests to delete.
     * @example
     * // Delete a few ReturnRequests
     * const { count } = await prisma.returnRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReturnRequestDeleteManyArgs>(args?: SelectSubset<T, ReturnRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReturnRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReturnRequests
     * const returnRequest = await prisma.returnRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReturnRequestUpdateManyArgs>(args: SelectSubset<T, ReturnRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReturnRequest.
     * @param {ReturnRequestUpsertArgs} args - Arguments to update or create a ReturnRequest.
     * @example
     * // Update or create a ReturnRequest
     * const returnRequest = await prisma.returnRequest.upsert({
     *   create: {
     *     // ... data to create a ReturnRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReturnRequest we want to update
     *   }
     * })
     */
    upsert<T extends ReturnRequestUpsertArgs>(args: SelectSubset<T, ReturnRequestUpsertArgs<ExtArgs>>): Prisma__ReturnRequestClient<$Result.GetResult<Prisma.$ReturnRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReturnRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnRequestCountArgs} args - Arguments to filter ReturnRequests to count.
     * @example
     * // Count the number of ReturnRequests
     * const count = await prisma.returnRequest.count({
     *   where: {
     *     // ... the filter for the ReturnRequests we want to count
     *   }
     * })
    **/
    count<T extends ReturnRequestCountArgs>(
      args?: Subset<T, ReturnRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReturnRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReturnRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReturnRequestAggregateArgs>(args: Subset<T, ReturnRequestAggregateArgs>): Prisma.PrismaPromise<GetReturnRequestAggregateType<T>>

    /**
     * Group by ReturnRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReturnRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReturnRequestGroupByArgs['orderBy'] }
        : { orderBy?: ReturnRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReturnRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReturnRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReturnRequest model
   */
  readonly fields: ReturnRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReturnRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReturnRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderDefaultArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReturnRequest model
   */ 
  interface ReturnRequestFieldRefs {
    readonly id: FieldRef<"ReturnRequest", 'Int'>
    readonly orderId: FieldRef<"ReturnRequest", 'String'>
    readonly userId: FieldRef<"ReturnRequest", 'Int'>
    readonly reason: FieldRef<"ReturnRequest", 'String'>
    readonly reasonDetail: FieldRef<"ReturnRequest", 'String'>
    readonly returnImages: FieldRef<"ReturnRequest", 'Json'>
    readonly returnItems: FieldRef<"ReturnRequest", 'Json'>
    readonly status: FieldRef<"ReturnRequest", 'String'>
    readonly adminNotes: FieldRef<"ReturnRequest", 'String'>
    readonly qcNotes: FieldRef<"ReturnRequest", 'String'>
    readonly qcImages: FieldRef<"ReturnRequest", 'Json'>
    readonly vendorQcNotes: FieldRef<"ReturnRequest", 'String'>
    readonly vendorQcImages: FieldRef<"ReturnRequest", 'Json'>
    readonly rejectionReason: FieldRef<"ReturnRequest", 'String'>
    readonly refundAmount: FieldRef<"ReturnRequest", 'Int'>
    readonly refundMethod: FieldRef<"ReturnRequest", 'String'>
    readonly refundStatus: FieldRef<"ReturnRequest", 'String'>
    readonly refundId: FieldRef<"ReturnRequest", 'String'>
    readonly refundedAt: FieldRef<"ReturnRequest", 'DateTime'>
    readonly stockRestored: FieldRef<"ReturnRequest", 'Boolean'>
    readonly vendorDeliveredAt: FieldRef<"ReturnRequest", 'DateTime'>
    readonly createdAt: FieldRef<"ReturnRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"ReturnRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReturnRequest findUnique
   */
  export type ReturnRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnRequest
     */
    select?: ReturnRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnRequestInclude<ExtArgs> | null
    /**
     * Filter, which ReturnRequest to fetch.
     */
    where: ReturnRequestWhereUniqueInput
  }

  /**
   * ReturnRequest findUniqueOrThrow
   */
  export type ReturnRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnRequest
     */
    select?: ReturnRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnRequestInclude<ExtArgs> | null
    /**
     * Filter, which ReturnRequest to fetch.
     */
    where: ReturnRequestWhereUniqueInput
  }

  /**
   * ReturnRequest findFirst
   */
  export type ReturnRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnRequest
     */
    select?: ReturnRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnRequestInclude<ExtArgs> | null
    /**
     * Filter, which ReturnRequest to fetch.
     */
    where?: ReturnRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnRequests to fetch.
     */
    orderBy?: ReturnRequestOrderByWithRelationInput | ReturnRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReturnRequests.
     */
    cursor?: ReturnRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReturnRequests.
     */
    distinct?: ReturnRequestScalarFieldEnum | ReturnRequestScalarFieldEnum[]
  }

  /**
   * ReturnRequest findFirstOrThrow
   */
  export type ReturnRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnRequest
     */
    select?: ReturnRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnRequestInclude<ExtArgs> | null
    /**
     * Filter, which ReturnRequest to fetch.
     */
    where?: ReturnRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnRequests to fetch.
     */
    orderBy?: ReturnRequestOrderByWithRelationInput | ReturnRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReturnRequests.
     */
    cursor?: ReturnRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReturnRequests.
     */
    distinct?: ReturnRequestScalarFieldEnum | ReturnRequestScalarFieldEnum[]
  }

  /**
   * ReturnRequest findMany
   */
  export type ReturnRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnRequest
     */
    select?: ReturnRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnRequestInclude<ExtArgs> | null
    /**
     * Filter, which ReturnRequests to fetch.
     */
    where?: ReturnRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnRequests to fetch.
     */
    orderBy?: ReturnRequestOrderByWithRelationInput | ReturnRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReturnRequests.
     */
    cursor?: ReturnRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnRequests.
     */
    skip?: number
    distinct?: ReturnRequestScalarFieldEnum | ReturnRequestScalarFieldEnum[]
  }

  /**
   * ReturnRequest create
   */
  export type ReturnRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnRequest
     */
    select?: ReturnRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a ReturnRequest.
     */
    data: XOR<ReturnRequestCreateInput, ReturnRequestUncheckedCreateInput>
  }

  /**
   * ReturnRequest createMany
   */
  export type ReturnRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReturnRequests.
     */
    data: ReturnRequestCreateManyInput | ReturnRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReturnRequest update
   */
  export type ReturnRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnRequest
     */
    select?: ReturnRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a ReturnRequest.
     */
    data: XOR<ReturnRequestUpdateInput, ReturnRequestUncheckedUpdateInput>
    /**
     * Choose, which ReturnRequest to update.
     */
    where: ReturnRequestWhereUniqueInput
  }

  /**
   * ReturnRequest updateMany
   */
  export type ReturnRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReturnRequests.
     */
    data: XOR<ReturnRequestUpdateManyMutationInput, ReturnRequestUncheckedUpdateManyInput>
    /**
     * Filter which ReturnRequests to update
     */
    where?: ReturnRequestWhereInput
  }

  /**
   * ReturnRequest upsert
   */
  export type ReturnRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnRequest
     */
    select?: ReturnRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the ReturnRequest to update in case it exists.
     */
    where: ReturnRequestWhereUniqueInput
    /**
     * In case the ReturnRequest found by the `where` argument doesn't exist, create a new ReturnRequest with this data.
     */
    create: XOR<ReturnRequestCreateInput, ReturnRequestUncheckedCreateInput>
    /**
     * In case the ReturnRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReturnRequestUpdateInput, ReturnRequestUncheckedUpdateInput>
  }

  /**
   * ReturnRequest delete
   */
  export type ReturnRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnRequest
     */
    select?: ReturnRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnRequestInclude<ExtArgs> | null
    /**
     * Filter which ReturnRequest to delete.
     */
    where: ReturnRequestWhereUniqueInput
  }

  /**
   * ReturnRequest deleteMany
   */
  export type ReturnRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReturnRequests to delete
     */
    where?: ReturnRequestWhereInput
  }

  /**
   * ReturnRequest without action
   */
  export type ReturnRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnRequest
     */
    select?: ReturnRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnRequestInclude<ExtArgs> | null
  }


  /**
   * Model Settlement
   */

  export type AggregateSettlement = {
    _count: SettlementCountAggregateOutputType | null
    _avg: SettlementAvgAggregateOutputType | null
    _sum: SettlementSumAggregateOutputType | null
    _min: SettlementMinAggregateOutputType | null
    _max: SettlementMaxAggregateOutputType | null
  }

  export type SettlementAvgAggregateOutputType = {
    id: number | null
    vendorId: number | null
    orderAmountPaise: number | null
    commissionPaise: number | null
    vendorPayoutPaise: number | null
  }

  export type SettlementSumAggregateOutputType = {
    id: number | null
    vendorId: number | null
    orderAmountPaise: number | null
    commissionPaise: number | null
    vendorPayoutPaise: number | null
  }

  export type SettlementMinAggregateOutputType = {
    id: number | null
    orderId: string | null
    vendorId: number | null
    orderAmountPaise: number | null
    commissionPaise: number | null
    vendorPayoutPaise: number | null
    status: string | null
    holdUntil: Date | null
    settledAt: Date | null
    vendorPaymentRef: string | null
    vendorPaymentMode: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SettlementMaxAggregateOutputType = {
    id: number | null
    orderId: string | null
    vendorId: number | null
    orderAmountPaise: number | null
    commissionPaise: number | null
    vendorPayoutPaise: number | null
    status: string | null
    holdUntil: Date | null
    settledAt: Date | null
    vendorPaymentRef: string | null
    vendorPaymentMode: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SettlementCountAggregateOutputType = {
    id: number
    orderId: number
    vendorId: number
    orderAmountPaise: number
    commissionPaise: number
    vendorPayoutPaise: number
    status: number
    holdUntil: number
    settledAt: number
    vendorPaymentRef: number
    vendorPaymentMode: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SettlementAvgAggregateInputType = {
    id?: true
    vendorId?: true
    orderAmountPaise?: true
    commissionPaise?: true
    vendorPayoutPaise?: true
  }

  export type SettlementSumAggregateInputType = {
    id?: true
    vendorId?: true
    orderAmountPaise?: true
    commissionPaise?: true
    vendorPayoutPaise?: true
  }

  export type SettlementMinAggregateInputType = {
    id?: true
    orderId?: true
    vendorId?: true
    orderAmountPaise?: true
    commissionPaise?: true
    vendorPayoutPaise?: true
    status?: true
    holdUntil?: true
    settledAt?: true
    vendorPaymentRef?: true
    vendorPaymentMode?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SettlementMaxAggregateInputType = {
    id?: true
    orderId?: true
    vendorId?: true
    orderAmountPaise?: true
    commissionPaise?: true
    vendorPayoutPaise?: true
    status?: true
    holdUntil?: true
    settledAt?: true
    vendorPaymentRef?: true
    vendorPaymentMode?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SettlementCountAggregateInputType = {
    id?: true
    orderId?: true
    vendorId?: true
    orderAmountPaise?: true
    commissionPaise?: true
    vendorPayoutPaise?: true
    status?: true
    holdUntil?: true
    settledAt?: true
    vendorPaymentRef?: true
    vendorPaymentMode?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SettlementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settlement to aggregate.
     */
    where?: SettlementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settlements to fetch.
     */
    orderBy?: SettlementOrderByWithRelationInput | SettlementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettlementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settlements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settlements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settlements
    **/
    _count?: true | SettlementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SettlementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SettlementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettlementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettlementMaxAggregateInputType
  }

  export type GetSettlementAggregateType<T extends SettlementAggregateArgs> = {
        [P in keyof T & keyof AggregateSettlement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSettlement[P]>
      : GetScalarType<T[P], AggregateSettlement[P]>
  }




  export type SettlementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettlementWhereInput
    orderBy?: SettlementOrderByWithAggregationInput | SettlementOrderByWithAggregationInput[]
    by: SettlementScalarFieldEnum[] | SettlementScalarFieldEnum
    having?: SettlementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettlementCountAggregateInputType | true
    _avg?: SettlementAvgAggregateInputType
    _sum?: SettlementSumAggregateInputType
    _min?: SettlementMinAggregateInputType
    _max?: SettlementMaxAggregateInputType
  }

  export type SettlementGroupByOutputType = {
    id: number
    orderId: string
    vendorId: number
    orderAmountPaise: number
    commissionPaise: number
    vendorPayoutPaise: number
    status: string
    holdUntil: Date
    settledAt: Date | null
    vendorPaymentRef: string | null
    vendorPaymentMode: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: SettlementCountAggregateOutputType | null
    _avg: SettlementAvgAggregateOutputType | null
    _sum: SettlementSumAggregateOutputType | null
    _min: SettlementMinAggregateOutputType | null
    _max: SettlementMaxAggregateOutputType | null
  }

  type GetSettlementGroupByPayload<T extends SettlementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettlementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettlementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettlementGroupByOutputType[P]>
            : GetScalarType<T[P], SettlementGroupByOutputType[P]>
        }
      >
    >


  export type SettlementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    vendorId?: boolean
    orderAmountPaise?: boolean
    commissionPaise?: boolean
    vendorPayoutPaise?: boolean
    status?: boolean
    holdUntil?: boolean
    settledAt?: boolean
    vendorPaymentRef?: boolean
    vendorPaymentMode?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["settlement"]>


  export type SettlementSelectScalar = {
    id?: boolean
    orderId?: boolean
    vendorId?: boolean
    orderAmountPaise?: boolean
    commissionPaise?: boolean
    vendorPayoutPaise?: boolean
    status?: boolean
    holdUntil?: boolean
    settledAt?: boolean
    vendorPaymentRef?: boolean
    vendorPaymentMode?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SettlementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }

  export type $SettlementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Settlement"
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      orderId: string
      vendorId: number
      orderAmountPaise: number
      commissionPaise: number
      vendorPayoutPaise: number
      status: string
      holdUntil: Date
      settledAt: Date | null
      vendorPaymentRef: string | null
      vendorPaymentMode: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["settlement"]>
    composites: {}
  }

  type SettlementGetPayload<S extends boolean | null | undefined | SettlementDefaultArgs> = $Result.GetResult<Prisma.$SettlementPayload, S>

  type SettlementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SettlementFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SettlementCountAggregateInputType | true
    }

  export interface SettlementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Settlement'], meta: { name: 'Settlement' } }
    /**
     * Find zero or one Settlement that matches the filter.
     * @param {SettlementFindUniqueArgs} args - Arguments to find a Settlement
     * @example
     * // Get one Settlement
     * const settlement = await prisma.settlement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettlementFindUniqueArgs>(args: SelectSubset<T, SettlementFindUniqueArgs<ExtArgs>>): Prisma__SettlementClient<$Result.GetResult<Prisma.$SettlementPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Settlement that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SettlementFindUniqueOrThrowArgs} args - Arguments to find a Settlement
     * @example
     * // Get one Settlement
     * const settlement = await prisma.settlement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettlementFindUniqueOrThrowArgs>(args: SelectSubset<T, SettlementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettlementClient<$Result.GetResult<Prisma.$SettlementPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Settlement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementFindFirstArgs} args - Arguments to find a Settlement
     * @example
     * // Get one Settlement
     * const settlement = await prisma.settlement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettlementFindFirstArgs>(args?: SelectSubset<T, SettlementFindFirstArgs<ExtArgs>>): Prisma__SettlementClient<$Result.GetResult<Prisma.$SettlementPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Settlement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementFindFirstOrThrowArgs} args - Arguments to find a Settlement
     * @example
     * // Get one Settlement
     * const settlement = await prisma.settlement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettlementFindFirstOrThrowArgs>(args?: SelectSubset<T, SettlementFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettlementClient<$Result.GetResult<Prisma.$SettlementPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Settlements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settlements
     * const settlements = await prisma.settlement.findMany()
     * 
     * // Get first 10 Settlements
     * const settlements = await prisma.settlement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const settlementWithIdOnly = await prisma.settlement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SettlementFindManyArgs>(args?: SelectSubset<T, SettlementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettlementPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Settlement.
     * @param {SettlementCreateArgs} args - Arguments to create a Settlement.
     * @example
     * // Create one Settlement
     * const Settlement = await prisma.settlement.create({
     *   data: {
     *     // ... data to create a Settlement
     *   }
     * })
     * 
     */
    create<T extends SettlementCreateArgs>(args: SelectSubset<T, SettlementCreateArgs<ExtArgs>>): Prisma__SettlementClient<$Result.GetResult<Prisma.$SettlementPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Settlements.
     * @param {SettlementCreateManyArgs} args - Arguments to create many Settlements.
     * @example
     * // Create many Settlements
     * const settlement = await prisma.settlement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettlementCreateManyArgs>(args?: SelectSubset<T, SettlementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Settlement.
     * @param {SettlementDeleteArgs} args - Arguments to delete one Settlement.
     * @example
     * // Delete one Settlement
     * const Settlement = await prisma.settlement.delete({
     *   where: {
     *     // ... filter to delete one Settlement
     *   }
     * })
     * 
     */
    delete<T extends SettlementDeleteArgs>(args: SelectSubset<T, SettlementDeleteArgs<ExtArgs>>): Prisma__SettlementClient<$Result.GetResult<Prisma.$SettlementPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Settlement.
     * @param {SettlementUpdateArgs} args - Arguments to update one Settlement.
     * @example
     * // Update one Settlement
     * const settlement = await prisma.settlement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettlementUpdateArgs>(args: SelectSubset<T, SettlementUpdateArgs<ExtArgs>>): Prisma__SettlementClient<$Result.GetResult<Prisma.$SettlementPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Settlements.
     * @param {SettlementDeleteManyArgs} args - Arguments to filter Settlements to delete.
     * @example
     * // Delete a few Settlements
     * const { count } = await prisma.settlement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettlementDeleteManyArgs>(args?: SelectSubset<T, SettlementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settlements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settlements
     * const settlement = await prisma.settlement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettlementUpdateManyArgs>(args: SelectSubset<T, SettlementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Settlement.
     * @param {SettlementUpsertArgs} args - Arguments to update or create a Settlement.
     * @example
     * // Update or create a Settlement
     * const settlement = await prisma.settlement.upsert({
     *   create: {
     *     // ... data to create a Settlement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Settlement we want to update
     *   }
     * })
     */
    upsert<T extends SettlementUpsertArgs>(args: SelectSubset<T, SettlementUpsertArgs<ExtArgs>>): Prisma__SettlementClient<$Result.GetResult<Prisma.$SettlementPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Settlements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementCountArgs} args - Arguments to filter Settlements to count.
     * @example
     * // Count the number of Settlements
     * const count = await prisma.settlement.count({
     *   where: {
     *     // ... the filter for the Settlements we want to count
     *   }
     * })
    **/
    count<T extends SettlementCountArgs>(
      args?: Subset<T, SettlementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettlementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Settlement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SettlementAggregateArgs>(args: Subset<T, SettlementAggregateArgs>): Prisma.PrismaPromise<GetSettlementAggregateType<T>>

    /**
     * Group by Settlement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SettlementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettlementGroupByArgs['orderBy'] }
        : { orderBy?: SettlementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SettlementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettlementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Settlement model
   */
  readonly fields: SettlementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Settlement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettlementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderDefaultArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Settlement model
   */ 
  interface SettlementFieldRefs {
    readonly id: FieldRef<"Settlement", 'Int'>
    readonly orderId: FieldRef<"Settlement", 'String'>
    readonly vendorId: FieldRef<"Settlement", 'Int'>
    readonly orderAmountPaise: FieldRef<"Settlement", 'Int'>
    readonly commissionPaise: FieldRef<"Settlement", 'Int'>
    readonly vendorPayoutPaise: FieldRef<"Settlement", 'Int'>
    readonly status: FieldRef<"Settlement", 'String'>
    readonly holdUntil: FieldRef<"Settlement", 'DateTime'>
    readonly settledAt: FieldRef<"Settlement", 'DateTime'>
    readonly vendorPaymentRef: FieldRef<"Settlement", 'String'>
    readonly vendorPaymentMode: FieldRef<"Settlement", 'String'>
    readonly notes: FieldRef<"Settlement", 'String'>
    readonly createdAt: FieldRef<"Settlement", 'DateTime'>
    readonly updatedAt: FieldRef<"Settlement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Settlement findUnique
   */
  export type SettlementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settlement
     */
    select?: SettlementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettlementInclude<ExtArgs> | null
    /**
     * Filter, which Settlement to fetch.
     */
    where: SettlementWhereUniqueInput
  }

  /**
   * Settlement findUniqueOrThrow
   */
  export type SettlementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settlement
     */
    select?: SettlementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettlementInclude<ExtArgs> | null
    /**
     * Filter, which Settlement to fetch.
     */
    where: SettlementWhereUniqueInput
  }

  /**
   * Settlement findFirst
   */
  export type SettlementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settlement
     */
    select?: SettlementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettlementInclude<ExtArgs> | null
    /**
     * Filter, which Settlement to fetch.
     */
    where?: SettlementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settlements to fetch.
     */
    orderBy?: SettlementOrderByWithRelationInput | SettlementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settlements.
     */
    cursor?: SettlementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settlements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settlements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settlements.
     */
    distinct?: SettlementScalarFieldEnum | SettlementScalarFieldEnum[]
  }

  /**
   * Settlement findFirstOrThrow
   */
  export type SettlementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settlement
     */
    select?: SettlementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettlementInclude<ExtArgs> | null
    /**
     * Filter, which Settlement to fetch.
     */
    where?: SettlementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settlements to fetch.
     */
    orderBy?: SettlementOrderByWithRelationInput | SettlementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settlements.
     */
    cursor?: SettlementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settlements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settlements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settlements.
     */
    distinct?: SettlementScalarFieldEnum | SettlementScalarFieldEnum[]
  }

  /**
   * Settlement findMany
   */
  export type SettlementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settlement
     */
    select?: SettlementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettlementInclude<ExtArgs> | null
    /**
     * Filter, which Settlements to fetch.
     */
    where?: SettlementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settlements to fetch.
     */
    orderBy?: SettlementOrderByWithRelationInput | SettlementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settlements.
     */
    cursor?: SettlementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settlements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settlements.
     */
    skip?: number
    distinct?: SettlementScalarFieldEnum | SettlementScalarFieldEnum[]
  }

  /**
   * Settlement create
   */
  export type SettlementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settlement
     */
    select?: SettlementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettlementInclude<ExtArgs> | null
    /**
     * The data needed to create a Settlement.
     */
    data: XOR<SettlementCreateInput, SettlementUncheckedCreateInput>
  }

  /**
   * Settlement createMany
   */
  export type SettlementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settlements.
     */
    data: SettlementCreateManyInput | SettlementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Settlement update
   */
  export type SettlementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settlement
     */
    select?: SettlementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettlementInclude<ExtArgs> | null
    /**
     * The data needed to update a Settlement.
     */
    data: XOR<SettlementUpdateInput, SettlementUncheckedUpdateInput>
    /**
     * Choose, which Settlement to update.
     */
    where: SettlementWhereUniqueInput
  }

  /**
   * Settlement updateMany
   */
  export type SettlementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settlements.
     */
    data: XOR<SettlementUpdateManyMutationInput, SettlementUncheckedUpdateManyInput>
    /**
     * Filter which Settlements to update
     */
    where?: SettlementWhereInput
  }

  /**
   * Settlement upsert
   */
  export type SettlementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settlement
     */
    select?: SettlementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettlementInclude<ExtArgs> | null
    /**
     * The filter to search for the Settlement to update in case it exists.
     */
    where: SettlementWhereUniqueInput
    /**
     * In case the Settlement found by the `where` argument doesn't exist, create a new Settlement with this data.
     */
    create: XOR<SettlementCreateInput, SettlementUncheckedCreateInput>
    /**
     * In case the Settlement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettlementUpdateInput, SettlementUncheckedUpdateInput>
  }

  /**
   * Settlement delete
   */
  export type SettlementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settlement
     */
    select?: SettlementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettlementInclude<ExtArgs> | null
    /**
     * Filter which Settlement to delete.
     */
    where: SettlementWhereUniqueInput
  }

  /**
   * Settlement deleteMany
   */
  export type SettlementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settlements to delete
     */
    where?: SettlementWhereInput
  }

  /**
   * Settlement without action
   */
  export type SettlementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settlement
     */
    select?: SettlementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettlementInclude<ExtArgs> | null
  }


  /**
   * Model Address
   */

  export type AggregateAddress = {
    _count: AddressCountAggregateOutputType | null
    _avg: AddressAvgAggregateOutputType | null
    _sum: AddressSumAggregateOutputType | null
    _min: AddressMinAggregateOutputType | null
    _max: AddressMaxAggregateOutputType | null
  }

  export type AddressAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type AddressSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type AddressMinAggregateOutputType = {
    id: number | null
    userId: number | null
    label: string | null
    name: string | null
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    pincode: string | null
    country: string | null
    isDefault: boolean | null
    createdAt: Date | null
  }

  export type AddressMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    label: string | null
    name: string | null
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    pincode: string | null
    country: string | null
    isDefault: boolean | null
    createdAt: Date | null
  }

  export type AddressCountAggregateOutputType = {
    id: number
    userId: number
    label: number
    name: number
    phone: number
    address: number
    city: number
    state: number
    pincode: number
    country: number
    isDefault: number
    createdAt: number
    _all: number
  }


  export type AddressAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AddressSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AddressMinAggregateInputType = {
    id?: true
    userId?: true
    label?: true
    name?: true
    phone?: true
    address?: true
    city?: true
    state?: true
    pincode?: true
    country?: true
    isDefault?: true
    createdAt?: true
  }

  export type AddressMaxAggregateInputType = {
    id?: true
    userId?: true
    label?: true
    name?: true
    phone?: true
    address?: true
    city?: true
    state?: true
    pincode?: true
    country?: true
    isDefault?: true
    createdAt?: true
  }

  export type AddressCountAggregateInputType = {
    id?: true
    userId?: true
    label?: true
    name?: true
    phone?: true
    address?: true
    city?: true
    state?: true
    pincode?: true
    country?: true
    isDefault?: true
    createdAt?: true
    _all?: true
  }

  export type AddressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Address to aggregate.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Addresses
    **/
    _count?: true | AddressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AddressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AddressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AddressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AddressMaxAggregateInputType
  }

  export type GetAddressAggregateType<T extends AddressAggregateArgs> = {
        [P in keyof T & keyof AggregateAddress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAddress[P]>
      : GetScalarType<T[P], AggregateAddress[P]>
  }




  export type AddressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AddressWhereInput
    orderBy?: AddressOrderByWithAggregationInput | AddressOrderByWithAggregationInput[]
    by: AddressScalarFieldEnum[] | AddressScalarFieldEnum
    having?: AddressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AddressCountAggregateInputType | true
    _avg?: AddressAvgAggregateInputType
    _sum?: AddressSumAggregateInputType
    _min?: AddressMinAggregateInputType
    _max?: AddressMaxAggregateInputType
  }

  export type AddressGroupByOutputType = {
    id: number
    userId: number
    label: string
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
    isDefault: boolean
    createdAt: Date
    _count: AddressCountAggregateOutputType | null
    _avg: AddressAvgAggregateOutputType | null
    _sum: AddressSumAggregateOutputType | null
    _min: AddressMinAggregateOutputType | null
    _max: AddressMaxAggregateOutputType | null
  }

  type GetAddressGroupByPayload<T extends AddressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AddressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AddressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AddressGroupByOutputType[P]>
            : GetScalarType<T[P], AddressGroupByOutputType[P]>
        }
      >
    >


  export type AddressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    label?: boolean
    name?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    pincode?: boolean
    country?: boolean
    isDefault?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["address"]>


  export type AddressSelectScalar = {
    id?: boolean
    userId?: boolean
    label?: boolean
    name?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    pincode?: boolean
    country?: boolean
    isDefault?: boolean
    createdAt?: boolean
  }

  export type AddressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AddressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Address"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      label: string
      name: string
      phone: string
      address: string
      city: string
      state: string
      pincode: string
      country: string
      isDefault: boolean
      createdAt: Date
    }, ExtArgs["result"]["address"]>
    composites: {}
  }

  type AddressGetPayload<S extends boolean | null | undefined | AddressDefaultArgs> = $Result.GetResult<Prisma.$AddressPayload, S>

  type AddressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AddressFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AddressCountAggregateInputType | true
    }

  export interface AddressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Address'], meta: { name: 'Address' } }
    /**
     * Find zero or one Address that matches the filter.
     * @param {AddressFindUniqueArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AddressFindUniqueArgs>(args: SelectSubset<T, AddressFindUniqueArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Address that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AddressFindUniqueOrThrowArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AddressFindUniqueOrThrowArgs>(args: SelectSubset<T, AddressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Address that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindFirstArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AddressFindFirstArgs>(args?: SelectSubset<T, AddressFindFirstArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Address that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindFirstOrThrowArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AddressFindFirstOrThrowArgs>(args?: SelectSubset<T, AddressFindFirstOrThrowArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Addresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Addresses
     * const addresses = await prisma.address.findMany()
     * 
     * // Get first 10 Addresses
     * const addresses = await prisma.address.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const addressWithIdOnly = await prisma.address.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AddressFindManyArgs>(args?: SelectSubset<T, AddressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Address.
     * @param {AddressCreateArgs} args - Arguments to create a Address.
     * @example
     * // Create one Address
     * const Address = await prisma.address.create({
     *   data: {
     *     // ... data to create a Address
     *   }
     * })
     * 
     */
    create<T extends AddressCreateArgs>(args: SelectSubset<T, AddressCreateArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Addresses.
     * @param {AddressCreateManyArgs} args - Arguments to create many Addresses.
     * @example
     * // Create many Addresses
     * const address = await prisma.address.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AddressCreateManyArgs>(args?: SelectSubset<T, AddressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Address.
     * @param {AddressDeleteArgs} args - Arguments to delete one Address.
     * @example
     * // Delete one Address
     * const Address = await prisma.address.delete({
     *   where: {
     *     // ... filter to delete one Address
     *   }
     * })
     * 
     */
    delete<T extends AddressDeleteArgs>(args: SelectSubset<T, AddressDeleteArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Address.
     * @param {AddressUpdateArgs} args - Arguments to update one Address.
     * @example
     * // Update one Address
     * const address = await prisma.address.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AddressUpdateArgs>(args: SelectSubset<T, AddressUpdateArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Addresses.
     * @param {AddressDeleteManyArgs} args - Arguments to filter Addresses to delete.
     * @example
     * // Delete a few Addresses
     * const { count } = await prisma.address.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AddressDeleteManyArgs>(args?: SelectSubset<T, AddressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Addresses
     * const address = await prisma.address.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AddressUpdateManyArgs>(args: SelectSubset<T, AddressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Address.
     * @param {AddressUpsertArgs} args - Arguments to update or create a Address.
     * @example
     * // Update or create a Address
     * const address = await prisma.address.upsert({
     *   create: {
     *     // ... data to create a Address
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Address we want to update
     *   }
     * })
     */
    upsert<T extends AddressUpsertArgs>(args: SelectSubset<T, AddressUpsertArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressCountArgs} args - Arguments to filter Addresses to count.
     * @example
     * // Count the number of Addresses
     * const count = await prisma.address.count({
     *   where: {
     *     // ... the filter for the Addresses we want to count
     *   }
     * })
    **/
    count<T extends AddressCountArgs>(
      args?: Subset<T, AddressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AddressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Address.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AddressAggregateArgs>(args: Subset<T, AddressAggregateArgs>): Prisma.PrismaPromise<GetAddressAggregateType<T>>

    /**
     * Group by Address.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AddressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AddressGroupByArgs['orderBy'] }
        : { orderBy?: AddressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AddressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAddressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Address model
   */
  readonly fields: AddressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Address.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AddressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Address model
   */ 
  interface AddressFieldRefs {
    readonly id: FieldRef<"Address", 'Int'>
    readonly userId: FieldRef<"Address", 'Int'>
    readonly label: FieldRef<"Address", 'String'>
    readonly name: FieldRef<"Address", 'String'>
    readonly phone: FieldRef<"Address", 'String'>
    readonly address: FieldRef<"Address", 'String'>
    readonly city: FieldRef<"Address", 'String'>
    readonly state: FieldRef<"Address", 'String'>
    readonly pincode: FieldRef<"Address", 'String'>
    readonly country: FieldRef<"Address", 'String'>
    readonly isDefault: FieldRef<"Address", 'Boolean'>
    readonly createdAt: FieldRef<"Address", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Address findUnique
   */
  export type AddressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address findUniqueOrThrow
   */
  export type AddressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address findFirst
   */
  export type AddressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Addresses.
     */
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address findFirstOrThrow
   */
  export type AddressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Addresses.
     */
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address findMany
   */
  export type AddressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Addresses to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address create
   */
  export type AddressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The data needed to create a Address.
     */
    data: XOR<AddressCreateInput, AddressUncheckedCreateInput>
  }

  /**
   * Address createMany
   */
  export type AddressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Addresses.
     */
    data: AddressCreateManyInput | AddressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Address update
   */
  export type AddressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The data needed to update a Address.
     */
    data: XOR<AddressUpdateInput, AddressUncheckedUpdateInput>
    /**
     * Choose, which Address to update.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address updateMany
   */
  export type AddressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Addresses.
     */
    data: XOR<AddressUpdateManyMutationInput, AddressUncheckedUpdateManyInput>
    /**
     * Filter which Addresses to update
     */
    where?: AddressWhereInput
  }

  /**
   * Address upsert
   */
  export type AddressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The filter to search for the Address to update in case it exists.
     */
    where: AddressWhereUniqueInput
    /**
     * In case the Address found by the `where` argument doesn't exist, create a new Address with this data.
     */
    create: XOR<AddressCreateInput, AddressUncheckedCreateInput>
    /**
     * In case the Address was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AddressUpdateInput, AddressUncheckedUpdateInput>
  }

  /**
   * Address delete
   */
  export type AddressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter which Address to delete.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address deleteMany
   */
  export type AddressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Addresses to delete
     */
    where?: AddressWhereInput
  }

  /**
   * Address without action
   */
  export type AddressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
  }


  /**
   * Model AdminSettings
   */

  export type AggregateAdminSettings = {
    _count: AdminSettingsCountAggregateOutputType | null
    _avg: AdminSettingsAvgAggregateOutputType | null
    _sum: AdminSettingsSumAggregateOutputType | null
    _min: AdminSettingsMinAggregateOutputType | null
    _max: AdminSettingsMaxAggregateOutputType | null
  }

  export type AdminSettingsAvgAggregateOutputType = {
    id: number | null
    defaultCommissionRate: number | null
    taxRate: number | null
    commissionGstRate: number | null
    shippingFreeAbove: number | null
    shippingChargePaise: number | null
    codShippingChargePaise: number | null
    internationalShippingPaise: number | null
    codMaxAmountPaise: number | null
    codSurchargePaise: number | null
    returnWindowDays: number | null
    vendorReturnSlaHours: number | null
    payoutCustomDays: number | null
  }

  export type AdminSettingsSumAggregateOutputType = {
    id: number | null
    defaultCommissionRate: number | null
    taxRate: number | null
    commissionGstRate: number | null
    shippingFreeAbove: number | null
    shippingChargePaise: number | null
    codShippingChargePaise: number | null
    internationalShippingPaise: number | null
    codMaxAmountPaise: number | null
    codSurchargePaise: number | null
    returnWindowDays: number | null
    vendorReturnSlaHours: number | null
    payoutCustomDays: number | null
  }

  export type AdminSettingsMinAggregateOutputType = {
    id: number | null
    defaultCommissionRate: number | null
    taxRate: number | null
    commissionGstRate: number | null
    commissionSacCode: string | null
    companyName: string | null
    companyAddress: string | null
    companyGstin: string | null
    companyPan: string | null
    companyCity: string | null
    companyState: string | null
    companyCountry: string | null
    companyPincode: string | null
    shippingFreeAbove: number | null
    shippingChargePaise: number | null
    codShippingChargePaise: number | null
    internationalShippingPaise: number | null
    codEnabled: boolean | null
    codMaxAmountPaise: number | null
    codSurchargePaise: number | null
    returnWindowDays: number | null
    returnEnabled: boolean | null
    vendorReturnSlaHours: number | null
    payoutSchedule: string | null
    payoutCustomDays: number | null
    lastPayoutRun: Date | null
    shiprocketPickupLocation: string | null
    shiprocketAutoAssign: boolean | null
    shiprocketCourierPriority: string | null
    updatedAt: Date | null
  }

  export type AdminSettingsMaxAggregateOutputType = {
    id: number | null
    defaultCommissionRate: number | null
    taxRate: number | null
    commissionGstRate: number | null
    commissionSacCode: string | null
    companyName: string | null
    companyAddress: string | null
    companyGstin: string | null
    companyPan: string | null
    companyCity: string | null
    companyState: string | null
    companyCountry: string | null
    companyPincode: string | null
    shippingFreeAbove: number | null
    shippingChargePaise: number | null
    codShippingChargePaise: number | null
    internationalShippingPaise: number | null
    codEnabled: boolean | null
    codMaxAmountPaise: number | null
    codSurchargePaise: number | null
    returnWindowDays: number | null
    returnEnabled: boolean | null
    vendorReturnSlaHours: number | null
    payoutSchedule: string | null
    payoutCustomDays: number | null
    lastPayoutRun: Date | null
    shiprocketPickupLocation: string | null
    shiprocketAutoAssign: boolean | null
    shiprocketCourierPriority: string | null
    updatedAt: Date | null
  }

  export type AdminSettingsCountAggregateOutputType = {
    id: number
    defaultCommissionRate: number
    taxRate: number
    commissionGstRate: number
    commissionSacCode: number
    companyName: number
    companyAddress: number
    companyGstin: number
    companyPan: number
    companyCity: number
    companyState: number
    companyCountry: number
    companyPincode: number
    shippingFreeAbove: number
    shippingChargePaise: number
    codShippingChargePaise: number
    internationalShippingPaise: number
    codEnabled: number
    codMaxAmountPaise: number
    codSurchargePaise: number
    returnWindowDays: number
    returnEnabled: number
    vendorReturnSlaHours: number
    payoutSchedule: number
    payoutCustomDays: number
    lastPayoutRun: number
    shiprocketPickupLocation: number
    shiprocketAutoAssign: number
    shiprocketCourierPriority: number
    homepageSections: number
    updatedAt: number
    _all: number
  }


  export type AdminSettingsAvgAggregateInputType = {
    id?: true
    defaultCommissionRate?: true
    taxRate?: true
    commissionGstRate?: true
    shippingFreeAbove?: true
    shippingChargePaise?: true
    codShippingChargePaise?: true
    internationalShippingPaise?: true
    codMaxAmountPaise?: true
    codSurchargePaise?: true
    returnWindowDays?: true
    vendorReturnSlaHours?: true
    payoutCustomDays?: true
  }

  export type AdminSettingsSumAggregateInputType = {
    id?: true
    defaultCommissionRate?: true
    taxRate?: true
    commissionGstRate?: true
    shippingFreeAbove?: true
    shippingChargePaise?: true
    codShippingChargePaise?: true
    internationalShippingPaise?: true
    codMaxAmountPaise?: true
    codSurchargePaise?: true
    returnWindowDays?: true
    vendorReturnSlaHours?: true
    payoutCustomDays?: true
  }

  export type AdminSettingsMinAggregateInputType = {
    id?: true
    defaultCommissionRate?: true
    taxRate?: true
    commissionGstRate?: true
    commissionSacCode?: true
    companyName?: true
    companyAddress?: true
    companyGstin?: true
    companyPan?: true
    companyCity?: true
    companyState?: true
    companyCountry?: true
    companyPincode?: true
    shippingFreeAbove?: true
    shippingChargePaise?: true
    codShippingChargePaise?: true
    internationalShippingPaise?: true
    codEnabled?: true
    codMaxAmountPaise?: true
    codSurchargePaise?: true
    returnWindowDays?: true
    returnEnabled?: true
    vendorReturnSlaHours?: true
    payoutSchedule?: true
    payoutCustomDays?: true
    lastPayoutRun?: true
    shiprocketPickupLocation?: true
    shiprocketAutoAssign?: true
    shiprocketCourierPriority?: true
    updatedAt?: true
  }

  export type AdminSettingsMaxAggregateInputType = {
    id?: true
    defaultCommissionRate?: true
    taxRate?: true
    commissionGstRate?: true
    commissionSacCode?: true
    companyName?: true
    companyAddress?: true
    companyGstin?: true
    companyPan?: true
    companyCity?: true
    companyState?: true
    companyCountry?: true
    companyPincode?: true
    shippingFreeAbove?: true
    shippingChargePaise?: true
    codShippingChargePaise?: true
    internationalShippingPaise?: true
    codEnabled?: true
    codMaxAmountPaise?: true
    codSurchargePaise?: true
    returnWindowDays?: true
    returnEnabled?: true
    vendorReturnSlaHours?: true
    payoutSchedule?: true
    payoutCustomDays?: true
    lastPayoutRun?: true
    shiprocketPickupLocation?: true
    shiprocketAutoAssign?: true
    shiprocketCourierPriority?: true
    updatedAt?: true
  }

  export type AdminSettingsCountAggregateInputType = {
    id?: true
    defaultCommissionRate?: true
    taxRate?: true
    commissionGstRate?: true
    commissionSacCode?: true
    companyName?: true
    companyAddress?: true
    companyGstin?: true
    companyPan?: true
    companyCity?: true
    companyState?: true
    companyCountry?: true
    companyPincode?: true
    shippingFreeAbove?: true
    shippingChargePaise?: true
    codShippingChargePaise?: true
    internationalShippingPaise?: true
    codEnabled?: true
    codMaxAmountPaise?: true
    codSurchargePaise?: true
    returnWindowDays?: true
    returnEnabled?: true
    vendorReturnSlaHours?: true
    payoutSchedule?: true
    payoutCustomDays?: true
    lastPayoutRun?: true
    shiprocketPickupLocation?: true
    shiprocketAutoAssign?: true
    shiprocketCourierPriority?: true
    homepageSections?: true
    updatedAt?: true
    _all?: true
  }

  export type AdminSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminSettings to aggregate.
     */
    where?: AdminSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminSettings to fetch.
     */
    orderBy?: AdminSettingsOrderByWithRelationInput | AdminSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminSettings
    **/
    _count?: true | AdminSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdminSettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdminSettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminSettingsMaxAggregateInputType
  }

  export type GetAdminSettingsAggregateType<T extends AdminSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminSettings[P]>
      : GetScalarType<T[P], AggregateAdminSettings[P]>
  }




  export type AdminSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminSettingsWhereInput
    orderBy?: AdminSettingsOrderByWithAggregationInput | AdminSettingsOrderByWithAggregationInput[]
    by: AdminSettingsScalarFieldEnum[] | AdminSettingsScalarFieldEnum
    having?: AdminSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminSettingsCountAggregateInputType | true
    _avg?: AdminSettingsAvgAggregateInputType
    _sum?: AdminSettingsSumAggregateInputType
    _min?: AdminSettingsMinAggregateInputType
    _max?: AdminSettingsMaxAggregateInputType
  }

  export type AdminSettingsGroupByOutputType = {
    id: number
    defaultCommissionRate: number
    taxRate: number
    commissionGstRate: number
    commissionSacCode: string
    companyName: string
    companyAddress: string
    companyGstin: string
    companyPan: string
    companyCity: string
    companyState: string
    companyCountry: string
    companyPincode: string
    shippingFreeAbove: number
    shippingChargePaise: number
    codShippingChargePaise: number
    internationalShippingPaise: number
    codEnabled: boolean
    codMaxAmountPaise: number
    codSurchargePaise: number
    returnWindowDays: number
    returnEnabled: boolean
    vendorReturnSlaHours: number
    payoutSchedule: string
    payoutCustomDays: number
    lastPayoutRun: Date | null
    shiprocketPickupLocation: string | null
    shiprocketAutoAssign: boolean
    shiprocketCourierPriority: string
    homepageSections: JsonValue | null
    updatedAt: Date
    _count: AdminSettingsCountAggregateOutputType | null
    _avg: AdminSettingsAvgAggregateOutputType | null
    _sum: AdminSettingsSumAggregateOutputType | null
    _min: AdminSettingsMinAggregateOutputType | null
    _max: AdminSettingsMaxAggregateOutputType | null
  }

  type GetAdminSettingsGroupByPayload<T extends AdminSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], AdminSettingsGroupByOutputType[P]>
        }
      >
    >


  export type AdminSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    defaultCommissionRate?: boolean
    taxRate?: boolean
    commissionGstRate?: boolean
    commissionSacCode?: boolean
    companyName?: boolean
    companyAddress?: boolean
    companyGstin?: boolean
    companyPan?: boolean
    companyCity?: boolean
    companyState?: boolean
    companyCountry?: boolean
    companyPincode?: boolean
    shippingFreeAbove?: boolean
    shippingChargePaise?: boolean
    codShippingChargePaise?: boolean
    internationalShippingPaise?: boolean
    codEnabled?: boolean
    codMaxAmountPaise?: boolean
    codSurchargePaise?: boolean
    returnWindowDays?: boolean
    returnEnabled?: boolean
    vendorReturnSlaHours?: boolean
    payoutSchedule?: boolean
    payoutCustomDays?: boolean
    lastPayoutRun?: boolean
    shiprocketPickupLocation?: boolean
    shiprocketAutoAssign?: boolean
    shiprocketCourierPriority?: boolean
    homepageSections?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminSettings"]>


  export type AdminSettingsSelectScalar = {
    id?: boolean
    defaultCommissionRate?: boolean
    taxRate?: boolean
    commissionGstRate?: boolean
    commissionSacCode?: boolean
    companyName?: boolean
    companyAddress?: boolean
    companyGstin?: boolean
    companyPan?: boolean
    companyCity?: boolean
    companyState?: boolean
    companyCountry?: boolean
    companyPincode?: boolean
    shippingFreeAbove?: boolean
    shippingChargePaise?: boolean
    codShippingChargePaise?: boolean
    internationalShippingPaise?: boolean
    codEnabled?: boolean
    codMaxAmountPaise?: boolean
    codSurchargePaise?: boolean
    returnWindowDays?: boolean
    returnEnabled?: boolean
    vendorReturnSlaHours?: boolean
    payoutSchedule?: boolean
    payoutCustomDays?: boolean
    lastPayoutRun?: boolean
    shiprocketPickupLocation?: boolean
    shiprocketAutoAssign?: boolean
    shiprocketCourierPriority?: boolean
    homepageSections?: boolean
    updatedAt?: boolean
  }


  export type $AdminSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminSettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      defaultCommissionRate: number
      taxRate: number
      commissionGstRate: number
      commissionSacCode: string
      companyName: string
      companyAddress: string
      companyGstin: string
      companyPan: string
      companyCity: string
      companyState: string
      companyCountry: string
      companyPincode: string
      shippingFreeAbove: number
      shippingChargePaise: number
      codShippingChargePaise: number
      internationalShippingPaise: number
      codEnabled: boolean
      codMaxAmountPaise: number
      codSurchargePaise: number
      returnWindowDays: number
      returnEnabled: boolean
      vendorReturnSlaHours: number
      payoutSchedule: string
      payoutCustomDays: number
      lastPayoutRun: Date | null
      shiprocketPickupLocation: string | null
      shiprocketAutoAssign: boolean
      shiprocketCourierPriority: string
      homepageSections: Prisma.JsonValue | null
      updatedAt: Date
    }, ExtArgs["result"]["adminSettings"]>
    composites: {}
  }

  type AdminSettingsGetPayload<S extends boolean | null | undefined | AdminSettingsDefaultArgs> = $Result.GetResult<Prisma.$AdminSettingsPayload, S>

  type AdminSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AdminSettingsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AdminSettingsCountAggregateInputType | true
    }

  export interface AdminSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminSettings'], meta: { name: 'AdminSettings' } }
    /**
     * Find zero or one AdminSettings that matches the filter.
     * @param {AdminSettingsFindUniqueArgs} args - Arguments to find a AdminSettings
     * @example
     * // Get one AdminSettings
     * const adminSettings = await prisma.adminSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminSettingsFindUniqueArgs>(args: SelectSubset<T, AdminSettingsFindUniqueArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AdminSettings that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AdminSettingsFindUniqueOrThrowArgs} args - Arguments to find a AdminSettings
     * @example
     * // Get one AdminSettings
     * const adminSettings = await prisma.adminSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AdminSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsFindFirstArgs} args - Arguments to find a AdminSettings
     * @example
     * // Get one AdminSettings
     * const adminSettings = await prisma.adminSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminSettingsFindFirstArgs>(args?: SelectSubset<T, AdminSettingsFindFirstArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AdminSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsFindFirstOrThrowArgs} args - Arguments to find a AdminSettings
     * @example
     * // Get one AdminSettings
     * const adminSettings = await prisma.adminSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AdminSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminSettings
     * const adminSettings = await prisma.adminSettings.findMany()
     * 
     * // Get first 10 AdminSettings
     * const adminSettings = await prisma.adminSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminSettingsWithIdOnly = await prisma.adminSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminSettingsFindManyArgs>(args?: SelectSubset<T, AdminSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AdminSettings.
     * @param {AdminSettingsCreateArgs} args - Arguments to create a AdminSettings.
     * @example
     * // Create one AdminSettings
     * const AdminSettings = await prisma.adminSettings.create({
     *   data: {
     *     // ... data to create a AdminSettings
     *   }
     * })
     * 
     */
    create<T extends AdminSettingsCreateArgs>(args: SelectSubset<T, AdminSettingsCreateArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AdminSettings.
     * @param {AdminSettingsCreateManyArgs} args - Arguments to create many AdminSettings.
     * @example
     * // Create many AdminSettings
     * const adminSettings = await prisma.adminSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminSettingsCreateManyArgs>(args?: SelectSubset<T, AdminSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AdminSettings.
     * @param {AdminSettingsDeleteArgs} args - Arguments to delete one AdminSettings.
     * @example
     * // Delete one AdminSettings
     * const AdminSettings = await prisma.adminSettings.delete({
     *   where: {
     *     // ... filter to delete one AdminSettings
     *   }
     * })
     * 
     */
    delete<T extends AdminSettingsDeleteArgs>(args: SelectSubset<T, AdminSettingsDeleteArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AdminSettings.
     * @param {AdminSettingsUpdateArgs} args - Arguments to update one AdminSettings.
     * @example
     * // Update one AdminSettings
     * const adminSettings = await prisma.adminSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminSettingsUpdateArgs>(args: SelectSubset<T, AdminSettingsUpdateArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AdminSettings.
     * @param {AdminSettingsDeleteManyArgs} args - Arguments to filter AdminSettings to delete.
     * @example
     * // Delete a few AdminSettings
     * const { count } = await prisma.adminSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminSettingsDeleteManyArgs>(args?: SelectSubset<T, AdminSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminSettings
     * const adminSettings = await prisma.adminSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminSettingsUpdateManyArgs>(args: SelectSubset<T, AdminSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AdminSettings.
     * @param {AdminSettingsUpsertArgs} args - Arguments to update or create a AdminSettings.
     * @example
     * // Update or create a AdminSettings
     * const adminSettings = await prisma.adminSettings.upsert({
     *   create: {
     *     // ... data to create a AdminSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminSettings we want to update
     *   }
     * })
     */
    upsert<T extends AdminSettingsUpsertArgs>(args: SelectSubset<T, AdminSettingsUpsertArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AdminSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsCountArgs} args - Arguments to filter AdminSettings to count.
     * @example
     * // Count the number of AdminSettings
     * const count = await prisma.adminSettings.count({
     *   where: {
     *     // ... the filter for the AdminSettings we want to count
     *   }
     * })
    **/
    count<T extends AdminSettingsCountArgs>(
      args?: Subset<T, AdminSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminSettingsAggregateArgs>(args: Subset<T, AdminSettingsAggregateArgs>): Prisma.PrismaPromise<GetAdminSettingsAggregateType<T>>

    /**
     * Group by AdminSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminSettingsGroupByArgs['orderBy'] }
        : { orderBy?: AdminSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminSettings model
   */
  readonly fields: AdminSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminSettings model
   */ 
  interface AdminSettingsFieldRefs {
    readonly id: FieldRef<"AdminSettings", 'Int'>
    readonly defaultCommissionRate: FieldRef<"AdminSettings", 'Float'>
    readonly taxRate: FieldRef<"AdminSettings", 'Float'>
    readonly commissionGstRate: FieldRef<"AdminSettings", 'Float'>
    readonly commissionSacCode: FieldRef<"AdminSettings", 'String'>
    readonly companyName: FieldRef<"AdminSettings", 'String'>
    readonly companyAddress: FieldRef<"AdminSettings", 'String'>
    readonly companyGstin: FieldRef<"AdminSettings", 'String'>
    readonly companyPan: FieldRef<"AdminSettings", 'String'>
    readonly companyCity: FieldRef<"AdminSettings", 'String'>
    readonly companyState: FieldRef<"AdminSettings", 'String'>
    readonly companyCountry: FieldRef<"AdminSettings", 'String'>
    readonly companyPincode: FieldRef<"AdminSettings", 'String'>
    readonly shippingFreeAbove: FieldRef<"AdminSettings", 'Int'>
    readonly shippingChargePaise: FieldRef<"AdminSettings", 'Int'>
    readonly codShippingChargePaise: FieldRef<"AdminSettings", 'Int'>
    readonly internationalShippingPaise: FieldRef<"AdminSettings", 'Int'>
    readonly codEnabled: FieldRef<"AdminSettings", 'Boolean'>
    readonly codMaxAmountPaise: FieldRef<"AdminSettings", 'Int'>
    readonly codSurchargePaise: FieldRef<"AdminSettings", 'Int'>
    readonly returnWindowDays: FieldRef<"AdminSettings", 'Int'>
    readonly returnEnabled: FieldRef<"AdminSettings", 'Boolean'>
    readonly vendorReturnSlaHours: FieldRef<"AdminSettings", 'Int'>
    readonly payoutSchedule: FieldRef<"AdminSettings", 'String'>
    readonly payoutCustomDays: FieldRef<"AdminSettings", 'Int'>
    readonly lastPayoutRun: FieldRef<"AdminSettings", 'DateTime'>
    readonly shiprocketPickupLocation: FieldRef<"AdminSettings", 'String'>
    readonly shiprocketAutoAssign: FieldRef<"AdminSettings", 'Boolean'>
    readonly shiprocketCourierPriority: FieldRef<"AdminSettings", 'String'>
    readonly homepageSections: FieldRef<"AdminSettings", 'Json'>
    readonly updatedAt: FieldRef<"AdminSettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminSettings findUnique
   */
  export type AdminSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Filter, which AdminSettings to fetch.
     */
    where: AdminSettingsWhereUniqueInput
  }

  /**
   * AdminSettings findUniqueOrThrow
   */
  export type AdminSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Filter, which AdminSettings to fetch.
     */
    where: AdminSettingsWhereUniqueInput
  }

  /**
   * AdminSettings findFirst
   */
  export type AdminSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Filter, which AdminSettings to fetch.
     */
    where?: AdminSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminSettings to fetch.
     */
    orderBy?: AdminSettingsOrderByWithRelationInput | AdminSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminSettings.
     */
    cursor?: AdminSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminSettings.
     */
    distinct?: AdminSettingsScalarFieldEnum | AdminSettingsScalarFieldEnum[]
  }

  /**
   * AdminSettings findFirstOrThrow
   */
  export type AdminSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Filter, which AdminSettings to fetch.
     */
    where?: AdminSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminSettings to fetch.
     */
    orderBy?: AdminSettingsOrderByWithRelationInput | AdminSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminSettings.
     */
    cursor?: AdminSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminSettings.
     */
    distinct?: AdminSettingsScalarFieldEnum | AdminSettingsScalarFieldEnum[]
  }

  /**
   * AdminSettings findMany
   */
  export type AdminSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Filter, which AdminSettings to fetch.
     */
    where?: AdminSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminSettings to fetch.
     */
    orderBy?: AdminSettingsOrderByWithRelationInput | AdminSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminSettings.
     */
    cursor?: AdminSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminSettings.
     */
    skip?: number
    distinct?: AdminSettingsScalarFieldEnum | AdminSettingsScalarFieldEnum[]
  }

  /**
   * AdminSettings create
   */
  export type AdminSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * The data needed to create a AdminSettings.
     */
    data: XOR<AdminSettingsCreateInput, AdminSettingsUncheckedCreateInput>
  }

  /**
   * AdminSettings createMany
   */
  export type AdminSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminSettings.
     */
    data: AdminSettingsCreateManyInput | AdminSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminSettings update
   */
  export type AdminSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * The data needed to update a AdminSettings.
     */
    data: XOR<AdminSettingsUpdateInput, AdminSettingsUncheckedUpdateInput>
    /**
     * Choose, which AdminSettings to update.
     */
    where: AdminSettingsWhereUniqueInput
  }

  /**
   * AdminSettings updateMany
   */
  export type AdminSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminSettings.
     */
    data: XOR<AdminSettingsUpdateManyMutationInput, AdminSettingsUncheckedUpdateManyInput>
    /**
     * Filter which AdminSettings to update
     */
    where?: AdminSettingsWhereInput
  }

  /**
   * AdminSettings upsert
   */
  export type AdminSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * The filter to search for the AdminSettings to update in case it exists.
     */
    where: AdminSettingsWhereUniqueInput
    /**
     * In case the AdminSettings found by the `where` argument doesn't exist, create a new AdminSettings with this data.
     */
    create: XOR<AdminSettingsCreateInput, AdminSettingsUncheckedCreateInput>
    /**
     * In case the AdminSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminSettingsUpdateInput, AdminSettingsUncheckedUpdateInput>
  }

  /**
   * AdminSettings delete
   */
  export type AdminSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Filter which AdminSettings to delete.
     */
    where: AdminSettingsWhereUniqueInput
  }

  /**
   * AdminSettings deleteMany
   */
  export type AdminSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminSettings to delete
     */
    where?: AdminSettingsWhereInput
  }

  /**
   * AdminSettings without action
   */
  export type AdminSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt',
    mobile: 'mobile',
    location: 'location',
    artisanId: 'artisanId',
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

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    image: 'image'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const ProductScalarFieldEnum: {
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
    vendorId: 'vendorId'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const InquiryScalarFieldEnum: {
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

  export type InquiryScalarFieldEnum = (typeof InquiryScalarFieldEnum)[keyof typeof InquiryScalarFieldEnum]


  export const OrderScalarFieldEnum: {
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
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const OrderItemScalarFieldEnum: {
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

  export type OrderItemScalarFieldEnum = (typeof OrderItemScalarFieldEnum)[keyof typeof OrderItemScalarFieldEnum]


  export const ReturnRequestScalarFieldEnum: {
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

  export type ReturnRequestScalarFieldEnum = (typeof ReturnRequestScalarFieldEnum)[keyof typeof ReturnRequestScalarFieldEnum]


  export const SettlementScalarFieldEnum: {
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

  export type SettlementScalarFieldEnum = (typeof SettlementScalarFieldEnum)[keyof typeof SettlementScalarFieldEnum]


  export const AddressScalarFieldEnum: {
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

  export type AddressScalarFieldEnum = (typeof AddressScalarFieldEnum)[keyof typeof AddressScalarFieldEnum]


  export const AdminSettingsScalarFieldEnum: {
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
    updatedAt: 'updatedAt'
  };

  export type AdminSettingsScalarFieldEnum = (typeof AdminSettingsScalarFieldEnum)[keyof typeof AdminSettingsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    mobile?: StringNullableFilter<"User"> | string | null
    location?: StringNullableFilter<"User"> | string | null
    artisanId?: StringNullableFilter<"User"> | string | null
    gstin?: StringNullableFilter<"User"> | string | null
    aadhaar?: StringNullableFilter<"User"> | string | null
    pan?: StringNullableFilter<"User"> | string | null
    aadhaarUrl?: StringNullableFilter<"User"> | string | null
    panUrl?: StringNullableFilter<"User"> | string | null
    docUrl?: StringNullableFilter<"User"> | string | null
    vendorStatus?: StringFilter<"User"> | string
    rejectionReason?: StringNullableFilter<"User"> | string | null
    allowedCategories?: StringNullableFilter<"User"> | string | null
    razorpayAccountId?: StringNullableFilter<"User"> | string | null
    payoutsPaused?: BoolFilter<"User"> | boolean
    products?: ProductListRelationFilter
    orders?: OrderListRelationFilter
    addresses?: AddressListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    mobile?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    artisanId?: SortOrderInput | SortOrder
    gstin?: SortOrderInput | SortOrder
    aadhaar?: SortOrderInput | SortOrder
    pan?: SortOrderInput | SortOrder
    aadhaarUrl?: SortOrderInput | SortOrder
    panUrl?: SortOrderInput | SortOrder
    docUrl?: SortOrderInput | SortOrder
    vendorStatus?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    allowedCategories?: SortOrderInput | SortOrder
    razorpayAccountId?: SortOrderInput | SortOrder
    payoutsPaused?: SortOrder
    products?: ProductOrderByRelationAggregateInput
    orders?: OrderOrderByRelationAggregateInput
    addresses?: AddressOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    mobile?: StringNullableFilter<"User"> | string | null
    location?: StringNullableFilter<"User"> | string | null
    artisanId?: StringNullableFilter<"User"> | string | null
    gstin?: StringNullableFilter<"User"> | string | null
    aadhaar?: StringNullableFilter<"User"> | string | null
    pan?: StringNullableFilter<"User"> | string | null
    aadhaarUrl?: StringNullableFilter<"User"> | string | null
    panUrl?: StringNullableFilter<"User"> | string | null
    docUrl?: StringNullableFilter<"User"> | string | null
    vendorStatus?: StringFilter<"User"> | string
    rejectionReason?: StringNullableFilter<"User"> | string | null
    allowedCategories?: StringNullableFilter<"User"> | string | null
    razorpayAccountId?: StringNullableFilter<"User"> | string | null
    payoutsPaused?: BoolFilter<"User"> | boolean
    products?: ProductListRelationFilter
    orders?: OrderListRelationFilter
    addresses?: AddressListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    mobile?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    artisanId?: SortOrderInput | SortOrder
    gstin?: SortOrderInput | SortOrder
    aadhaar?: SortOrderInput | SortOrder
    pan?: SortOrderInput | SortOrder
    aadhaarUrl?: SortOrderInput | SortOrder
    panUrl?: SortOrderInput | SortOrder
    docUrl?: SortOrderInput | SortOrder
    vendorStatus?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    allowedCategories?: SortOrderInput | SortOrder
    razorpayAccountId?: SortOrderInput | SortOrder
    payoutsPaused?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    mobile?: StringNullableWithAggregatesFilter<"User"> | string | null
    location?: StringNullableWithAggregatesFilter<"User"> | string | null
    artisanId?: StringNullableWithAggregatesFilter<"User"> | string | null
    gstin?: StringNullableWithAggregatesFilter<"User"> | string | null
    aadhaar?: StringNullableWithAggregatesFilter<"User"> | string | null
    pan?: StringNullableWithAggregatesFilter<"User"> | string | null
    aadhaarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    panUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    docUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    vendorStatus?: StringWithAggregatesFilter<"User"> | string
    rejectionReason?: StringNullableWithAggregatesFilter<"User"> | string | null
    allowedCategories?: StringNullableWithAggregatesFilter<"User"> | string | null
    razorpayAccountId?: StringNullableWithAggregatesFilter<"User"> | string | null
    payoutsPaused?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: IntFilter<"Category"> | number
    name?: StringFilter<"Category"> | string
    slug?: StringFilter<"Category"> | string
    image?: StringFilter<"Category"> | string
    products?: ProductListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    image?: SortOrder
    products?: ProductOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    slug?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    name?: StringFilter<"Category"> | string
    image?: StringFilter<"Category"> | string
    products?: ProductListRelationFilter
  }, "id" | "slug">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    image?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Category"> | number
    name?: StringWithAggregatesFilter<"Category"> | string
    slug?: StringWithAggregatesFilter<"Category"> | string
    image?: StringWithAggregatesFilter<"Category"> | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: IntFilter<"Product"> | number
    name?: StringFilter<"Product"> | string
    slug?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    specs?: StringFilter<"Product"> | string
    image?: StringFilter<"Product"> | string
    images?: JsonNullableFilter<"Product">
    prices?: JsonNullableFilter<"Product">
    price?: FloatFilter<"Product"> | number
    mrp?: FloatFilter<"Product"> | number
    discount?: FloatFilter<"Product"> | number
    rating?: FloatFilter<"Product"> | number
    reviews?: IntFilter<"Product"> | number
    categoryName?: StringFilter<"Product"> | string
    material?: StringFilter<"Product"> | string
    stock?: IntFilter<"Product"> | number
    featured?: BoolFilter<"Product"> | boolean
    newLaunch?: BoolFilter<"Product"> | boolean
    active?: BoolFilter<"Product"> | boolean
    createdAt?: DateTimeFilter<"Product"> | Date | string
    vendorId?: IntNullableFilter<"Product"> | number | null
    category?: XOR<CategoryRelationFilter, CategoryWhereInput>
    vendor?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    orderItems?: OrderItemListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    specs?: SortOrder
    image?: SortOrder
    images?: SortOrderInput | SortOrder
    prices?: SortOrderInput | SortOrder
    price?: SortOrder
    mrp?: SortOrder
    discount?: SortOrder
    rating?: SortOrder
    reviews?: SortOrder
    categoryName?: SortOrder
    material?: SortOrder
    stock?: SortOrder
    featured?: SortOrder
    newLaunch?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    vendorId?: SortOrderInput | SortOrder
    category?: CategoryOrderByWithRelationInput
    vendor?: UserOrderByWithRelationInput
    orderItems?: OrderItemOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    slug?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    specs?: StringFilter<"Product"> | string
    image?: StringFilter<"Product"> | string
    images?: JsonNullableFilter<"Product">
    prices?: JsonNullableFilter<"Product">
    price?: FloatFilter<"Product"> | number
    mrp?: FloatFilter<"Product"> | number
    discount?: FloatFilter<"Product"> | number
    rating?: FloatFilter<"Product"> | number
    reviews?: IntFilter<"Product"> | number
    categoryName?: StringFilter<"Product"> | string
    material?: StringFilter<"Product"> | string
    stock?: IntFilter<"Product"> | number
    featured?: BoolFilter<"Product"> | boolean
    newLaunch?: BoolFilter<"Product"> | boolean
    active?: BoolFilter<"Product"> | boolean
    createdAt?: DateTimeFilter<"Product"> | Date | string
    vendorId?: IntNullableFilter<"Product"> | number | null
    category?: XOR<CategoryRelationFilter, CategoryWhereInput>
    vendor?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    orderItems?: OrderItemListRelationFilter
  }, "id" | "slug">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    specs?: SortOrder
    image?: SortOrder
    images?: SortOrderInput | SortOrder
    prices?: SortOrderInput | SortOrder
    price?: SortOrder
    mrp?: SortOrder
    discount?: SortOrder
    rating?: SortOrder
    reviews?: SortOrder
    categoryName?: SortOrder
    material?: SortOrder
    stock?: SortOrder
    featured?: SortOrder
    newLaunch?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    vendorId?: SortOrderInput | SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Product"> | number
    name?: StringWithAggregatesFilter<"Product"> | string
    slug?: StringWithAggregatesFilter<"Product"> | string
    description?: StringWithAggregatesFilter<"Product"> | string
    specs?: StringWithAggregatesFilter<"Product"> | string
    image?: StringWithAggregatesFilter<"Product"> | string
    images?: JsonNullableWithAggregatesFilter<"Product">
    prices?: JsonNullableWithAggregatesFilter<"Product">
    price?: FloatWithAggregatesFilter<"Product"> | number
    mrp?: FloatWithAggregatesFilter<"Product"> | number
    discount?: FloatWithAggregatesFilter<"Product"> | number
    rating?: FloatWithAggregatesFilter<"Product"> | number
    reviews?: IntWithAggregatesFilter<"Product"> | number
    categoryName?: StringWithAggregatesFilter<"Product"> | string
    material?: StringWithAggregatesFilter<"Product"> | string
    stock?: IntWithAggregatesFilter<"Product"> | number
    featured?: BoolWithAggregatesFilter<"Product"> | boolean
    newLaunch?: BoolWithAggregatesFilter<"Product"> | boolean
    active?: BoolWithAggregatesFilter<"Product"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    vendorId?: IntNullableWithAggregatesFilter<"Product"> | number | null
  }

  export type InquiryWhereInput = {
    AND?: InquiryWhereInput | InquiryWhereInput[]
    OR?: InquiryWhereInput[]
    NOT?: InquiryWhereInput | InquiryWhereInput[]
    id?: IntFilter<"Inquiry"> | number
    name?: StringFilter<"Inquiry"> | string
    email?: StringFilter<"Inquiry"> | string
    phone?: StringFilter<"Inquiry"> | string
    companyName?: StringNullableFilter<"Inquiry"> | string | null
    country?: StringNullableFilter<"Inquiry"> | string | null
    items?: JsonNullableFilter<"Inquiry">
    message?: StringFilter<"Inquiry"> | string
    status?: StringFilter<"Inquiry"> | string
    createdAt?: DateTimeFilter<"Inquiry"> | Date | string
  }

  export type InquiryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    companyName?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    items?: SortOrderInput | SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type InquiryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: InquiryWhereInput | InquiryWhereInput[]
    OR?: InquiryWhereInput[]
    NOT?: InquiryWhereInput | InquiryWhereInput[]
    name?: StringFilter<"Inquiry"> | string
    email?: StringFilter<"Inquiry"> | string
    phone?: StringFilter<"Inquiry"> | string
    companyName?: StringNullableFilter<"Inquiry"> | string | null
    country?: StringNullableFilter<"Inquiry"> | string | null
    items?: JsonNullableFilter<"Inquiry">
    message?: StringFilter<"Inquiry"> | string
    status?: StringFilter<"Inquiry"> | string
    createdAt?: DateTimeFilter<"Inquiry"> | Date | string
  }, "id">

  export type InquiryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    companyName?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    items?: SortOrderInput | SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: InquiryCountOrderByAggregateInput
    _avg?: InquiryAvgOrderByAggregateInput
    _max?: InquiryMaxOrderByAggregateInput
    _min?: InquiryMinOrderByAggregateInput
    _sum?: InquirySumOrderByAggregateInput
  }

  export type InquiryScalarWhereWithAggregatesInput = {
    AND?: InquiryScalarWhereWithAggregatesInput | InquiryScalarWhereWithAggregatesInput[]
    OR?: InquiryScalarWhereWithAggregatesInput[]
    NOT?: InquiryScalarWhereWithAggregatesInput | InquiryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Inquiry"> | number
    name?: StringWithAggregatesFilter<"Inquiry"> | string
    email?: StringWithAggregatesFilter<"Inquiry"> | string
    phone?: StringWithAggregatesFilter<"Inquiry"> | string
    companyName?: StringNullableWithAggregatesFilter<"Inquiry"> | string | null
    country?: StringNullableWithAggregatesFilter<"Inquiry"> | string | null
    items?: JsonNullableWithAggregatesFilter<"Inquiry">
    message?: StringWithAggregatesFilter<"Inquiry"> | string
    status?: StringWithAggregatesFilter<"Inquiry"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Inquiry"> | Date | string
  }

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    orderNumber?: StringFilter<"Order"> | string
    userId?: IntFilter<"Order"> | number
    paymentMethod?: StringFilter<"Order"> | string
    paymentGateway?: StringNullableFilter<"Order"> | string | null
    paymentStatus?: StringFilter<"Order"> | string
    razorpayPaymentId?: StringNullableFilter<"Order"> | string | null
    paymentOrderId?: StringNullableFilter<"Order"> | string | null
    paymentData?: JsonNullableFilter<"Order">
    subtotalPaise?: IntFilter<"Order"> | number
    shippingPaise?: IntFilter<"Order"> | number
    codChargePaise?: IntFilter<"Order"> | number
    taxPaise?: IntFilter<"Order"> | number
    totalPaise?: IntFilter<"Order"> | number
    currency?: StringFilter<"Order"> | string
    commissionRate?: FloatFilter<"Order"> | number
    commissionPaise?: IntFilter<"Order"> | number
    vendorPayoutPaise?: IntFilter<"Order"> | number
    settlementStatus?: StringFilter<"Order"> | string
    settlementDate?: DateTimeNullableFilter<"Order"> | Date | string | null
    shippingName?: StringFilter<"Order"> | string
    shippingPhone?: StringFilter<"Order"> | string
    shippingEmail?: StringFilter<"Order"> | string
    shippingAddress?: StringFilter<"Order"> | string
    shippingCity?: StringFilter<"Order"> | string
    shippingState?: StringFilter<"Order"> | string
    shippingPincode?: StringFilter<"Order"> | string
    shippingCountry?: StringFilter<"Order"> | string
    status?: StringFilter<"Order"> | string
    deliveryDate?: DateTimeNullableFilter<"Order"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    trackingId?: StringNullableFilter<"Order"> | string | null
    returnWindowDays?: IntFilter<"Order"> | number
    shiprocketOrderId?: IntNullableFilter<"Order"> | number | null
    shiprocketShipmentId?: IntNullableFilter<"Order"> | number | null
    awbCode?: StringNullableFilter<"Order"> | string | null
    courierName?: StringNullableFilter<"Order"> | string | null
    courierId?: IntNullableFilter<"Order"> | number | null
    shippingLabelUrl?: StringNullableFilter<"Order"> | string | null
    manifestUrl?: StringNullableFilter<"Order"> | string | null
    estimatedDelivery?: DateTimeNullableFilter<"Order"> | Date | string | null
    shiprocketStatus?: StringNullableFilter<"Order"> | string | null
    returnShiprocketId?: IntNullableFilter<"Order"> | number | null
    returnAwbCode?: StringNullableFilter<"Order"> | string | null
    returnCourierName?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    items?: OrderItemListRelationFilter
    returnRequest?: XOR<ReturnRequestNullableRelationFilter, ReturnRequestWhereInput> | null
    settlements?: SettlementListRelationFilter
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    userId?: SortOrder
    paymentMethod?: SortOrder
    paymentGateway?: SortOrderInput | SortOrder
    paymentStatus?: SortOrder
    razorpayPaymentId?: SortOrderInput | SortOrder
    paymentOrderId?: SortOrderInput | SortOrder
    paymentData?: SortOrderInput | SortOrder
    subtotalPaise?: SortOrder
    shippingPaise?: SortOrder
    codChargePaise?: SortOrder
    taxPaise?: SortOrder
    totalPaise?: SortOrder
    currency?: SortOrder
    commissionRate?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    settlementStatus?: SortOrder
    settlementDate?: SortOrderInput | SortOrder
    shippingName?: SortOrder
    shippingPhone?: SortOrder
    shippingEmail?: SortOrder
    shippingAddress?: SortOrder
    shippingCity?: SortOrder
    shippingState?: SortOrder
    shippingPincode?: SortOrder
    shippingCountry?: SortOrder
    status?: SortOrder
    deliveryDate?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    trackingId?: SortOrderInput | SortOrder
    returnWindowDays?: SortOrder
    shiprocketOrderId?: SortOrderInput | SortOrder
    shiprocketShipmentId?: SortOrderInput | SortOrder
    awbCode?: SortOrderInput | SortOrder
    courierName?: SortOrderInput | SortOrder
    courierId?: SortOrderInput | SortOrder
    shippingLabelUrl?: SortOrderInput | SortOrder
    manifestUrl?: SortOrderInput | SortOrder
    estimatedDelivery?: SortOrderInput | SortOrder
    shiprocketStatus?: SortOrderInput | SortOrder
    returnShiprocketId?: SortOrderInput | SortOrder
    returnAwbCode?: SortOrderInput | SortOrder
    returnCourierName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    items?: OrderItemOrderByRelationAggregateInput
    returnRequest?: ReturnRequestOrderByWithRelationInput
    settlements?: SettlementOrderByRelationAggregateInput
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderNumber?: string
    paymentOrderId?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    userId?: IntFilter<"Order"> | number
    paymentMethod?: StringFilter<"Order"> | string
    paymentGateway?: StringNullableFilter<"Order"> | string | null
    paymentStatus?: StringFilter<"Order"> | string
    razorpayPaymentId?: StringNullableFilter<"Order"> | string | null
    paymentData?: JsonNullableFilter<"Order">
    subtotalPaise?: IntFilter<"Order"> | number
    shippingPaise?: IntFilter<"Order"> | number
    codChargePaise?: IntFilter<"Order"> | number
    taxPaise?: IntFilter<"Order"> | number
    totalPaise?: IntFilter<"Order"> | number
    currency?: StringFilter<"Order"> | string
    commissionRate?: FloatFilter<"Order"> | number
    commissionPaise?: IntFilter<"Order"> | number
    vendorPayoutPaise?: IntFilter<"Order"> | number
    settlementStatus?: StringFilter<"Order"> | string
    settlementDate?: DateTimeNullableFilter<"Order"> | Date | string | null
    shippingName?: StringFilter<"Order"> | string
    shippingPhone?: StringFilter<"Order"> | string
    shippingEmail?: StringFilter<"Order"> | string
    shippingAddress?: StringFilter<"Order"> | string
    shippingCity?: StringFilter<"Order"> | string
    shippingState?: StringFilter<"Order"> | string
    shippingPincode?: StringFilter<"Order"> | string
    shippingCountry?: StringFilter<"Order"> | string
    status?: StringFilter<"Order"> | string
    deliveryDate?: DateTimeNullableFilter<"Order"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    trackingId?: StringNullableFilter<"Order"> | string | null
    returnWindowDays?: IntFilter<"Order"> | number
    shiprocketOrderId?: IntNullableFilter<"Order"> | number | null
    shiprocketShipmentId?: IntNullableFilter<"Order"> | number | null
    awbCode?: StringNullableFilter<"Order"> | string | null
    courierName?: StringNullableFilter<"Order"> | string | null
    courierId?: IntNullableFilter<"Order"> | number | null
    shippingLabelUrl?: StringNullableFilter<"Order"> | string | null
    manifestUrl?: StringNullableFilter<"Order"> | string | null
    estimatedDelivery?: DateTimeNullableFilter<"Order"> | Date | string | null
    shiprocketStatus?: StringNullableFilter<"Order"> | string | null
    returnShiprocketId?: IntNullableFilter<"Order"> | number | null
    returnAwbCode?: StringNullableFilter<"Order"> | string | null
    returnCourierName?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    items?: OrderItemListRelationFilter
    returnRequest?: XOR<ReturnRequestNullableRelationFilter, ReturnRequestWhereInput> | null
    settlements?: SettlementListRelationFilter
  }, "id" | "orderNumber" | "paymentOrderId">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    userId?: SortOrder
    paymentMethod?: SortOrder
    paymentGateway?: SortOrderInput | SortOrder
    paymentStatus?: SortOrder
    razorpayPaymentId?: SortOrderInput | SortOrder
    paymentOrderId?: SortOrderInput | SortOrder
    paymentData?: SortOrderInput | SortOrder
    subtotalPaise?: SortOrder
    shippingPaise?: SortOrder
    codChargePaise?: SortOrder
    taxPaise?: SortOrder
    totalPaise?: SortOrder
    currency?: SortOrder
    commissionRate?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    settlementStatus?: SortOrder
    settlementDate?: SortOrderInput | SortOrder
    shippingName?: SortOrder
    shippingPhone?: SortOrder
    shippingEmail?: SortOrder
    shippingAddress?: SortOrder
    shippingCity?: SortOrder
    shippingState?: SortOrder
    shippingPincode?: SortOrder
    shippingCountry?: SortOrder
    status?: SortOrder
    deliveryDate?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    trackingId?: SortOrderInput | SortOrder
    returnWindowDays?: SortOrder
    shiprocketOrderId?: SortOrderInput | SortOrder
    shiprocketShipmentId?: SortOrderInput | SortOrder
    awbCode?: SortOrderInput | SortOrder
    courierName?: SortOrderInput | SortOrder
    courierId?: SortOrderInput | SortOrder
    shippingLabelUrl?: SortOrderInput | SortOrder
    manifestUrl?: SortOrderInput | SortOrder
    estimatedDelivery?: SortOrderInput | SortOrder
    shiprocketStatus?: SortOrderInput | SortOrder
    returnShiprocketId?: SortOrderInput | SortOrder
    returnAwbCode?: SortOrderInput | SortOrder
    returnCourierName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrderCountOrderByAggregateInput
    _avg?: OrderAvgOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
    _sum?: OrderSumOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    orderNumber?: StringWithAggregatesFilter<"Order"> | string
    userId?: IntWithAggregatesFilter<"Order"> | number
    paymentMethod?: StringWithAggregatesFilter<"Order"> | string
    paymentGateway?: StringNullableWithAggregatesFilter<"Order"> | string | null
    paymentStatus?: StringWithAggregatesFilter<"Order"> | string
    razorpayPaymentId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    paymentOrderId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    paymentData?: JsonNullableWithAggregatesFilter<"Order">
    subtotalPaise?: IntWithAggregatesFilter<"Order"> | number
    shippingPaise?: IntWithAggregatesFilter<"Order"> | number
    codChargePaise?: IntWithAggregatesFilter<"Order"> | number
    taxPaise?: IntWithAggregatesFilter<"Order"> | number
    totalPaise?: IntWithAggregatesFilter<"Order"> | number
    currency?: StringWithAggregatesFilter<"Order"> | string
    commissionRate?: FloatWithAggregatesFilter<"Order"> | number
    commissionPaise?: IntWithAggregatesFilter<"Order"> | number
    vendorPayoutPaise?: IntWithAggregatesFilter<"Order"> | number
    settlementStatus?: StringWithAggregatesFilter<"Order"> | string
    settlementDate?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    shippingName?: StringWithAggregatesFilter<"Order"> | string
    shippingPhone?: StringWithAggregatesFilter<"Order"> | string
    shippingEmail?: StringWithAggregatesFilter<"Order"> | string
    shippingAddress?: StringWithAggregatesFilter<"Order"> | string
    shippingCity?: StringWithAggregatesFilter<"Order"> | string
    shippingState?: StringWithAggregatesFilter<"Order"> | string
    shippingPincode?: StringWithAggregatesFilter<"Order"> | string
    shippingCountry?: StringWithAggregatesFilter<"Order"> | string
    status?: StringWithAggregatesFilter<"Order"> | string
    deliveryDate?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    deliveredAt?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    trackingId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    returnWindowDays?: IntWithAggregatesFilter<"Order"> | number
    shiprocketOrderId?: IntNullableWithAggregatesFilter<"Order"> | number | null
    shiprocketShipmentId?: IntNullableWithAggregatesFilter<"Order"> | number | null
    awbCode?: StringNullableWithAggregatesFilter<"Order"> | string | null
    courierName?: StringNullableWithAggregatesFilter<"Order"> | string | null
    courierId?: IntNullableWithAggregatesFilter<"Order"> | number | null
    shippingLabelUrl?: StringNullableWithAggregatesFilter<"Order"> | string | null
    manifestUrl?: StringNullableWithAggregatesFilter<"Order"> | string | null
    estimatedDelivery?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    shiprocketStatus?: StringNullableWithAggregatesFilter<"Order"> | string | null
    returnShiprocketId?: IntNullableWithAggregatesFilter<"Order"> | number | null
    returnAwbCode?: StringNullableWithAggregatesFilter<"Order"> | string | null
    returnCourierName?: StringNullableWithAggregatesFilter<"Order"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
  }

  export type OrderItemWhereInput = {
    AND?: OrderItemWhereInput | OrderItemWhereInput[]
    OR?: OrderItemWhereInput[]
    NOT?: OrderItemWhereInput | OrderItemWhereInput[]
    id?: IntFilter<"OrderItem"> | number
    orderId?: StringFilter<"OrderItem"> | string
    productId?: IntFilter<"OrderItem"> | number
    vendorId?: IntNullableFilter<"OrderItem"> | number | null
    quantity?: IntFilter<"OrderItem"> | number
    unitPaise?: IntFilter<"OrderItem"> | number
    totalPaise?: IntFilter<"OrderItem"> | number
    productName?: StringFilter<"OrderItem"> | string
    productImage?: StringFilter<"OrderItem"> | string
    productMaterial?: StringFilter<"OrderItem"> | string
    returnQuantity?: IntFilter<"OrderItem"> | number
    returnStatus?: StringNullableFilter<"OrderItem"> | string | null
    stockRestored?: BoolFilter<"OrderItem"> | boolean
    dispatchImages?: JsonNullableFilter<"OrderItem">
    order?: XOR<OrderRelationFilter, OrderWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }

  export type OrderItemOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrderInput | SortOrder
    quantity?: SortOrder
    unitPaise?: SortOrder
    totalPaise?: SortOrder
    productName?: SortOrder
    productImage?: SortOrder
    productMaterial?: SortOrder
    returnQuantity?: SortOrder
    returnStatus?: SortOrderInput | SortOrder
    stockRestored?: SortOrder
    dispatchImages?: SortOrderInput | SortOrder
    order?: OrderOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type OrderItemWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: OrderItemWhereInput | OrderItemWhereInput[]
    OR?: OrderItemWhereInput[]
    NOT?: OrderItemWhereInput | OrderItemWhereInput[]
    orderId?: StringFilter<"OrderItem"> | string
    productId?: IntFilter<"OrderItem"> | number
    vendorId?: IntNullableFilter<"OrderItem"> | number | null
    quantity?: IntFilter<"OrderItem"> | number
    unitPaise?: IntFilter<"OrderItem"> | number
    totalPaise?: IntFilter<"OrderItem"> | number
    productName?: StringFilter<"OrderItem"> | string
    productImage?: StringFilter<"OrderItem"> | string
    productMaterial?: StringFilter<"OrderItem"> | string
    returnQuantity?: IntFilter<"OrderItem"> | number
    returnStatus?: StringNullableFilter<"OrderItem"> | string | null
    stockRestored?: BoolFilter<"OrderItem"> | boolean
    dispatchImages?: JsonNullableFilter<"OrderItem">
    order?: XOR<OrderRelationFilter, OrderWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }, "id">

  export type OrderItemOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrderInput | SortOrder
    quantity?: SortOrder
    unitPaise?: SortOrder
    totalPaise?: SortOrder
    productName?: SortOrder
    productImage?: SortOrder
    productMaterial?: SortOrder
    returnQuantity?: SortOrder
    returnStatus?: SortOrderInput | SortOrder
    stockRestored?: SortOrder
    dispatchImages?: SortOrderInput | SortOrder
    _count?: OrderItemCountOrderByAggregateInput
    _avg?: OrderItemAvgOrderByAggregateInput
    _max?: OrderItemMaxOrderByAggregateInput
    _min?: OrderItemMinOrderByAggregateInput
    _sum?: OrderItemSumOrderByAggregateInput
  }

  export type OrderItemScalarWhereWithAggregatesInput = {
    AND?: OrderItemScalarWhereWithAggregatesInput | OrderItemScalarWhereWithAggregatesInput[]
    OR?: OrderItemScalarWhereWithAggregatesInput[]
    NOT?: OrderItemScalarWhereWithAggregatesInput | OrderItemScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"OrderItem"> | number
    orderId?: StringWithAggregatesFilter<"OrderItem"> | string
    productId?: IntWithAggregatesFilter<"OrderItem"> | number
    vendorId?: IntNullableWithAggregatesFilter<"OrderItem"> | number | null
    quantity?: IntWithAggregatesFilter<"OrderItem"> | number
    unitPaise?: IntWithAggregatesFilter<"OrderItem"> | number
    totalPaise?: IntWithAggregatesFilter<"OrderItem"> | number
    productName?: StringWithAggregatesFilter<"OrderItem"> | string
    productImage?: StringWithAggregatesFilter<"OrderItem"> | string
    productMaterial?: StringWithAggregatesFilter<"OrderItem"> | string
    returnQuantity?: IntWithAggregatesFilter<"OrderItem"> | number
    returnStatus?: StringNullableWithAggregatesFilter<"OrderItem"> | string | null
    stockRestored?: BoolWithAggregatesFilter<"OrderItem"> | boolean
    dispatchImages?: JsonNullableWithAggregatesFilter<"OrderItem">
  }

  export type ReturnRequestWhereInput = {
    AND?: ReturnRequestWhereInput | ReturnRequestWhereInput[]
    OR?: ReturnRequestWhereInput[]
    NOT?: ReturnRequestWhereInput | ReturnRequestWhereInput[]
    id?: IntFilter<"ReturnRequest"> | number
    orderId?: StringFilter<"ReturnRequest"> | string
    userId?: IntFilter<"ReturnRequest"> | number
    reason?: StringFilter<"ReturnRequest"> | string
    reasonDetail?: StringNullableFilter<"ReturnRequest"> | string | null
    returnImages?: JsonNullableFilter<"ReturnRequest">
    returnItems?: JsonFilter<"ReturnRequest">
    status?: StringFilter<"ReturnRequest"> | string
    adminNotes?: StringNullableFilter<"ReturnRequest"> | string | null
    qcNotes?: StringNullableFilter<"ReturnRequest"> | string | null
    qcImages?: JsonNullableFilter<"ReturnRequest">
    vendorQcNotes?: StringNullableFilter<"ReturnRequest"> | string | null
    vendorQcImages?: JsonNullableFilter<"ReturnRequest">
    rejectionReason?: StringNullableFilter<"ReturnRequest"> | string | null
    refundAmount?: IntNullableFilter<"ReturnRequest"> | number | null
    refundMethod?: StringNullableFilter<"ReturnRequest"> | string | null
    refundStatus?: StringNullableFilter<"ReturnRequest"> | string | null
    refundId?: StringNullableFilter<"ReturnRequest"> | string | null
    refundedAt?: DateTimeNullableFilter<"ReturnRequest"> | Date | string | null
    stockRestored?: BoolFilter<"ReturnRequest"> | boolean
    vendorDeliveredAt?: DateTimeNullableFilter<"ReturnRequest"> | Date | string | null
    createdAt?: DateTimeFilter<"ReturnRequest"> | Date | string
    updatedAt?: DateTimeFilter<"ReturnRequest"> | Date | string
    order?: XOR<OrderRelationFilter, OrderWhereInput>
  }

  export type ReturnRequestOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    reasonDetail?: SortOrderInput | SortOrder
    returnImages?: SortOrderInput | SortOrder
    returnItems?: SortOrder
    status?: SortOrder
    adminNotes?: SortOrderInput | SortOrder
    qcNotes?: SortOrderInput | SortOrder
    qcImages?: SortOrderInput | SortOrder
    vendorQcNotes?: SortOrderInput | SortOrder
    vendorQcImages?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    refundAmount?: SortOrderInput | SortOrder
    refundMethod?: SortOrderInput | SortOrder
    refundStatus?: SortOrderInput | SortOrder
    refundId?: SortOrderInput | SortOrder
    refundedAt?: SortOrderInput | SortOrder
    stockRestored?: SortOrder
    vendorDeliveredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    order?: OrderOrderByWithRelationInput
  }

  export type ReturnRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    orderId?: string
    AND?: ReturnRequestWhereInput | ReturnRequestWhereInput[]
    OR?: ReturnRequestWhereInput[]
    NOT?: ReturnRequestWhereInput | ReturnRequestWhereInput[]
    userId?: IntFilter<"ReturnRequest"> | number
    reason?: StringFilter<"ReturnRequest"> | string
    reasonDetail?: StringNullableFilter<"ReturnRequest"> | string | null
    returnImages?: JsonNullableFilter<"ReturnRequest">
    returnItems?: JsonFilter<"ReturnRequest">
    status?: StringFilter<"ReturnRequest"> | string
    adminNotes?: StringNullableFilter<"ReturnRequest"> | string | null
    qcNotes?: StringNullableFilter<"ReturnRequest"> | string | null
    qcImages?: JsonNullableFilter<"ReturnRequest">
    vendorQcNotes?: StringNullableFilter<"ReturnRequest"> | string | null
    vendorQcImages?: JsonNullableFilter<"ReturnRequest">
    rejectionReason?: StringNullableFilter<"ReturnRequest"> | string | null
    refundAmount?: IntNullableFilter<"ReturnRequest"> | number | null
    refundMethod?: StringNullableFilter<"ReturnRequest"> | string | null
    refundStatus?: StringNullableFilter<"ReturnRequest"> | string | null
    refundId?: StringNullableFilter<"ReturnRequest"> | string | null
    refundedAt?: DateTimeNullableFilter<"ReturnRequest"> | Date | string | null
    stockRestored?: BoolFilter<"ReturnRequest"> | boolean
    vendorDeliveredAt?: DateTimeNullableFilter<"ReturnRequest"> | Date | string | null
    createdAt?: DateTimeFilter<"ReturnRequest"> | Date | string
    updatedAt?: DateTimeFilter<"ReturnRequest"> | Date | string
    order?: XOR<OrderRelationFilter, OrderWhereInput>
  }, "id" | "orderId">

  export type ReturnRequestOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    reasonDetail?: SortOrderInput | SortOrder
    returnImages?: SortOrderInput | SortOrder
    returnItems?: SortOrder
    status?: SortOrder
    adminNotes?: SortOrderInput | SortOrder
    qcNotes?: SortOrderInput | SortOrder
    qcImages?: SortOrderInput | SortOrder
    vendorQcNotes?: SortOrderInput | SortOrder
    vendorQcImages?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    refundAmount?: SortOrderInput | SortOrder
    refundMethod?: SortOrderInput | SortOrder
    refundStatus?: SortOrderInput | SortOrder
    refundId?: SortOrderInput | SortOrder
    refundedAt?: SortOrderInput | SortOrder
    stockRestored?: SortOrder
    vendorDeliveredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReturnRequestCountOrderByAggregateInput
    _avg?: ReturnRequestAvgOrderByAggregateInput
    _max?: ReturnRequestMaxOrderByAggregateInput
    _min?: ReturnRequestMinOrderByAggregateInput
    _sum?: ReturnRequestSumOrderByAggregateInput
  }

  export type ReturnRequestScalarWhereWithAggregatesInput = {
    AND?: ReturnRequestScalarWhereWithAggregatesInput | ReturnRequestScalarWhereWithAggregatesInput[]
    OR?: ReturnRequestScalarWhereWithAggregatesInput[]
    NOT?: ReturnRequestScalarWhereWithAggregatesInput | ReturnRequestScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ReturnRequest"> | number
    orderId?: StringWithAggregatesFilter<"ReturnRequest"> | string
    userId?: IntWithAggregatesFilter<"ReturnRequest"> | number
    reason?: StringWithAggregatesFilter<"ReturnRequest"> | string
    reasonDetail?: StringNullableWithAggregatesFilter<"ReturnRequest"> | string | null
    returnImages?: JsonNullableWithAggregatesFilter<"ReturnRequest">
    returnItems?: JsonWithAggregatesFilter<"ReturnRequest">
    status?: StringWithAggregatesFilter<"ReturnRequest"> | string
    adminNotes?: StringNullableWithAggregatesFilter<"ReturnRequest"> | string | null
    qcNotes?: StringNullableWithAggregatesFilter<"ReturnRequest"> | string | null
    qcImages?: JsonNullableWithAggregatesFilter<"ReturnRequest">
    vendorQcNotes?: StringNullableWithAggregatesFilter<"ReturnRequest"> | string | null
    vendorQcImages?: JsonNullableWithAggregatesFilter<"ReturnRequest">
    rejectionReason?: StringNullableWithAggregatesFilter<"ReturnRequest"> | string | null
    refundAmount?: IntNullableWithAggregatesFilter<"ReturnRequest"> | number | null
    refundMethod?: StringNullableWithAggregatesFilter<"ReturnRequest"> | string | null
    refundStatus?: StringNullableWithAggregatesFilter<"ReturnRequest"> | string | null
    refundId?: StringNullableWithAggregatesFilter<"ReturnRequest"> | string | null
    refundedAt?: DateTimeNullableWithAggregatesFilter<"ReturnRequest"> | Date | string | null
    stockRestored?: BoolWithAggregatesFilter<"ReturnRequest"> | boolean
    vendorDeliveredAt?: DateTimeNullableWithAggregatesFilter<"ReturnRequest"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ReturnRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ReturnRequest"> | Date | string
  }

  export type SettlementWhereInput = {
    AND?: SettlementWhereInput | SettlementWhereInput[]
    OR?: SettlementWhereInput[]
    NOT?: SettlementWhereInput | SettlementWhereInput[]
    id?: IntFilter<"Settlement"> | number
    orderId?: StringFilter<"Settlement"> | string
    vendorId?: IntFilter<"Settlement"> | number
    orderAmountPaise?: IntFilter<"Settlement"> | number
    commissionPaise?: IntFilter<"Settlement"> | number
    vendorPayoutPaise?: IntFilter<"Settlement"> | number
    status?: StringFilter<"Settlement"> | string
    holdUntil?: DateTimeFilter<"Settlement"> | Date | string
    settledAt?: DateTimeNullableFilter<"Settlement"> | Date | string | null
    vendorPaymentRef?: StringNullableFilter<"Settlement"> | string | null
    vendorPaymentMode?: StringNullableFilter<"Settlement"> | string | null
    notes?: StringNullableFilter<"Settlement"> | string | null
    createdAt?: DateTimeFilter<"Settlement"> | Date | string
    updatedAt?: DateTimeFilter<"Settlement"> | Date | string
    order?: XOR<OrderRelationFilter, OrderWhereInput>
  }

  export type SettlementOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    vendorId?: SortOrder
    orderAmountPaise?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    status?: SortOrder
    holdUntil?: SortOrder
    settledAt?: SortOrderInput | SortOrder
    vendorPaymentRef?: SortOrderInput | SortOrder
    vendorPaymentMode?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    order?: OrderOrderByWithRelationInput
  }

  export type SettlementWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SettlementWhereInput | SettlementWhereInput[]
    OR?: SettlementWhereInput[]
    NOT?: SettlementWhereInput | SettlementWhereInput[]
    orderId?: StringFilter<"Settlement"> | string
    vendorId?: IntFilter<"Settlement"> | number
    orderAmountPaise?: IntFilter<"Settlement"> | number
    commissionPaise?: IntFilter<"Settlement"> | number
    vendorPayoutPaise?: IntFilter<"Settlement"> | number
    status?: StringFilter<"Settlement"> | string
    holdUntil?: DateTimeFilter<"Settlement"> | Date | string
    settledAt?: DateTimeNullableFilter<"Settlement"> | Date | string | null
    vendorPaymentRef?: StringNullableFilter<"Settlement"> | string | null
    vendorPaymentMode?: StringNullableFilter<"Settlement"> | string | null
    notes?: StringNullableFilter<"Settlement"> | string | null
    createdAt?: DateTimeFilter<"Settlement"> | Date | string
    updatedAt?: DateTimeFilter<"Settlement"> | Date | string
    order?: XOR<OrderRelationFilter, OrderWhereInput>
  }, "id">

  export type SettlementOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    vendorId?: SortOrder
    orderAmountPaise?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    status?: SortOrder
    holdUntil?: SortOrder
    settledAt?: SortOrderInput | SortOrder
    vendorPaymentRef?: SortOrderInput | SortOrder
    vendorPaymentMode?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SettlementCountOrderByAggregateInput
    _avg?: SettlementAvgOrderByAggregateInput
    _max?: SettlementMaxOrderByAggregateInput
    _min?: SettlementMinOrderByAggregateInput
    _sum?: SettlementSumOrderByAggregateInput
  }

  export type SettlementScalarWhereWithAggregatesInput = {
    AND?: SettlementScalarWhereWithAggregatesInput | SettlementScalarWhereWithAggregatesInput[]
    OR?: SettlementScalarWhereWithAggregatesInput[]
    NOT?: SettlementScalarWhereWithAggregatesInput | SettlementScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Settlement"> | number
    orderId?: StringWithAggregatesFilter<"Settlement"> | string
    vendorId?: IntWithAggregatesFilter<"Settlement"> | number
    orderAmountPaise?: IntWithAggregatesFilter<"Settlement"> | number
    commissionPaise?: IntWithAggregatesFilter<"Settlement"> | number
    vendorPayoutPaise?: IntWithAggregatesFilter<"Settlement"> | number
    status?: StringWithAggregatesFilter<"Settlement"> | string
    holdUntil?: DateTimeWithAggregatesFilter<"Settlement"> | Date | string
    settledAt?: DateTimeNullableWithAggregatesFilter<"Settlement"> | Date | string | null
    vendorPaymentRef?: StringNullableWithAggregatesFilter<"Settlement"> | string | null
    vendorPaymentMode?: StringNullableWithAggregatesFilter<"Settlement"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Settlement"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Settlement"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Settlement"> | Date | string
  }

  export type AddressWhereInput = {
    AND?: AddressWhereInput | AddressWhereInput[]
    OR?: AddressWhereInput[]
    NOT?: AddressWhereInput | AddressWhereInput[]
    id?: IntFilter<"Address"> | number
    userId?: IntFilter<"Address"> | number
    label?: StringFilter<"Address"> | string
    name?: StringFilter<"Address"> | string
    phone?: StringFilter<"Address"> | string
    address?: StringFilter<"Address"> | string
    city?: StringFilter<"Address"> | string
    state?: StringFilter<"Address"> | string
    pincode?: StringFilter<"Address"> | string
    country?: StringFilter<"Address"> | string
    isDefault?: BoolFilter<"Address"> | boolean
    createdAt?: DateTimeFilter<"Address"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type AddressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    label?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    pincode?: SortOrder
    country?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AddressWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AddressWhereInput | AddressWhereInput[]
    OR?: AddressWhereInput[]
    NOT?: AddressWhereInput | AddressWhereInput[]
    userId?: IntFilter<"Address"> | number
    label?: StringFilter<"Address"> | string
    name?: StringFilter<"Address"> | string
    phone?: StringFilter<"Address"> | string
    address?: StringFilter<"Address"> | string
    city?: StringFilter<"Address"> | string
    state?: StringFilter<"Address"> | string
    pincode?: StringFilter<"Address"> | string
    country?: StringFilter<"Address"> | string
    isDefault?: BoolFilter<"Address"> | boolean
    createdAt?: DateTimeFilter<"Address"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type AddressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    label?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    pincode?: SortOrder
    country?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    _count?: AddressCountOrderByAggregateInput
    _avg?: AddressAvgOrderByAggregateInput
    _max?: AddressMaxOrderByAggregateInput
    _min?: AddressMinOrderByAggregateInput
    _sum?: AddressSumOrderByAggregateInput
  }

  export type AddressScalarWhereWithAggregatesInput = {
    AND?: AddressScalarWhereWithAggregatesInput | AddressScalarWhereWithAggregatesInput[]
    OR?: AddressScalarWhereWithAggregatesInput[]
    NOT?: AddressScalarWhereWithAggregatesInput | AddressScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Address"> | number
    userId?: IntWithAggregatesFilter<"Address"> | number
    label?: StringWithAggregatesFilter<"Address"> | string
    name?: StringWithAggregatesFilter<"Address"> | string
    phone?: StringWithAggregatesFilter<"Address"> | string
    address?: StringWithAggregatesFilter<"Address"> | string
    city?: StringWithAggregatesFilter<"Address"> | string
    state?: StringWithAggregatesFilter<"Address"> | string
    pincode?: StringWithAggregatesFilter<"Address"> | string
    country?: StringWithAggregatesFilter<"Address"> | string
    isDefault?: BoolWithAggregatesFilter<"Address"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Address"> | Date | string
  }

  export type AdminSettingsWhereInput = {
    AND?: AdminSettingsWhereInput | AdminSettingsWhereInput[]
    OR?: AdminSettingsWhereInput[]
    NOT?: AdminSettingsWhereInput | AdminSettingsWhereInput[]
    id?: IntFilter<"AdminSettings"> | number
    defaultCommissionRate?: FloatFilter<"AdminSettings"> | number
    taxRate?: FloatFilter<"AdminSettings"> | number
    commissionGstRate?: FloatFilter<"AdminSettings"> | number
    commissionSacCode?: StringFilter<"AdminSettings"> | string
    companyName?: StringFilter<"AdminSettings"> | string
    companyAddress?: StringFilter<"AdminSettings"> | string
    companyGstin?: StringFilter<"AdminSettings"> | string
    companyPan?: StringFilter<"AdminSettings"> | string
    companyCity?: StringFilter<"AdminSettings"> | string
    companyState?: StringFilter<"AdminSettings"> | string
    companyCountry?: StringFilter<"AdminSettings"> | string
    companyPincode?: StringFilter<"AdminSettings"> | string
    shippingFreeAbove?: IntFilter<"AdminSettings"> | number
    shippingChargePaise?: IntFilter<"AdminSettings"> | number
    codShippingChargePaise?: IntFilter<"AdminSettings"> | number
    internationalShippingPaise?: IntFilter<"AdminSettings"> | number
    codEnabled?: BoolFilter<"AdminSettings"> | boolean
    codMaxAmountPaise?: IntFilter<"AdminSettings"> | number
    codSurchargePaise?: IntFilter<"AdminSettings"> | number
    returnWindowDays?: IntFilter<"AdminSettings"> | number
    returnEnabled?: BoolFilter<"AdminSettings"> | boolean
    vendorReturnSlaHours?: IntFilter<"AdminSettings"> | number
    payoutSchedule?: StringFilter<"AdminSettings"> | string
    payoutCustomDays?: IntFilter<"AdminSettings"> | number
    lastPayoutRun?: DateTimeNullableFilter<"AdminSettings"> | Date | string | null
    shiprocketPickupLocation?: StringNullableFilter<"AdminSettings"> | string | null
    shiprocketAutoAssign?: BoolFilter<"AdminSettings"> | boolean
    shiprocketCourierPriority?: StringFilter<"AdminSettings"> | string
    homepageSections?: JsonNullableFilter<"AdminSettings">
    updatedAt?: DateTimeFilter<"AdminSettings"> | Date | string
  }

  export type AdminSettingsOrderByWithRelationInput = {
    id?: SortOrder
    defaultCommissionRate?: SortOrder
    taxRate?: SortOrder
    commissionGstRate?: SortOrder
    commissionSacCode?: SortOrder
    companyName?: SortOrder
    companyAddress?: SortOrder
    companyGstin?: SortOrder
    companyPan?: SortOrder
    companyCity?: SortOrder
    companyState?: SortOrder
    companyCountry?: SortOrder
    companyPincode?: SortOrder
    shippingFreeAbove?: SortOrder
    shippingChargePaise?: SortOrder
    codShippingChargePaise?: SortOrder
    internationalShippingPaise?: SortOrder
    codEnabled?: SortOrder
    codMaxAmountPaise?: SortOrder
    codSurchargePaise?: SortOrder
    returnWindowDays?: SortOrder
    returnEnabled?: SortOrder
    vendorReturnSlaHours?: SortOrder
    payoutSchedule?: SortOrder
    payoutCustomDays?: SortOrder
    lastPayoutRun?: SortOrderInput | SortOrder
    shiprocketPickupLocation?: SortOrderInput | SortOrder
    shiprocketAutoAssign?: SortOrder
    shiprocketCourierPriority?: SortOrder
    homepageSections?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type AdminSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AdminSettingsWhereInput | AdminSettingsWhereInput[]
    OR?: AdminSettingsWhereInput[]
    NOT?: AdminSettingsWhereInput | AdminSettingsWhereInput[]
    defaultCommissionRate?: FloatFilter<"AdminSettings"> | number
    taxRate?: FloatFilter<"AdminSettings"> | number
    commissionGstRate?: FloatFilter<"AdminSettings"> | number
    commissionSacCode?: StringFilter<"AdminSettings"> | string
    companyName?: StringFilter<"AdminSettings"> | string
    companyAddress?: StringFilter<"AdminSettings"> | string
    companyGstin?: StringFilter<"AdminSettings"> | string
    companyPan?: StringFilter<"AdminSettings"> | string
    companyCity?: StringFilter<"AdminSettings"> | string
    companyState?: StringFilter<"AdminSettings"> | string
    companyCountry?: StringFilter<"AdminSettings"> | string
    companyPincode?: StringFilter<"AdminSettings"> | string
    shippingFreeAbove?: IntFilter<"AdminSettings"> | number
    shippingChargePaise?: IntFilter<"AdminSettings"> | number
    codShippingChargePaise?: IntFilter<"AdminSettings"> | number
    internationalShippingPaise?: IntFilter<"AdminSettings"> | number
    codEnabled?: BoolFilter<"AdminSettings"> | boolean
    codMaxAmountPaise?: IntFilter<"AdminSettings"> | number
    codSurchargePaise?: IntFilter<"AdminSettings"> | number
    returnWindowDays?: IntFilter<"AdminSettings"> | number
    returnEnabled?: BoolFilter<"AdminSettings"> | boolean
    vendorReturnSlaHours?: IntFilter<"AdminSettings"> | number
    payoutSchedule?: StringFilter<"AdminSettings"> | string
    payoutCustomDays?: IntFilter<"AdminSettings"> | number
    lastPayoutRun?: DateTimeNullableFilter<"AdminSettings"> | Date | string | null
    shiprocketPickupLocation?: StringNullableFilter<"AdminSettings"> | string | null
    shiprocketAutoAssign?: BoolFilter<"AdminSettings"> | boolean
    shiprocketCourierPriority?: StringFilter<"AdminSettings"> | string
    homepageSections?: JsonNullableFilter<"AdminSettings">
    updatedAt?: DateTimeFilter<"AdminSettings"> | Date | string
  }, "id">

  export type AdminSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    defaultCommissionRate?: SortOrder
    taxRate?: SortOrder
    commissionGstRate?: SortOrder
    commissionSacCode?: SortOrder
    companyName?: SortOrder
    companyAddress?: SortOrder
    companyGstin?: SortOrder
    companyPan?: SortOrder
    companyCity?: SortOrder
    companyState?: SortOrder
    companyCountry?: SortOrder
    companyPincode?: SortOrder
    shippingFreeAbove?: SortOrder
    shippingChargePaise?: SortOrder
    codShippingChargePaise?: SortOrder
    internationalShippingPaise?: SortOrder
    codEnabled?: SortOrder
    codMaxAmountPaise?: SortOrder
    codSurchargePaise?: SortOrder
    returnWindowDays?: SortOrder
    returnEnabled?: SortOrder
    vendorReturnSlaHours?: SortOrder
    payoutSchedule?: SortOrder
    payoutCustomDays?: SortOrder
    lastPayoutRun?: SortOrderInput | SortOrder
    shiprocketPickupLocation?: SortOrderInput | SortOrder
    shiprocketAutoAssign?: SortOrder
    shiprocketCourierPriority?: SortOrder
    homepageSections?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: AdminSettingsCountOrderByAggregateInput
    _avg?: AdminSettingsAvgOrderByAggregateInput
    _max?: AdminSettingsMaxOrderByAggregateInput
    _min?: AdminSettingsMinOrderByAggregateInput
    _sum?: AdminSettingsSumOrderByAggregateInput
  }

  export type AdminSettingsScalarWhereWithAggregatesInput = {
    AND?: AdminSettingsScalarWhereWithAggregatesInput | AdminSettingsScalarWhereWithAggregatesInput[]
    OR?: AdminSettingsScalarWhereWithAggregatesInput[]
    NOT?: AdminSettingsScalarWhereWithAggregatesInput | AdminSettingsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AdminSettings"> | number
    defaultCommissionRate?: FloatWithAggregatesFilter<"AdminSettings"> | number
    taxRate?: FloatWithAggregatesFilter<"AdminSettings"> | number
    commissionGstRate?: FloatWithAggregatesFilter<"AdminSettings"> | number
    commissionSacCode?: StringWithAggregatesFilter<"AdminSettings"> | string
    companyName?: StringWithAggregatesFilter<"AdminSettings"> | string
    companyAddress?: StringWithAggregatesFilter<"AdminSettings"> | string
    companyGstin?: StringWithAggregatesFilter<"AdminSettings"> | string
    companyPan?: StringWithAggregatesFilter<"AdminSettings"> | string
    companyCity?: StringWithAggregatesFilter<"AdminSettings"> | string
    companyState?: StringWithAggregatesFilter<"AdminSettings"> | string
    companyCountry?: StringWithAggregatesFilter<"AdminSettings"> | string
    companyPincode?: StringWithAggregatesFilter<"AdminSettings"> | string
    shippingFreeAbove?: IntWithAggregatesFilter<"AdminSettings"> | number
    shippingChargePaise?: IntWithAggregatesFilter<"AdminSettings"> | number
    codShippingChargePaise?: IntWithAggregatesFilter<"AdminSettings"> | number
    internationalShippingPaise?: IntWithAggregatesFilter<"AdminSettings"> | number
    codEnabled?: BoolWithAggregatesFilter<"AdminSettings"> | boolean
    codMaxAmountPaise?: IntWithAggregatesFilter<"AdminSettings"> | number
    codSurchargePaise?: IntWithAggregatesFilter<"AdminSettings"> | number
    returnWindowDays?: IntWithAggregatesFilter<"AdminSettings"> | number
    returnEnabled?: BoolWithAggregatesFilter<"AdminSettings"> | boolean
    vendorReturnSlaHours?: IntWithAggregatesFilter<"AdminSettings"> | number
    payoutSchedule?: StringWithAggregatesFilter<"AdminSettings"> | string
    payoutCustomDays?: IntWithAggregatesFilter<"AdminSettings"> | number
    lastPayoutRun?: DateTimeNullableWithAggregatesFilter<"AdminSettings"> | Date | string | null
    shiprocketPickupLocation?: StringNullableWithAggregatesFilter<"AdminSettings"> | string | null
    shiprocketAutoAssign?: BoolWithAggregatesFilter<"AdminSettings"> | boolean
    shiprocketCourierPriority?: StringWithAggregatesFilter<"AdminSettings"> | string
    homepageSections?: JsonNullableWithAggregatesFilter<"AdminSettings">
    updatedAt?: DateTimeWithAggregatesFilter<"AdminSettings"> | Date | string
  }

  export type UserCreateInput = {
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    mobile?: string | null
    location?: string | null
    artisanId?: string | null
    gstin?: string | null
    aadhaar?: string | null
    pan?: string | null
    aadhaarUrl?: string | null
    panUrl?: string | null
    docUrl?: string | null
    vendorStatus?: string
    rejectionReason?: string | null
    allowedCategories?: string | null
    razorpayAccountId?: string | null
    payoutsPaused?: boolean
    products?: ProductCreateNestedManyWithoutVendorInput
    orders?: OrderCreateNestedManyWithoutUserInput
    addresses?: AddressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    mobile?: string | null
    location?: string | null
    artisanId?: string | null
    gstin?: string | null
    aadhaar?: string | null
    pan?: string | null
    aadhaarUrl?: string | null
    panUrl?: string | null
    docUrl?: string | null
    vendorStatus?: string
    rejectionReason?: string | null
    allowedCategories?: string | null
    razorpayAccountId?: string | null
    payoutsPaused?: boolean
    products?: ProductUncheckedCreateNestedManyWithoutVendorInput
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    addresses?: AddressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    artisanId?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaar?: NullableStringFieldUpdateOperationsInput | string | null
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    panUrl?: NullableStringFieldUpdateOperationsInput | string | null
    docUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vendorStatus?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    allowedCategories?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    payoutsPaused?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUpdateManyWithoutVendorNestedInput
    orders?: OrderUpdateManyWithoutUserNestedInput
    addresses?: AddressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    artisanId?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaar?: NullableStringFieldUpdateOperationsInput | string | null
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    panUrl?: NullableStringFieldUpdateOperationsInput | string | null
    docUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vendorStatus?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    allowedCategories?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    payoutsPaused?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUncheckedUpdateManyWithoutVendorNestedInput
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    addresses?: AddressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    mobile?: string | null
    location?: string | null
    artisanId?: string | null
    gstin?: string | null
    aadhaar?: string | null
    pan?: string | null
    aadhaarUrl?: string | null
    panUrl?: string | null
    docUrl?: string | null
    vendorStatus?: string
    rejectionReason?: string | null
    allowedCategories?: string | null
    razorpayAccountId?: string | null
    payoutsPaused?: boolean
  }

  export type UserUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    artisanId?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaar?: NullableStringFieldUpdateOperationsInput | string | null
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    panUrl?: NullableStringFieldUpdateOperationsInput | string | null
    docUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vendorStatus?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    allowedCategories?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    payoutsPaused?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    artisanId?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaar?: NullableStringFieldUpdateOperationsInput | string | null
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    panUrl?: NullableStringFieldUpdateOperationsInput | string | null
    docUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vendorStatus?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    allowedCategories?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    payoutsPaused?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CategoryCreateInput = {
    name: string
    slug: string
    image: string
    products?: ProductCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: number
    name: string
    slug: string
    image: string
    products?: ProductUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    products?: ProductUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    products?: ProductUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: number
    name: string
    slug: string
    image: string
  }

  export type CategoryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
  }

  export type ProductCreateInput = {
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price: number
    mrp: number
    discount: number
    rating?: number
    reviews?: number
    material: string
    stock?: number
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutProductsInput
    vendor?: UserCreateNestedOneWithoutProductsInput
    orderItems?: OrderItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: number
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price: number
    mrp: number
    discount: number
    rating?: number
    reviews?: number
    categoryName: string
    material: string
    stock?: number
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: Date | string
    vendorId?: number | null
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutProductsNestedInput
    vendor?: UserUpdateOneWithoutProductsNestedInput
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    categoryName?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: number
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price: number
    mrp: number
    discount: number
    rating?: number
    reviews?: number
    categoryName: string
    material: string
    stock?: number
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: Date | string
    vendorId?: number | null
  }

  export type ProductUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    categoryName?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type InquiryCreateInput = {
    name: string
    email: string
    phone: string
    companyName?: string | null
    country?: string | null
    items?: NullableJsonNullValueInput | InputJsonValue
    message: string
    status?: string
    createdAt?: Date | string
  }

  export type InquiryUncheckedCreateInput = {
    id?: number
    name: string
    email: string
    phone: string
    companyName?: string | null
    country?: string | null
    items?: NullableJsonNullValueInput | InputJsonValue
    message: string
    status?: string
    createdAt?: Date | string
  }

  export type InquiryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    items?: NullableJsonNullValueInput | InputJsonValue
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    items?: NullableJsonNullValueInput | InputJsonValue
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryCreateManyInput = {
    id?: number
    name: string
    email: string
    phone: string
    companyName?: string | null
    country?: string | null
    items?: NullableJsonNullValueInput | InputJsonValue
    message: string
    status?: string
    createdAt?: Date | string
  }

  export type InquiryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    items?: NullableJsonNullValueInput | InputJsonValue
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    items?: NullableJsonNullValueInput | InputJsonValue
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateInput = {
    id?: string
    orderNumber: string
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOrdersInput
    items?: OrderItemCreateNestedManyWithoutOrderInput
    returnRequest?: ReturnRequestCreateNestedOneWithoutOrderInput
    settlements?: SettlementCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    orderNumber: string
    userId: number
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput
    returnRequest?: ReturnRequestUncheckedCreateNestedOneWithoutOrderInput
    settlements?: SettlementUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOrdersNestedInput
    items?: OrderItemUpdateManyWithoutOrderNestedInput
    returnRequest?: ReturnRequestUpdateOneWithoutOrderNestedInput
    settlements?: SettlementUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput
    returnRequest?: ReturnRequestUncheckedUpdateOneWithoutOrderNestedInput
    settlements?: SettlementUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderCreateManyInput = {
    id?: string
    orderNumber: string
    userId: number
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderItemCreateInput = {
    vendorId?: number | null
    quantity: number
    unitPaise: number
    totalPaise: number
    productName: string
    productImage: string
    productMaterial: string
    returnQuantity?: number
    returnStatus?: string | null
    stockRestored?: boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
    order: OrderCreateNestedOneWithoutItemsInput
    product: ProductCreateNestedOneWithoutOrderItemsInput
  }

  export type OrderItemUncheckedCreateInput = {
    id?: number
    orderId: string
    productId: number
    vendorId?: number | null
    quantity: number
    unitPaise: number
    totalPaise: number
    productName: string
    productImage: string
    productMaterial: string
    returnQuantity?: number
    returnStatus?: string | null
    stockRestored?: boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OrderItemUpdateInput = {
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    productName?: StringFieldUpdateOperationsInput | string
    productImage?: StringFieldUpdateOperationsInput | string
    productMaterial?: StringFieldUpdateOperationsInput | string
    returnQuantity?: IntFieldUpdateOperationsInput | number
    returnStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
    order?: OrderUpdateOneRequiredWithoutItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutOrderItemsNestedInput
  }

  export type OrderItemUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderId?: StringFieldUpdateOperationsInput | string
    productId?: IntFieldUpdateOperationsInput | number
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    productName?: StringFieldUpdateOperationsInput | string
    productImage?: StringFieldUpdateOperationsInput | string
    productMaterial?: StringFieldUpdateOperationsInput | string
    returnQuantity?: IntFieldUpdateOperationsInput | number
    returnStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OrderItemCreateManyInput = {
    id?: number
    orderId: string
    productId: number
    vendorId?: number | null
    quantity: number
    unitPaise: number
    totalPaise: number
    productName: string
    productImage: string
    productMaterial: string
    returnQuantity?: number
    returnStatus?: string | null
    stockRestored?: boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OrderItemUpdateManyMutationInput = {
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    productName?: StringFieldUpdateOperationsInput | string
    productImage?: StringFieldUpdateOperationsInput | string
    productMaterial?: StringFieldUpdateOperationsInput | string
    returnQuantity?: IntFieldUpdateOperationsInput | number
    returnStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OrderItemUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderId?: StringFieldUpdateOperationsInput | string
    productId?: IntFieldUpdateOperationsInput | number
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    productName?: StringFieldUpdateOperationsInput | string
    productImage?: StringFieldUpdateOperationsInput | string
    productMaterial?: StringFieldUpdateOperationsInput | string
    returnQuantity?: IntFieldUpdateOperationsInput | number
    returnStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ReturnRequestCreateInput = {
    userId: number
    reason: string
    reasonDetail?: string | null
    returnImages?: NullableJsonNullValueInput | InputJsonValue
    returnItems: JsonNullValueInput | InputJsonValue
    status?: string
    adminNotes?: string | null
    qcNotes?: string | null
    qcImages?: NullableJsonNullValueInput | InputJsonValue
    vendorQcNotes?: string | null
    vendorQcImages?: NullableJsonNullValueInput | InputJsonValue
    rejectionReason?: string | null
    refundAmount?: number | null
    refundMethod?: string | null
    refundStatus?: string | null
    refundId?: string | null
    refundedAt?: Date | string | null
    stockRestored?: boolean
    vendorDeliveredAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    order: OrderCreateNestedOneWithoutReturnRequestInput
  }

  export type ReturnRequestUncheckedCreateInput = {
    id?: number
    orderId: string
    userId: number
    reason: string
    reasonDetail?: string | null
    returnImages?: NullableJsonNullValueInput | InputJsonValue
    returnItems: JsonNullValueInput | InputJsonValue
    status?: string
    adminNotes?: string | null
    qcNotes?: string | null
    qcImages?: NullableJsonNullValueInput | InputJsonValue
    vendorQcNotes?: string | null
    vendorQcImages?: NullableJsonNullValueInput | InputJsonValue
    rejectionReason?: string | null
    refundAmount?: number | null
    refundMethod?: string | null
    refundStatus?: string | null
    refundId?: string | null
    refundedAt?: Date | string | null
    stockRestored?: boolean
    vendorDeliveredAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReturnRequestUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    reasonDetail?: NullableStringFieldUpdateOperationsInput | string | null
    returnImages?: NullableJsonNullValueInput | InputJsonValue
    returnItems?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcImages?: NullableJsonNullValueInput | InputJsonValue
    vendorQcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    vendorQcImages?: NullableJsonNullValueInput | InputJsonValue
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableIntFieldUpdateOperationsInput | number | null
    refundMethod?: NullableStringFieldUpdateOperationsInput | string | null
    refundStatus?: NullableStringFieldUpdateOperationsInput | string | null
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    vendorDeliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutReturnRequestNestedInput
  }

  export type ReturnRequestUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    reasonDetail?: NullableStringFieldUpdateOperationsInput | string | null
    returnImages?: NullableJsonNullValueInput | InputJsonValue
    returnItems?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcImages?: NullableJsonNullValueInput | InputJsonValue
    vendorQcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    vendorQcImages?: NullableJsonNullValueInput | InputJsonValue
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableIntFieldUpdateOperationsInput | number | null
    refundMethod?: NullableStringFieldUpdateOperationsInput | string | null
    refundStatus?: NullableStringFieldUpdateOperationsInput | string | null
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    vendorDeliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnRequestCreateManyInput = {
    id?: number
    orderId: string
    userId: number
    reason: string
    reasonDetail?: string | null
    returnImages?: NullableJsonNullValueInput | InputJsonValue
    returnItems: JsonNullValueInput | InputJsonValue
    status?: string
    adminNotes?: string | null
    qcNotes?: string | null
    qcImages?: NullableJsonNullValueInput | InputJsonValue
    vendorQcNotes?: string | null
    vendorQcImages?: NullableJsonNullValueInput | InputJsonValue
    rejectionReason?: string | null
    refundAmount?: number | null
    refundMethod?: string | null
    refundStatus?: string | null
    refundId?: string | null
    refundedAt?: Date | string | null
    stockRestored?: boolean
    vendorDeliveredAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReturnRequestUpdateManyMutationInput = {
    userId?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    reasonDetail?: NullableStringFieldUpdateOperationsInput | string | null
    returnImages?: NullableJsonNullValueInput | InputJsonValue
    returnItems?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcImages?: NullableJsonNullValueInput | InputJsonValue
    vendorQcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    vendorQcImages?: NullableJsonNullValueInput | InputJsonValue
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableIntFieldUpdateOperationsInput | number | null
    refundMethod?: NullableStringFieldUpdateOperationsInput | string | null
    refundStatus?: NullableStringFieldUpdateOperationsInput | string | null
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    vendorDeliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnRequestUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    reasonDetail?: NullableStringFieldUpdateOperationsInput | string | null
    returnImages?: NullableJsonNullValueInput | InputJsonValue
    returnItems?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcImages?: NullableJsonNullValueInput | InputJsonValue
    vendorQcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    vendorQcImages?: NullableJsonNullValueInput | InputJsonValue
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableIntFieldUpdateOperationsInput | number | null
    refundMethod?: NullableStringFieldUpdateOperationsInput | string | null
    refundStatus?: NullableStringFieldUpdateOperationsInput | string | null
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    vendorDeliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettlementCreateInput = {
    vendorId: number
    orderAmountPaise: number
    commissionPaise: number
    vendorPayoutPaise: number
    status?: string
    holdUntil: Date | string
    settledAt?: Date | string | null
    vendorPaymentRef?: string | null
    vendorPaymentMode?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    order: OrderCreateNestedOneWithoutSettlementsInput
  }

  export type SettlementUncheckedCreateInput = {
    id?: number
    orderId: string
    vendorId: number
    orderAmountPaise: number
    commissionPaise: number
    vendorPayoutPaise: number
    status?: string
    holdUntil: Date | string
    settledAt?: Date | string | null
    vendorPaymentRef?: string | null
    vendorPaymentMode?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SettlementUpdateInput = {
    vendorId?: IntFieldUpdateOperationsInput | number
    orderAmountPaise?: IntFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    holdUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vendorPaymentRef?: NullableStringFieldUpdateOperationsInput | string | null
    vendorPaymentMode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutSettlementsNestedInput
  }

  export type SettlementUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderId?: StringFieldUpdateOperationsInput | string
    vendorId?: IntFieldUpdateOperationsInput | number
    orderAmountPaise?: IntFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    holdUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vendorPaymentRef?: NullableStringFieldUpdateOperationsInput | string | null
    vendorPaymentMode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettlementCreateManyInput = {
    id?: number
    orderId: string
    vendorId: number
    orderAmountPaise: number
    commissionPaise: number
    vendorPayoutPaise: number
    status?: string
    holdUntil: Date | string
    settledAt?: Date | string | null
    vendorPaymentRef?: string | null
    vendorPaymentMode?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SettlementUpdateManyMutationInput = {
    vendorId?: IntFieldUpdateOperationsInput | number
    orderAmountPaise?: IntFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    holdUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vendorPaymentRef?: NullableStringFieldUpdateOperationsInput | string | null
    vendorPaymentMode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettlementUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderId?: StringFieldUpdateOperationsInput | string
    vendorId?: IntFieldUpdateOperationsInput | number
    orderAmountPaise?: IntFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    holdUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vendorPaymentRef?: NullableStringFieldUpdateOperationsInput | string | null
    vendorPaymentMode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressCreateInput = {
    label?: string
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country?: string
    isDefault?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutAddressesInput
  }

  export type AddressUncheckedCreateInput = {
    id?: number
    userId: number
    label?: string
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country?: string
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type AddressUpdateInput = {
    label?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    pincode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAddressesNestedInput
  }

  export type AddressUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    pincode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressCreateManyInput = {
    id?: number
    userId: number
    label?: string
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country?: string
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type AddressUpdateManyMutationInput = {
    label?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    pincode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    pincode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminSettingsCreateInput = {
    id?: number
    defaultCommissionRate?: number
    taxRate?: number
    commissionGstRate?: number
    commissionSacCode?: string
    companyName?: string
    companyAddress?: string
    companyGstin?: string
    companyPan?: string
    companyCity?: string
    companyState?: string
    companyCountry?: string
    companyPincode?: string
    shippingFreeAbove?: number
    shippingChargePaise?: number
    codShippingChargePaise?: number
    internationalShippingPaise?: number
    codEnabled?: boolean
    codMaxAmountPaise?: number
    codSurchargePaise?: number
    returnWindowDays?: number
    returnEnabled?: boolean
    vendorReturnSlaHours?: number
    payoutSchedule?: string
    payoutCustomDays?: number
    lastPayoutRun?: Date | string | null
    shiprocketPickupLocation?: string | null
    shiprocketAutoAssign?: boolean
    shiprocketCourierPriority?: string
    homepageSections?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type AdminSettingsUncheckedCreateInput = {
    id?: number
    defaultCommissionRate?: number
    taxRate?: number
    commissionGstRate?: number
    commissionSacCode?: string
    companyName?: string
    companyAddress?: string
    companyGstin?: string
    companyPan?: string
    companyCity?: string
    companyState?: string
    companyCountry?: string
    companyPincode?: string
    shippingFreeAbove?: number
    shippingChargePaise?: number
    codShippingChargePaise?: number
    internationalShippingPaise?: number
    codEnabled?: boolean
    codMaxAmountPaise?: number
    codSurchargePaise?: number
    returnWindowDays?: number
    returnEnabled?: boolean
    vendorReturnSlaHours?: number
    payoutSchedule?: string
    payoutCustomDays?: number
    lastPayoutRun?: Date | string | null
    shiprocketPickupLocation?: string | null
    shiprocketAutoAssign?: boolean
    shiprocketCourierPriority?: string
    homepageSections?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type AdminSettingsUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    defaultCommissionRate?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    commissionGstRate?: FloatFieldUpdateOperationsInput | number
    commissionSacCode?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    companyAddress?: StringFieldUpdateOperationsInput | string
    companyGstin?: StringFieldUpdateOperationsInput | string
    companyPan?: StringFieldUpdateOperationsInput | string
    companyCity?: StringFieldUpdateOperationsInput | string
    companyState?: StringFieldUpdateOperationsInput | string
    companyCountry?: StringFieldUpdateOperationsInput | string
    companyPincode?: StringFieldUpdateOperationsInput | string
    shippingFreeAbove?: IntFieldUpdateOperationsInput | number
    shippingChargePaise?: IntFieldUpdateOperationsInput | number
    codShippingChargePaise?: IntFieldUpdateOperationsInput | number
    internationalShippingPaise?: IntFieldUpdateOperationsInput | number
    codEnabled?: BoolFieldUpdateOperationsInput | boolean
    codMaxAmountPaise?: IntFieldUpdateOperationsInput | number
    codSurchargePaise?: IntFieldUpdateOperationsInput | number
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    returnEnabled?: BoolFieldUpdateOperationsInput | boolean
    vendorReturnSlaHours?: IntFieldUpdateOperationsInput | number
    payoutSchedule?: StringFieldUpdateOperationsInput | string
    payoutCustomDays?: IntFieldUpdateOperationsInput | number
    lastPayoutRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketPickupLocation?: NullableStringFieldUpdateOperationsInput | string | null
    shiprocketAutoAssign?: BoolFieldUpdateOperationsInput | boolean
    shiprocketCourierPriority?: StringFieldUpdateOperationsInput | string
    homepageSections?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminSettingsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    defaultCommissionRate?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    commissionGstRate?: FloatFieldUpdateOperationsInput | number
    commissionSacCode?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    companyAddress?: StringFieldUpdateOperationsInput | string
    companyGstin?: StringFieldUpdateOperationsInput | string
    companyPan?: StringFieldUpdateOperationsInput | string
    companyCity?: StringFieldUpdateOperationsInput | string
    companyState?: StringFieldUpdateOperationsInput | string
    companyCountry?: StringFieldUpdateOperationsInput | string
    companyPincode?: StringFieldUpdateOperationsInput | string
    shippingFreeAbove?: IntFieldUpdateOperationsInput | number
    shippingChargePaise?: IntFieldUpdateOperationsInput | number
    codShippingChargePaise?: IntFieldUpdateOperationsInput | number
    internationalShippingPaise?: IntFieldUpdateOperationsInput | number
    codEnabled?: BoolFieldUpdateOperationsInput | boolean
    codMaxAmountPaise?: IntFieldUpdateOperationsInput | number
    codSurchargePaise?: IntFieldUpdateOperationsInput | number
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    returnEnabled?: BoolFieldUpdateOperationsInput | boolean
    vendorReturnSlaHours?: IntFieldUpdateOperationsInput | number
    payoutSchedule?: StringFieldUpdateOperationsInput | string
    payoutCustomDays?: IntFieldUpdateOperationsInput | number
    lastPayoutRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketPickupLocation?: NullableStringFieldUpdateOperationsInput | string | null
    shiprocketAutoAssign?: BoolFieldUpdateOperationsInput | boolean
    shiprocketCourierPriority?: StringFieldUpdateOperationsInput | string
    homepageSections?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminSettingsCreateManyInput = {
    id?: number
    defaultCommissionRate?: number
    taxRate?: number
    commissionGstRate?: number
    commissionSacCode?: string
    companyName?: string
    companyAddress?: string
    companyGstin?: string
    companyPan?: string
    companyCity?: string
    companyState?: string
    companyCountry?: string
    companyPincode?: string
    shippingFreeAbove?: number
    shippingChargePaise?: number
    codShippingChargePaise?: number
    internationalShippingPaise?: number
    codEnabled?: boolean
    codMaxAmountPaise?: number
    codSurchargePaise?: number
    returnWindowDays?: number
    returnEnabled?: boolean
    vendorReturnSlaHours?: number
    payoutSchedule?: string
    payoutCustomDays?: number
    lastPayoutRun?: Date | string | null
    shiprocketPickupLocation?: string | null
    shiprocketAutoAssign?: boolean
    shiprocketCourierPriority?: string
    homepageSections?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type AdminSettingsUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    defaultCommissionRate?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    commissionGstRate?: FloatFieldUpdateOperationsInput | number
    commissionSacCode?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    companyAddress?: StringFieldUpdateOperationsInput | string
    companyGstin?: StringFieldUpdateOperationsInput | string
    companyPan?: StringFieldUpdateOperationsInput | string
    companyCity?: StringFieldUpdateOperationsInput | string
    companyState?: StringFieldUpdateOperationsInput | string
    companyCountry?: StringFieldUpdateOperationsInput | string
    companyPincode?: StringFieldUpdateOperationsInput | string
    shippingFreeAbove?: IntFieldUpdateOperationsInput | number
    shippingChargePaise?: IntFieldUpdateOperationsInput | number
    codShippingChargePaise?: IntFieldUpdateOperationsInput | number
    internationalShippingPaise?: IntFieldUpdateOperationsInput | number
    codEnabled?: BoolFieldUpdateOperationsInput | boolean
    codMaxAmountPaise?: IntFieldUpdateOperationsInput | number
    codSurchargePaise?: IntFieldUpdateOperationsInput | number
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    returnEnabled?: BoolFieldUpdateOperationsInput | boolean
    vendorReturnSlaHours?: IntFieldUpdateOperationsInput | number
    payoutSchedule?: StringFieldUpdateOperationsInput | string
    payoutCustomDays?: IntFieldUpdateOperationsInput | number
    lastPayoutRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketPickupLocation?: NullableStringFieldUpdateOperationsInput | string | null
    shiprocketAutoAssign?: BoolFieldUpdateOperationsInput | boolean
    shiprocketCourierPriority?: StringFieldUpdateOperationsInput | string
    homepageSections?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminSettingsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    defaultCommissionRate?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    commissionGstRate?: FloatFieldUpdateOperationsInput | number
    commissionSacCode?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    companyAddress?: StringFieldUpdateOperationsInput | string
    companyGstin?: StringFieldUpdateOperationsInput | string
    companyPan?: StringFieldUpdateOperationsInput | string
    companyCity?: StringFieldUpdateOperationsInput | string
    companyState?: StringFieldUpdateOperationsInput | string
    companyCountry?: StringFieldUpdateOperationsInput | string
    companyPincode?: StringFieldUpdateOperationsInput | string
    shippingFreeAbove?: IntFieldUpdateOperationsInput | number
    shippingChargePaise?: IntFieldUpdateOperationsInput | number
    codShippingChargePaise?: IntFieldUpdateOperationsInput | number
    internationalShippingPaise?: IntFieldUpdateOperationsInput | number
    codEnabled?: BoolFieldUpdateOperationsInput | boolean
    codMaxAmountPaise?: IntFieldUpdateOperationsInput | number
    codSurchargePaise?: IntFieldUpdateOperationsInput | number
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    returnEnabled?: BoolFieldUpdateOperationsInput | boolean
    vendorReturnSlaHours?: IntFieldUpdateOperationsInput | number
    payoutSchedule?: StringFieldUpdateOperationsInput | string
    payoutCustomDays?: IntFieldUpdateOperationsInput | number
    lastPayoutRun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketPickupLocation?: NullableStringFieldUpdateOperationsInput | string | null
    shiprocketAutoAssign?: BoolFieldUpdateOperationsInput | boolean
    shiprocketCourierPriority?: StringFieldUpdateOperationsInput | string
    homepageSections?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ProductListRelationFilter = {
    every?: ProductWhereInput
    some?: ProductWhereInput
    none?: ProductWhereInput
  }

  export type OrderListRelationFilter = {
    every?: OrderWhereInput
    some?: OrderWhereInput
    none?: OrderWhereInput
  }

  export type AddressListRelationFilter = {
    every?: AddressWhereInput
    some?: AddressWhereInput
    none?: AddressWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProductOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AddressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    mobile?: SortOrder
    location?: SortOrder
    artisanId?: SortOrder
    gstin?: SortOrder
    aadhaar?: SortOrder
    pan?: SortOrder
    aadhaarUrl?: SortOrder
    panUrl?: SortOrder
    docUrl?: SortOrder
    vendorStatus?: SortOrder
    rejectionReason?: SortOrder
    allowedCategories?: SortOrder
    razorpayAccountId?: SortOrder
    payoutsPaused?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    mobile?: SortOrder
    location?: SortOrder
    artisanId?: SortOrder
    gstin?: SortOrder
    aadhaar?: SortOrder
    pan?: SortOrder
    aadhaarUrl?: SortOrder
    panUrl?: SortOrder
    docUrl?: SortOrder
    vendorStatus?: SortOrder
    rejectionReason?: SortOrder
    allowedCategories?: SortOrder
    razorpayAccountId?: SortOrder
    payoutsPaused?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    mobile?: SortOrder
    location?: SortOrder
    artisanId?: SortOrder
    gstin?: SortOrder
    aadhaar?: SortOrder
    pan?: SortOrder
    aadhaarUrl?: SortOrder
    panUrl?: SortOrder
    docUrl?: SortOrder
    vendorStatus?: SortOrder
    rejectionReason?: SortOrder
    allowedCategories?: SortOrder
    razorpayAccountId?: SortOrder
    payoutsPaused?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    image?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    image?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    image?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    id?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type CategoryRelationFilter = {
    is?: CategoryWhereInput
    isNot?: CategoryWhereInput
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type OrderItemListRelationFilter = {
    every?: OrderItemWhereInput
    some?: OrderItemWhereInput
    none?: OrderItemWhereInput
  }

  export type OrderItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    specs?: SortOrder
    image?: SortOrder
    images?: SortOrder
    prices?: SortOrder
    price?: SortOrder
    mrp?: SortOrder
    discount?: SortOrder
    rating?: SortOrder
    reviews?: SortOrder
    categoryName?: SortOrder
    material?: SortOrder
    stock?: SortOrder
    featured?: SortOrder
    newLaunch?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    vendorId?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
    mrp?: SortOrder
    discount?: SortOrder
    rating?: SortOrder
    reviews?: SortOrder
    stock?: SortOrder
    vendorId?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    specs?: SortOrder
    image?: SortOrder
    price?: SortOrder
    mrp?: SortOrder
    discount?: SortOrder
    rating?: SortOrder
    reviews?: SortOrder
    categoryName?: SortOrder
    material?: SortOrder
    stock?: SortOrder
    featured?: SortOrder
    newLaunch?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    vendorId?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    specs?: SortOrder
    image?: SortOrder
    price?: SortOrder
    mrp?: SortOrder
    discount?: SortOrder
    rating?: SortOrder
    reviews?: SortOrder
    categoryName?: SortOrder
    material?: SortOrder
    stock?: SortOrder
    featured?: SortOrder
    newLaunch?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    vendorId?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
    mrp?: SortOrder
    discount?: SortOrder
    rating?: SortOrder
    reviews?: SortOrder
    stock?: SortOrder
    vendorId?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type InquiryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    companyName?: SortOrder
    country?: SortOrder
    items?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type InquiryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type InquiryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    companyName?: SortOrder
    country?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type InquiryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    companyName?: SortOrder
    country?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type InquirySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ReturnRequestNullableRelationFilter = {
    is?: ReturnRequestWhereInput | null
    isNot?: ReturnRequestWhereInput | null
  }

  export type SettlementListRelationFilter = {
    every?: SettlementWhereInput
    some?: SettlementWhereInput
    none?: SettlementWhereInput
  }

  export type SettlementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    userId?: SortOrder
    paymentMethod?: SortOrder
    paymentGateway?: SortOrder
    paymentStatus?: SortOrder
    razorpayPaymentId?: SortOrder
    paymentOrderId?: SortOrder
    paymentData?: SortOrder
    subtotalPaise?: SortOrder
    shippingPaise?: SortOrder
    codChargePaise?: SortOrder
    taxPaise?: SortOrder
    totalPaise?: SortOrder
    currency?: SortOrder
    commissionRate?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    settlementStatus?: SortOrder
    settlementDate?: SortOrder
    shippingName?: SortOrder
    shippingPhone?: SortOrder
    shippingEmail?: SortOrder
    shippingAddress?: SortOrder
    shippingCity?: SortOrder
    shippingState?: SortOrder
    shippingPincode?: SortOrder
    shippingCountry?: SortOrder
    status?: SortOrder
    deliveryDate?: SortOrder
    deliveredAt?: SortOrder
    trackingId?: SortOrder
    returnWindowDays?: SortOrder
    shiprocketOrderId?: SortOrder
    shiprocketShipmentId?: SortOrder
    awbCode?: SortOrder
    courierName?: SortOrder
    courierId?: SortOrder
    shippingLabelUrl?: SortOrder
    manifestUrl?: SortOrder
    estimatedDelivery?: SortOrder
    shiprocketStatus?: SortOrder
    returnShiprocketId?: SortOrder
    returnAwbCode?: SortOrder
    returnCourierName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderAvgOrderByAggregateInput = {
    userId?: SortOrder
    subtotalPaise?: SortOrder
    shippingPaise?: SortOrder
    codChargePaise?: SortOrder
    taxPaise?: SortOrder
    totalPaise?: SortOrder
    commissionRate?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    returnWindowDays?: SortOrder
    shiprocketOrderId?: SortOrder
    shiprocketShipmentId?: SortOrder
    courierId?: SortOrder
    returnShiprocketId?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    userId?: SortOrder
    paymentMethod?: SortOrder
    paymentGateway?: SortOrder
    paymentStatus?: SortOrder
    razorpayPaymentId?: SortOrder
    paymentOrderId?: SortOrder
    subtotalPaise?: SortOrder
    shippingPaise?: SortOrder
    codChargePaise?: SortOrder
    taxPaise?: SortOrder
    totalPaise?: SortOrder
    currency?: SortOrder
    commissionRate?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    settlementStatus?: SortOrder
    settlementDate?: SortOrder
    shippingName?: SortOrder
    shippingPhone?: SortOrder
    shippingEmail?: SortOrder
    shippingAddress?: SortOrder
    shippingCity?: SortOrder
    shippingState?: SortOrder
    shippingPincode?: SortOrder
    shippingCountry?: SortOrder
    status?: SortOrder
    deliveryDate?: SortOrder
    deliveredAt?: SortOrder
    trackingId?: SortOrder
    returnWindowDays?: SortOrder
    shiprocketOrderId?: SortOrder
    shiprocketShipmentId?: SortOrder
    awbCode?: SortOrder
    courierName?: SortOrder
    courierId?: SortOrder
    shippingLabelUrl?: SortOrder
    manifestUrl?: SortOrder
    estimatedDelivery?: SortOrder
    shiprocketStatus?: SortOrder
    returnShiprocketId?: SortOrder
    returnAwbCode?: SortOrder
    returnCourierName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    userId?: SortOrder
    paymentMethod?: SortOrder
    paymentGateway?: SortOrder
    paymentStatus?: SortOrder
    razorpayPaymentId?: SortOrder
    paymentOrderId?: SortOrder
    subtotalPaise?: SortOrder
    shippingPaise?: SortOrder
    codChargePaise?: SortOrder
    taxPaise?: SortOrder
    totalPaise?: SortOrder
    currency?: SortOrder
    commissionRate?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    settlementStatus?: SortOrder
    settlementDate?: SortOrder
    shippingName?: SortOrder
    shippingPhone?: SortOrder
    shippingEmail?: SortOrder
    shippingAddress?: SortOrder
    shippingCity?: SortOrder
    shippingState?: SortOrder
    shippingPincode?: SortOrder
    shippingCountry?: SortOrder
    status?: SortOrder
    deliveryDate?: SortOrder
    deliveredAt?: SortOrder
    trackingId?: SortOrder
    returnWindowDays?: SortOrder
    shiprocketOrderId?: SortOrder
    shiprocketShipmentId?: SortOrder
    awbCode?: SortOrder
    courierName?: SortOrder
    courierId?: SortOrder
    shippingLabelUrl?: SortOrder
    manifestUrl?: SortOrder
    estimatedDelivery?: SortOrder
    shiprocketStatus?: SortOrder
    returnShiprocketId?: SortOrder
    returnAwbCode?: SortOrder
    returnCourierName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderSumOrderByAggregateInput = {
    userId?: SortOrder
    subtotalPaise?: SortOrder
    shippingPaise?: SortOrder
    codChargePaise?: SortOrder
    taxPaise?: SortOrder
    totalPaise?: SortOrder
    commissionRate?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    returnWindowDays?: SortOrder
    shiprocketOrderId?: SortOrder
    shiprocketShipmentId?: SortOrder
    courierId?: SortOrder
    returnShiprocketId?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type OrderRelationFilter = {
    is?: OrderWhereInput
    isNot?: OrderWhereInput
  }

  export type ProductRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type OrderItemCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    quantity?: SortOrder
    unitPaise?: SortOrder
    totalPaise?: SortOrder
    productName?: SortOrder
    productImage?: SortOrder
    productMaterial?: SortOrder
    returnQuantity?: SortOrder
    returnStatus?: SortOrder
    stockRestored?: SortOrder
    dispatchImages?: SortOrder
  }

  export type OrderItemAvgOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    quantity?: SortOrder
    unitPaise?: SortOrder
    totalPaise?: SortOrder
    returnQuantity?: SortOrder
  }

  export type OrderItemMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    quantity?: SortOrder
    unitPaise?: SortOrder
    totalPaise?: SortOrder
    productName?: SortOrder
    productImage?: SortOrder
    productMaterial?: SortOrder
    returnQuantity?: SortOrder
    returnStatus?: SortOrder
    stockRestored?: SortOrder
  }

  export type OrderItemMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    quantity?: SortOrder
    unitPaise?: SortOrder
    totalPaise?: SortOrder
    productName?: SortOrder
    productImage?: SortOrder
    productMaterial?: SortOrder
    returnQuantity?: SortOrder
    returnStatus?: SortOrder
    stockRestored?: SortOrder
  }

  export type OrderItemSumOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    quantity?: SortOrder
    unitPaise?: SortOrder
    totalPaise?: SortOrder
    returnQuantity?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ReturnRequestCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    reasonDetail?: SortOrder
    returnImages?: SortOrder
    returnItems?: SortOrder
    status?: SortOrder
    adminNotes?: SortOrder
    qcNotes?: SortOrder
    qcImages?: SortOrder
    vendorQcNotes?: SortOrder
    vendorQcImages?: SortOrder
    rejectionReason?: SortOrder
    refundAmount?: SortOrder
    refundMethod?: SortOrder
    refundStatus?: SortOrder
    refundId?: SortOrder
    refundedAt?: SortOrder
    stockRestored?: SortOrder
    vendorDeliveredAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReturnRequestAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refundAmount?: SortOrder
  }

  export type ReturnRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    reasonDetail?: SortOrder
    status?: SortOrder
    adminNotes?: SortOrder
    qcNotes?: SortOrder
    vendorQcNotes?: SortOrder
    rejectionReason?: SortOrder
    refundAmount?: SortOrder
    refundMethod?: SortOrder
    refundStatus?: SortOrder
    refundId?: SortOrder
    refundedAt?: SortOrder
    stockRestored?: SortOrder
    vendorDeliveredAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReturnRequestMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    reasonDetail?: SortOrder
    status?: SortOrder
    adminNotes?: SortOrder
    qcNotes?: SortOrder
    vendorQcNotes?: SortOrder
    rejectionReason?: SortOrder
    refundAmount?: SortOrder
    refundMethod?: SortOrder
    refundStatus?: SortOrder
    refundId?: SortOrder
    refundedAt?: SortOrder
    stockRestored?: SortOrder
    vendorDeliveredAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReturnRequestSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refundAmount?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type SettlementCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    vendorId?: SortOrder
    orderAmountPaise?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    status?: SortOrder
    holdUntil?: SortOrder
    settledAt?: SortOrder
    vendorPaymentRef?: SortOrder
    vendorPaymentMode?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettlementAvgOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    orderAmountPaise?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
  }

  export type SettlementMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    vendorId?: SortOrder
    orderAmountPaise?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    status?: SortOrder
    holdUntil?: SortOrder
    settledAt?: SortOrder
    vendorPaymentRef?: SortOrder
    vendorPaymentMode?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettlementMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    vendorId?: SortOrder
    orderAmountPaise?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
    status?: SortOrder
    holdUntil?: SortOrder
    settledAt?: SortOrder
    vendorPaymentRef?: SortOrder
    vendorPaymentMode?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettlementSumOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    orderAmountPaise?: SortOrder
    commissionPaise?: SortOrder
    vendorPayoutPaise?: SortOrder
  }

  export type AddressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    label?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    pincode?: SortOrder
    country?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type AddressAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type AddressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    label?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    pincode?: SortOrder
    country?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type AddressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    label?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    pincode?: SortOrder
    country?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type AddressSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type AdminSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    defaultCommissionRate?: SortOrder
    taxRate?: SortOrder
    commissionGstRate?: SortOrder
    commissionSacCode?: SortOrder
    companyName?: SortOrder
    companyAddress?: SortOrder
    companyGstin?: SortOrder
    companyPan?: SortOrder
    companyCity?: SortOrder
    companyState?: SortOrder
    companyCountry?: SortOrder
    companyPincode?: SortOrder
    shippingFreeAbove?: SortOrder
    shippingChargePaise?: SortOrder
    codShippingChargePaise?: SortOrder
    internationalShippingPaise?: SortOrder
    codEnabled?: SortOrder
    codMaxAmountPaise?: SortOrder
    codSurchargePaise?: SortOrder
    returnWindowDays?: SortOrder
    returnEnabled?: SortOrder
    vendorReturnSlaHours?: SortOrder
    payoutSchedule?: SortOrder
    payoutCustomDays?: SortOrder
    lastPayoutRun?: SortOrder
    shiprocketPickupLocation?: SortOrder
    shiprocketAutoAssign?: SortOrder
    shiprocketCourierPriority?: SortOrder
    homepageSections?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminSettingsAvgOrderByAggregateInput = {
    id?: SortOrder
    defaultCommissionRate?: SortOrder
    taxRate?: SortOrder
    commissionGstRate?: SortOrder
    shippingFreeAbove?: SortOrder
    shippingChargePaise?: SortOrder
    codShippingChargePaise?: SortOrder
    internationalShippingPaise?: SortOrder
    codMaxAmountPaise?: SortOrder
    codSurchargePaise?: SortOrder
    returnWindowDays?: SortOrder
    vendorReturnSlaHours?: SortOrder
    payoutCustomDays?: SortOrder
  }

  export type AdminSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    defaultCommissionRate?: SortOrder
    taxRate?: SortOrder
    commissionGstRate?: SortOrder
    commissionSacCode?: SortOrder
    companyName?: SortOrder
    companyAddress?: SortOrder
    companyGstin?: SortOrder
    companyPan?: SortOrder
    companyCity?: SortOrder
    companyState?: SortOrder
    companyCountry?: SortOrder
    companyPincode?: SortOrder
    shippingFreeAbove?: SortOrder
    shippingChargePaise?: SortOrder
    codShippingChargePaise?: SortOrder
    internationalShippingPaise?: SortOrder
    codEnabled?: SortOrder
    codMaxAmountPaise?: SortOrder
    codSurchargePaise?: SortOrder
    returnWindowDays?: SortOrder
    returnEnabled?: SortOrder
    vendorReturnSlaHours?: SortOrder
    payoutSchedule?: SortOrder
    payoutCustomDays?: SortOrder
    lastPayoutRun?: SortOrder
    shiprocketPickupLocation?: SortOrder
    shiprocketAutoAssign?: SortOrder
    shiprocketCourierPriority?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    defaultCommissionRate?: SortOrder
    taxRate?: SortOrder
    commissionGstRate?: SortOrder
    commissionSacCode?: SortOrder
    companyName?: SortOrder
    companyAddress?: SortOrder
    companyGstin?: SortOrder
    companyPan?: SortOrder
    companyCity?: SortOrder
    companyState?: SortOrder
    companyCountry?: SortOrder
    companyPincode?: SortOrder
    shippingFreeAbove?: SortOrder
    shippingChargePaise?: SortOrder
    codShippingChargePaise?: SortOrder
    internationalShippingPaise?: SortOrder
    codEnabled?: SortOrder
    codMaxAmountPaise?: SortOrder
    codSurchargePaise?: SortOrder
    returnWindowDays?: SortOrder
    returnEnabled?: SortOrder
    vendorReturnSlaHours?: SortOrder
    payoutSchedule?: SortOrder
    payoutCustomDays?: SortOrder
    lastPayoutRun?: SortOrder
    shiprocketPickupLocation?: SortOrder
    shiprocketAutoAssign?: SortOrder
    shiprocketCourierPriority?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminSettingsSumOrderByAggregateInput = {
    id?: SortOrder
    defaultCommissionRate?: SortOrder
    taxRate?: SortOrder
    commissionGstRate?: SortOrder
    shippingFreeAbove?: SortOrder
    shippingChargePaise?: SortOrder
    codShippingChargePaise?: SortOrder
    internationalShippingPaise?: SortOrder
    codMaxAmountPaise?: SortOrder
    codSurchargePaise?: SortOrder
    returnWindowDays?: SortOrder
    vendorReturnSlaHours?: SortOrder
    payoutCustomDays?: SortOrder
  }

  export type ProductCreateNestedManyWithoutVendorInput = {
    create?: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput> | ProductCreateWithoutVendorInput[] | ProductUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutVendorInput | ProductCreateOrConnectWithoutVendorInput[]
    createMany?: ProductCreateManyVendorInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type OrderCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type AddressCreateNestedManyWithoutUserInput = {
    create?: XOR<AddressCreateWithoutUserInput, AddressUncheckedCreateWithoutUserInput> | AddressCreateWithoutUserInput[] | AddressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutUserInput | AddressCreateOrConnectWithoutUserInput[]
    createMany?: AddressCreateManyUserInputEnvelope
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput> | ProductCreateWithoutVendorInput[] | ProductUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutVendorInput | ProductCreateOrConnectWithoutVendorInput[]
    createMany?: ProductCreateManyVendorInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type AddressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AddressCreateWithoutUserInput, AddressUncheckedCreateWithoutUserInput> | AddressCreateWithoutUserInput[] | AddressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutUserInput | AddressCreateOrConnectWithoutUserInput[]
    createMany?: AddressCreateManyUserInputEnvelope
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ProductUpdateManyWithoutVendorNestedInput = {
    create?: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput> | ProductCreateWithoutVendorInput[] | ProductUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutVendorInput | ProductCreateOrConnectWithoutVendorInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutVendorInput | ProductUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: ProductCreateManyVendorInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutVendorInput | ProductUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutVendorInput | ProductUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type OrderUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutUserInput | OrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutUserInput | OrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutUserInput | OrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type AddressUpdateManyWithoutUserNestedInput = {
    create?: XOR<AddressCreateWithoutUserInput, AddressUncheckedCreateWithoutUserInput> | AddressCreateWithoutUserInput[] | AddressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutUserInput | AddressCreateOrConnectWithoutUserInput[]
    upsert?: AddressUpsertWithWhereUniqueWithoutUserInput | AddressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AddressCreateManyUserInputEnvelope
    set?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    disconnect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    delete?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    update?: AddressUpdateWithWhereUniqueWithoutUserInput | AddressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AddressUpdateManyWithWhereWithoutUserInput | AddressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AddressScalarWhereInput | AddressScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProductUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput> | ProductCreateWithoutVendorInput[] | ProductUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutVendorInput | ProductCreateOrConnectWithoutVendorInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutVendorInput | ProductUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: ProductCreateManyVendorInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutVendorInput | ProductUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutVendorInput | ProductUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutUserInput | OrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutUserInput | OrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutUserInput | OrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type AddressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AddressCreateWithoutUserInput, AddressUncheckedCreateWithoutUserInput> | AddressCreateWithoutUserInput[] | AddressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutUserInput | AddressCreateOrConnectWithoutUserInput[]
    upsert?: AddressUpsertWithWhereUniqueWithoutUserInput | AddressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AddressCreateManyUserInputEnvelope
    set?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    disconnect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    delete?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    update?: AddressUpdateWithWhereUniqueWithoutUserInput | AddressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AddressUpdateManyWithWhereWithoutUserInput | AddressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AddressScalarWhereInput | AddressScalarWhereInput[]
  }

  export type ProductCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutCategoryInput | ProductUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutCategoryInput | ProductUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutCategoryInput | ProductUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutCategoryInput | ProductUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutCategoryInput | ProductUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutCategoryInput | ProductUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type CategoryCreateNestedOneWithoutProductsInput = {
    create?: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutProductsInput
    connect?: CategoryWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutProductsInput = {
    create?: XOR<UserCreateWithoutProductsInput, UserUncheckedCreateWithoutProductsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProductsInput
    connect?: UserWhereUniqueInput
  }

  export type OrderItemCreateNestedManyWithoutProductInput = {
    create?: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput> | OrderItemCreateWithoutProductInput[] | OrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutProductInput | OrderItemCreateOrConnectWithoutProductInput[]
    createMany?: OrderItemCreateManyProductInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type OrderItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput> | OrderItemCreateWithoutProductInput[] | OrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutProductInput | OrderItemCreateOrConnectWithoutProductInput[]
    createMany?: OrderItemCreateManyProductInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CategoryUpdateOneRequiredWithoutProductsNestedInput = {
    create?: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutProductsInput
    upsert?: CategoryUpsertWithoutProductsInput
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutProductsInput, CategoryUpdateWithoutProductsInput>, CategoryUncheckedUpdateWithoutProductsInput>
  }

  export type UserUpdateOneWithoutProductsNestedInput = {
    create?: XOR<UserCreateWithoutProductsInput, UserUncheckedCreateWithoutProductsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProductsInput
    upsert?: UserUpsertWithoutProductsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProductsInput, UserUpdateWithoutProductsInput>, UserUncheckedUpdateWithoutProductsInput>
  }

  export type OrderItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput> | OrderItemCreateWithoutProductInput[] | OrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutProductInput | OrderItemCreateOrConnectWithoutProductInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutProductInput | OrderItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: OrderItemCreateManyProductInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutProductInput | OrderItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutProductInput | OrderItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OrderItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput> | OrderItemCreateWithoutProductInput[] | OrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutProductInput | OrderItemCreateOrConnectWithoutProductInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutProductInput | OrderItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: OrderItemCreateManyProductInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutProductInput | OrderItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutProductInput | OrderItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutOrdersInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    connect?: UserWhereUniqueInput
  }

  export type OrderItemCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type ReturnRequestCreateNestedOneWithoutOrderInput = {
    create?: XOR<ReturnRequestCreateWithoutOrderInput, ReturnRequestUncheckedCreateWithoutOrderInput>
    connectOrCreate?: ReturnRequestCreateOrConnectWithoutOrderInput
    connect?: ReturnRequestWhereUniqueInput
  }

  export type SettlementCreateNestedManyWithoutOrderInput = {
    create?: XOR<SettlementCreateWithoutOrderInput, SettlementUncheckedCreateWithoutOrderInput> | SettlementCreateWithoutOrderInput[] | SettlementUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: SettlementCreateOrConnectWithoutOrderInput | SettlementCreateOrConnectWithoutOrderInput[]
    createMany?: SettlementCreateManyOrderInputEnvelope
    connect?: SettlementWhereUniqueInput | SettlementWhereUniqueInput[]
  }

  export type OrderItemUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type ReturnRequestUncheckedCreateNestedOneWithoutOrderInput = {
    create?: XOR<ReturnRequestCreateWithoutOrderInput, ReturnRequestUncheckedCreateWithoutOrderInput>
    connectOrCreate?: ReturnRequestCreateOrConnectWithoutOrderInput
    connect?: ReturnRequestWhereUniqueInput
  }

  export type SettlementUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<SettlementCreateWithoutOrderInput, SettlementUncheckedCreateWithoutOrderInput> | SettlementCreateWithoutOrderInput[] | SettlementUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: SettlementCreateOrConnectWithoutOrderInput | SettlementCreateOrConnectWithoutOrderInput[]
    createMany?: SettlementCreateManyOrderInputEnvelope
    connect?: SettlementWhereUniqueInput | SettlementWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    upsert?: UserUpsertWithoutOrdersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrdersInput, UserUpdateWithoutOrdersInput>, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type OrderItemUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutOrderInput | OrderItemUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutOrderInput | OrderItemUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutOrderInput | OrderItemUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type ReturnRequestUpdateOneWithoutOrderNestedInput = {
    create?: XOR<ReturnRequestCreateWithoutOrderInput, ReturnRequestUncheckedCreateWithoutOrderInput>
    connectOrCreate?: ReturnRequestCreateOrConnectWithoutOrderInput
    upsert?: ReturnRequestUpsertWithoutOrderInput
    disconnect?: ReturnRequestWhereInput | boolean
    delete?: ReturnRequestWhereInput | boolean
    connect?: ReturnRequestWhereUniqueInput
    update?: XOR<XOR<ReturnRequestUpdateToOneWithWhereWithoutOrderInput, ReturnRequestUpdateWithoutOrderInput>, ReturnRequestUncheckedUpdateWithoutOrderInput>
  }

  export type SettlementUpdateManyWithoutOrderNestedInput = {
    create?: XOR<SettlementCreateWithoutOrderInput, SettlementUncheckedCreateWithoutOrderInput> | SettlementCreateWithoutOrderInput[] | SettlementUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: SettlementCreateOrConnectWithoutOrderInput | SettlementCreateOrConnectWithoutOrderInput[]
    upsert?: SettlementUpsertWithWhereUniqueWithoutOrderInput | SettlementUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: SettlementCreateManyOrderInputEnvelope
    set?: SettlementWhereUniqueInput | SettlementWhereUniqueInput[]
    disconnect?: SettlementWhereUniqueInput | SettlementWhereUniqueInput[]
    delete?: SettlementWhereUniqueInput | SettlementWhereUniqueInput[]
    connect?: SettlementWhereUniqueInput | SettlementWhereUniqueInput[]
    update?: SettlementUpdateWithWhereUniqueWithoutOrderInput | SettlementUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: SettlementUpdateManyWithWhereWithoutOrderInput | SettlementUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: SettlementScalarWhereInput | SettlementScalarWhereInput[]
  }

  export type OrderItemUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutOrderInput | OrderItemUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutOrderInput | OrderItemUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutOrderInput | OrderItemUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type ReturnRequestUncheckedUpdateOneWithoutOrderNestedInput = {
    create?: XOR<ReturnRequestCreateWithoutOrderInput, ReturnRequestUncheckedCreateWithoutOrderInput>
    connectOrCreate?: ReturnRequestCreateOrConnectWithoutOrderInput
    upsert?: ReturnRequestUpsertWithoutOrderInput
    disconnect?: ReturnRequestWhereInput | boolean
    delete?: ReturnRequestWhereInput | boolean
    connect?: ReturnRequestWhereUniqueInput
    update?: XOR<XOR<ReturnRequestUpdateToOneWithWhereWithoutOrderInput, ReturnRequestUpdateWithoutOrderInput>, ReturnRequestUncheckedUpdateWithoutOrderInput>
  }

  export type SettlementUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<SettlementCreateWithoutOrderInput, SettlementUncheckedCreateWithoutOrderInput> | SettlementCreateWithoutOrderInput[] | SettlementUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: SettlementCreateOrConnectWithoutOrderInput | SettlementCreateOrConnectWithoutOrderInput[]
    upsert?: SettlementUpsertWithWhereUniqueWithoutOrderInput | SettlementUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: SettlementCreateManyOrderInputEnvelope
    set?: SettlementWhereUniqueInput | SettlementWhereUniqueInput[]
    disconnect?: SettlementWhereUniqueInput | SettlementWhereUniqueInput[]
    delete?: SettlementWhereUniqueInput | SettlementWhereUniqueInput[]
    connect?: SettlementWhereUniqueInput | SettlementWhereUniqueInput[]
    update?: SettlementUpdateWithWhereUniqueWithoutOrderInput | SettlementUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: SettlementUpdateManyWithWhereWithoutOrderInput | SettlementUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: SettlementScalarWhereInput | SettlementScalarWhereInput[]
  }

  export type OrderCreateNestedOneWithoutItemsInput = {
    create?: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutItemsInput
    connect?: OrderWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutOrderItemsInput = {
    create?: XOR<ProductCreateWithoutOrderItemsInput, ProductUncheckedCreateWithoutOrderItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutOrderItemsInput
    connect?: ProductWhereUniqueInput
  }

  export type OrderUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutItemsInput
    upsert?: OrderUpsertWithoutItemsInput
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutItemsInput, OrderUpdateWithoutItemsInput>, OrderUncheckedUpdateWithoutItemsInput>
  }

  export type ProductUpdateOneRequiredWithoutOrderItemsNestedInput = {
    create?: XOR<ProductCreateWithoutOrderItemsInput, ProductUncheckedCreateWithoutOrderItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutOrderItemsInput
    upsert?: ProductUpsertWithoutOrderItemsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutOrderItemsInput, ProductUpdateWithoutOrderItemsInput>, ProductUncheckedUpdateWithoutOrderItemsInput>
  }

  export type OrderCreateNestedOneWithoutReturnRequestInput = {
    create?: XOR<OrderCreateWithoutReturnRequestInput, OrderUncheckedCreateWithoutReturnRequestInput>
    connectOrCreate?: OrderCreateOrConnectWithoutReturnRequestInput
    connect?: OrderWhereUniqueInput
  }

  export type OrderUpdateOneRequiredWithoutReturnRequestNestedInput = {
    create?: XOR<OrderCreateWithoutReturnRequestInput, OrderUncheckedCreateWithoutReturnRequestInput>
    connectOrCreate?: OrderCreateOrConnectWithoutReturnRequestInput
    upsert?: OrderUpsertWithoutReturnRequestInput
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutReturnRequestInput, OrderUpdateWithoutReturnRequestInput>, OrderUncheckedUpdateWithoutReturnRequestInput>
  }

  export type OrderCreateNestedOneWithoutSettlementsInput = {
    create?: XOR<OrderCreateWithoutSettlementsInput, OrderUncheckedCreateWithoutSettlementsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutSettlementsInput
    connect?: OrderWhereUniqueInput
  }

  export type OrderUpdateOneRequiredWithoutSettlementsNestedInput = {
    create?: XOR<OrderCreateWithoutSettlementsInput, OrderUncheckedCreateWithoutSettlementsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutSettlementsInput
    upsert?: OrderUpsertWithoutSettlementsInput
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutSettlementsInput, OrderUpdateWithoutSettlementsInput>, OrderUncheckedUpdateWithoutSettlementsInput>
  }

  export type UserCreateNestedOneWithoutAddressesInput = {
    create?: XOR<UserCreateWithoutAddressesInput, UserUncheckedCreateWithoutAddressesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAddressesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAddressesNestedInput = {
    create?: XOR<UserCreateWithoutAddressesInput, UserUncheckedCreateWithoutAddressesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAddressesInput
    upsert?: UserUpsertWithoutAddressesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAddressesInput, UserUpdateWithoutAddressesInput>, UserUncheckedUpdateWithoutAddressesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProductCreateWithoutVendorInput = {
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price: number
    mrp: number
    discount: number
    rating?: number
    reviews?: number
    material: string
    stock?: number
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutProductsInput
    orderItems?: OrderItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutVendorInput = {
    id?: number
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price: number
    mrp: number
    discount: number
    rating?: number
    reviews?: number
    categoryName: string
    material: string
    stock?: number
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: Date | string
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutVendorInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput>
  }

  export type ProductCreateManyVendorInputEnvelope = {
    data: ProductCreateManyVendorInput | ProductCreateManyVendorInput[]
    skipDuplicates?: boolean
  }

  export type OrderCreateWithoutUserInput = {
    id?: string
    orderNumber: string
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: OrderItemCreateNestedManyWithoutOrderInput
    returnRequest?: ReturnRequestCreateNestedOneWithoutOrderInput
    settlements?: SettlementCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutUserInput = {
    id?: string
    orderNumber: string
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput
    returnRequest?: ReturnRequestUncheckedCreateNestedOneWithoutOrderInput
    settlements?: SettlementUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutUserInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput>
  }

  export type OrderCreateManyUserInputEnvelope = {
    data: OrderCreateManyUserInput | OrderCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AddressCreateWithoutUserInput = {
    label?: string
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country?: string
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type AddressUncheckedCreateWithoutUserInput = {
    id?: number
    label?: string
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country?: string
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type AddressCreateOrConnectWithoutUserInput = {
    where: AddressWhereUniqueInput
    create: XOR<AddressCreateWithoutUserInput, AddressUncheckedCreateWithoutUserInput>
  }

  export type AddressCreateManyUserInputEnvelope = {
    data: AddressCreateManyUserInput | AddressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithWhereUniqueWithoutVendorInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutVendorInput, ProductUncheckedUpdateWithoutVendorInput>
    create: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutVendorInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutVendorInput, ProductUncheckedUpdateWithoutVendorInput>
  }

  export type ProductUpdateManyWithWhereWithoutVendorInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutVendorInput>
  }

  export type ProductScalarWhereInput = {
    AND?: ProductScalarWhereInput | ProductScalarWhereInput[]
    OR?: ProductScalarWhereInput[]
    NOT?: ProductScalarWhereInput | ProductScalarWhereInput[]
    id?: IntFilter<"Product"> | number
    name?: StringFilter<"Product"> | string
    slug?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    specs?: StringFilter<"Product"> | string
    image?: StringFilter<"Product"> | string
    images?: JsonNullableFilter<"Product">
    prices?: JsonNullableFilter<"Product">
    price?: FloatFilter<"Product"> | number
    mrp?: FloatFilter<"Product"> | number
    discount?: FloatFilter<"Product"> | number
    rating?: FloatFilter<"Product"> | number
    reviews?: IntFilter<"Product"> | number
    categoryName?: StringFilter<"Product"> | string
    material?: StringFilter<"Product"> | string
    stock?: IntFilter<"Product"> | number
    featured?: BoolFilter<"Product"> | boolean
    newLaunch?: BoolFilter<"Product"> | boolean
    active?: BoolFilter<"Product"> | boolean
    createdAt?: DateTimeFilter<"Product"> | Date | string
    vendorId?: IntNullableFilter<"Product"> | number | null
  }

  export type OrderUpsertWithWhereUniqueWithoutUserInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutUserInput, OrderUncheckedUpdateWithoutUserInput>
    create: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutUserInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutUserInput, OrderUncheckedUpdateWithoutUserInput>
  }

  export type OrderUpdateManyWithWhereWithoutUserInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutUserInput>
  }

  export type OrderScalarWhereInput = {
    AND?: OrderScalarWhereInput | OrderScalarWhereInput[]
    OR?: OrderScalarWhereInput[]
    NOT?: OrderScalarWhereInput | OrderScalarWhereInput[]
    id?: StringFilter<"Order"> | string
    orderNumber?: StringFilter<"Order"> | string
    userId?: IntFilter<"Order"> | number
    paymentMethod?: StringFilter<"Order"> | string
    paymentGateway?: StringNullableFilter<"Order"> | string | null
    paymentStatus?: StringFilter<"Order"> | string
    razorpayPaymentId?: StringNullableFilter<"Order"> | string | null
    paymentOrderId?: StringNullableFilter<"Order"> | string | null
    paymentData?: JsonNullableFilter<"Order">
    subtotalPaise?: IntFilter<"Order"> | number
    shippingPaise?: IntFilter<"Order"> | number
    codChargePaise?: IntFilter<"Order"> | number
    taxPaise?: IntFilter<"Order"> | number
    totalPaise?: IntFilter<"Order"> | number
    currency?: StringFilter<"Order"> | string
    commissionRate?: FloatFilter<"Order"> | number
    commissionPaise?: IntFilter<"Order"> | number
    vendorPayoutPaise?: IntFilter<"Order"> | number
    settlementStatus?: StringFilter<"Order"> | string
    settlementDate?: DateTimeNullableFilter<"Order"> | Date | string | null
    shippingName?: StringFilter<"Order"> | string
    shippingPhone?: StringFilter<"Order"> | string
    shippingEmail?: StringFilter<"Order"> | string
    shippingAddress?: StringFilter<"Order"> | string
    shippingCity?: StringFilter<"Order"> | string
    shippingState?: StringFilter<"Order"> | string
    shippingPincode?: StringFilter<"Order"> | string
    shippingCountry?: StringFilter<"Order"> | string
    status?: StringFilter<"Order"> | string
    deliveryDate?: DateTimeNullableFilter<"Order"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    trackingId?: StringNullableFilter<"Order"> | string | null
    returnWindowDays?: IntFilter<"Order"> | number
    shiprocketOrderId?: IntNullableFilter<"Order"> | number | null
    shiprocketShipmentId?: IntNullableFilter<"Order"> | number | null
    awbCode?: StringNullableFilter<"Order"> | string | null
    courierName?: StringNullableFilter<"Order"> | string | null
    courierId?: IntNullableFilter<"Order"> | number | null
    shippingLabelUrl?: StringNullableFilter<"Order"> | string | null
    manifestUrl?: StringNullableFilter<"Order"> | string | null
    estimatedDelivery?: DateTimeNullableFilter<"Order"> | Date | string | null
    shiprocketStatus?: StringNullableFilter<"Order"> | string | null
    returnShiprocketId?: IntNullableFilter<"Order"> | number | null
    returnAwbCode?: StringNullableFilter<"Order"> | string | null
    returnCourierName?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
  }

  export type AddressUpsertWithWhereUniqueWithoutUserInput = {
    where: AddressWhereUniqueInput
    update: XOR<AddressUpdateWithoutUserInput, AddressUncheckedUpdateWithoutUserInput>
    create: XOR<AddressCreateWithoutUserInput, AddressUncheckedCreateWithoutUserInput>
  }

  export type AddressUpdateWithWhereUniqueWithoutUserInput = {
    where: AddressWhereUniqueInput
    data: XOR<AddressUpdateWithoutUserInput, AddressUncheckedUpdateWithoutUserInput>
  }

  export type AddressUpdateManyWithWhereWithoutUserInput = {
    where: AddressScalarWhereInput
    data: XOR<AddressUpdateManyMutationInput, AddressUncheckedUpdateManyWithoutUserInput>
  }

  export type AddressScalarWhereInput = {
    AND?: AddressScalarWhereInput | AddressScalarWhereInput[]
    OR?: AddressScalarWhereInput[]
    NOT?: AddressScalarWhereInput | AddressScalarWhereInput[]
    id?: IntFilter<"Address"> | number
    userId?: IntFilter<"Address"> | number
    label?: StringFilter<"Address"> | string
    name?: StringFilter<"Address"> | string
    phone?: StringFilter<"Address"> | string
    address?: StringFilter<"Address"> | string
    city?: StringFilter<"Address"> | string
    state?: StringFilter<"Address"> | string
    pincode?: StringFilter<"Address"> | string
    country?: StringFilter<"Address"> | string
    isDefault?: BoolFilter<"Address"> | boolean
    createdAt?: DateTimeFilter<"Address"> | Date | string
  }

  export type ProductCreateWithoutCategoryInput = {
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price: number
    mrp: number
    discount: number
    rating?: number
    reviews?: number
    material: string
    stock?: number
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: Date | string
    vendor?: UserCreateNestedOneWithoutProductsInput
    orderItems?: OrderItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutCategoryInput = {
    id?: number
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price: number
    mrp: number
    discount: number
    rating?: number
    reviews?: number
    material: string
    stock?: number
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: Date | string
    vendorId?: number | null
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput>
  }

  export type ProductCreateManyCategoryInputEnvelope = {
    data: ProductCreateManyCategoryInput | ProductCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithWhereUniqueWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutCategoryInput, ProductUncheckedUpdateWithoutCategoryInput>
    create: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutCategoryInput, ProductUncheckedUpdateWithoutCategoryInput>
  }

  export type ProductUpdateManyWithWhereWithoutCategoryInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutCategoryInput>
  }

  export type CategoryCreateWithoutProductsInput = {
    name: string
    slug: string
    image: string
  }

  export type CategoryUncheckedCreateWithoutProductsInput = {
    id?: number
    name: string
    slug: string
    image: string
  }

  export type CategoryCreateOrConnectWithoutProductsInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
  }

  export type UserCreateWithoutProductsInput = {
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    mobile?: string | null
    location?: string | null
    artisanId?: string | null
    gstin?: string | null
    aadhaar?: string | null
    pan?: string | null
    aadhaarUrl?: string | null
    panUrl?: string | null
    docUrl?: string | null
    vendorStatus?: string
    rejectionReason?: string | null
    allowedCategories?: string | null
    razorpayAccountId?: string | null
    payoutsPaused?: boolean
    orders?: OrderCreateNestedManyWithoutUserInput
    addresses?: AddressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProductsInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    mobile?: string | null
    location?: string | null
    artisanId?: string | null
    gstin?: string | null
    aadhaar?: string | null
    pan?: string | null
    aadhaarUrl?: string | null
    panUrl?: string | null
    docUrl?: string | null
    vendorStatus?: string
    rejectionReason?: string | null
    allowedCategories?: string | null
    razorpayAccountId?: string | null
    payoutsPaused?: boolean
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    addresses?: AddressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProductsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProductsInput, UserUncheckedCreateWithoutProductsInput>
  }

  export type OrderItemCreateWithoutProductInput = {
    vendorId?: number | null
    quantity: number
    unitPaise: number
    totalPaise: number
    productName: string
    productImage: string
    productMaterial: string
    returnQuantity?: number
    returnStatus?: string | null
    stockRestored?: boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
    order: OrderCreateNestedOneWithoutItemsInput
  }

  export type OrderItemUncheckedCreateWithoutProductInput = {
    id?: number
    orderId: string
    vendorId?: number | null
    quantity: number
    unitPaise: number
    totalPaise: number
    productName: string
    productImage: string
    productMaterial: string
    returnQuantity?: number
    returnStatus?: string | null
    stockRestored?: boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OrderItemCreateOrConnectWithoutProductInput = {
    where: OrderItemWhereUniqueInput
    create: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput>
  }

  export type OrderItemCreateManyProductInputEnvelope = {
    data: OrderItemCreateManyProductInput | OrderItemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type CategoryUpsertWithoutProductsInput = {
    update: XOR<CategoryUpdateWithoutProductsInput, CategoryUncheckedUpdateWithoutProductsInput>
    create: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutProductsInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutProductsInput, CategoryUncheckedUpdateWithoutProductsInput>
  }

  export type CategoryUpdateWithoutProductsInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryUncheckedUpdateWithoutProductsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpsertWithoutProductsInput = {
    update: XOR<UserUpdateWithoutProductsInput, UserUncheckedUpdateWithoutProductsInput>
    create: XOR<UserCreateWithoutProductsInput, UserUncheckedCreateWithoutProductsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProductsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProductsInput, UserUncheckedUpdateWithoutProductsInput>
  }

  export type UserUpdateWithoutProductsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    artisanId?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaar?: NullableStringFieldUpdateOperationsInput | string | null
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    panUrl?: NullableStringFieldUpdateOperationsInput | string | null
    docUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vendorStatus?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    allowedCategories?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    payoutsPaused?: BoolFieldUpdateOperationsInput | boolean
    orders?: OrderUpdateManyWithoutUserNestedInput
    addresses?: AddressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProductsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    artisanId?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaar?: NullableStringFieldUpdateOperationsInput | string | null
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    panUrl?: NullableStringFieldUpdateOperationsInput | string | null
    docUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vendorStatus?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    allowedCategories?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    payoutsPaused?: BoolFieldUpdateOperationsInput | boolean
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    addresses?: AddressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type OrderItemUpsertWithWhereUniqueWithoutProductInput = {
    where: OrderItemWhereUniqueInput
    update: XOR<OrderItemUpdateWithoutProductInput, OrderItemUncheckedUpdateWithoutProductInput>
    create: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput>
  }

  export type OrderItemUpdateWithWhereUniqueWithoutProductInput = {
    where: OrderItemWhereUniqueInput
    data: XOR<OrderItemUpdateWithoutProductInput, OrderItemUncheckedUpdateWithoutProductInput>
  }

  export type OrderItemUpdateManyWithWhereWithoutProductInput = {
    where: OrderItemScalarWhereInput
    data: XOR<OrderItemUpdateManyMutationInput, OrderItemUncheckedUpdateManyWithoutProductInput>
  }

  export type OrderItemScalarWhereInput = {
    AND?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
    OR?: OrderItemScalarWhereInput[]
    NOT?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
    id?: IntFilter<"OrderItem"> | number
    orderId?: StringFilter<"OrderItem"> | string
    productId?: IntFilter<"OrderItem"> | number
    vendorId?: IntNullableFilter<"OrderItem"> | number | null
    quantity?: IntFilter<"OrderItem"> | number
    unitPaise?: IntFilter<"OrderItem"> | number
    totalPaise?: IntFilter<"OrderItem"> | number
    productName?: StringFilter<"OrderItem"> | string
    productImage?: StringFilter<"OrderItem"> | string
    productMaterial?: StringFilter<"OrderItem"> | string
    returnQuantity?: IntFilter<"OrderItem"> | number
    returnStatus?: StringNullableFilter<"OrderItem"> | string | null
    stockRestored?: BoolFilter<"OrderItem"> | boolean
    dispatchImages?: JsonNullableFilter<"OrderItem">
  }

  export type UserCreateWithoutOrdersInput = {
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    mobile?: string | null
    location?: string | null
    artisanId?: string | null
    gstin?: string | null
    aadhaar?: string | null
    pan?: string | null
    aadhaarUrl?: string | null
    panUrl?: string | null
    docUrl?: string | null
    vendorStatus?: string
    rejectionReason?: string | null
    allowedCategories?: string | null
    razorpayAccountId?: string | null
    payoutsPaused?: boolean
    products?: ProductCreateNestedManyWithoutVendorInput
    addresses?: AddressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrdersInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    mobile?: string | null
    location?: string | null
    artisanId?: string | null
    gstin?: string | null
    aadhaar?: string | null
    pan?: string | null
    aadhaarUrl?: string | null
    panUrl?: string | null
    docUrl?: string | null
    vendorStatus?: string
    rejectionReason?: string | null
    allowedCategories?: string | null
    razorpayAccountId?: string | null
    payoutsPaused?: boolean
    products?: ProductUncheckedCreateNestedManyWithoutVendorInput
    addresses?: AddressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrdersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
  }

  export type OrderItemCreateWithoutOrderInput = {
    vendorId?: number | null
    quantity: number
    unitPaise: number
    totalPaise: number
    productName: string
    productImage: string
    productMaterial: string
    returnQuantity?: number
    returnStatus?: string | null
    stockRestored?: boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
    product: ProductCreateNestedOneWithoutOrderItemsInput
  }

  export type OrderItemUncheckedCreateWithoutOrderInput = {
    id?: number
    productId: number
    vendorId?: number | null
    quantity: number
    unitPaise: number
    totalPaise: number
    productName: string
    productImage: string
    productMaterial: string
    returnQuantity?: number
    returnStatus?: string | null
    stockRestored?: boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OrderItemCreateOrConnectWithoutOrderInput = {
    where: OrderItemWhereUniqueInput
    create: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput>
  }

  export type OrderItemCreateManyOrderInputEnvelope = {
    data: OrderItemCreateManyOrderInput | OrderItemCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type ReturnRequestCreateWithoutOrderInput = {
    userId: number
    reason: string
    reasonDetail?: string | null
    returnImages?: NullableJsonNullValueInput | InputJsonValue
    returnItems: JsonNullValueInput | InputJsonValue
    status?: string
    adminNotes?: string | null
    qcNotes?: string | null
    qcImages?: NullableJsonNullValueInput | InputJsonValue
    vendorQcNotes?: string | null
    vendorQcImages?: NullableJsonNullValueInput | InputJsonValue
    rejectionReason?: string | null
    refundAmount?: number | null
    refundMethod?: string | null
    refundStatus?: string | null
    refundId?: string | null
    refundedAt?: Date | string | null
    stockRestored?: boolean
    vendorDeliveredAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReturnRequestUncheckedCreateWithoutOrderInput = {
    id?: number
    userId: number
    reason: string
    reasonDetail?: string | null
    returnImages?: NullableJsonNullValueInput | InputJsonValue
    returnItems: JsonNullValueInput | InputJsonValue
    status?: string
    adminNotes?: string | null
    qcNotes?: string | null
    qcImages?: NullableJsonNullValueInput | InputJsonValue
    vendorQcNotes?: string | null
    vendorQcImages?: NullableJsonNullValueInput | InputJsonValue
    rejectionReason?: string | null
    refundAmount?: number | null
    refundMethod?: string | null
    refundStatus?: string | null
    refundId?: string | null
    refundedAt?: Date | string | null
    stockRestored?: boolean
    vendorDeliveredAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReturnRequestCreateOrConnectWithoutOrderInput = {
    where: ReturnRequestWhereUniqueInput
    create: XOR<ReturnRequestCreateWithoutOrderInput, ReturnRequestUncheckedCreateWithoutOrderInput>
  }

  export type SettlementCreateWithoutOrderInput = {
    vendorId: number
    orderAmountPaise: number
    commissionPaise: number
    vendorPayoutPaise: number
    status?: string
    holdUntil: Date | string
    settledAt?: Date | string | null
    vendorPaymentRef?: string | null
    vendorPaymentMode?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SettlementUncheckedCreateWithoutOrderInput = {
    id?: number
    vendorId: number
    orderAmountPaise: number
    commissionPaise: number
    vendorPayoutPaise: number
    status?: string
    holdUntil: Date | string
    settledAt?: Date | string | null
    vendorPaymentRef?: string | null
    vendorPaymentMode?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SettlementCreateOrConnectWithoutOrderInput = {
    where: SettlementWhereUniqueInput
    create: XOR<SettlementCreateWithoutOrderInput, SettlementUncheckedCreateWithoutOrderInput>
  }

  export type SettlementCreateManyOrderInputEnvelope = {
    data: SettlementCreateManyOrderInput | SettlementCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutOrdersInput = {
    update: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrdersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type UserUpdateWithoutOrdersInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    artisanId?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaar?: NullableStringFieldUpdateOperationsInput | string | null
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    panUrl?: NullableStringFieldUpdateOperationsInput | string | null
    docUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vendorStatus?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    allowedCategories?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    payoutsPaused?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUpdateManyWithoutVendorNestedInput
    addresses?: AddressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrdersInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    artisanId?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaar?: NullableStringFieldUpdateOperationsInput | string | null
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    panUrl?: NullableStringFieldUpdateOperationsInput | string | null
    docUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vendorStatus?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    allowedCategories?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    payoutsPaused?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUncheckedUpdateManyWithoutVendorNestedInput
    addresses?: AddressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type OrderItemUpsertWithWhereUniqueWithoutOrderInput = {
    where: OrderItemWhereUniqueInput
    update: XOR<OrderItemUpdateWithoutOrderInput, OrderItemUncheckedUpdateWithoutOrderInput>
    create: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput>
  }

  export type OrderItemUpdateWithWhereUniqueWithoutOrderInput = {
    where: OrderItemWhereUniqueInput
    data: XOR<OrderItemUpdateWithoutOrderInput, OrderItemUncheckedUpdateWithoutOrderInput>
  }

  export type OrderItemUpdateManyWithWhereWithoutOrderInput = {
    where: OrderItemScalarWhereInput
    data: XOR<OrderItemUpdateManyMutationInput, OrderItemUncheckedUpdateManyWithoutOrderInput>
  }

  export type ReturnRequestUpsertWithoutOrderInput = {
    update: XOR<ReturnRequestUpdateWithoutOrderInput, ReturnRequestUncheckedUpdateWithoutOrderInput>
    create: XOR<ReturnRequestCreateWithoutOrderInput, ReturnRequestUncheckedCreateWithoutOrderInput>
    where?: ReturnRequestWhereInput
  }

  export type ReturnRequestUpdateToOneWithWhereWithoutOrderInput = {
    where?: ReturnRequestWhereInput
    data: XOR<ReturnRequestUpdateWithoutOrderInput, ReturnRequestUncheckedUpdateWithoutOrderInput>
  }

  export type ReturnRequestUpdateWithoutOrderInput = {
    userId?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    reasonDetail?: NullableStringFieldUpdateOperationsInput | string | null
    returnImages?: NullableJsonNullValueInput | InputJsonValue
    returnItems?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcImages?: NullableJsonNullValueInput | InputJsonValue
    vendorQcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    vendorQcImages?: NullableJsonNullValueInput | InputJsonValue
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableIntFieldUpdateOperationsInput | number | null
    refundMethod?: NullableStringFieldUpdateOperationsInput | string | null
    refundStatus?: NullableStringFieldUpdateOperationsInput | string | null
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    vendorDeliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnRequestUncheckedUpdateWithoutOrderInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    reasonDetail?: NullableStringFieldUpdateOperationsInput | string | null
    returnImages?: NullableJsonNullValueInput | InputJsonValue
    returnItems?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    qcImages?: NullableJsonNullValueInput | InputJsonValue
    vendorQcNotes?: NullableStringFieldUpdateOperationsInput | string | null
    vendorQcImages?: NullableJsonNullValueInput | InputJsonValue
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableIntFieldUpdateOperationsInput | number | null
    refundMethod?: NullableStringFieldUpdateOperationsInput | string | null
    refundStatus?: NullableStringFieldUpdateOperationsInput | string | null
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    vendorDeliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettlementUpsertWithWhereUniqueWithoutOrderInput = {
    where: SettlementWhereUniqueInput
    update: XOR<SettlementUpdateWithoutOrderInput, SettlementUncheckedUpdateWithoutOrderInput>
    create: XOR<SettlementCreateWithoutOrderInput, SettlementUncheckedCreateWithoutOrderInput>
  }

  export type SettlementUpdateWithWhereUniqueWithoutOrderInput = {
    where: SettlementWhereUniqueInput
    data: XOR<SettlementUpdateWithoutOrderInput, SettlementUncheckedUpdateWithoutOrderInput>
  }

  export type SettlementUpdateManyWithWhereWithoutOrderInput = {
    where: SettlementScalarWhereInput
    data: XOR<SettlementUpdateManyMutationInput, SettlementUncheckedUpdateManyWithoutOrderInput>
  }

  export type SettlementScalarWhereInput = {
    AND?: SettlementScalarWhereInput | SettlementScalarWhereInput[]
    OR?: SettlementScalarWhereInput[]
    NOT?: SettlementScalarWhereInput | SettlementScalarWhereInput[]
    id?: IntFilter<"Settlement"> | number
    orderId?: StringFilter<"Settlement"> | string
    vendorId?: IntFilter<"Settlement"> | number
    orderAmountPaise?: IntFilter<"Settlement"> | number
    commissionPaise?: IntFilter<"Settlement"> | number
    vendorPayoutPaise?: IntFilter<"Settlement"> | number
    status?: StringFilter<"Settlement"> | string
    holdUntil?: DateTimeFilter<"Settlement"> | Date | string
    settledAt?: DateTimeNullableFilter<"Settlement"> | Date | string | null
    vendorPaymentRef?: StringNullableFilter<"Settlement"> | string | null
    vendorPaymentMode?: StringNullableFilter<"Settlement"> | string | null
    notes?: StringNullableFilter<"Settlement"> | string | null
    createdAt?: DateTimeFilter<"Settlement"> | Date | string
    updatedAt?: DateTimeFilter<"Settlement"> | Date | string
  }

  export type OrderCreateWithoutItemsInput = {
    id?: string
    orderNumber: string
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOrdersInput
    returnRequest?: ReturnRequestCreateNestedOneWithoutOrderInput
    settlements?: SettlementCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutItemsInput = {
    id?: string
    orderNumber: string
    userId: number
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    returnRequest?: ReturnRequestUncheckedCreateNestedOneWithoutOrderInput
    settlements?: SettlementUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutItemsInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
  }

  export type ProductCreateWithoutOrderItemsInput = {
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price: number
    mrp: number
    discount: number
    rating?: number
    reviews?: number
    material: string
    stock?: number
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutProductsInput
    vendor?: UserCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutOrderItemsInput = {
    id?: number
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price: number
    mrp: number
    discount: number
    rating?: number
    reviews?: number
    categoryName: string
    material: string
    stock?: number
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: Date | string
    vendorId?: number | null
  }

  export type ProductCreateOrConnectWithoutOrderItemsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutOrderItemsInput, ProductUncheckedCreateWithoutOrderItemsInput>
  }

  export type OrderUpsertWithoutItemsInput = {
    update: XOR<OrderUpdateWithoutItemsInput, OrderUncheckedUpdateWithoutItemsInput>
    create: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutItemsInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutItemsInput, OrderUncheckedUpdateWithoutItemsInput>
  }

  export type OrderUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOrdersNestedInput
    returnRequest?: ReturnRequestUpdateOneWithoutOrderNestedInput
    settlements?: SettlementUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    returnRequest?: ReturnRequestUncheckedUpdateOneWithoutOrderNestedInput
    settlements?: SettlementUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type ProductUpsertWithoutOrderItemsInput = {
    update: XOR<ProductUpdateWithoutOrderItemsInput, ProductUncheckedUpdateWithoutOrderItemsInput>
    create: XOR<ProductCreateWithoutOrderItemsInput, ProductUncheckedCreateWithoutOrderItemsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutOrderItemsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutOrderItemsInput, ProductUncheckedUpdateWithoutOrderItemsInput>
  }

  export type ProductUpdateWithoutOrderItemsInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutProductsNestedInput
    vendor?: UserUpdateOneWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutOrderItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    categoryName?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type OrderCreateWithoutReturnRequestInput = {
    id?: string
    orderNumber: string
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOrdersInput
    items?: OrderItemCreateNestedManyWithoutOrderInput
    settlements?: SettlementCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutReturnRequestInput = {
    id?: string
    orderNumber: string
    userId: number
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput
    settlements?: SettlementUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutReturnRequestInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutReturnRequestInput, OrderUncheckedCreateWithoutReturnRequestInput>
  }

  export type OrderUpsertWithoutReturnRequestInput = {
    update: XOR<OrderUpdateWithoutReturnRequestInput, OrderUncheckedUpdateWithoutReturnRequestInput>
    create: XOR<OrderCreateWithoutReturnRequestInput, OrderUncheckedCreateWithoutReturnRequestInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutReturnRequestInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutReturnRequestInput, OrderUncheckedUpdateWithoutReturnRequestInput>
  }

  export type OrderUpdateWithoutReturnRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOrdersNestedInput
    items?: OrderItemUpdateManyWithoutOrderNestedInput
    settlements?: SettlementUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutReturnRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput
    settlements?: SettlementUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderCreateWithoutSettlementsInput = {
    id?: string
    orderNumber: string
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOrdersInput
    items?: OrderItemCreateNestedManyWithoutOrderInput
    returnRequest?: ReturnRequestCreateNestedOneWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutSettlementsInput = {
    id?: string
    orderNumber: string
    userId: number
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput
    returnRequest?: ReturnRequestUncheckedCreateNestedOneWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutSettlementsInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutSettlementsInput, OrderUncheckedCreateWithoutSettlementsInput>
  }

  export type OrderUpsertWithoutSettlementsInput = {
    update: XOR<OrderUpdateWithoutSettlementsInput, OrderUncheckedUpdateWithoutSettlementsInput>
    create: XOR<OrderCreateWithoutSettlementsInput, OrderUncheckedCreateWithoutSettlementsInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutSettlementsInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutSettlementsInput, OrderUncheckedUpdateWithoutSettlementsInput>
  }

  export type OrderUpdateWithoutSettlementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOrdersNestedInput
    items?: OrderItemUpdateManyWithoutOrderNestedInput
    returnRequest?: ReturnRequestUpdateOneWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutSettlementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput
    returnRequest?: ReturnRequestUncheckedUpdateOneWithoutOrderNestedInput
  }

  export type UserCreateWithoutAddressesInput = {
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    mobile?: string | null
    location?: string | null
    artisanId?: string | null
    gstin?: string | null
    aadhaar?: string | null
    pan?: string | null
    aadhaarUrl?: string | null
    panUrl?: string | null
    docUrl?: string | null
    vendorStatus?: string
    rejectionReason?: string | null
    allowedCategories?: string | null
    razorpayAccountId?: string | null
    payoutsPaused?: boolean
    products?: ProductCreateNestedManyWithoutVendorInput
    orders?: OrderCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAddressesInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    mobile?: string | null
    location?: string | null
    artisanId?: string | null
    gstin?: string | null
    aadhaar?: string | null
    pan?: string | null
    aadhaarUrl?: string | null
    panUrl?: string | null
    docUrl?: string | null
    vendorStatus?: string
    rejectionReason?: string | null
    allowedCategories?: string | null
    razorpayAccountId?: string | null
    payoutsPaused?: boolean
    products?: ProductUncheckedCreateNestedManyWithoutVendorInput
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAddressesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAddressesInput, UserUncheckedCreateWithoutAddressesInput>
  }

  export type UserUpsertWithoutAddressesInput = {
    update: XOR<UserUpdateWithoutAddressesInput, UserUncheckedUpdateWithoutAddressesInput>
    create: XOR<UserCreateWithoutAddressesInput, UserUncheckedCreateWithoutAddressesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAddressesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAddressesInput, UserUncheckedUpdateWithoutAddressesInput>
  }

  export type UserUpdateWithoutAddressesInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    artisanId?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaar?: NullableStringFieldUpdateOperationsInput | string | null
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    panUrl?: NullableStringFieldUpdateOperationsInput | string | null
    docUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vendorStatus?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    allowedCategories?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    payoutsPaused?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUpdateManyWithoutVendorNestedInput
    orders?: OrderUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAddressesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mobile?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    artisanId?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaar?: NullableStringFieldUpdateOperationsInput | string | null
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    panUrl?: NullableStringFieldUpdateOperationsInput | string | null
    docUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vendorStatus?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    allowedCategories?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    payoutsPaused?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUncheckedUpdateManyWithoutVendorNestedInput
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProductCreateManyVendorInput = {
    id?: number
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price: number
    mrp: number
    discount: number
    rating?: number
    reviews?: number
    categoryName: string
    material: string
    stock?: number
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: Date | string
  }

  export type OrderCreateManyUserInput = {
    id?: string
    orderNumber: string
    paymentMethod: string
    paymentGateway?: string | null
    paymentStatus?: string
    razorpayPaymentId?: string | null
    paymentOrderId?: string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise: number
    shippingPaise?: number
    codChargePaise?: number
    taxPaise?: number
    totalPaise: number
    currency?: string
    commissionRate?: number
    commissionPaise?: number
    vendorPayoutPaise?: number
    settlementStatus?: string
    settlementDate?: Date | string | null
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingPincode: string
    shippingCountry?: string
    status?: string
    deliveryDate?: Date | string | null
    deliveredAt?: Date | string | null
    trackingId?: string | null
    returnWindowDays?: number
    shiprocketOrderId?: number | null
    shiprocketShipmentId?: number | null
    awbCode?: string | null
    courierName?: string | null
    courierId?: number | null
    shippingLabelUrl?: string | null
    manifestUrl?: string | null
    estimatedDelivery?: Date | string | null
    shiprocketStatus?: string | null
    returnShiprocketId?: number | null
    returnAwbCode?: string | null
    returnCourierName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AddressCreateManyUserInput = {
    id?: number
    label?: string
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country?: string
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type ProductUpdateWithoutVendorInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutProductsNestedInput
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutVendorInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    categoryName?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutVendorInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    categoryName?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: OrderItemUpdateManyWithoutOrderNestedInput
    returnRequest?: ReturnRequestUpdateOneWithoutOrderNestedInput
    settlements?: SettlementUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput
    returnRequest?: ReturnRequestUncheckedUpdateOneWithoutOrderNestedInput
    settlements?: SettlementUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    paymentGateway?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentData?: NullableJsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    codChargePaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    commissionRate?: FloatFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    settlementStatus?: StringFieldUpdateOperationsInput | string
    settlementDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingName?: StringFieldUpdateOperationsInput | string
    shippingPhone?: StringFieldUpdateOperationsInput | string
    shippingEmail?: StringFieldUpdateOperationsInput | string
    shippingAddress?: StringFieldUpdateOperationsInput | string
    shippingCity?: StringFieldUpdateOperationsInput | string
    shippingState?: StringFieldUpdateOperationsInput | string
    shippingPincode?: StringFieldUpdateOperationsInput | string
    shippingCountry?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingId?: NullableStringFieldUpdateOperationsInput | string | null
    returnWindowDays?: IntFieldUpdateOperationsInput | number
    shiprocketOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    shiprocketShipmentId?: NullableIntFieldUpdateOperationsInput | number | null
    awbCode?: NullableStringFieldUpdateOperationsInput | string | null
    courierName?: NullableStringFieldUpdateOperationsInput | string | null
    courierId?: NullableIntFieldUpdateOperationsInput | number | null
    shippingLabelUrl?: NullableStringFieldUpdateOperationsInput | string | null
    manifestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shiprocketStatus?: NullableStringFieldUpdateOperationsInput | string | null
    returnShiprocketId?: NullableIntFieldUpdateOperationsInput | number | null
    returnAwbCode?: NullableStringFieldUpdateOperationsInput | string | null
    returnCourierName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressUpdateWithoutUserInput = {
    label?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    pincode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    pincode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    pincode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateManyCategoryInput = {
    id?: number
    name: string
    slug: string
    description: string
    specs: string
    image: string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price: number
    mrp: number
    discount: number
    rating?: number
    reviews?: number
    material: string
    stock?: number
    featured?: boolean
    newLaunch?: boolean
    active?: boolean
    createdAt?: Date | string
    vendorId?: number | null
  }

  export type ProductUpdateWithoutCategoryInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendor?: UserUpdateOneWithoutProductsNestedInput
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    specs?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    images?: NullableJsonNullValueInput | InputJsonValue
    prices?: NullableJsonNullValueInput | InputJsonValue
    price?: FloatFieldUpdateOperationsInput | number
    mrp?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    reviews?: IntFieldUpdateOperationsInput | number
    material?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    featured?: BoolFieldUpdateOperationsInput | boolean
    newLaunch?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type OrderItemCreateManyProductInput = {
    id?: number
    orderId: string
    vendorId?: number | null
    quantity: number
    unitPaise: number
    totalPaise: number
    productName: string
    productImage: string
    productMaterial: string
    returnQuantity?: number
    returnStatus?: string | null
    stockRestored?: boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OrderItemUpdateWithoutProductInput = {
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    productName?: StringFieldUpdateOperationsInput | string
    productImage?: StringFieldUpdateOperationsInput | string
    productMaterial?: StringFieldUpdateOperationsInput | string
    returnQuantity?: IntFieldUpdateOperationsInput | number
    returnStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
    order?: OrderUpdateOneRequiredWithoutItemsNestedInput
  }

  export type OrderItemUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderId?: StringFieldUpdateOperationsInput | string
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    productName?: StringFieldUpdateOperationsInput | string
    productImage?: StringFieldUpdateOperationsInput | string
    productMaterial?: StringFieldUpdateOperationsInput | string
    returnQuantity?: IntFieldUpdateOperationsInput | number
    returnStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OrderItemUncheckedUpdateManyWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderId?: StringFieldUpdateOperationsInput | string
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    productName?: StringFieldUpdateOperationsInput | string
    productImage?: StringFieldUpdateOperationsInput | string
    productMaterial?: StringFieldUpdateOperationsInput | string
    returnQuantity?: IntFieldUpdateOperationsInput | number
    returnStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OrderItemCreateManyOrderInput = {
    id?: number
    productId: number
    vendorId?: number | null
    quantity: number
    unitPaise: number
    totalPaise: number
    productName: string
    productImage: string
    productMaterial: string
    returnQuantity?: number
    returnStatus?: string | null
    stockRestored?: boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SettlementCreateManyOrderInput = {
    id?: number
    vendorId: number
    orderAmountPaise: number
    commissionPaise: number
    vendorPayoutPaise: number
    status?: string
    holdUntil: Date | string
    settledAt?: Date | string | null
    vendorPaymentRef?: string | null
    vendorPaymentMode?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderItemUpdateWithoutOrderInput = {
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    productName?: StringFieldUpdateOperationsInput | string
    productImage?: StringFieldUpdateOperationsInput | string
    productMaterial?: StringFieldUpdateOperationsInput | string
    returnQuantity?: IntFieldUpdateOperationsInput | number
    returnStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
    product?: ProductUpdateOneRequiredWithoutOrderItemsNestedInput
  }

  export type OrderItemUncheckedUpdateWithoutOrderInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    productName?: StringFieldUpdateOperationsInput | string
    productImage?: StringFieldUpdateOperationsInput | string
    productMaterial?: StringFieldUpdateOperationsInput | string
    returnQuantity?: IntFieldUpdateOperationsInput | number
    returnStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OrderItemUncheckedUpdateManyWithoutOrderInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    productName?: StringFieldUpdateOperationsInput | string
    productImage?: StringFieldUpdateOperationsInput | string
    productMaterial?: StringFieldUpdateOperationsInput | string
    returnQuantity?: IntFieldUpdateOperationsInput | number
    returnStatus?: NullableStringFieldUpdateOperationsInput | string | null
    stockRestored?: BoolFieldUpdateOperationsInput | boolean
    dispatchImages?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SettlementUpdateWithoutOrderInput = {
    vendorId?: IntFieldUpdateOperationsInput | number
    orderAmountPaise?: IntFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    holdUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vendorPaymentRef?: NullableStringFieldUpdateOperationsInput | string | null
    vendorPaymentMode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettlementUncheckedUpdateWithoutOrderInput = {
    id?: IntFieldUpdateOperationsInput | number
    vendorId?: IntFieldUpdateOperationsInput | number
    orderAmountPaise?: IntFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    holdUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vendorPaymentRef?: NullableStringFieldUpdateOperationsInput | string | null
    vendorPaymentMode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettlementUncheckedUpdateManyWithoutOrderInput = {
    id?: IntFieldUpdateOperationsInput | number
    vendorId?: IntFieldUpdateOperationsInput | number
    orderAmountPaise?: IntFieldUpdateOperationsInput | number
    commissionPaise?: IntFieldUpdateOperationsInput | number
    vendorPayoutPaise?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    holdUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vendorPaymentRef?: NullableStringFieldUpdateOperationsInput | string | null
    vendorPaymentMode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoryCountOutputTypeDefaultArgs instead
     */
    export type CategoryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductCountOutputTypeDefaultArgs instead
     */
    export type ProductCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrderCountOutputTypeDefaultArgs instead
     */
    export type OrderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoryDefaultArgs instead
     */
    export type CategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductDefaultArgs instead
     */
    export type ProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InquiryDefaultArgs instead
     */
    export type InquiryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InquiryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrderDefaultArgs instead
     */
    export type OrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrderItemDefaultArgs instead
     */
    export type OrderItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrderItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReturnRequestDefaultArgs instead
     */
    export type ReturnRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReturnRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SettlementDefaultArgs instead
     */
    export type SettlementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SettlementDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AddressDefaultArgs instead
     */
    export type AddressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AddressDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AdminSettingsDefaultArgs instead
     */
    export type AdminSettingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AdminSettingsDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}