export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  originalPrice?: number | null
  image: string
  category: "home" | "tableware" | "sculptures" | "decor"
  badge?: "Bestseller" | "New" | "Sale" | null
  stoneType: string
  dimensions: string
  weight: string
  origin: string
  finish: string
  details: string
  careInstructions: string
  artisanStory: string
  shipping: string
}

export const products: Product[] = [
  {
    id: "vein-marble-tray",
    name: "Vein Marble Tray",
    tagline: "Honed Carrara marble with natural bronze-grey veining",
    description: "Hand-sculpted from solid white Carrara marble. Features soft chamfered edges and a matte honed finish that accentuates its distinctive mineral veins.",
    price: 88,
    originalPrice: null,
    image: "/images/products/vein-marble-tray.jpg",
    category: "home",
    badge: "Bestseller",
    stoneType: "Carrara White Marble",
    dimensions: '14" L x 9" W x 1.25" H',
    weight: "4.8 lbs (2.2 kg)",
    origin: "Tuscany, Italy",
    finish: "Hand-honed satin",
    details: "Each tray is carved from a solid block of genuine Italian Carrara marble. Carefully chiseled and buffed by master stonemasons, every piece reveals unique swirling charcoal and warm bronze veins that guarantee no two trays are ever identical.",
    careInstructions: "Wipe clean with a damp, soft microfiber cloth and pH-neutral soap. Never use acidic or abrasive cleaners. Seal periodically with a natural stone sealer to preserve its natural luster.",
    artisanStory: "Hand-finished in small artisan ateliers using traditional water-cooled diamond saws and fine-grit emery stones passed down through generations.",
    shipping: "Carefully nestled in custom-molded eco-cushioning and crated for secure worldwide dispatch. Arrives within 3-5 business days."
  },
  {
    id: "carved-stone-bowl",
    name: "Carved Stone Vessel",
    tagline: "Deep contoured bowl carved from monolithic natural stone",
    description: "Carved from solid natural limestone with dramatic geological movement. A centerpiece vessel celebrating raw tactile organic form.",
    price: 95,
    originalPrice: null,
    image: "/images/products/carved-stone-bowl.jpg",
    category: "tableware",
    badge: null,
    stoneType: "Calacatta Monolith",
    dimensions: '10" Dia x 5.5" H',
    weight: "7.2 lbs (3.3 kg)",
    origin: "Apuan Alps, Italy",
    finish: "Hand-sculpted with honed interior",
    details: "A dramatic architectural accent for dining tables, kitchen islands, or console displays. The exterior preserves gentle hand-chisel facets while the interior is smoothed to a silky touch.",
    careInstructions: "Suitable for dry goods, fruit, or as a standalone sculptural object. Clean with lukewarm water and mild soap. Dry immediately.",
    artisanStory: "Rough-hewn from quarry block offcuts, maximizing sustainable stone utilization while honoring the ancient craft of sculptural stone bowls.",
    shipping: "Reinforced double-walled archival packaging. Free standard shipping on orders over $75."
  },
  {
    id: "travertine-candleholder",
    name: "Travertine Fluted Candleholder",
    tagline: "Architectural travertine with solid copper bronze insert",
    description: "Fluted Roman travertine column accented with a burnished copper bronze candle insert. Brings warm tactile warmth to candlelight.",
    price: 78,
    originalPrice: null,
    image: "/images/products/travertine-candleholder.jpg",
    category: "sculptures",
    badge: "New",
    stoneType: "Classic Roman Travertine & Copper Bronze",
    dimensions: '3.5" Dia x 6" H',
    weight: "3.1 lbs (1.4 kg)",
    origin: "Tivoli, Italy",
    finish: "Porous natural matte travertine, aged copper cup",
    details: "Combines the natural voids and warm porosity of authentic Roman travertine with a custom-machined copper bronze candle cup designed to fit standard 7/8\" taper candles.",
    careInstructions: "Gently remove wax remnants by cooling in refrigerator or wiping with warm soft cloth. Do not use metal scraping tools.",
    artisanStory: "Turned and fluted on stone lathes by skilled stonemasons before receiving hand-antiqued solid copper bronze fittings.",
    shipping: "Individually boxed in gift-ready linen-covered protective rigid packaging."
  },
  {
    id: "marble-incense-stand",
    name: "Marble Incense Stand",
    tagline: "Minimalist slab with burnished brass incense rod holder",
    description: "A serene sculptural accent for meditative moments. Crafted from smooth Makrana white marble with a subtle ash catch hollow.",
    price: 58,
    originalPrice: 68,
    image: "/images/products/marble-incense-stand.jpg",
    category: "sculptures",
    badge: "Sale",
    stoneType: "Makrana Pure White Marble",
    dimensions: '9" L x 2.5" W x 0.75" H',
    weight: "1.8 lbs (0.8 kg)",
    origin: "Rajasthan, India",
    finish: "Silky honed matte",
    details: "Carved from Makrana marble—the very stone celebrated for centuries in royal Indian architecture. The shallow concave trench catches incense ash gracefully while preserving tabletop surfaces.",
    careInstructions: "Brush off dry incense ash after cooling. Spot clean with warm water when needed.",
    artisanStory: "Produced by traditional Rajasthani stone carvers continuing the centuries-old legacy of marble lapidary craft.",
    shipping: "Standard ground shipping (2-4 business days). Expedited options available."
  },
  {
    id: "sculptural-bookend",
    name: "Sculptural Arch Bookends",
    tagline: "Solid marble bookend pair with architectural geometry",
    description: "Weighted architectural arches crafted from solid marble blocks. Substantial enough to anchor the heaviest art tomes.",
    price: 92,
    originalPrice: null,
    image: "/images/products/sculptural-bookend.jpg",
    category: "home",
    badge: null,
    stoneType: "Calacatta Cream & Sandstone",
    dimensions: '5" W x 2.5" D x 7" H (each)',
    weight: "8.5 lbs per pair (3.9 kg)",
    origin: "Tuscany, Italy",
    finish: "Satin honed with cork-lined bases",
    details: "Sold as a matched pair. Each bookend features a precision-curved arch silhouette and comes fitted with protective natural cork footings to safeguard fine timber shelves.",
    careInstructions: "Dust regularly with soft dry cloth. Avoid exposure to high heat and harsh chemicals.",
    artisanStory: "Cut with diamond-tipped wire saws and hand-ground along each curve to achieve flawless geometric harmony.",
    shipping: "Double-boxed heavy cargo shipping with custom high-density foam molds."
  },
  {
    id: "marble-coaster-set",
    name: "Marble Coaster Set",
    tagline: "Set of four hand-cut octagonal marble drink coasters",
    description: "Four hexagonal coasters cut from solid white marble with warm grey and copper veins. Features beveled edge detailing and protective cork backing.",
    price: 46,
    originalPrice: 56,
    image: "/images/products/marble-coaster-set.jpg",
    category: "tableware",
    badge: "Sale",
    stoneType: "Carrara Natural Marble",
    dimensions: '4" Dia x 0.5" H (each)',
    weight: "2.4 lbs (set of 4)",
    origin: "Carrara, Italy",
    finish: "Polished top with natural cork underside",
    details: "Naturally cool to the touch and resistant to condensation. Sealed with food-safe non-toxic stone impregnator to resist wine, coffee, and moisture rings.",
    careInstructions: "Wipe with damp cloth after use. Not dishwasher safe.",
    artisanStory: "Hand-chamfered along every edge to reflect ambient candlelight beautifully during dinner service.",
    shipping: "Tied with natural raw linen ribbon inside a recycled kraft presentation box."
  },
  {
    id: "oval-serving-platter",
    name: "Oval Serving Platter",
    tagline: "Generous hand-finished marble platter for dining tables",
    description: "An impressive oval sharing platter with a gently elevated rim, cut from warm cream travertine marble with subtle undulating grain.",
    price: 110,
    originalPrice: null,
    image: "/images/products/oval-serving-platter.jpg",
    category: "tableware",
    badge: "Bestseller",
    stoneType: "Travertine & Limestone Composite",
    dimensions: '16" L x 10.5" W x 1" H',
    weight: "6.6 lbs (3.0 kg)",
    origin: "Pamukkale, Turkey",
    finish: "Honed matte surface with smooth rounded lip",
    details: "Ideal for charcuterie, artisanal cheeses, pastries, or as an anchor for centerpiece floral displays. Keeps chilled delicacies cool naturally throughout gatherings.",
    careInstructions: "Food safe. Hand wash with mild dish soap and warm water immediately after use. Avoid citrus or acidic sauces left directly on surface.",
    artisanStory: "Each slab is hand-selected for continuous grain flow across the entire length of the platter before final sculpting.",
    shipping: "Delivered in reinforced wood-braced protective packaging."
  },
  {
    id: "stone-desk-accent",
    name: "Monolithic Stone Desk Accent",
    tagline: "Sculptural geometric paperweight and tactile object",
    description: "A satisfyingly heavy geometric marble monolith designed for executive desks, credenzas, and library shelves.",
    price: 48,
    originalPrice: null,
    image: "/images/products/stone-desk-accent.jpg",
    category: "home",
    badge: null,
    stoneType: "Alabaster & Charcoal Granite Vein",
    dimensions: '3.25" W x 3.25" D x 4" H',
    weight: "2.5 lbs (1.1 kg)",
    origin: "Volterra, Italy",
    finish: "Polished facets with matte underside",
    details: "Designed as an homage to brutalist architectural forms. The multifaceted stone catches natural light from multiple angles throughout the day.",
    careInstructions: "Simply dust with a dry feather duster or microfiber cloth.",
    artisanStory: "Precision faceted by skilled lapidaries who align each facet to highlight crystalline mineral inclusions.",
    shipping: "Dispatches within 24 hours in signature protective packaging."
  },
  {
    id: "green-marble-catchall",
    name: "Forest Green Marble Catchall",
    tagline: "Verde Guatemala marble with rich deep emerald movement",
    description: "Carved from deep green marble characterized by dark serpentinite veins and lighter jade highlights. Gently hollowed for everyday treasures.",
    price: 74,
    originalPrice: null,
    image: "/images/products/green-marble-catchall.jpg",
    category: "decor",
    badge: "New",
    stoneType: "Verde Guatemala Marble",
    dimensions: '7.5" Dia x 1.5" H',
    weight: "3.4 lbs (1.5 kg)",
    origin: "Guatemala / Udaipur",
    finish: "Deep polish with smooth basin",
    details: "The deep forest tones and dramatic contrast bring rich earth energy to bedside tables, entry consoles, or dressing vanities.",
    careInstructions: "Wipe with damp cloth. Buff gently with a drop of mineral oil once a year to enhance depth of green.",
    artisanStory: "Extracted from historic green marble deposits renowned for high density and rich serpentine mineral richness.",
    shipping: "Standard and express shipping available at checkout."
  },
  {
    id: "white-marble-totem",
    name: "Fluted White Marble Totem",
    tagline: "Vertical sculptural column in pure crystalline marble",
    description: "An evocative fluted stone sculpture that commands presence on mantels, consoles, and pedestals.",
    price: 125,
    originalPrice: 140,
    image: "/images/products/white-marble-totem.jpg",
    category: "sculptures",
    badge: "Sale",
    stoneType: "Thassos Pure Crystalline Marble",
    dimensions: '4.5" Dia x 11" H',
    weight: "9.2 lbs (4.2 kg)",
    origin: "Thassos, Greece",
    finish: "Precision fluted with satin polish",
    details: "Cut from brilliant Thassos marble, celebrated since antiquity for its snow-white sparkle and high light reflectivity.",
    careInstructions: "Keep indoors. Clean gently with dry dusting or mild damp sponge.",
    artisanStory: "Turned on a precision stonemason's spindle, with individual vertical flutes finished by hand chisel.",
    shipping: "Crated in high-impact wooden frame with dense closed-cell foam."
  },
  {
    id: "rosso-marble-dish",
    name: "Rosso Levanto Scalloped Dish",
    tagline: "Dramatic wine-red Italian marble with white calcite veins",
    description: "Rich terracotta and wine-red marble shaped into a shallow scalloped tray. A bold warm statement piece for any room.",
    price: 68,
    originalPrice: null,
    image: "/images/products/rosso-marble-dish.jpg",
    category: "decor",
    badge: null,
    stoneType: "Rosso Levanto Marble",
    dimensions: '8" Dia x 1.75" H',
    weight: "3.6 lbs (1.6 kg)",
    origin: "Liguria, Italy",
    finish: "Lustrous hand-buffed wax finish",
    details: "Rosso Levanto marble is famous for its deep reddish-purple jasper ground interwoven with brilliant white calcite veining. Every dish is a geological masterpiece.",
    careInstructions: "Wipe clean with soft microfiber cloth. Avoid acidic liquids.",
    artisanStory: "Quarried near the Ligurian coast where centuries of tectonic activity produced this rare, highly expressive stone.",
    shipping: "Arrives in bespoke foam-padded presentation gift box."
  },
  {
    id: "travertine-pedestal",
    name: "Tiered Travertine Pedestal",
    tagline: "Grounded stone plinth for elevating prized art and objects",
    description: "A stepped pedestal cut from dense, warm beige travertine. Elevates sculptures, ceramics, or botanical vessels.",
    price: 82,
    originalPrice: null,
    image: "/images/products/travertine-pedestal.jpg",
    category: "decor",
    badge: "Bestseller",
    stoneType: "Natural Roman Travertine",
    dimensions: '6.5" W x 6.5" D x 4.5" H',
    weight: "5.5 lbs (2.5 kg)",
    origin: "Rome, Italy",
    finish: "Open-pore matte honed travertine",
    details: "Constructed with stepped architectural tiers inspired by classical monument bases. The unfilled natural pores preserve authentic tactile geological history.",
    careInstructions: "Dust regularly. In case of spills, blot immediately with clean cloth.",
    artisanStory: "Each block is calibrated for balance and level display, ensuring precious objects rest securely.",
    shipping: "Dispatched with white-glove corner reinforcements."
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id) || products.find(p => p.id === "vein-marble-tray")
}

export function getProductsByCategory(category: string): Product[] {
  if (!category || category === "all") return products
  return products.filter(p => p.category === category)
}
