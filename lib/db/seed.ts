import { db, ensureDbInitialized } from "./index"
import { products, productSizes } from "./schema"
import { eq } from "drizzle-orm"

export const initialSeedProducts = [
  {
    id: "vein-marble-tray",
    slug: "vein-marble-tray",
    name: "Vein Marble Tray",
    tagline: "Honed Carrara marble with natural bronze-grey veining",
    description: "The Vein Marble Tray by Sang Tarash is sculpted from a single solid block of authentic Tuscan Carrara marble. Carefully chiseled with soft chamfered perimeter lips and dry-honed by hand, this statement object captures millennia of geological mineral crystallization. The distinctive grey and warm bronze veins trace unique organic patterns across the silky matte surface, ensuring every individual piece is an unrepeatable work of natural art. Designed for versatile ritual use, it serves effortlessly as an anchor for heirloom perfumes, an architectural centerpiece for candle clusters, or a striking serving surface for artisanal dining and cocktail service.",
    category: "home",
    badge: "Bestseller",
    stoneType: "Carrara White Marble",
    origin: "Tuscany, Italy",
    finish: "Hand-honed satin",
    details: "Hand-carved from solid marble offcuts salvaged from historic quarries. Precision-machined edges buffed with emery cloth to preserve a tactile, non-reflective matte patina.",
    careInstructions: "Wipe with a damp microfiber cloth and pH-neutral soap. Never expose to harsh acidic liquids or citrus. Seal every 12 months with natural stone impregnator.",
    artisanStory: "Crafted in partnership with generational stonemasons in the Apuan Alps who continue centuries-old traditions of water-sawing and hand-chiseling marble.",
    shipping: "Double-crated with custom-molded closed-cell archival foam to guarantee zero damage during international courier transit.",
    featuredImage: "/images/products/vein-marble-tray.jpg",
    seoTitle: "Vein Marble Tray | Handcrafted Italian Carrara Stone | Sang Tarash",
    seoDescription: "Shop the handcrafted Vein Marble Tray by Sang Tarash. Solid Italian Carrara marble with natural bronze and charcoal veins. Hand-honed satin finish.",
    sizes: [
      {
        sizeName: "Standard Tray",
        dimensions: '14" L x 9" W x 1.25" H',
        weight: "4.8 lbs (2.2 kg)",
        price: 88,
        originalPrice: null,
        stock: 15,
        sku: "ST-VMT-STD",
        images: ["/images/products/vein-marble-tray.jpg", "/images/products/oval-serving-platter.jpg"],
        isDefault: true
      },
      {
        sizeName: "Grande Salon",
        dimensions: '18" L x 12" W x 1.5" H',
        weight: "8.4 lbs (3.8 kg)",
        price: 145,
        originalPrice: 165,
        stock: 8,
        sku: "ST-VMT-GRD",
        images: ["/images/products/oval-serving-platter.jpg", "/images/products/vein-marble-tray.jpg"],
        isDefault: false
      },
      {
        sizeName: "Petite Console",
        dimensions: '10" L x 6" W x 1" H',
        weight: "2.9 lbs (1.3 kg)",
        price: 64,
        originalPrice: null,
        stock: 20,
        sku: "ST-VMT-PET",
        images: ["/images/products/vein-marble-tray.jpg"],
        isDefault: false
      }
    ]
  },
  {
    id: "carved-stone-bowl",
    slug: "carved-stone-vessel",
    name: "Carved Stone Vessel",
    tagline: "Deep contoured bowl carved from monolithic natural stone",
    description: "A commanding monolithic statement piece carved from a dense single block of Italian Calacatta limestone. The exterior retains subtle hand-chiseled facets that pay tribute to the stonemason's hammer, while the deep parabolic interior is ground and polished to a sensuous, satiny hollow. With substantial geological weight and rich undulating veins of charcoal, copper, and amber minerals, this vessel brings grounded permanence to dining tables, entryway consoles, and minimalist hearths. It celebrates the tension between raw mineral weight and refined human craft.",
    category: "tableware",
    badge: null,
    stoneType: "Calacatta Monolith Stone",
    origin: "Apuan Alps, Italy",
    finish: "Hand-sculpted exterior with honed interior",
    details: "Hollowed out using diamond coring drills followed by four stages of wet hand-buffing. The organic rim varies slightly between pieces, celebrating natural block variance.",
    careInstructions: "Suitable for dry pantry goods, seasonal fruit, or as a standalone art sculpture. Wash with mild soap and warm water; dry immediately.",
    artisanStory: "Shaped by master stone carvers utilizing quarry offcuts that would otherwise be discarded, celebrating zero-waste lapidary principles.",
    shipping: "Reinforced high-impact wood-braced packaging with protective bubble suspension.",
    featuredImage: "/images/products/carved-stone-bowl.jpg",
    seoTitle: "Carved Stone Vessel | Solid Natural Calacatta Bowl | Sang Tarash",
    seoDescription: "Discover the Carved Stone Vessel by Sang Tarash. Monolithic hand-carved Calacatta bowl with dramatic natural veining and hand-honed interior.",
    sizes: [
      {
        sizeName: 'Medium Centerpiece (10")',
        dimensions: '10" Dia x 5.5" H',
        weight: "7.2 lbs (3.3 kg)",
        price: 95,
        originalPrice: null,
        stock: 12,
        sku: "ST-CSV-10",
        images: ["/images/products/carved-stone-bowl.jpg"],
        isDefault: true
      },
      {
        sizeName: 'Monumental Display (14")',
        dimensions: '14" Dia x 7.5" H',
        weight: "14.5 lbs (6.6 kg)",
        price: 185,
        originalPrice: 210,
        stock: 5,
        sku: "ST-CSV-14",
        images: ["/images/products/carved-stone-bowl.jpg", "/images/products/rosso-marble-dish.jpg"],
        isDefault: false
      }
    ]
  },
  {
    id: "travertine-candleholder",
    slug: "travertine-fluted-candleholder",
    name: "Travertine Fluted Candleholder",
    tagline: "Architectural travertine with solid copper bronze insert",
    description: "Standing with the gravitas of classical Roman colonnades, this fluted candleholder unites tactile natural travertine with a precision-machined solid copper bronze insert cup. The porous limestone displays the organic voids and strata of subterranean mineral springs, warmed by the lustrous burnished copper that holds your candle securely. Designed to fit standard 7/8-inch taper candles, it casts a serene, meditative amber glow across dinner gatherings, library credenzas, and bath sanctuaries.",
    category: "sculptures",
    badge: "New",
    stoneType: "Roman Travertine & Burnished Copper Bronze",
    origin: "Tivoli, Italy",
    finish: "Open-pore matte travertine, antiqued copper cup",
    details: "Turned and vertically fluted on precision stone lathes before being fitted with a heavy copper bronze metal cup that patinas gracefully over years of use.",
    careInstructions: "Gently wipe stone with soft dry cloth. Wax drips can be safely removed by cooling the stone in a refrigerator and flicking wax off with a wooden utensil.",
    artisanStory: "Quarried from the historic Tivoli travertine basins that supplied the stone for the Colosseum and St. Peter's Basilica.",
    shipping: "Packaged inside a foil-stamped presentation linen gift box with dense contoured foam protection.",
    featuredImage: "/images/products/travertine-candleholder.jpg",
    seoTitle: "Travertine Fluted Candleholder with Copper Bronze | Sang Tarash",
    seoDescription: "Shop the Travertine Fluted Candleholder by Sang Tarash. Roman architectural travertine paired with solid burnished copper bronze candle insert.",
    sizes: [
      {
        sizeName: 'Standard Column (6")',
        dimensions: '3.5" Dia x 6" H',
        weight: "3.1 lbs (1.4 kg)",
        price: 78,
        originalPrice: null,
        stock: 25,
        sku: "ST-TCH-06",
        images: ["/images/products/travertine-candleholder.jpg"],
        isDefault: true
      },
      {
        sizeName: 'Tall Altar (9")',
        dimensions: '3.5" Dia x 9" H',
        weight: "4.6 lbs (2.1 kg)",
        price: 110,
        originalPrice: 125,
        stock: 14,
        sku: "ST-TCH-09",
        images: ["/images/products/travertine-candleholder.jpg", "/images/products/travertine-pedestal.jpg"],
        isDefault: false
      }
    ]
  },
  {
    id: "marble-incense-stand",
    slug: "marble-incense-stand",
    name: "Marble Incense Stand",
    tagline: "Minimalist slab with burnished brass incense rod holder",
    description: "A serene, architectural incense stand crafted from luminous Makrana pure white marble—the legendary stone prized in royal Indian monuments. Features a gently carved trough to capture ash cleanly and a removable burnished copper bronze rod holder suited for both Japanese and Indian incense sticks.",
    category: "sculptures",
    badge: "Sale",
    stoneType: "Makrana Pure White Marble",
    origin: "Rajasthan, India",
    finish: "Silky honed matte",
    details: "Carved from Makrana marble known for low porosity and radiant calcite crystals that sparkle subtly in daylight.",
    careInstructions: "Brush away dry ash with a soft bristle brush. Wipe clean with warm water when required.",
    artisanStory: "Sculpted by master Rajasthani lapidaries whose lineages have practiced marble inlay and chiseling for over three hundred years.",
    shipping: "Ships in rigid eco-cushioned mailer box with tracking.",
    featuredImage: "/images/products/marble-incense-stand.jpg",
    seoTitle: "Makrana Marble Incense Stand | Sang Tarash Stonecraft",
    seoDescription: "Handcrafted Makrana white marble incense holder with copper bronze brass insert. Clean ash catch trough for serene everyday rituals.",
    sizes: [
      {
        sizeName: 'Standard (9")',
        dimensions: '9" L x 2.5" W x 0.75" H',
        weight: "1.8 lbs (0.8 kg)",
        price: 58,
        originalPrice: 68,
        stock: 30,
        sku: "ST-MIS-09",
        images: ["/images/products/marble-incense-stand.jpg"],
        isDefault: true
      },
      {
        sizeName: 'Grand Atelier (12")',
        dimensions: '12" L x 3" W x 1" H',
        weight: "2.7 lbs (1.2 kg)",
        price: 78,
        originalPrice: null,
        stock: 15,
        sku: "ST-MIS-12",
        images: ["/images/products/marble-incense-stand.jpg"],
        isDefault: false
      }
    ]
  },
  {
    id: "sculptural-bookend",
    slug: "sculptural-arch-bookends",
    name: "Sculptural Arch Bookends",
    tagline: "Solid marble bookend pair with architectural geometry",
    description: "A balanced pair of monumental arched bookends cut from solid slabs of Calacatta cream stone. Weighted to firmly support art monographs, architectural folios, and treasured libraries, with natural cork bases to prevent shelf scratches.",
    category: "home",
    badge: null,
    stoneType: "Calacatta Cream & Sandstone",
    origin: "Tuscany, Italy",
    finish: "Satin honed with cork footings",
    details: "Pair of 2 bookends. Each curve is carved with waterjet wire saws and finished by hand with 400-grit diamond emery blocks.",
    careInstructions: "Dust regularly with soft dry cloth. Avoid dragging across unfinished wood surfaces.",
    artisanStory: "Inspired by classical Roman aqueducts and Italian rationalist arches.",
    shipping: "Double-boxed heavy parcel crating.",
    featuredImage: "/images/products/sculptural-bookend.jpg",
    seoTitle: "Sculptural Arch Marble Bookends (Pair) | Sang Tarash",
    seoDescription: "Hand-carved Calacatta cream marble arch bookends pair by Sang Tarash. Architectural, weighted bookends for luxury shelves and libraries.",
    sizes: [
      {
        sizeName: "Standard Pair",
        dimensions: '5" W x 2.5" D x 7" H (each)',
        weight: "8.5 lbs per pair (3.9 kg)",
        price: 92,
        originalPrice: null,
        stock: 18,
        sku: "ST-SAB-PAIR",
        images: ["/images/products/sculptural-bookend.jpg"],
        isDefault: true
      }
    ]
  },
  {
    id: "marble-coaster-set",
    slug: "marble-coaster-set",
    name: "Marble Coaster Set",
    tagline: "Set of four hand-cut octagonal marble drink coasters",
    description: "A set of four octagonal coasters sculpted from natural Carrara marble with chamfered bevels and non-slip natural cork bottoms. Naturally cool to the touch, they protect fine surfaces from drink rings and condensation.",
    category: "tableware",
    badge: "Sale",
    stoneType: "Carrara Natural Marble",
    origin: "Carrara, Italy",
    finish: "Polished top with natural cork underside",
    details: "Set of 4. Sealed with food-safe non-toxic stone impregnator to resist wine and coffee stains.",
    careInstructions: "Wipe with damp cloth after entertaining. Not suitable for dishwashers.",
    artisanStory: "Chamfered by hand around all eight edges to reflect ambient dining candlelight.",
    shipping: "Bound with natural raw linen cord in a recycled gift box.",
    featuredImage: "/images/products/marble-coaster-set.jpg",
    seoTitle: "Hand-Cut Marble Coaster Set of 4 | Sang Tarash",
    seoDescription: "Set of 4 hand-cut octagonal Carrara marble coasters by Sang Tarash. Beveled chamfer edges and non-slip cork protection.",
    sizes: [
      {
        sizeName: "Set of 4 Coasters",
        dimensions: '4" Dia x 0.5" H (each)',
        weight: "2.4 lbs (1.1 kg)",
        price: 46,
        originalPrice: 56,
        stock: 40,
        sku: "ST-MCS-04",
        images: ["/images/products/marble-coaster-set.jpg"],
        isDefault: true
      },
      {
        sizeName: "Set of 8 Entertaining Set",
        dimensions: '4" Dia x 0.5" H (each)',
        weight: "4.8 lbs (2.2 kg)",
        price: 82,
        originalPrice: 96,
        stock: 20,
        sku: "ST-MCS-08",
        images: ["/images/products/marble-coaster-set.jpg"],
        isDefault: false
      }
    ]
  },
  {
    id: "oval-serving-platter",
    slug: "oval-serving-platter",
    name: "Oval Serving Platter",
    tagline: "Generous hand-finished marble platter for dining tables",
    description: "An expansive oval sharing platter cut from creamy Roman travertine with subtle undulating grain and an elevated thumb rim. Retains cool temperatures naturally, making it ideal for cheeses, hors d'oeuvres, or centerpiece arrangements.",
    category: "tableware",
    badge: "Bestseller",
    stoneType: "Travertine & Limestone Composite",
    origin: "Pamukkale, Turkey",
    finish: "Honed matte surface with smooth rounded lip",
    details: "Hand-selected for uniform horizontal veining across the full oval radius.",
    careInstructions: "Hand wash with mild dish soap and warm water immediately after dining service.",
    artisanStory: "Turned on large horizontal stone mills and finished by stonemasons in Turkish travertine valleys.",
    shipping: "Reinforced wooden frame crating.",
    featuredImage: "/images/products/oval-serving-platter.jpg",
    seoTitle: "Oval Marble & Travertine Serving Platter | Sang Tarash",
    seoDescription: "Hand-honed oval travertine serving platter by Sang Tarash. Generous entertaining platter for charcuterie and centerpiece dining displays.",
    sizes: [
      {
        sizeName: 'Generous (16")',
        dimensions: '16" L x 10.5" W x 1" H',
        weight: "6.6 lbs (3.0 kg)",
        price: 110,
        originalPrice: null,
        stock: 12,
        sku: "ST-OSP-16",
        images: ["/images/products/oval-serving-platter.jpg"],
        isDefault: true
      },
      {
        sizeName: 'Banquet Feast (20")',
        dimensions: '20" L x 13" W x 1.25" H',
        weight: "11.2 lbs (5.1 kg)",
        price: 165,
        originalPrice: 190,
        stock: 6,
        sku: "ST-OSP-20",
        images: ["/images/products/oval-serving-platter.jpg"],
        isDefault: false
      }
    ]
  },
  {
    id: "stone-desk-accent",
    slug: "monolithic-stone-desk-accent",
    name: "Monolithic Stone Desk Accent",
    tagline: "Sculptural geometric paperweight and tactile object",
    description: "A satisfyingly heavy multifaceted marble monolith designed for executive desks, credenzas, and library shelves. Inspired by brutalist monuments, each facet catches daylight from distinct angles.",
    category: "home",
    badge: null,
    stoneType: "Alabaster & Charcoal Granite Vein",
    origin: "Volterra, Italy",
    finish: "Polished facets with matte underside",
    details: "Precision faceted by skilled lapidaries who align cuts to highlight interior crystalline minerals.",
    careInstructions: "Dust with dry feather duster or soft cloth.",
    artisanStory: "Carved in the historic alabaster workshops of Volterra.",
    shipping: "Ships in signature protective padded gift box.",
    featuredImage: "/images/products/stone-desk-accent.jpg",
    seoTitle: "Monolithic Stone Desk Accent & Paperweight | Sang Tarash",
    seoDescription: "Sculptural geometric stone monolith paperweight by Sang Tarash. Faceted Tuscan alabaster and granite accent for luxury office and desk.",
    sizes: [
      {
        sizeName: "Standard Monolith",
        dimensions: '3.25" W x 3.25" D x 4" H',
        weight: "2.5 lbs (1.1 kg)",
        price: 48,
        originalPrice: null,
        stock: 22,
        sku: "ST-SDA-01",
        images: ["/images/products/stone-desk-accent.jpg"],
        isDefault: true
      }
    ]
  },
  {
    id: "green-marble-catchall",
    slug: "forest-green-marble-catchall",
    name: "Forest Green Marble Catchall",
    tagline: "Verde Guatemala marble with rich deep emerald movement",
    description: "Carved from deep green serpentinite marble characterized by jade highlights and dark mineral fissures. Hollowed gently to cradle keys, jewelry, and daily keepsakes.",
    category: "decor",
    badge: "New",
    stoneType: "Verde Guatemala Marble",
    origin: "Guatemala / Udaipur",
    finish: "Deep polish with smooth basin",
    details: "High density stone with dramatic contrast that grounds any entryway or nightstand.",
    careInstructions: "Wipe with damp cloth. A drop of mineral oil once a year will maintain deep emerald luster.",
    artisanStory: "Extracted from ancient green marble beds prized for deep mineral color saturation.",
    shipping: "Archival foam packaging.",
    featuredImage: "/images/products/green-marble-catchall.jpg",
    seoTitle: "Forest Green Marble Catchall Tray | Sang Tarash",
    seoDescription: "Solid Verde Guatemala green marble catchall dish by Sang Tarash. Sculptural vanity and entryway tray with rich emerald veining.",
    sizes: [
      {
        sizeName: 'Medium Basin (7.5")',
        dimensions: '7.5" Dia x 1.5" H',
        weight: "3.4 lbs (1.5 kg)",
        price: 74,
        originalPrice: null,
        stock: 16,
        sku: "ST-FGC-75",
        images: ["/images/products/green-marble-catchall.jpg"],
        isDefault: true
      },
      {
        sizeName: 'Grand Valet (10")',
        dimensions: '10" Dia x 1.75" H',
        weight: "5.8 lbs (2.6 kg)",
        price: 115,
        originalPrice: 130,
        stock: 9,
        sku: "ST-FGC-10",
        images: ["/images/products/green-marble-catchall.jpg"],
        isDefault: false
      }
    ]
  },
  {
    id: "white-marble-totem",
    slug: "fluted-white-marble-totem",
    name: "Fluted White Marble Totem",
    tagline: "Vertical sculptural column in pure crystalline marble",
    description: "An evocative fluted column carved from pure white crystalline Thassos marble. Designed as an imposing vertical accent for console displays, mantels, and pedestals.",
    category: "sculptures",
    badge: "Sale",
    stoneType: "Thassos Pure Crystalline Marble",
    origin: "Thassos, Greece",
    finish: "Precision fluted with satin polish",
    details: "Snow-white sparkle stone renowned since ancient Hellenic times for exceptional light transmission.",
    careInstructions: "Dust regularly. Wipe with damp cloth.",
    artisanStory: "Turned on a vertical stonemason lathe with hand-cut fluting grooves.",
    shipping: "Crated in high-impact timber frame.",
    featuredImage: "/images/products/white-marble-totem.jpg",
    seoTitle: "Fluted White Marble Totem Sculpture | Sang Tarash",
    seoDescription: "Architectural fluted white marble totem sculpture by Sang Tarash. Carved from crystalline Thassos marble for luxury interior consoles.",
    sizes: [
      {
        sizeName: 'Column Medium (11")',
        dimensions: '4.5" Dia x 11" H',
        weight: "9.2 lbs (4.2 kg)",
        price: 125,
        originalPrice: 140,
        stock: 7,
        sku: "ST-WMT-11",
        images: ["/images/products/white-marble-totem.jpg"],
        isDefault: true
      },
      {
        sizeName: 'Column Grande (16")',
        dimensions: '5.5" Dia x 16" H',
        weight: "16.8 lbs (7.6 kg)",
        price: 195,
        originalPrice: null,
        stock: 4,
        sku: "ST-WMT-16",
        images: ["/images/products/white-marble-totem.jpg"],
        isDefault: false
      }
    ]
  },
  {
    id: "rosso-marble-dish",
    slug: "rosso-levanto-scalloped-dish",
    name: "Rosso Levanto Scalloped Dish",
    tagline: "Dramatic wine-red Italian marble with white calcite veins",
    description: "Rich terracotta and wine-red marble hand-shaped into an organic scalloped shallow bowl. Every piece displays natural calcite lightning veins in striking contrast with the deep reddish-purple stone.",
    category: "decor",
    badge: null,
    stoneType: "Rosso Levanto Marble",
    origin: "Liguria, Italy",
    finish: "Lustrous hand-buffed wax finish",
    details: "Quarried along the Ligurian coastline where tectonic heat formed rare red jasper marble.",
    careInstructions: "Wipe with soft cloth. Avoid acids.",
    artisanStory: "Hand-scalloped by Italian lapidary artisans.",
    shipping: "Custom gift presentation packaging.",
    featuredImage: "/images/products/rosso-marble-dish.jpg",
    seoTitle: "Rosso Levanto Wine Red Marble Dish | Sang Tarash",
    seoDescription: "Scalloped natural Rosso Levanto red marble dish by Sang Tarash. Expressive Italian stone with white calcite veins.",
    sizes: [
      {
        sizeName: 'Standard Dish (8")',
        dimensions: '8" Dia x 1.75" H',
        weight: "3.6 lbs (1.6 kg)",
        price: 68,
        originalPrice: null,
        stock: 14,
        sku: "ST-RLD-08",
        images: ["/images/products/rosso-marble-dish.jpg"],
        isDefault: true
      }
    ]
  },
  {
    id: "travertine-pedestal",
    slug: "tiered-travertine-pedestal",
    name: "Tiered Travertine Pedestal",
    tagline: "Grounded stone plinth for elevating prized art and objects",
    description: "A stepped architectural pedestal cut from dense, warm Roman travertine. Elevates ceramics, sculptures, or botanical vessels into museum-worthy focal points.",
    category: "decor",
    badge: "Bestseller",
    stoneType: "Natural Roman Travertine",
    origin: "Rome, Italy",
    finish: "Open-pore matte honed travertine",
    details: "Tiered plinth base with unfilled tactile pores preserving geological history.",
    careInstructions: "Dust regularly. Blot spills immediately.",
    artisanStory: "Cut and calibrated for perfect level balance.",
    shipping: "White-glove padded corner reinforcements.",
    featuredImage: "/images/products/travertine-pedestal.jpg",
    seoTitle: "Tiered Travertine Pedestal Plinth | Sang Tarash",
    seoDescription: "Classical tiered Roman travertine pedestal plinth by Sang Tarash. Architectural stone riser for art and treasured objects.",
    sizes: [
      {
        sizeName: "Standard Plinth",
        dimensions: '6.5" W x 6.5" D x 4.5" H',
        weight: "5.5 lbs (2.5 kg)",
        price: 82,
        originalPrice: null,
        stock: 18,
        sku: "ST-TTP-01",
        images: ["/images/products/travertine-pedestal.jpg"],
        isDefault: true
      },
      {
        sizeName: "Tall Gallery Riser",
        dimensions: '8" W x 8" D x 7" H',
        weight: "10.4 lbs (4.7 kg)",
        price: 135,
        originalPrice: 155,
        stock: 8,
        sku: "ST-TTP-02",
        images: ["/images/products/travertine-pedestal.jpg"],
        isDefault: false
      }
    ]
  }
]

export async function seedDatabase() {
  await ensureDbInitialized()

  console.log("Seeding Sang Tarash database...")

  for (const item of initialSeedProducts) {
    const { sizes, ...prodData } = item

    // Upsert product
    await db.insert(products).values({
      ...prodData,
      gallery: JSON.stringify(sizes.flatMap(s => s.images))
    }).onConflictDoUpdate({
      target: products.id,
      set: {
        ...prodData,
        gallery: JSON.stringify(sizes.flatMap(s => s.images)),
        updatedAt: new Date()
      }
    })

    // Delete existing sizes for this product to avoid duplicates
    await db.delete(productSizes).where(eq(productSizes.productId, prodData.id))

    // Insert sizes
    for (let i = 0; i < sizes.length; i++) {
      const s = sizes[i]
      await db.insert(productSizes).values({
        id: `${prodData.id}-size-${i + 1}`,
        productId: prodData.id,
        sizeName: s.sizeName,
        dimensions: s.dimensions,
        weight: s.weight,
        price: s.price,
        originalPrice: s.originalPrice,
        stock: s.stock,
        sku: s.sku,
        images: JSON.stringify(s.images),
        isDefault: s.isDefault,
        sortOrder: i
      })
    }
  }

  console.log(`Successfully seeded ${initialSeedProducts.length} Sang Tarash products with size variants!`)
  return { success: true, count: initialSeedProducts.length }
}
