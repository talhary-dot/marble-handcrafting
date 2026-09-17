"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Elena Rostova",
    location: "Architectural Interiorist, Milan",
    rating: 5,
    text: "The Vein Marble Tray is the anchor of our dining room. The subtle warm bronze veins rippling through the Carrara stone are breathtaking in person.",
    product: "Vein Marble Tray"
  },
  {
    id: 2,
    name: "Marcus Vance",
    location: "Art Collector, London",
    rating: 5,
    text: "The heft and hand-chiseled contour of the Carved Stone Vessel feels like an antiquity retrieved from a classical villa. Museum grade craftsmanship.",
    product: "Carved Stone Vessel"
  },
  {
    id: 3,
    name: "Clara Beauchamp",
    location: "Design Director, Paris",
    rating: 5,
    text: "The Travertine Candleholder with its burnished copper bronze insert casts the warmest, most serene amber light across our salon every evening.",
    product: "Travertine Candleholder"
  },
  {
    id: 4,
    name: "David K.",
    location: "Architect, New York",
    rating: 5,
    text: "Unpacking these sculptural bookends was an experience in itself. Heavy, flawlessly calibrated, and the cork-lined bases protect our walnut shelves.",
    product: "Sculptural Arch Bookends"
  },
  {
    id: 5,
    name: "Aria Lin",
    location: "Ceramicist, Tokyo",
    rating: 5,
    text: "The Makrana white marble incense stand is a quiet masterpiece. The honed silky texture and slender proportions ground my morning tea ritual.",
    product: "Marble Incense Stand"
  },
  {
    id: 6,
    name: "Julian S.",
    location: "Studio Principal, Copenhagen",
    rating: 5,
    text: "The Forest Green marble catchall holds an intense depth of emerald and jade minerals. It brings real geological weight and calm to my desk.",
    product: "Forest Green Catchall"
  },
  {
    id: 7,
    name: "Sonia Patel",
    location: "Hospitality Stylist, San Francisco",
    rating: 5,
    text: "The set of four Carrara coasters with beveled chamfers look exceptionally sharp under crystal glassware. The protective seal resists moisture rings completely.",
    product: "Marble Coaster Set"
  },
  {
    id: 8,
    name: "Henrik Weber",
    location: "Gallery Curator, Berlin",
    rating: 5,
    text: "The Rosso Levanto dish is unlike anything in commercial design stores. Rich deep wine hues, white calcite lightning veins, and an exquisite polish.",
    product: "Rosso Levanto Dish"
  },
  {
    id: 9,
    name: "Camilla Rossi",
    location: "Stone Conservator, Florence",
    rating: 5,
    text: "Having worked in Tuscan stone for over twenty years, I can attest that Marmo's lapidary chiseling and honed finish honor the purest Italian tradition.",
    product: "Fluted White Marble Totem"
  }
]

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div 
    className="rounded-3xl p-6 bg-card border border-border/50 mb-4 flex-shrink-0 boty-shadow boty-transition hover:border-primary/30"
  >
    {/* Stars */}
    <div className="flex items-center gap-1 mb-3 text-primary">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
      ))}
    </div>

    {/* Quote */}
    <p className="text-foreground/85 leading-relaxed mb-5 text-pretty font-serif text-lg tracking-wide italic">
      &ldquo;{testimonial.text}&rdquo;
    </p>

    {/* Author */}
    <div className="flex items-end justify-between gap-3 pt-3 border-t border-border/40">
      <div>
        <p className="text-foreground text-sm font-semibold">{testimonial.name}</p>
        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
      </div>
      <span className="text-[11px] font-medium tracking-wide text-primary bg-primary/10 px-2.5 py-1 rounded-full whitespace-nowrap border border-primary/20">
        {testimonial.product}
      </span>
    </div>
  </div>
)

export function Testimonials() {
  const [headerVisible, setHeaderVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  
  const column1 = [testimonials[0], testimonials[3], testimonials[6]]
  const column2 = [testimonials[1], testimonials[4], testimonials[7]]
  const column3 = [testimonials[2], testimonials[5], testimonials[8]]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (headerRef.current) {
      observer.observe(headerRef.current)
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 bg-background overflow-hidden pb-24 pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span 
            className={`text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3 block ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
            style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}
          >
            Collector & Designer Notes
          </span>
          <h2 
            className={`font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-foreground text-balance ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
            style={headerVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}
          >
            Collected and Revered
          </h2>
          <p 
            className={`text-sm sm:text-base text-muted-foreground max-w-md mx-auto mt-3 ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`}
            style={headerVisible ? { animationDelay: '0.6s', animationFillMode: 'forwards' } : {}}
          >
            How architects, artists, and homeowners live with our natural stone pieces.
          </p>
        </div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
          
          {/* Mobile - Single Column */}
          <div className="md:hidden h-[600px]">
            <div className="relative overflow-hidden h-full">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <TestimonialCard key={`mobile-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop - Three Columns */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 h-[600px]">
            {/* Column 1 - Scrolling Down */}
            <div className="relative overflow-hidden">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...column1, ...column1].map((testimonial, index) => (
                  <TestimonialCard key={`col1-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {/* Column 2 - Scrolling Up */}
            <div className="relative overflow-hidden">
              <div className="animate-scroll-up hover:animate-scroll-up-slow">
                {[...column2, ...column2].map((testimonial, index) => (
                  <TestimonialCard key={`col2-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {/* Column 3 - Scrolling Down */}
            <div className="relative overflow-hidden">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...column3, ...column3].map((testimonial, index) => (
                  <TestimonialCard key={`col3-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-down {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scroll-up {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-scroll-down {
          animation: scroll-down 32s linear infinite;
        }

        .animate-scroll-up {
          animation: scroll-up 32s linear infinite;
        }

        .animate-scroll-down-slow {
          animation: scroll-down 65s linear infinite;
        }

        .animate-scroll-up-slow {
          animation: scroll-up 65s linear infinite;
        }
      `}</style>
    </section>
  )
}
