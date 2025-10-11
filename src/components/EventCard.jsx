import Link from 'next/link';

export default function EventCard({ event, highlight = false }) {
  return (
    <div
      className={`border rounded-xl p-5 shadow-sm ${
        highlight ? 'bg-orange-200/20 border-orange-300' : 'bg-white'
      }`}
    >
      <div className="flex gap-4">
        <img
          src={event.image}
          alt={event.title}
          className="w-28 h-20 object-cover rounded-lg"
        />
        <div>
          <h3 className="font-semibold">{event.title}</h3>
          <p className="text-sm text-slate-600">{event.date}</p>
          <p className="text-sm mt-2">{event.summary}</p>
          <div className="mt-3 flex gap-3">
            <Link href={`/events/${event.slug}`} className="text-blue-600 hover:underline">
              Lihat detail
            </Link>
            {event.status === 'open' && (
              <Link href={`/events/${event.slug}#form`} className="text-teal-600 hover:underline">
                Daftar
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}