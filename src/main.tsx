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
    },
    hero: {
      ...defaultConfig.hero,
      ...(raw.hero || {}),
      calibration:
        raw.hero?.calibration || defaultConfig.hero.calibration,
    },
    articles: {
      ...defaultConfig.articles,
      ...(raw.articles || {}),
      cardStyle: {
        ...defaultConfig.articles.cardStyle,
        ...(raw.articles?.cardStyle || {}),
      },
    },
    news: {
      ...defaultConfig.news,
      ...(raw.news || {}),
      cardStyle: {
        ...defaultConfig.news.cardStyle,
        ...(raw.news?.cardStyle || {}),
      },
    },
    people: {
      ...defaultConfig.people,
      ...(raw.people || {}),
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
