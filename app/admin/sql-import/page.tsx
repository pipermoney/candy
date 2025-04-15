import Link from "next/link"

export default function SqlImportPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">SQL Import</h1>

        <p className="mb-6 text-gray-600">
          If other import methods aren't working, you can use these SQL commands to directly insert the artworks into
          your database.
        </p>

        <div className="mb-8">
          <h2 className="text-lg font-medium mb-2">Step 1: Create Media Records</h2>
          <p className="text-sm text-gray-600 mb-2">Run this SQL to create media records for your artworks:</p>

          <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              {`-- Insert media records
INSERT INTO media (id, url, type, alt)
VALUES 
  (gen_random_uuid(), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-05.png-E7k2azVONDIXqR5qEtkKbUjQGML4Pt.jpeg', 'image', 'Wooden Crown'),
  (gen_random_uuid(), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-closeup-04.png-TjZZ4fbI90TWrPpbqPckvVgHjp12BL.jpeg', 'image', 'Close Encounter'),
  (gen_random_uuid(), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-03-cc4aI0Pzn8XIaOKDFuyrjiiQOsnPsI.png', 'image', 'Dice Portrait'),
  (gen_random_uuid(), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-dicegurl-01-rf9VREj6gmXflWFhHSRBnDgjJ6Hhu0.png', 'image', 'Dice Gurl'),
  (gen_random_uuid(), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-soulofai-ndpRAigRKJ0s5qMGCjj53C07s8mcKs.png', 'image', 'Soul of AI'),
  (gen_random_uuid(), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-02-siN1tEU6KEowjTJNMsACBQa2KRPmH8.png', 'image', 'Aggressive'),
  (gen_random_uuid(), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-08-ItNZcHjwVbSAxxaMTnBT8bzUkSkcp6.png', 'image', 'Red Distortion'),
  (gen_random_uuid(), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-04-xZavvE8Hu7qgtMB9B4L7ymZRGlVrrx.png', 'image', 'Crown Bearer'),
  (gen_random_uuid(), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/character-slicesofme-QAaOiNl2LV4N5oQViIF9bgCOvCwF6J.png', 'image', 'Slices of Me');`}
            </pre>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium mb-2">Step 2: Create Artwork Records</h2>
          <p className="text-sm text-gray-600 mb-2">After running the first SQL, run this to create artwork records:</p>

          <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              {`-- Get category IDs
WITH categories AS (
  SELECT id, name FROM categories
),
-- Get media IDs
media_data AS (
  SELECT id, alt FROM media
)

-- Insert artworks
INSERT INTO artworks (id, title, slug, description, year, category_id, media_id)
SELECT 
  gen_random_uuid(),
  m.alt,
  lower(regexp_replace(m.alt, '[^\\w\\s-]', '', 'g')) || '-' || floor(random() * 1000)::text,
  CASE 
    WHEN m.alt = 'Wooden Crown' THEN 'Portrait on wood, exploring texture and identity.'
    WHEN m.alt = 'Close Encounter' THEN 'Detailed portrait transferred onto wood grain.'
    WHEN m.alt = 'Dice Portrait' THEN 'Portrait with dice element, exploring chance and identity.'
    WHEN m.alt = 'Dice Gurl' THEN 'Digital portrait with snake and dice elements.'
    WHEN m.alt = 'Soul of AI' THEN 'Digital collage exploring the intersection of nature, technology, and artificial intelligence.'
    WHEN m.alt = 'Aggressive' THEN 'Blue-toned portrait with 3D typography.'
    WHEN m.alt = 'Red Distortion' THEN 'Abstract digital artwork exploring form and color.'
    WHEN m.alt = 'Crown Bearer' THEN 'Digital portrait with medieval elements and vibrant orange hair.'
    WHEN m.alt = 'Slices of Me' THEN 'A study of movement and form through silhouettes.'
    ELSE 'Artwork by Piper Jules'
  END,
  '2023',
  (SELECT id FROM categories c WHERE 
    CASE 
      WHEN m.alt IN ('Wooden Crown', 'Close Encounter', 'Dice Gurl', 'Aggressive') THEN c.name = 'Cybergirl'
      WHEN m.alt IN ('Dice Portrait') THEN c.name = 'Portals'
      WHEN m.alt IN ('Soul of AI') THEN c.name = 'Transversive Media'
      WHEN m.alt IN ('Red Distortion') THEN c.name = 'Play on Space'
      WHEN m.alt IN ('Crown Bearer', 'Slices of Me') THEN c.name = 'Characters'
      ELSE c.name = 'Characters'
    END
  ),
  m.id
FROM media_data m;`}
            </pre>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link href="/admin" className="text-blue-600 hover:underline">
            Back to Admin
          </Link>

          <Link href="/debug" className="text-blue-600 hover:underline">
            Check Results
          </Link>
        </div>
      </div>
    </div>
  )
}
