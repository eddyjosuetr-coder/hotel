export default function Footer() {
  return (
    <footer
      id="footer"
      className="bg-white border-t border-black/10 pt-20 px-6 md:px-12 lg:px-[60px] min-h-[600px] flex flex-col justify-between overflow-hidden"
    >
      {/* Top: Office Info */}
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-20">
        <OfficeColumn
          city="Amalfi Coast"
          cityEn="ITALY"
          address="Via Lunamare 12, Positano, 84017 SA"
          coords="40.6280° N, 14.4847° E"
          timezone="UTC+1"
        />
        <OfficeColumn
          city="Malibu"
          cityEn="CALIFORNIA"
          address="27400 Pacific Coast Highway, Malibu, CA 90265"
          coords="34.0259° N, 118.7798° W"
          timezone="UTC-8"
        />
        <OfficeColumn
          city="Phuket"
          cityEn="THAILAND"
          address="88 Tri-Trang Beach Road, Patong, Phuket 83150"
          coords="7.8804° N, 98.2953° E"
          timezone="UTC+7"
        />
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-zinc-950 mb-5 uppercase">
            CONTACT
          </p>
          <p className="text-sm text-zinc-500 leading-loose">
            reservations@lunamare.com
            <br />
            +1 (310) 555 0123
            <br />
            Instagram: @lunamare.hotels
          </p>
        </div>
      </div>

      {/* Bottom: Giant Wordmark */}
      <div className="w-full overflow-hidden leading-[0.85] pb-0">
        <span className="block text-[clamp(80px,18vw,320px)] font-light tracking-[-0.04em] text-zinc-950 whitespace-nowrap translate-y-[15%] select-none">
          LUNAMARE
        </span>
      </div>
    </footer>
  )
}

function OfficeColumn({
  city,
  cityEn,
  address,
  coords,
  timezone,
}: {
  city: string
  cityEn: string
  address: string
  coords: string
  timezone: string
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-[0.18em] text-zinc-950 mb-5 uppercase">
        {cityEn}
      </p>
      <p className="text-base font-medium text-zinc-950 mb-2">
        {city}
      </p>
      <p className="text-sm text-zinc-500 leading-relaxed mb-3 max-w-[260px]">
        {address}
      </p>
      <p className="text-[11px] tracking-wide text-zinc-400 tabular-nums leading-relaxed">
        {coords}
        <br />
        {timezone}
      </p>
    </div>
  )
}
