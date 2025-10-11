export function upcomingEvents() {
  return listEvents()
    .filter((e) => e.status === 'open')
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function listEvents() {
  return [
    {
      slug: 'seminar-ai-2025',
      title: 'Seminar AI: Tren 2025',
      date: '2025-11-20',
      location: 'Auditorium Informatika',
      summary: 'Membahas perkembangan AI, LLM, dan penerapan industri.',
      image: '/window.svg',
      category: 'Seminar',
      status: 'open',
      ics: '20251120T070000Z/20251120T090000Z',
      mapEmbed: 'https://www.google.com/maps/embed?...',
    },
    {
      slug: 'workshop-react',
      title: 'Workshop React Advanced',
      date: '2025-12-02',
      location: 'Lab Komputer 2',
      summary: 'Pengantar Next.js, performance, dan best practices.',
      image: '/window.svg',
      category: 'Workshop',
      status: 'open',
      ics: '20251202T070000Z/20251202T100000Z',
      mapEmbed: 'https://www.google.com/maps/embed?...',
    },
  ];
}

export function getEvent(slug) {
  return listEvents().find((e) => e.slug === slug);
}