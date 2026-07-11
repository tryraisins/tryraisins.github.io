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
    name: 'QuickBillz',
    description:
      'Freelance invoicing without the SaaS subscription. Generate professional invoices in seconds with custom styling, multiple export formats, and typography that does not look like a template. Built with Next.js, TypeScript, and Tailwind.',
    url: 'https://quickbillz.tryraisins.dev/',
  },
  {
    name: 'Terror Tracker',
    description:
      'A live map of insurgent activity across Nigeria — verified incident reports, casualty counts, and threat clusters, updated as the news comes in. Built with Next.js, MongoDB, and Node.js data pipelines.',
    url: 'https://terrortracker.tryraisins.dev/',
  },
  {
    name: 'Talent Hunter',
    description:
      'A resume screening tool for recruiters drowning in resumes: paste a job spec, upload the pile, get a ranked shortlist in minutes instead of hours. Built with Vite and React with NLP-driven candidate matching.',
    url: 'https://talenthunter.tryraisins.dev/',
  },
  {
    name: 'Echo List',
    description:
      'Resurrects your Shazam discovery history as a curated YouTube playlist — one upload, done. Built with React, Vite, and the YouTube Data API.',
    url: 'https://echolist.tryraisins.dev/',
  },
  {
    name: 'StreamSlip',
    description:
      'Your YouTube Music listening history, printed as a shareable receipt. Wrapped-style stats whenever you want them. Built with Next.js, canvas rendering, and OAuth.',
    url: 'https://streamslip.tryraisins.dev/',
  },
  {
    name: 'International Space Station Tracker',
    description:
      'A live tracker showing exactly where the International Space Station is over Earth right now, plus who is onboard and where they are from. Built with React, live API polling, and interactive mapping.',
    url: 'https://isstracker.tryraisins.dev/',
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
