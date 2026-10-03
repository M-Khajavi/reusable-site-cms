import type { HeroBrandCalibration, SiteConfig } from '../types/site'

const heroCalibration: HeroBrandCalibration[] = [
  {
    name: 'Paulig',
    facing: 4,
    color: '#4ECACE',
    area: { x: 12.7, y: 31, w: 31, h: 22 },
    products: [
      { variant: 'Classic', x: 13.2, y: 32.5, w: 7.2, h: 18.5 },
      { variant: 'Presidentti Original', x: 20.6, y: 32.5, w: 7.4, h: 18.5 },
      { variant: 'Dark', x: 28.2, y: 32.5, w: 7.1, h: 18.5 },
      { variant: 'Café Parisien', x: 35.3, y: 32.5, w: 7.7, h: 18.5 },
    ],
  },
  {
    name: 'Twinings',
    facing: 7,
    color: '#F2C94C',
    area: { x: 23.5, y: 8, w: 40, h: 19 },
    products: [
      { variant: 'English Breakfast', x: 23.8, y: 8.5, w: 5.4, h: 18 },
      { variant: 'Earl Grey', x: 29.6, y: 8.5, w: 5.4, h: 18 },
      { variant: 'Green Tea', x: 35.4, y: 8.5, w: 5.4, h: 18 },
      { variant: 'Lemon & Ginger', x: 41.3, y: 8.5, w: 5.4, h: 18 },
      { variant: 'Lemon & Peppermint', x: 47, y: 8.5, w: 5.4, h: 18 },
      { variant: 'Pure Peppermint', x: 52.8, y: 8.5, w: 5.4, h: 18 },
      { variant: 'Camomile', x: 58.5, y: 8.5, w: 5.2, h: 18 },
    ],
  },
  {
    name: 'Nescafé Dolce Gusto',
    facing: 4,
    color: '#FF5A36',
    area: { x: 50, y: 58, w: 35, h: 17 },
    products: [
      { variant: 'Espresso Intenso', x: 50.4, y: 58.5, w: 8, h: 16 },
      { variant: 'Café Au Lait', x: 58.8, y: 58.5, w: 8.4, h: 16 },
      { variant: 'Cappuccino', x: 67.5, y: 58.5, w: 8.2, h: 16 },
      { variant: 'Latte Macchiato', x: 76, y: 58.5, w: 8.5, h: 16 },
    ],
  },
]

const defaultSectionAppearance = {
  hero: { backgroundColor: '#0F3A5A', fontColor: '#FFFFFF' },
  stats: { backgroundColor: '#4ECACE', fontColor: '#231F20' },
  steps: { backgroundColor: '#FFFFFF', fontColor: '#231F20' },
  ticker: { backgroundColor: '#FFFFFF', fontColor: '#231F20' },
  report: { backgroundColor: '#EEF1F3', fontColor: '#231F20' },
  segments: { backgroundColor: '#FFFFFF', fontColor: '#231F20' },
  blocks: { backgroundColor: '#FFFFFF', fontColor: '#231F20' },
  articles: { backgroundColor: '#FFFFFF', fontColor: '#231F20' },
  news: { backgroundColor: '#0F3A5A', fontColor: '#FFFFFF' },
  people: { backgroundColor: '#EEF1F3', fontColor: '#231F20' },
  philosophy: { backgroundColor: '#2575A7', fontColor: '#FFFFFF' },
  cta: { backgroundColor: '#FFFFFF', fontColor: '#231F20' },
  footer: { backgroundColor: '#231F20', fontColor: '#FFFFFF' },
} as const

const section = (id: SiteConfig['sections'][number]['id'], type: SiteConfig['sections'][number]['type'], label: string) => ({
  id,
  type,
  label,
  enabled: true,
  appearance: { ...defaultSectionAppearance[type] },
  menu: { enabled: false, label, placement: 'normal' as const, variant: 'link' as const },
})

export const defaultConfig: SiteConfig = {
  brand: {
    name: 'Northstar',
    tagline: 'A reusable modern website template',
    logo: '',
  },

  theme: {
    primary: '#2575A7',
    secondary: '#4ECACE',
    ink: '#231F20',
    paper: '#F7F9FA',
    grey: '#E4E9ED',
    accent: '#FF5A36',
    dark: '#0F3A5A',
    headerFooter: '#231F20',
  },

  /* Kept for backward compatibility. The public header now uses section menu settings. */
  nav: [],

  header: {
    login: {
      enabled: true,
      label: 'Login / Sign up',
      href: '#login',
      variant: 'button',
    },
    language: {
      enabled: true,
      options: ['EN', 'FI'],
      defaultLanguage: 'EN',
    },
  },

  sections: [
    section('hero', 'hero', 'Hero'),
    section('stats', 'stats', 'Stats Strip'),
    section('steps', 'steps', 'How It Works'),
    section('ticker', 'ticker', 'Ticker'),
    section('report', 'report', 'Report Preview'),
    section('segments', 'segments', "Who It's For"),
    section('blocks', 'blocks', 'Content Blocks'),
    section('articles', 'articles', 'Insights'),
    section('news', 'news', 'News'),
    section('people', 'people', 'Network'),
    section('philosophy', 'philosophy', 'The Shelvion Principle'),
    section('cta', 'cta', 'CTA'),
    section('footer', 'footer', 'Footer'),
  ],

  hero: {
    eyebrow: 'Modern website · reusable template',
    title: 'Build a clear digital presence.',
    subtitle: 'A configurable website system with a public site and content admin. Change the content without rebuilding the components.',
    primaryCta: 'Get started',
    secondaryCta: 'See how it works',
    image: 'assets/hero-image-coffee.png',
    imageSize: 48,
    titleSize: 100,
    textColor: '#FFFFFF',
    textY: 50,
    calibration: heroCalibration,
  },

  stats: [
    { value: '01', label: 'Reusable system' },
    { value: 'TSX', label: 'Typed components' },
    { value: 'Admin', label: 'Content controls' },
    { value: 'Local', label: 'Easy to test' },
  ],

  steps: [
    { title: 'Configure the site', body: 'Change your brand, navigation, sections and content from the admin panel.', icon: '01' },
    { title: 'Edit the content', body: 'Update headings, cards, articles, people and calls to action without touching JSX.', icon: '02' },
    { title: 'Preview and publish', body: 'Preview the public website, save configuration locally, then connect a real backend later.', icon: '03' },
  ],

  findings: [
    { category: 'Content', finding: 'Hero headline updated successfully', status: 'ok', statusText: 'Ready' },
    { category: 'Navigation', finding: 'All primary links are configured', status: 'ok', statusText: 'Ready' },
    { category: 'Sections', finding: '13 configurable sections available', status: 'warn', statusText: 'Customizable' },
  ],

  report: {
    title: 'Content Configuration Preview',
    store: 'Example Company',
    category: 'Website Content',
    metrics: [
      { label: 'Sections', value: '13' },
      { label: 'Articles', value: '3' },
      { label: 'People', value: '3' },
    ],
  },

  segments: [
    { title: 'Startups', description: 'Launch quickly with a polished structure.', bullets: ['Clear positioning', 'Reusable content blocks', 'Simple administration'], icon: '🚀' },
    { title: 'Consultancies', description: 'Present expertise and services professionally.', bullets: ['Case-study friendly', 'Insights and news', 'Flexible CTAs'], icon: '🧭' },
    { title: 'Product brands', description: 'Turn product information into a strong digital story.', bullets: ['Feature sections', 'Visual storytelling', 'Scalable content'], icon: '📦' },
  ],

  blocks: [
    { eyebrow: 'Flexible content', title: 'Use sections as building blocks.', body: 'Create pages from reusable blocks. Swap the layout, background and copy while keeping the visual system consistent.', image: '', layout: 'right', background: 'white' },
  ],

  articles: {
    heading: 'Insights',
    subtitle: 'Research, analysis and useful guidance.',
    effect: 'rec_move_2x',
    viewAllHref: '#articles',
    cardStyle: {
      backgroundColor: '#FFFFFF',
      fontColor: '#231F20',
      fontSize: 14,
      borderWidth: 1.5,
      borderColor: '#E4E9ED',
      borderRadius: 8,
      padding: 22,
      shadow: 'soft',
    },
    items: [
      { title: 'Designing a clearer homepage', category: 'Strategy', excerpt: 'How hierarchy helps visitors understand what you do.', date: 'Oct 2026' },
      { title: 'Why reusable components matter', category: 'Product', excerpt: 'A practical approach to maintaining a growing website.', date: 'Sep 2026' },
      { title: 'From static HTML to TSX', category: 'Engineering', excerpt: 'What changes when content and components become separate.', date: 'Sep 2026' },
    ],
  },

  news: {
    heading: 'News',
    subtitle: 'Updates and announcements.',
    effect: 'rec_move_left',
    viewAllHref: '#news',
    cardStyle: {
      backgroundColor: '#234E69',
      fontColor: '#FFFFFF',
      fontSize: 14,
      borderWidth: 1,
      borderColor: '#48718A',
      borderRadius: 8,
      padding: 22,
      shadow: 'soft',
    },
    items: [
      { title: 'Template ready for customization', category: 'Update', excerpt: 'The reusable website and admin foundation is ready to test.', date: 'Oct 2026' },
      { title: 'Admin workflow added', category: 'Product', excerpt: 'Edit, toggle sections and preview changes in one place.', date: 'Oct 2026' },
    ],
  },

  people: {
    heading: 'A network of experts.',
    subtitle: 'Add people, partners or team members without changing the component code.',
    effect: 'card effect',
    pageHref: '#cta',
    cardStyle: {
      backgroundColor: '#FFFFFF',
      fontColor: '#231F20',
      fontSize: 14,
      borderWidth: 1.5,
      borderColor: '#E4E9ED',
      borderRadius: 8,
      padding: 28,
      shadow: 'strong',
    },
    items: [
      { name: 'Alex Morgan', role: 'Strategy Advisor', region: 'Europe', bio: 'Business strategy and market development.' },
      { name: 'Sam Lee', role: 'Design Consultant', region: 'Nordics', bio: 'Digital product and visual communication.' },
      { name: 'Taylor Kim', role: 'Technology Advisor', region: 'Global', bio: 'Web architecture and automation.' },
    ],
  },

  philosophy: {
    eyebrow: 'the shelvion principle',
    title: 'Technology should make the work clearer.',
    lines: [
      { text: 'AI sees.', highlighted: false },
      { text: 'AI analyzes.', highlighted: false },
      { text: 'AI recommends.', highlighted: false },
      { text: 'AI reports.', highlighted: false },
      { text: 'But humans decide.', highlighted: true },
    ],
    body: 'This template separates content from presentation so teams can change the message while keeping a consistent design system.',
  },

  cta: {
    title: 'Ready to make it yours?',
    body: 'Change the configuration in the admin panel and immediately preview the result.',
    button: 'Open admin',
  },

  footer: '© 2026 Northstar · Reusable website template',
}
