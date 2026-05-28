import {
  HeroSection,
  ShopByCollections,
  FeaturedProducts,
  CategoryProductGrid,
  ShopByMaterial,
  HeritageStory,
  ExportProgram,
  TestimonialsSection,
  FAQSection,
  WhyChooseUs,
  CategoryCards,
  VendorSection,
} from "@/features/home";


const kitchenUtilityProducts = [
  {
    id: 1,
    name: "Heritage Bronze Kadai",
    description: "Heavy-duty pure bronze cooking kadai, hand-beaten by traditional coppersmiths.",
    specs: "Weight: 2.4 kg | Hand-Hammered",
    image: "/bronze-kadai.png",
    rating: 4.9,
    reviews: 124
  },
  {
    id: 2,
    name: "Handcrafted Bronze Handi",
    description: "Elegant deep-cooking pot with lid, perfect for slow-cooking curries and biryanis.",
    specs: "Capacity: 3 Litres | Heavy Bottom",
    image: "/bronze-hero.png",
    rating: 4.7,
    reviews: 67
  },
  {
    id: 3,
    name: "Classic Bronze Patila",
    description: "Flat-bottomed classic cooking vessel designed for day-to-day culinary needs.",
    specs: "Weight: 1.8 kg | Pure Bronze",
    image: "/bronze-hero.png",
    rating: 4.8,
    reviews: 73
  },
  {
    id: 4,
    name: "Heavy-Duty Bronze Frypan",
    description: "Premium heavy-gauge bronze frypan with an insulated handle, optimized for roasting.",
    specs: "Diameter: 9.5 inches",
    image: "/bronze-kadai.png",
    rating: 4.8,
    reviews: 6
  },
  {
    id: 5,
    name: "Artisanal Spice Box",
    description: "An elegant kitchen organizer containing 7 individual bronze bowls.",
    specs: "7 Bowls | Engraved Floral Lid",
    image: "/bronze-hero.png",
    rating: 4.9,
    reviews: 14
  },
  {
    id: 6,
    name: "Hand-Beaten Bronze Tawa",
    description: "Traditional flat tawa for making rotis, parathas, and crepes with even heat distribution.",
    specs: "Diameter: 10 inches | Solid Bronze",
    image: "/bronze-kadai.png",
    rating: 4.6,
    reviews: 19
  },
  {
    id: 7,
    name: "Heritage Cooking Urli",
    description: "Traditional wide-mouthed cooking pot ideal for roasting and slow-cooking payasam or sweets.",
    specs: "Capacity: 1.8 Litres | Pure Bronze",
    image: "/bronze-kadai.png",
    rating: 4.8,
    reviews: 15
  },
  {
    id: 8,
    name: "Artisanal Serving Handi",
    description: "Elegant presentation serving handi with custom bronze handles and a tight lid.",
    specs: "Capacity: 1.2 Litres | Mirror Finish",
    image: "/bronze-hero.png",
    rating: 4.9,
    reviews: 21
  },
  {
    id: 9,
    name: "Traditional Bronze Saucepan",
    description: "A traditional bell metal saucepan with double rivet handle, optimized for boiling milk and making tea.",
    specs: "Capacity: 1.5 Litres | Solid Handle",
    image: "/bronze-lota.png",
    rating: 4.8,
    reviews: 14
  },
  {
    id: 10,
    name: "Heritage Bronze Urli Pot",
    description: "Wide-mouth heavy-duty bronze cooking pot ideal for traditional slow cooking.",
    specs: "Capacity: 2 Litres | Heavy Base",
    image: "/bronze-kadai.png",
    rating: 4.9,
    reviews: 32
  },
  {
    id: 11,
    name: "Artisanal Serving Ladle",
    description: "Solid bronze serving spoon/ladle handcrafted with ergonomic handle design.",
    specs: "Length: 12 inches | Solid Bronze",
    image: "/collection-tableware.png",
    rating: 4.7,
    reviews: 18
  },
  {
    id: 12,
    name: "Pure Bell Metal Glass",
    description: "Pure bell metal kansa drinking glass designed for water and natural wellness.",
    specs: "Capacity: 300ml | Wellness Glass",
    image: "/bronze-lota.png",
    rating: 4.9,
    reviews: 45
  }
];

const brassCookwareProducts = [
  {
    id: 1,
    name: "Royal Bronze Thali Set",
    description: "An exquisite multi-piece dining set fit for royalty, featuring intricate hand-etched rims.",
    specs: "7-Piece Set | Velvet Case",
    image: "/collection-tableware.png",
    rating: 5.0,
    reviews: 42
  },
  {
    id: 2,
    name: "Premium Dinner Bowl Set",
    description: "Beautifully polished bronze bowls designed for serving curries, dals, and side dishes.",
    specs: "Set of 6 | Mirror Finish",
    image: "/collection-tableware.png",
    rating: 4.9,
    reviews: 29
  },
  {
    id: 3,
    name: "Brass Spoon & Fork Set",
    description: "Hand-forged pure bronze dessert spoons and forks that add elegance to any dining table.",
    specs: "6 Spoons & 6 Forks | Gift Box",
    image: "/collection-tableware.png",
    rating: 4.8,
    reviews: 31
  },
  {
    id: 4,
    name: "Elegance Serving Tray",
    description: "Exquisite rectangular serving tray with hammered handles and raised border rims.",
    specs: "Size: 14x10 inches | Pure Bronze",
    image: "/collection-tableware.png",
    rating: 4.7,
    reviews: 18
  },
  {
    id: 5,
    name: "Traditional Katori Set",
    description: "Small traditional dessert and side bowls crafted from food-safe bell metal.",
    specs: "Set of 6 | 150ml each",
    image: "/collection-tableware.png",
    rating: 4.9,
    reviews: 22
  },
  {
    id: 6,
    name: "Artisanal Dessert Bowls",
    description: "Elegant stemmed bronze bowls designed for ice cream, puddings, or sweet treats.",
    specs: "Set of 4 | Hammered Surface",
    image: "/collection-tableware.png",
    rating: 4.8,
    reviews: 15
  },
  {
    id: 7,
    name: "Bell Metal Glass Set",
    description: "Double set of heavy bell-metal glasses, perfect for cold milk, buttermilk, or water.",
    specs: "Set of 2 | 280ml each",
    image: "/collection-tableware.png",
    rating: 4.9,
    reviews: 11
  },
  {
    id: 8,
    name: "Serving Bowl with Spoon",
    description: "Deep serving bowl complete with a long matching hand-hammered serving spoon.",
    specs: "Capacity: 1 Litre | Set of 2 Pieces",
    image: "/collection-tableware.png",
    rating: 4.7,
    reviews: 19
  },
  {
    id: 9,
    name: "Bell Metal Serving Spoon",
    description: "Beautifully carved large serving spoon made of pure food-safe bell metal (Kansa).",
    specs: "Length: 10 inches | Floral Engraving",
    image: "/collection-tableware.png",
    rating: 4.9,
    reviews: 12
  }
];

const copperProducts = [
  {
    id: 1,
    name: "Pure Copper Water Bottle",
    description: "Handcrafted pure copper bottle for daily Ayurvedic hydration and natural wellness.",
    specs: "Capacity: 1 Litre | Leak-Proof",
    image: "/bronze-lota.png",
    rating: 4.9,
    reviews: 156
  },
  {
    id: 2,
    name: "Copper Tumbler Set",
    description: "Set of premium copper tumblers for serving water, lassi, or traditional drinks.",
    specs: "Set of 4 | 350ml each",
    image: "/bronze-lota.png",
    rating: 4.8,
    reviews: 89
  },
  {
    id: 3,
    name: "Copper Jug Classic",
    description: "Traditional copper jug with hammered finish for storing and serving water overnight.",
    specs: "Capacity: 1.5 Litres | Hammered",
    image: "/bronze-lota.png",
    rating: 4.7,
    reviews: 64
  },
  {
    id: 4,
    name: "Copper Moscow Mule Mug",
    description: "Premium copper mugs with brass handles, perfect for cocktails and cold beverages.",
    specs: "Set of 2 | 500ml each",
    image: "/bronze-lota.png",
    rating: 4.8,
    reviews: 42
  },
  {
    id: 5,
    name: "Copper Lota Traditional",
    description: "Sacred copper lota used for pooja rituals and daily water storage with natural purification.",
    specs: "Capacity: 750ml | Pure Copper",
    image: "/bronze-lota.png",
    rating: 4.9,
    reviews: 78
  },
  {
    id: 6,
    name: "Copper Dinner Set",
    description: "Complete copper dining set with plates, bowls, and glass for premium table setting.",
    specs: "8-Piece Set | Gift Box",
    image: "/bronze-lota.png",
    rating: 5.0,
    reviews: 35
  },
  {
    id: 7,
    name: "Copper Storage Container",
    description: "Airtight copper container ideal for storing dry fruits, sugar, or spices.",
    specs: "Capacity: 500ml | Lid Included",
    image: "/bronze-lota.png",
    rating: 4.6,
    reviews: 28
  },
  {
    id: 8,
    name: "Copper Serving Tray",
    description: "Hand-hammered round copper tray for elegant serving and home décor display.",
    specs: "Diameter: 12 inches | Polished",
    image: "/bronze-lota.png",
    rating: 4.8,
    reviews: 19
  },
  {
    id: 9,
    name: "Copper Water Dispenser",
    description: "Large capacity copper matka-style dispenser for storing and dispensing purified water.",
    specs: "Capacity: 5 Litres | With Stand",
    image: "/bronze-lota.png",
    rating: 4.9,
    reviews: 47
  }
];

const poojaProducts = [
  {
    id: 1,
    name: "Premium Bronze Urli Bowl",
    description: "Decorative urli bowl used for wellness floating flowers or traditional decor.",
    specs: "Diameter: 12 inches | Solid Cast",
    image: "/collection-pooja.png",
    rating: 4.9,
    reviews: 31
  },
  {
    id: 2,
    name: "Handcrafted Bronze Diya",
    description: "Exquisite oil lamp with leaf engravings, designed to bring warmth to your altar.",
    specs: "Height: 6 inches | Solid Bronze",
    image: "/collection-pooja.png",
    rating: 5.0,
    reviews: 25
  },
  {
    id: 3,
    name: "Sacred Bell & Incense Holder",
    description: "A resonant bronze handbell paired with a matching flower-shaped incense holder.",
    specs: "2-Piece Set | Spiritual Finish",
    image: "/collection-pooja.png",
    rating: 4.8,
    reviews: 41
  },
  {
    id: 4,
    name: "Traditional Pooja Thali Set",
    description: "Complete ritual plate containing tiny containers for haldi, kumkum, and oil lamp.",
    specs: "5 Items Included | Gift Box",
    image: "/collection-pooja.png",
    rating: 4.9,
    reviews: 19
  },
  {
    id: 5,
    name: "Hand-Carved Panchpatra Set",
    description: "Sacred water pot with a matching spoon used for offering prayers and purification.",
    specs: "Pure Bronze | Ritual Engraving",
    image: "/bronze-lota.png",
    rating: 4.7,
    reviews: 12
  },
  {
    id: 6,
    name: "Vintage Camphor Burner",
    description: "Traditional burner designed to safely diffuse camphor aromas throughout the space.",
    specs: "Height: 4 inches | Heavy Base",
    image: "/collection-pooja.png",
    rating: 4.8,
    reviews: 16
  },
  {
    id: 7,
    name: "Sacred Ganga Lota",
    description: "Sacred water purification pot, handcrafted with traditional ridges for spiritual altars.",
    specs: "Capacity: 1 Litre | Holy Water Vessel",
    image: "/bronze-lota.png",
    rating: 5.0,
    reviews: 28
  },
  {
    id: 8,
    name: "Engraved Dhoop Diffuser",
    description: "Solid bronze diffuser designed to hold and spread traditional dhoop and resin aromas.",
    specs: "Height: 5 inches | Hand-Carved Rings",
    image: "/collection-pooja.png",
    rating: 4.9,
    reviews: 22
  },
  {
    id: 9,
    name: "Artisanal Incense Diffuser",
    description: "A premium cast bronze incense burner with dome lid to evenly diffuse sacred dhoop and resin aromas.",
    specs: "Height: 6 inches | Removable Tray",
    image: "/collection-pooja.png",
    rating: 5.0,
    reviews: 17
  },
  {
    id: 10,
    name: "Hand-Hammered Pooja Bell",
    description: "A resonant solid bronze pooja bell with a beautifully hand-carved handle.",
    specs: "Height: 7 inches | Clear Resonance",
    image: "/collection-pooja.png",
    rating: 4.9,
    reviews: 29
  },
  {
    id: 11,
    name: "Divine Lotus Diya",
    description: "Lotus-shaped brass diya lamp perfect for traditional pooja rituals and festivals.",
    specs: "Diameter: 5 inches | Solid Brass",
    image: "/collection-pooja.png",
    rating: 5.0,
    reviews: 34
  },
  {
    id: 12,
    name: "Sacred Panchpatra Spoon",
    description: "Traditional copper panchpatra water vessel with custom spoon for daily rituals.",
    specs: "Capacity: 150ml | Pure Copper",
    image: "/bronze-lota.png",
    rating: 4.8,
    reviews: 19
  }
];

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Shop by Category Grid (10 categories, 2 rows) */}
      <ShopByCollections />

      {/* 3. Best Sellers (with prices & Inquire Price) */}
      <FeaturedProducts />

      {/* 4. Shop by Material (Brass, Copper, Steel, Ceramic, Glass) */}
      <ShopByMaterial />

      {/* 5. Kitchen Utility — Category Product Grid */}
      <CategoryProductGrid
        title="Kitchen Utility"
        tagLine="Heritage Cooking Essentials"
        products={kitchenUtilityProducts}
        viewAllLink="/category/kitchen-utility"
        accentColor="emerald"
      />

      {/* 6. Amazon-style Category Cards (2x2 grids) */}
      <CategoryCards />

      {/* 7. Brass Cookware — Category Product Grid */}
      <CategoryProductGrid
        title="Brass Cookware"
        tagLine="Royal Dining & Serveware"
        products={brassCookwareProducts}
        viewAllLink="/category/brass-cookware"
        accentColor="bronze"
      />

      {/* 8. Pooja Collection 🔒 */}
      <CategoryProductGrid
        title="Pooja Collection"
        tagLine="Sacred Ritual Vessels"
        products={poojaProducts}
        viewAllLink="/category/pooja-collection"
        accentColor="rose"
      />

      {/* 9. Copper Products — Category Product Grid */}
      <CategoryProductGrid
        title="Copper Products"
        tagLine="Ayurvedic Wellness Essentials"
        products={copperProducts}
        viewAllLink="/category/copper-products"
        accentColor="bronze"
      />

      {/* 10. Heritage + Artisan Story */}
      <HeritageStory />

      {/* Vendor Section - Artisan Clusters */}
      <VendorSection />

      {/* 11. Export Program */}
      <ExportProgram />

      {/* 12. Customer Reviews */}
      <TestimonialsSection />

      {/* 14. Why StopShop (Trust + Story) */}
      <WhyChooseUs />

      {/* 15. FAQ Section */}
      <FAQSection />
    </>
  );
}
