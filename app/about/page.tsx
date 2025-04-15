import Header from "@/components/header"
import ScrollReveal from "@/components/scroll-reveal"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-24 max-w-3xl">
        <div className="space-y-12">
          <ScrollReveal>
            <div className="mb-16 flex flex-col md:flex-row md:items-end gap-8">
              <div className="w-full md:w-1/2 aspect-square relative overflow-hidden rounded-md">
                <Image
                  src="/images/piper-portrait.jpg"
                  alt="Piper Jules"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="w-full md:w-1/2">
                <h1 className="text-3xl font-light mb-2">Piper Jules</h1>
                <h2 className="text-xl font-light text-gray-400">Candy Pill</h2>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section>
              <h3 className="text-lg font-medium mb-4">Education</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Songwriting & Production</h4>
                  <p>343 Labs</p>
                  <p>Electronic Music Production Classes</p>
                </div>

                <div>
                  <h4 className="font-medium">Rhode Island School Of Design</h4>
                  <p>BFA Film / Animation / Video</p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section>
              <h3 className="text-lg font-medium mb-4">News & Awards</h3>
              <ul className="space-y-2">
                <li>2022 "Artists to Watch 22," Artconnect</li>
                <li>2022 "Featured Artist," Vital</li>
                <li>2016 "Best Short Film," IFFF</li>
                <li>2014 "Best Short Film," Madrid Shorts</li>
                <li>2013 "Artisti en Roma," Rai</li>
              </ul>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <section>
              <h3 className="text-lg font-medium mb-4">Solo Shows</h3>
              <ul className="space-y-2">
                <li>2022 "Living Landscapes," Vital, New York, NY</li>
              </ul>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <section>
              <h3 className="text-lg font-medium mb-4">Group Shows</h3>
              <ul className="space-y-2">
                <li>2016 "IFFF," United Artists, Los Angeles, CA</li>
                <li>2016 "Summer Salon Show," Greenpoint Gallery, New York, NY</li>
                <li>2015 "Kids Festival," Madrid, Spain</li>
                <li>2014 "RISD Thesis Senior Showcase," RISD, Providence, RI</li>
                <li>2013 "Arte Elettronica," Electronic Art Cafe, Rome, Italy</li>
                <li>2013 "Le Donazioni 2013," Galleria Civica d'Arte Contemporanea</li>
                <li>2013 "End Show," Piazza Cenci, Rome, Italy</li>
                <li>2013 "Tinte Fresche," Piazza Cenci, Rome, Italy</li>
                <li>2013 "5 x 5 x 5," Villa Caproni, Rome, Italy</li>
                <li>2013 "Junior Film Festival," Rhode Island School of Design, Providence, RI</li>
                <li>2012 "Tr-annual Show," Rhode Island School of Design, Providence, RI</li>
                <li>2011 "RISD Selects," Nature Gallery, Providence, RI</li>
                <li>2011 "Local," Sullivan Country, NY</li>
                <li>2010 "Riverdale Country School Film Festival," Riverdale Country School, Bronx, NY</li>
                <li>2009 "Boston Salutes Painting in the T," Boston, MA</li>
                <li>2009 "Walnut Hill Arts," Walnut Hill School Gallery, Natick, MA</li>
                <li>2006 "Shell Wildlife Photographer of the Year," Natural History Museum, London, UK</li>
              </ul>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <section>
              <h3 className="text-lg font-medium mb-4">Works in Public Collections</h3>
              <ul className="space-y-2">
                <li>2022 Vital, New York NY</li>
                <li>2013 MAACK - Museum All'Aperto d'Arte Contemporanea Kalenarte, Molise, Italy</li>
                <li>2013 Take Away Gallery, Rome, Italy</li>
                <li>2013 Electronic Art Cafe, Rome Italy</li>
                <li>2012 The Smithsonian Institute, Washington, DC</li>
                <li>2012 RISD Museum, Providence, RI</li>
                <li>2010 Riverdale Country School Museum, New York, NY</li>
              </ul>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <section className="pt-8 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:justify-between items-center">
                <div>
                  <p>piperjulespill@gmail.com</p>
                  <p className="text-sm text-gray-500 mt-1">© 2025 Candy Pill & Piper Jules</p>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <a href="https://spotify.com" className="hover:underline" target="_blank" rel="noopener noreferrer">
                    spotify
                  </a>
                  <a
                    href="https://music.apple.com"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    apple music
                  </a>
                  <a href="https://tidal.com" className="hover:underline" target="_blank" rel="noopener noreferrer">
                    tidal
                  </a>
                </div>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </main>
  )
}
