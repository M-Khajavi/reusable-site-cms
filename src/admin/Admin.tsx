import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { SiteConfig, SectionType, EffectType } from '../types/site'

type Props = {
  config: SiteConfig
  onChange: (config: SiteConfig) => void
  onPublic: () => void
}

type Tab = SectionType | 'site' | 'theme' | 'navigation'

export function Admin({ config, onChange, onPublic }: Props) {
  const [active, setActive] = useState<Tab>('site')
  const fileInput = useRef<HTMLInputElement>(null)
  const [imageTarget, setImageTarget] = useState<'hero' | number | null>(null)

  const update = (mutate: (draft: SiteConfig) => void) => {
    const draft = structuredClone(config)
    mutate(draft)
    onChange(draft)
  }

  const reset = () => {
    localStorage.removeItem('reusable-site-cms-config')
    location.reload()
  }

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site-config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importConfig = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as SiteConfig
        onChange(parsed)
        alert('Configuration imported.')
      } catch {
        alert('Invalid configuration JSON.')
      }
    }
    reader.readAsText(file)
  }

  const pickImage = (target: 'hero' | number) => {
    setImageTarget(target)
    fileInput.current?.click()
  }

  const onImageSelected = (file?: File) => {
    if (!file || imageTarget === null) return
    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result)
      update(draft => {
        if (imageTarget === 'hero') draft.hero.image = value
        else if (draft.blocks[imageTarget]) draft.blocks[imageTarget].image = value
      })
      setImageTarget(null)
    }
    reader.readAsDataURL(file)
  }

  const moveSection = (index: number, direction: -1 | 1) => {
    update(draft => {
      const next = index + direction
      if (next < 0 || next >= draft.sections.length) return
      const [item] = draft.sections.splice(index, 1)
      draft.sections.splice(next, 0, item)
    })
  }

  return (
    <div className="admin-shell">
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        hidden
        onChange={e => onImageSelected(e.target.files?.[0])}
      />

      <header className="admin-topbar">
        <div>
          <strong>{config.brand.name}</strong>
          <span> / Content Control Panel</span>
        </div>
        <div className="admin-actions">
