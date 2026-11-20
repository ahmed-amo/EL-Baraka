export function SiteMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=16&hl=fr&output=embed`;
  return <iframe className="gmap" title={label} src={src} loading="eager" referrerPolicy="no-referrer-when-downgrade" />;
}
