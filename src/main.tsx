import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { defaultConfig } from './data/defaultConfig'
import type { SiteConfig } from './types/site'
import { PublicSite } from './components/PublicSite'
import { Admin } from './admin/Admin'

const KEY = 'reusable-site-cms-config'

function hydrate(raw: Partial<SiteConfig> | null): SiteConfig {
  if (!raw) return defaultConfig

  const savedFooterAppearance = (raw.sections || []).find(
    item => item.id === 'footer' || item.type === 'footer',
  )?.appearance

  const headerFooterColor =
    raw.theme?.headerFooter ||
    savedFooterAppearance?.backgroundColor ||
    defaultConfig.theme.headerFooter

  return {
    ...defaultConfig,
    ...raw,
    brand: {
      ...defaultConfig.brand,
      ...(raw.brand || {}),
    },
    header: {
      ...defaultConfig.header,
      ...(raw.header || {}),
      login: {
        ...defaultConfig.header.login,
        ...(raw.header?.login || {}),
      },
      language: {
        ...defaultConfig.header.language,
        ...(raw.header?.language || {}),
        options:
          raw.header?.language?.options?.length
            ? raw.header.language.options
            : defaultConfig.header.language.options,
      },
    },
    theme: {
      ...defaultConfig.theme,
      ...(raw.theme || {}),
      headerFooter: headerFooterColor,
    },
    hero: {
      ...defaultConfig.hero,
      ...(raw.hero || {}),
      calibration:
        raw.hero?.calibration || defaultConfig.hero.calibration,
    },
    segments: (raw.segments || defaultConfig.segments).map((item, index) => ({
      ...defaultConfig.segments[index % defaultConfig.segments.length],
      ...item,
      icon:
        item.icon ??
        defaultConfig.segments[index % defaultConfig.segments.length].icon,
      bullets: item.bullets || [],
    })),
    articles: {
      ...defaultConfig.articles,
      ...(raw.articles || {}),
      viewAllHref:
        raw.articles?.viewAllHref || defaultConfig.articles.viewAllHref,
      cardStyle: {
        ...defaultConfig.articles.cardStyle,
        ...(raw.articles?.cardStyle || {}),
      },
    },
    news: {
      ...defaultConfig.news,
      ...(raw.news || {}),
      viewAllHref:
        raw.news?.viewAllHref || defaultConfig.news.viewAllHref,
      cardStyle: {
        ...defaultConfig.news.cardStyle,
        ...(raw.news?.cardStyle || {}),
      },
    },
    people: {
      ...defaultConfig.people,
      ...(raw.people || {}),
      pageHref:
        raw.people?.pageHref || defaultConfig.people.pageHref,
      cardStyle: {
        ...defaultConfig.people.cardStyle,
        ...(raw.people?.cardStyle || {}),
      },
    },
    sections: defaultConfig.sections.map(section => {
      const saved = (raw.sections || []).find(item => item.id === section.id)
      return {
        ...section,
        ...(saved || {}),
        appearance: {
          ...section.appearance,
          ...(saved?.appearance || {}),
          ...(section.type === 'footer'
            ? { backgroundColor: headerFooterColor }
            : {}),
        },
        menu: {
          ...section.menu,
          ...(saved?.menu || {}),
        },
      }
    }),
  }
}

function App() {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      return hydrate(
        JSON.parse(localStorage.getItem(KEY) || 'null') as
          | Partial<SiteConfig>
          | null,
      )
    } catch {
      return defaultConfig
    }
  })

  const [admin, setAdmin] = useState(location.hash === '#admin')

  useEffect(() => {
    const handleHashChange = () =>
      setAdmin(location.hash === '#admin')

    addEventListener('hashchange', handleHashChange)
    return () => removeEventListener('hashchange', handleHashChange)
  }, [])

  const save = (nextConfig: SiteConfig) => {
    const next = hydrate(nextConfig)
    setConfig(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  return admin ? (
    <Admin
      config={config}
      onChange={save}
      onPublic={() => {
        location.hash = ''
      }}
    />
  ) : (
    <PublicSite
      config={config}
      onAdmin={() => {
        location.hash = 'admin'
      }}
    />
  )
}

createRoot(document.getElementById('root')!).render(<App />)
