// Facts the rendered pages and the markdown alternates both state. Moved out of
// index.astro so an agent copy cannot drift from, or invent, what the page shows.
export interface Project {
  number: string;
  name: string;
  type: string;
  description: string;
  year: string;
  href: string;
  /** Shown on the page, but presented as unavailable rather than live. */
  suspended?: boolean;
  cta?: string;
}

export const siteUrl = 'https://tryraisins.dev/';

export const email = 'tryraisins@gmail.com';

export const pageTitle = 'TryRaisins | Software Engineer and Open-Source Maintainer';

export const pageDescription =
  'TryRaisins is a software engineer whose work is used by FTSE 100 companies on four continents, building web products, developer tools and open-source projects, mostly with Next.js, Node.js and Python.';

export const socialImageAlt =
  'TryRaisins: I build useful things for the web. Ruled notebook paper with a handwritten hello and pencil sketches of a face and a cat.';

export const socials = [
  { name: 'GitHub', href: 'https://github.com/tryraisins' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/seun-sowemimo-8518b7249/' },
  { name: 'Medium', href: 'https://medium.com/@TryRaisins' },
];

export const projects: Project[] = [
  { number: '01', name: 'Terror Tracker', type: 'Live incident map', description: 'A map for exploring verified security incidents and emerging patterns across Nigeria.', year: '2026', href: 'https://terrortracker.tryraisins.dev/' },
  { number: '02', name: 'SlopLens', type: 'Design audit tool', description: 'Scores any web page out of 100 for how template-made it looks, and lists the tells that gave it away.', year: '2026', href: 'https://sloplens.tryraisins.dev/' },
  { number: '03', name: 'QuickBillz', type: 'Invoicing product', description: 'A straightforward way to create and share invoices, without a monthly subscription.', year: '2026', href: 'https://quickbillz.tryraisins.dev/' },
  { number: '04', name: 'Talent Hunter', type: 'Resume matching', description: 'Compares resumes with a job brief to help teams build a clearer shortlist.', year: '2026', href: 'https://talenthunter.tryraisins.dev/' },
  { number: '05', name: 'StreamSlip', type: 'Music utility', description: 'Turns YouTube Music listening history into a tidy recap you can share.', year: '2025', href: 'https://streamslip.vercel.app/' },
  { number: '06', name: 'yeknal', type: 'Developer tooling', description: 'A command-line tool and a library of agent skills that teach coding agents how I review, design, test and ship work.', year: '2026', href: '/skills/', cta: 'Browse the skills' },
  { number: '07', name: 'BetPicks', type: 'Sports picks product', description: 'A single place to look through fixtures, odds, and match predictions.', year: '2026', href: 'https://betpicks.tryraisins.dev/', suspended: true },
];
