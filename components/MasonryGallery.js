// components/MasonryGallery.jsx
"use client"

const ITEMS_PER_SECTION = 4

export default function MasonryGallery({ images = [] }) {
  // Pecah array jadi sections isi 4
  const sections = []
  for (let i = 0; i < images.length; i += ITEMS_PER_SECTION) {
    sections.push(images.slice(i, i + ITEMS_PER_SECTION))
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {sections.map((section, sectionIdx) => (
        <Section key={sectionIdx} images={section} sectionIndex={sectionIdx} />
      ))}
    </div>
  )
}

function Section({ images, sectionIndex }) {
  // Layout berganti-ganti tiap section
  const isEven = sectionIndex % 2 === 0

  if (isEven) {
    // Layout A: 1 gambar besar kiri + 3 gambar kanan (seperti gambarmu)
    return (
      <div className="flex gap-4 h-72">
        {/* Gambar besar kiri */}
        <div className="relative w-1/3 shrink-0 rounded-2xl overflow-hidden">
          <img
            src={images[0]?.url}
            alt={images[0]?.title}
            className="w-full h-full object-cover"
          />
          <Caption title={images[0]?.title} subtitle={images[0]?.subtitle} />
        </div>

        {/* 3 gambar kanan */}
        <div className="flex flex-col flex-1 gap-4">
          {/* Gambar besar atas */}
          <div className="relative flex-1 rounded-2xl overflow-hidden">
            <img
              src={images[1]?.url}
              alt={images[1]?.title}
              className="w-full h-full object-cover"
            />
            <Caption title={images[1]?.title} subtitle={images[1]?.subtitle} />
          </div>

          {/* 2 gambar kecil bawah */}
          <div className="flex gap-4 h-32">
            {images.slice(2, 4).map((img, i) => (
              <div key={i} className="relative flex-1 rounded-2xl overflow-hidden">
                <img
                  src={img?.url}
                  alt={img?.title}
                  className="w-full h-full object-cover"
                />
                <Caption title={img?.title} subtitle={img?.subtitle} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Layout B: 3 gambar kiri + 1 gambar besar kanan (kebalikan)
  return (
    <div className="flex gap-4 h-72">
      {/* 3 gambar kiri */}
      <div className="flex flex-col flex-1 gap-4">
        <div className="relative flex-1 rounded-2xl overflow-hidden">
          <img
            src={images[0]?.url}
            alt={images[0]?.title}
            className="w-full h-full object-cover"
          />
          <Caption title={images[0]?.title} subtitle={images[0]?.subtitle} />
        </div>
        <div className="flex gap-4 h-32">
          {images.slice(1, 3).map((img, i) => (
            <div key={i} className="relative flex-1 rounded-2xl overflow-hidden">
              <img
                src={img?.url}
                alt={img?.title}
                className="w-full h-full object-cover"
              />
              <Caption title={img?.title} subtitle={img?.subtitle} />
            </div>
          ))}
        </div>
      </div>

      {/* Gambar besar kanan */}
      <div className="relative w-1/3 shrink-0 rounded-2xl overflow-hidden">
        <img
          src={images[3]?.url}
          alt={images[3]?.title}
          className="w-full h-full object-cover"
        />
        <Caption title={images[3]?.title} subtitle={images[3]?.subtitle} />
      </div>
    </div>
  )
}

function Caption({ title, subtitle }) {
  if (!title) return null
  return (
    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
      <p className="text-white text-sm font-semibold leading-tight">{title}</p>
      {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
    </div>
  )
}