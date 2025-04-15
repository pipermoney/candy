import { Suspense } from "react"
import Header from "@/components/header"
import ScrollReveal from "@/components/scroll-reveal"

export default async function ExhibitionsPage() {
  const exhibitions = [
    {
      id: "1",
      title: "Living Landscapes",
      venue: "Vital",
      location: "New York, NY",
      year: "2022",
      description: "Solo exhibition exploring digital landscapes and virtual environments.",
    },
    {
      id: "2",
      title: "Digital Identities",
      venue: "Virtual Gallery",
      location: "Online",
      year: "2023",
      description: "Group exhibition examining the intersection of identity and technology.",
    },
    {
      id: "3",
      title: "Summer Salon Show",
      venue: "Greenpoint Gallery",
      location: "New York, NY",
      year: "2016",
      description: "Annual group exhibition featuring emerging artists.",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-24 max-w-3xl">
        <ScrollReveal>
          <h1 className="text-3xl font-light mb-12">Exhibitions</h1>
        </ScrollReveal>

        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <div className="space-y-16">
            {exhibitions.map((exhibition, index) => (
              <ScrollReveal key={exhibition.id} delay={index * 0.1}>
                <div className="border-t border-gray-100 pt-8">
                  <h2 className="text-xl font-light">{exhibition.title}</h2>
                  <p className="text-gray-400 mb-4">
                    {exhibition.venue}, {exhibition.location}, {exhibition.year}
                  </p>
                  <p>{exhibition.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Suspense>
      </div>
    </main>
  )
}
