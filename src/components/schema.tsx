const SITE_URL = 'https://tryraisins.dev';

const PERSON = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Seun Sowemimo',
  alternateName: 'TryRaisins',
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  jobTitle: 'Fullstack Web Developer',
  description:
    'Fullstack Web Developer with 5+ years of experience specializing in React, TypeScript, Node.js, and Python.',
  email: 'mailto:tryraisins@gmail.com',
  givenName: 'Oluwaseun',
  familyName: 'Sowemimo',
  additionalName: 'TryRaisins',
  sameAs: [
    'https://github.com/tryraisins',
    'https://www.linkedin.com/in/seun-sowemimo-8518b7249/',
    'https://medium.com/@TryRaisins',
    SITE_URL,
  ],
  knowsAbout: [
    'React',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Python',
    'MongoDB',
    'Azure Functions',
    'Web Development',
    'Frontend Development',
    'Backend Development',
  ],
  homeLocation: {
    '@type': 'Place',
    name: 'Lagos, Nigeria',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance / Professional',
  },
};

const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TryRaisins Portfolio',
  alternateName: 'Seun Sowemimo Developer Portfolio',
  url: SITE_URL,
  description:
    'Portfolio website of Seun Sowemimo, a Fullstack Web Developer specializing in React, TypeScript, Node.js, and Python.',
  author: { '@type': 'Person', name: 'Seun Sowemimo' },
};

const PROJECTS = [
  {
    name: 'Terror Tracker',
    description: 'Real-time intelligence on terrorist and insurgent activities across Nigeria.',
    url: 'https://terrortracker.tryraisins.dev/',
  },
  {
    name: 'Echo List',
    description: 'A tool to seamlessly convert your Shazam discoveries into curated YouTube playlists.',
    url: 'https://echolist.tryraisins.dev/',
  },
  {
    name: 'StreamSlip',
    description: 'Transform your YouTube Music listening history into beautiful, shareable receipts.',
    url: 'https://streamslip.tryraisins.dev/',
  },
  {
    name: 'International Space Station Tracker',
    description:
      'A simple app that fetches the current location of the International Space Station, the number of people in space, who they are, and where they are.',
    url: 'https://isstracker.tryraisins.dev/',
  },
  {
    name: 'Talent Hunter',
    description:
      'A Vite powered resume screening app that helps recruiters, HR professionals, and hiring managers find the best candidates faster than ever before.',
    url: 'https://talenthunter.tryraisins.dev/',
  },
];

const COLLECTION = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Web Development Projects',
  description:
    'A collection of web development projects showcasing expertise in React, TypeScript, Node.js, and modern web technologies.',
  url: `${SITE_URL}/#work`,
  author: { '@type': 'Person', name: 'Seun Sowemimo' },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: PROJECTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: p.name,
        description: p.description,
        url: p.url,
      },
    })),
  },
};

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonSchema() {
  return <JsonLd data={PERSON} />;
}

export function WebsiteSchema() {
  return <JsonLd data={WEBSITE} />;
}

export function CollectionSchema() {
  return <JsonLd data={COLLECTION} />;
}
