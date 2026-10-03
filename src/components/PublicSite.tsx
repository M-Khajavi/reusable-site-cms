import type { CSSProperties } from 'react'
import type { SiteConfig, EffectType } from '../types/site'
import { HeroShelfAudit } from './HeroShelfAudit'
import './HeroShelfAudit.css'

const EFFECTS: EffectType[] = ['card effect', 'rec_move_left', 'rec_move_2x', 'circle_move_left']

export function PublicSite({ config, onAdmin }: { config: SiteConfig; onAdmin: () => void }) {
  const enabled = (id: string) => config.sections.find(s => s.id === id)?.enabled
 const heroSize = Math.min(
  100,
  Math.max(25, Number(config.hero.imageSize || 48))
)
  
  return <div className="site" style={{ '--primary': config.theme.primary, '--secondary': config.theme.secondary, '--ink': config.theme.ink, '--paper': config.theme.paper, '--grey': config.theme.grey, '--accent': config.theme.accent, '--dark': config.theme.dark, '--hero-image-size': `${heroSize}%` } as CSSProperties}>
    <nav className="nav"><a className="brand" href="#">{config.brand.name}</a><div className="navlinks">{config.nav.map(n => <a key={n.href} href={n.href}>{n.label}</a>)}<a className="navcta" href="#cta">Get started</a></div></nav>

{enabled('hero') && (
  <section
  className="hero"
  style={{
    background: '#0F3A5A',
  }}
>
    <div className="hero-copy">
      <span className="eyebrow">{config.hero.eyebrow}</span>
      <h1>{config.hero.title}</h1>
      <p>{config.hero.subtitle}</p>

      <div className="buttons">
        <a className="primary" href="#cta">
          {config.hero.primaryCta}
        </a>
        <a className="outline" href="#steps">
          {config.hero.secondaryCta}
        </a>
      </div>
    </div>

    {config.hero.image ? (
      <HeroShelfAudit
        image={config.hero.image}
        brands={config.hero.calibration ?? []}
        imageSize={heroSize}
      />
    ) : (
      <div
        className="hero-visual hero-image-placeholder"
        aria-label="Hero image"
      >
        Upload a Hero image in Admin
      </div>
    )}
  </section>
)}

    {enabled('stats') && <section className="stats">{config.stats.map(s => <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>)}</section>}
    {enabled('steps') && <section id="steps" className="section"><Header eyebrow="The process" title="Three steps. Zero friction."/><div className="stepgrid">{config.steps.map(s => <article className="card" key={s.title}><b>{s.icon}</b><h3>{s.title}</h3><p>{s.body}</p></article>)}</div></section>}
    {enabled('ticker') && <section className="ticker">{config.findings.map(f => <div key={f.finding}><small>{f.category}</small><span>{f.finding}</span><em className={f.status}>{f.statusText}</em></div>)}</section>}
    {enabled('report') && <section className="section soft"><Header eyebrow="Preview" title={config.report.title}/><div className="report"><h3>{config.report.store}</h3><p>{config.report.category}</p><div className="metrics">{config.report.metrics.map(m => <div key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}</div></div></section>}
    {enabled('segments') && <section className="section"><Header eyebrow="Who it's for" title="Built for different kinds of teams."/><div className="three">{config.segments.map(s => <article className="card" key={s.title}><div className="icon"/><h3>{s.title}</h3><p>{s.description}</p><ul>{s.bullets.map(x => <li key={x}>{x}</li>)}</ul></article>)}</div></section>}
    {enabled('blocks') && config.blocks.map((b, i) => <section className={'section block ' + b.background} key={i}><div className={'blockgrid ' + b.layout}><div><Header eyebrow={b.eyebrow} title={b.title}/><p className="lead">{b.body}</p></div>{b.layout !== 'none' && <div className="visual">{b.image ? <img src={b.image} /> : <div className="placeholder">IMAGE / MEDIA</div>}</div>}</div></section>)}
    {enabled('articles') && <ArticleCollection id="articles" eyebrow="Insights" config={config.articles}/>} 
    {enabled('news') && <ArticleCollection id="news" eyebrow="Updates" config={config.news}/>} 
    {enabled('people') && <NetworkSection config={config.people}/>} 
    {enabled('philosophy') && <PrincipleSection config={config.philosophy}/>} 
    {enabled('cta') && <section id="cta" className="cta"><div><h2>{config.cta.title}</h2><p>{config.cta.body}</p><button onClick={onAdmin}>{config.cta.button}</button></div></section>}
    {enabled('footer') && <footer>{config.footer}<button onClick={onAdmin}>Admin</button></footer>}
  </div>
}

function Header({ eyebrow, title }: { eyebrow: string; title: string }) { return <><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></> }

function EffectRail({ items, effect, dark }: { items: SiteConfig['articles']['items']; effect: EffectType; dark?: boolean }) {
  const safe = EFFECTS.includes(effect) ? effect : 'rec_move_left'
  const doubled = [...items, ...items]
  if (safe === 'card effect') return <div className={'effect-card-row ' + (dark ? 'effect-card-row-dark' : '')}>{items.map((a, i) => <article className="effect-card" key={a.title + '-' + i}><small>{a.category}</small><h3>{a.title}</h3><p>{a.excerpt}</p><span>{a.date} · Read →</span></article>)}</div>
  if (safe === 'circle_move_left') return <div className={'network-circle-mask article-circle-mask ' + (dark ? 'effect-circle-dark' : '')}><div className="network-circle-track">{doubled.map((a, i) => <div className="network-circle" key={a.title + '-' + i}><div className="article-circle-badge">{a.category}</div><div className="network-name">{a.title}</div><div className="network-region">{a.date}</div></div>)}</div></div>
  if (safe === 'rec_move_2x') return <div className="marquee-stack"><MarqueeRow items={doubled} direction="left" dark={dark}/><MarqueeRow items={[...items.slice().reverse(), ...items.slice().reverse()]} direction="right" dark={dark}/></div>
  return <MarqueeRow items={doubled} direction="left" dark={dark}/>
}

function MarqueeRow({ items, direction, dark }: { items: SiteConfig['articles']['items']; direction: 'left' | 'right'; dark?: boolean }) {
  return <div className="marquee-mask"><div className={'marquee-track ' + (dark ? 'marquee-dark ' : '') + (direction === 'right' ? 'move-right' : 'move-left')}>{items.map((a, i) => <article className="marquee-card" key={a.title + '-' + i}><small>{a.category}</small><h3>{a.title}</h3><p>{a.excerpt}</p><span>{a.date} · Read →</span></article>)}</div></div>
}

function ArticleCollection({ id, eyebrow, config }: { id: string; eyebrow: string; config: { heading: string; subtitle: string; effect: EffectType; items: SiteConfig['articles']['items'] } }) {
  const dark = id === 'news'
  return <section id={id} className={'section collection ' + (dark ? 'collection-dark' : '')}><div className="collection-head"><div><Header eyebrow={eyebrow} title={config.heading}/><p className="lead">{config.subtitle}</p></div><a className="collection-link" href={id === 'news' ? '#news' : '#articles'}>View all {id}</a></div><EffectRail items={config.items} effect={config.effect || 'rec_move_left'} dark={dark}/></section>
}

function NetworkSection({ config }: { config: SiteConfig['people'] }) {
  const effect = config.effect || 'card effect'
  if (effect === 'circle_move_left') {
    const items = [...config.items, ...config.items]
    return <section id="people" className="section soft network-section"><div className="collection-head"><div><Header eyebrow="Our network" title={config.heading}/><p className="lead">{config.subtitle}</p></div><a className="collection-link" href="#cta">Join the network</a></div><div className="network-circle-mask"><div className="network-circle-track">{items.map((p, i) => <div className="network-circle" key={p.name + '-' + i}><div className="network-avatar">{p.name.split(' ').map(x => x[0]).join('')}</div><div className="network-name">{p.name}</div><div className="network-role">{p.role}</div><div className="network-region">{p.region}</div></div>)}</div></div></section>
  }
  return <section id="people" className="section soft network-section"><div className="collection-head"><div><Header eyebrow="Our network" title={config.heading}/><p className="lead">{config.subtitle}</p></div><a className="collection-link" href="#cta">Join the network</a></div><div className="network-rail">{config.items.map((p, i) => <article className="network-card" key={p.name} style={{ '--card-index': i } as CSSProperties}><div className="network-card-number">{String(i + 1).padStart(2, '0')}</div><div className="network-card-content"><span className="network-region">{p.region}</span><h3>{p.name}</h3><strong>{p.role}</strong><p>{p.bio}</p></div></article>)}</div></section>
}

function PrincipleSection({ config }: { config: SiteConfig['philosophy'] }) {
  const lines = config.lines?.length ? config.lines : [{ text: 'Principle line one', highlighted: false }, { text: 'Principle line two', highlighted: false }, { text: 'Principle line three', highlighted: true }]
  return <section className="philosophy"><div className="principle-inner"><span className="eyebrow">{config.eyebrow || 'the shelvion principle'}</span><h2>{config.title}</h2><div className="principle-lines">{lines.map((line, i) => <div className={'principle-line ' + (line.highlighted ? 'highlighted' : '')} key={i}>{line.text}</div>)}</div><p>{config.body}</p></div></section>
}
