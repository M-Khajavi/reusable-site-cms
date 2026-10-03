import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type {
  CardStyle,
  EffectType,
  MenuVariant,
  SectionType,
  SiteConfig,
} from '../types/site'
import { HeroShelfAudit } from './HeroShelfAudit'
import './HeroShelfAudit.css'

const EFFECTS: EffectType[] = [
  'card effect',
  'rec_move_left',
  'rec_move_2x',
  'circle_move_left',
]

const shadowValue = (shadow: CardStyle['shadow']) => {
  if (shadow === 'strong') return '0 24px 60px rgba(0,0,0,.20)'
  if (shadow === 'soft') return '0 14px 34px rgba(35,31,32,.12)'
  return 'none'
}

const cardStyleVars = (style: CardStyle) =>
  ({
    '--card-background': style.backgroundColor,
    '--card-color': style.fontColor,
    '--card-font-size': `${style.fontSize}px`,
    '--card-border-width': `${style.borderWidth}px`,
    '--card-border-color': style.borderColor,
    '--card-border-radius': `${style.borderRadius}px`,
    '--card-padding': `${style.padding}px`,
    '--card-shadow': shadowValue(style.shadow),
  }) as CSSProperties

export function PublicSite({
  config,
  onAdmin,
}: {
  config: SiteConfig
  onAdmin: () => void
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState(
    config.header.language.defaultLanguage ||
      config.header.language.options[0] ||
      'EN',
  )

  useEffect(() => {
    const available = config.header.language.options || []
    if (!available.includes(language)) {
      setLanguage(
        config.header.language.defaultLanguage ||
          available[0] ||
          'EN',
      )
    }
  }, [config.header.language.defaultLanguage, config.header.language.options, language])

  const enabled = (id: string) =>
    config.sections.find(section => section.id === id)?.enabled

  const sectionConfig = (type: SectionType) =>
    config.sections.find(section => section.type === type)

  const sectionStyle = (type: SectionType) => {
    const appearance = sectionConfig(type)?.appearance

    return {
      '--section-background': appearance?.backgroundColor || '#FFFFFF',
      '--section-color': appearance?.fontColor || '#231F20',
    } as CSSProperties
  }

  const normalMenuItems = config.sections.filter(
    section =>
      section.enabled &&
      section.menu.enabled &&
      section.menu.placement === 'normal',
  )

  const bottomMenuItems = config.sections.filter(
    section =>
      section.enabled &&
      section.menu.enabled &&
      section.menu.placement === 'bottom',
  )

  const footerAppearance = sectionConfig('footer')?.appearance
  const headerBorderColor = footerAppearance?.backgroundColor || '#231F20'

  const renderMenuLink = (
    item: {
      label: string
      href: string
      variant: MenuVariant
    },
    mobile = false,
    onClick?: () => void,
  ) => (
    <a
      href={item.href}
      className={`menu-item ${
        item.variant === 'button' ? 'menu-item-button' : ''
      } ${mobile ? 'mobile-menu-item' : ''}`}
      onClick={onClick}
    >
      {item.label}
    </a>
  )

  const renderSectionMenuItem = (
    section: SiteConfig['sections'][number],
    mobile = false,
    onClick?: () => void,
  ) =>
    renderMenuLink(
      {
        label: section.menu.label || section.label,
        href: `#${section.id}`,
        variant: section.menu.variant,
      },
      mobile,
      onClick,
    )

  return (
    <div
      className="site"
      style={{ '--header-border-color': headerBorderColor } as CSSProperties}
    >
      <nav className="nav">
        <a className="brand" href="#">
          {config.brand.logo ? (
            <img
              className="brand-logo"
              src={config.brand.logo}
              alt={config.brand.name}
            />
          ) : (
            config.brand.name
          )}
        </a>

        <div className="nav-desktop">
          <div className="navlinks navlinks-normal">
            {normalMenuItems.map(section => (
              <span key={section.id}>
                {renderSectionMenuItem(section)}
              </span>
            ))}

            {config.header.login.enabled &&
              renderMenuLink({
                label: config.header.login.label,
                href: config.header.login.href,
                variant: config.header.login.variant,
              })}

            {config.header.language.enabled &&
              config.header.language.options.length > 0 && (
                <select
                  className="language-selector"
                  aria-label="Language"
                  value={language}
                  onChange={event => setLanguage(event.target.value)}
                >
                  {config.header.language.options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
          </div>

          {bottomMenuItems.length > 0 && (
            <div className="navlinks navlinks-bottom">
              {bottomMenuItems.map(section => (
                <span key={section.id}>
                  {renderSectionMenuItem(section)}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          className={`mobile-menu-toggle ${
            mobileMenuOpen ? 'open' : ''
          }`}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(value => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-list">
              {[...normalMenuItems, ...bottomMenuItems].map(
                section => (
                  <span key={section.id}>
                    {renderSectionMenuItem(section, true, () =>
                      setMobileMenuOpen(false),
                    )}
                  </span>
                ),
              )}

              {config.header.login.enabled && (
                <span>
                  {renderMenuLink(
                    {
                      label: config.header.login.label,
                      href: config.header.login.href,
                      variant: config.header.login.variant,
                    },
                    true,
                    () => setMobileMenuOpen(false),
                  )}
                </span>
              )}

              {config.header.language.enabled &&
                config.header.language.options.length > 0 && (
                  <label className="mobile-language">
                    <span>Language</span>
                    <select
                      value={language}
                      onChange={event => setLanguage(event.target.value)}
                    >
                      {config.header.language.options.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
            </div>
          </div>
        )}
      </nav>

      {enabled('hero') && (
        <section
          id="hero"
          className="hero cms-section"
          style={sectionStyle('hero')}
        >
          <div
            className="hero-copy"
            style={
              {
                '--hero-title-size': `${config.hero.titleSize ?? 100}px`,
                '--hero-text-color': config.hero.textColor ?? '#FFFFFF',
                '--hero-text-y': `${config.hero.textY ?? 50}%`,
              } as CSSProperties
            }
          >
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
              imageSize={heroSize(config.hero.imageSize)}
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

      {enabled('stats') && (
        <section
          id="stats"
          className="stats cms-section"
          style={sectionStyle('stats')}
        >
          {config.stats.map(stat => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>
      )}

      {enabled('steps') && (
        <section
          id="steps"
          className="section cms-section"
          style={sectionStyle('steps')}
        >
          <Header eyebrow="The process" title="Three steps. Zero friction." />
          <div className="stepgrid">
            {config.steps.map(step => (
              <article className="card" key={step.title}>
                <b>{step.icon}</b>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {enabled('ticker') && (
        <section
          id="ticker"
          className="ticker cms-section"
          style={sectionStyle('ticker')}
        >
          {config.findings.map(finding => (
            <div key={finding.finding}>
              <small>{finding.category}</small>
              <span>{finding.finding}</span>
              <em className={finding.status}>{finding.statusText}</em>
            </div>
          ))}
        </section>
      )}

      {enabled('report') && (
        <section
          id="report"
          className="section soft cms-section"
          style={sectionStyle('report')}
        >
          <Header eyebrow="Preview" title={config.report.title} />
          <div className="report">
            <h3>{config.report.store}</h3>
            <p>{config.report.category}</p>
            <div className="metrics">
              {config.report.metrics.map(metric => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {enabled('segments') && (
        <section
          id="segments"
          className="section cms-section"
          style={sectionStyle('segments')}
        >
          <Header
            eyebrow="Who it's for"
            title="Built for different kinds of teams."
          />
          <div className="three">
            {config.segments.map(segment => (
              <article className="card" key={segment.title}>
                <div className="icon" />
                <h3>{segment.title}</h3>
                <p>{segment.description}</p>
                <ul>
                  {segment.bullets.map(bullet => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {enabled('blocks') &&
        config.blocks.map((block, index) => (
          <section
            id={index === 0 ? 'blocks' : `block-${index + 1}`}
            className={`section block ${block.background} cms-section`}
            style={sectionStyle('blocks')}
            key={`${block.title}-${index}`}
          >
            <div className={`blockgrid ${block.layout}`}>
              <div>
                <Header eyebrow={block.eyebrow} title={block.title} />
                <p className="lead">{block.body}</p>
              </div>
              {block.layout !== 'none' && (
                <div className="visual">
                  {block.image ? (
                    <img src={block.image} alt="" />
                  ) : (
                    <div className="placeholder">IMAGE / MEDIA</div>
                  )}
                </div>
              )}
            </div>
          </section>
        ))}

      {enabled('articles') && (
        <ArticleCollection
          id="articles"
          eyebrow="Insights"
          config={config.articles}
          sectionStyle={sectionStyle('articles')}
        />
      )}

      {enabled('news') && (
        <ArticleCollection
          id="news"
          eyebrow="Updates"
          config={config.news}
          sectionStyle={sectionStyle('news')}
        />
      )}

      {enabled('people') && (
        <NetworkSection
          config={config.people}
          sectionStyle={sectionStyle('people')}
        />
      )}

      {enabled('philosophy') && (
        <PrincipleSection
          config={config.philosophy}
          sectionStyle={sectionStyle('philosophy')}
        />
      )}

      {enabled('cta') && (
        <section
          id="cta"
          className="cta cms-section"
          style={sectionStyle('cta')}
        >
          <div>
            <h2>{config.cta.title}</h2>
            <p>{config.cta.body}</p>
            <button onClick={onAdmin}>{config.cta.button}</button>
          </div>
        </section>
      )}

      {enabled('footer') && (
        <footer
          id="footer"
          className="cms-section"
          style={sectionStyle('footer')}
        >
          {config.footer}
          <button onClick={onAdmin}>Admin</button>
        </footer>
      )}
    </div>
  )
}

function heroSize(value: number | undefined) {
  return Math.min(100, Math.max(25, Number(value || 48)))
}

function Header({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </>
  )
}

function EffectRail({
  items,
  effect,
  dark,
  cardStyle,
}: {
  items: SiteConfig['articles']['items']
  effect: EffectType
  dark?: boolean
  cardStyle: CardStyle
}) {
  const safe = EFFECTS.includes(effect) ? effect : 'rec_move_left'
  const doubled = [...items, ...items]

  if (safe === 'card effect') {
    return (
      <div
        className={`effect-card-row ${
          dark ? 'effect-card-row-dark' : ''
        }`}
      >
        {items.map((article, index) => (
          <article
            className="effect-card"
            key={article.title + '-' + index}
            style={cardStyleVars(cardStyle)}
          >
            <small>{article.category}</small>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <span>{article.date} · Read →</span>
          </article>
        ))}
      </div>
    )
  }

  if (safe === 'circle_move_left') {
    return (
      <div
        className={`network-circle-mask article-circle-mask ${
          dark ? 'effect-circle-dark' : ''
        }`}
      >
        <div className="network-circle-track">
          {doubled.map((article, index) => (
            <div
              className="network-circle"
              key={article.title + '-' + index}
              style={cardStyleVars(cardStyle)}
            >
              <div className="article-circle-badge">
                {article.category}
              </div>
              <div className="network-name">{article.title}</div>
              <div className="network-region">{article.date}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (safe === 'rec_move_2x') {
    return (
      <div className="marquee-stack">
        <MarqueeRow
          items={doubled}
          direction="left"
          dark={dark}
          cardStyle={cardStyle}
        />
        <MarqueeRow
          items={[...items.slice().reverse(), ...items.slice().reverse()]}
          direction="right"
          dark={dark}
          cardStyle={cardStyle}
        />
      </div>
    )
  }

  return (
    <MarqueeRow
      items={doubled}
      direction="left"
      dark={dark}
      cardStyle={cardStyle}
    />
  )
}

function MarqueeRow({
  items,
  direction,
  dark,
  cardStyle,
}: {
  items: SiteConfig['articles']['items']
  direction: 'left' | 'right'
  dark?: boolean
  cardStyle: CardStyle
}) {
  return (
    <div className="marquee-mask">
      <div
        className={
          'marquee-track ' +
          (dark ? 'marquee-dark ' : '') +
          (direction === 'right' ? 'move-right' : 'move-left')
        }
      >
        {items.map((article, index) => (
          <article
            className="marquee-card"
            key={article.title + '-' + index}
            style={cardStyleVars(cardStyle)}
          >
            <small>{article.category}</small>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <span>{article.date} · Read →</span>
          </article>
        ))}
      </div>
    </div>
  )
}

function ArticleCollection({
  id,
  eyebrow,
  config,
  sectionStyle,
}: {
  id: 'articles' | 'news'
  eyebrow: string
  config: SiteConfig['articles'] | SiteConfig['news']
  sectionStyle: CSSProperties
}) {
  const dark = id === 'news'

  return (
    <section
      id={id}
      className={`section collection cms-section ${
        dark ? 'collection-dark' : ''
      }`}
      style={sectionStyle}
    >
      <div className="collection-head">
        <div>
          <Header eyebrow={eyebrow} title={config.heading} />
          <p className="lead">{config.subtitle}</p>
        </div>
        <a
          className="collection-link"
          href={id === 'news' ? '#news' : '#articles'}
        >
          View all {id}
        </a>
      </div>

      <EffectRail
        items={config.items}
        effect={config.effect || 'rec_move_left'}
        dark={dark}
        cardStyle={config.cardStyle}
      />
    </section>
  )
}

function NetworkSection({
  config,
  sectionStyle,
}: {
  config: SiteConfig['people']
  sectionStyle: CSSProperties
}) {
  const effect = config.effect || 'card effect'

  if (effect === 'circle_move_left') {
    const items = [...config.items, ...config.items]

    return (
      <section
        id="people"
        className="section soft network-section cms-section"
        style={sectionStyle}
      >
        <div className="collection-head">
          <div>
            <Header eyebrow="Our network" title={config.heading} />
            <p className="lead">{config.subtitle}</p>
          </div>
          <a className="collection-link" href="#cta">
            Join the network
          </a>
        </div>

        <div className="network-circle-mask">
          <div className="network-circle-track">
            {items.map((person, index) => (
              <div
                className="network-circle"
                key={person.name + '-' + index}
                style={cardStyleVars(config.cardStyle)}
              >
                <div className="network-avatar">
                  {person.name
                    .split(' ')
                    .map(part => part[0])
                    .join('')}
                </div>
                <div className="network-name">{person.name}</div>
                <div className="network-role">{person.role}</div>
                <div className="network-region">{person.region}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="people"
      className="section soft network-section cms-section"
      style={sectionStyle}
    >
      <div className="collection-head">
        <div>
          <Header eyebrow="Our network" title={config.heading} />
          <p className="lead">{config.subtitle}</p>
        </div>
        <a className="collection-link" href="#cta">
          Join the network
        </a>
      </div>

      <div className="network-rail">
        {config.items.map((person, index) => (
          <article
            className="network-card"
            key={person.name}
            style={
              {
                '--card-index': index,
                ...cardStyleVars(config.cardStyle),
              } as CSSProperties
            }
          >
            <div className="network-card-number">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="network-card-content">
              <span className="network-region">{person.region}</span>
              <h3>{person.name}</h3>
              <strong>{person.role}</strong>
              <p>{person.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function PrincipleSection({
  config,
  sectionStyle,
}: {
  config: SiteConfig['philosophy']
  sectionStyle: CSSProperties
}) {
  const lines = config.lines?.length
    ? config.lines
    : [
        { text: 'Principle line one', highlighted: false },
        { text: 'Principle line two', highlighted: false },
        { text: 'Principle line three', highlighted: true },
      ]

  return (
    <section
      id="philosophy"
      className="philosophy cms-section"
      style={sectionStyle}
    >
      <div className="principle-inner">
        <span className="eyebrow">
          {config.eyebrow || 'the shelvion principle'}
        </span>
        <h2>{config.title}</h2>
        <div className="principle-lines">
          {lines.map((line, index) => (
            <div
              className={`principle-line ${
                line.highlighted ? 'highlighted' : ''
              }`}
              key={index}
            >
              {line.text}
            </div>
          ))}
        </div>
        <p>{config.body}</p>
      </div>
    </section>
  )
}
