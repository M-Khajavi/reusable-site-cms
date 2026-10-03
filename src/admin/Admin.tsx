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
          <button onClick={onPublic}>Preview site</button>
          <button onClick={exportConfig}>Export JSON</button>
          <label className="admin-button">
            Import JSON
            <input type="file" accept="application/json" hidden onChange={e => e.target.files?.[0] && importConfig(e.target.files[0])} />
          </label>
          <button className="primary" onClick={() => { localStorage.setItem('reusable-site-cms-config', JSON.stringify(config)); alert('Saved locally.') }}>Save</button>
          <button onClick={reset}>Reset</button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title">Site</div>
          <button className={active === 'site' ? 'selected' : ''} onClick={() => setActive('site')}>Brand</button>
          <button className={active === 'navigation' ? 'selected' : ''} onClick={() => setActive('navigation')}>Navigation</button>
          <button className={active === 'theme' ? 'selected' : ''} onClick={() => setActive('theme')}>Theme</button>

          <div className="admin-sidebar-title">Sections</div>
          {config.sections.map((section, index) => (
            <div className={`section-nav ${active === section.id ? 'selected' : ''}`} key={section.id}>
              <button className="section-nav-main" onClick={() => setActive(section.type)}>
                <span>{section.label}</span>
                <small>{section.enabled ? 'ON' : 'OFF'}</small>
              </button>
              <div className="section-nav-tools">
                <button title="Move up" disabled={index === 0} onClick={() => moveSection(index, -1)}>↑</button>
                <button title="Move down" disabled={index === config.sections.length - 1} onClick={() => moveSection(index, 1)}>↓</button>
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={e => update(draft => { const s = draft.sections.find(x => x.id === section.id); if (s) s.enabled = e.target.checked })}
                />
              </div>
            </div>
          ))}
        </aside>

        <main className="admin-main">
          {active === 'site' && <SiteEditor config={config} update={update} />}
          {active === 'navigation' && <NavigationEditor config={config} update={update} />}
          {active === 'theme' && <ThemeEditor config={config} update={update} />}
          {active === 'hero' && <HeroEditor config={config} update={update} pickImage={pickImage} />}
          {active === 'stats' && <StatsEditor config={config} update={update} />}
          {active === 'steps' && <StepsEditor config={config} update={update} />}
          {active === 'ticker' && <TickerEditor config={config} update={update} />}
          {active === 'report' && <ReportEditor config={config} update={update} />}
          {active === 'segments' && <SegmentsEditor config={config} update={update} />}
          {active === 'blocks' && <BlocksEditor config={config} update={update} pickImage={pickImage} />}
          {active === 'articles' && <ArticleSectionEditor config={config} update={update} kind="articles" />}
          {active === 'news' && <ArticleSectionEditor config={config} update={update} kind="news" />}
          {active === 'people' && <PeopleEditor config={config} update={update} />}
          {active === 'philosophy' && <PhilosophyEditor config={config} update={update} />}
          {active === 'cta' && <CtaEditor config={config} update={update} />}
          {active === 'footer' && <FooterEditor config={config} update={update} />}
        </main>
      </div>
    </div>
  )
}

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <section className="admin-panel"><div className="admin-panel-heading"><h1>{title}</h1>{description && <p>{description}</p>}</div>{children}</section>
}

function Field({ label, value, onChange, multiline = false, placeholder }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; placeholder?: string }) {
  return <label className="admin-field"><span>{label}</span>{multiline ? <textarea value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} /> : <input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />}</label>
}

function AddButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button className="add-button" onClick={onClick}>+ {children}</button>
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return <button className="delete-button" onClick={onClick}>Delete</button>
}

function SiteEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  return <Panel title="Brand & site identity" description="Control the main identity used throughout the website.">
    <div className="admin-grid two">
      <Field label="Brand name" value={config.brand.name} onChange={v => update(c => c.brand.name = v)} />
      <Field label="Tagline" value={config.brand.tagline} onChange={v => update(c => c.brand.tagline = v)} />
    </div>
  </Panel>
}

function NavigationEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  return <Panel title="Navigation" description="Edit menu labels and links.">
    {config.nav.map((item, i) => <div className="repeat-card" key={i}>
      <div className="admin-grid two">
        <Field label="Label" value={item.label} onChange={v => update(c => c.nav[i].label = v)} />
        <Field label="Link" value={item.href} onChange={v => update(c => c.nav[i].href = v)} />
      </div>
      <DeleteButton onClick={() => update(c => c.nav.splice(i, 1))} />
    </div>)}
    <AddButton onClick={() => update(c => c.nav.push({ label: 'New item', href: '#' }))}>Add navigation item</AddButton>
  </Panel>
}

function ThemeEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  const colors: Array<[keyof SiteConfig['theme'], string]> = [['primary', 'Primary'], ['secondary', 'Secondary'], ['ink', 'Text'], ['paper', 'Paper'], ['grey', 'Grey'], ['accent', 'Accent'], ['dark', 'Dark']]
  return <Panel title="Theme" description="Change the visual color system without editing CSS.">
    <div className="color-grid">{colors.map(([key, label]) => <label className="color-field" key={key}><span>{label}</span><input type="color" value={config.theme[key]} onChange={e => update(c => c.theme[key] = e.target.value)} /><code>{config.theme[key]}</code></label>)}</div>
  </Panel>
}

function HeroEditor({ config, update, pickImage }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void; pickImage: (target: 'hero' | number) => void }) {
  return <Panel title="Hero" description="Control the first screen visitors see, including the main image.">
    <Field label="Eyebrow" value={config.hero.eyebrow} onChange={v => update(c => c.hero.eyebrow = v)} />
    <Field label="Title" value={config.hero.title} onChange={v => update(c => c.hero.title = v)} multiline />
    <Field label="Subtitle" value={config.hero.subtitle} onChange={v => update(c => c.hero.subtitle = v)} multiline />
    <div className="admin-grid two">
      <Field label="Primary button" value={config.hero.primaryCta} onChange={v => update(c => c.hero.primaryCta = v)} />
      <Field label="Secondary button" value={config.hero.secondaryCta} onChange={v => update(c => c.hero.secondaryCta = v)} />
    </div>
    <ImageEditor label="Hero image" value={config.hero.image} onChange={v => update(c => c.hero.image = v)} onUpload={() => pickImage('hero')} />
    <label className="admin-field"><span>Hero image size (%)</span><input type="number" min={25} max={90} value={config.hero.imageSize ?? 48} onChange={e => update(c => c.hero.imageSize = Math.min(90, Math.max(25, Number(e.target.value) || 48)))} /><small className="field-help">Controls the visual column width on desktop.</small></label>
  </Panel>
}

function ImageEditor({ label, value, onChange, onUpload }: { label: string; value: string; onChange: (v: string) => void; onUpload: () => void }) {
  return <div className="image-editor"><div className="image-editor-head"><span>{label}</span><button onClick={onUpload}>Upload image</button></div><Field label="Image URL" value={value} onChange={onChange} placeholder="https://... or uploaded image" />{value && <img className="admin-image-preview" src={value} alt="Preview" />}</div>
}

function StatsEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  return <Panel title="Stats strip" description="Edit every statistic shown on the page.">{config.stats.map((item, i) => <div className="repeat-card" key={i}><div className="admin-grid two"><Field label="Value" value={item.value} onChange={v => update(c => c.stats[i].value = v)} /><Field label="Label" value={item.label} onChange={v => update(c => c.stats[i].label = v)} /></div><DeleteButton onClick={() => update(c => c.stats.splice(i, 1))} /></div>)}<AddButton onClick={() => update(c => c.stats.push({ value: '00', label: 'New stat' }))}>Add statistic</AddButton></Panel>
}

function StepsEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  return <Panel title="How it works" description="Edit the steps, titles, descriptions and icons.">{config.steps.map((item, i) => <div className="repeat-card" key={i}><Field label="Icon / number" value={item.icon} onChange={v => update(c => c.steps[i].icon = v)} /><Field label="Title" value={item.title} onChange={v => update(c => c.steps[i].title = v)} /><Field label="Description" value={item.body} onChange={v => update(c => c.steps[i].body = v)} multiline /><DeleteButton onClick={() => update(c => c.steps.splice(i, 1))} /></div>)}<AddButton onClick={() => update(c => c.steps.push({ icon: String(c.steps.length + 1).padStart(2, '0'), title: 'New step', body: 'Describe this step.' }))}>Add step</AddButton></Panel>
}

function TickerEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  return <Panel title="Ticker / findings" description="Control the scrolling findings or status messages.">{config.findings.map((item, i) => <div className="repeat-card" key={i}><div className="admin-grid two"><Field label="Category" value={item.category} onChange={v => update(c => c.findings[i].category = v)} /><Field label="Status text" value={item.statusText} onChange={v => update(c => c.findings[i].statusText = v)} /></div><Field label="Finding" value={item.finding} onChange={v => update(c => c.findings[i].finding = v)} /><label className="admin-field"><span>Status</span><select value={item.status} onChange={e => update(c => c.findings[i].status = e.target.value as 'ok' | 'warn' | 'critical')}><option value="ok">OK</option><option value="warn">Warning</option><option value="critical">Critical</option></select></label><DeleteButton onClick={() => update(c => c.findings.splice(i, 1))} /></div>)}<AddButton onClick={() => update(c => c.findings.push({ category: 'New', finding: 'New finding', status: 'ok', statusText: 'Ready' }))}>Add ticker item</AddButton></Panel>
}

function ReportEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  return <Panel title="Report preview" description="Edit the report heading and every metric displayed in the preview."><Field label="Title" value={config.report.title} onChange={v => update(c => c.report.title = v)} /><div className="admin-grid two"><Field label="Store / company" value={config.report.store} onChange={v => update(c => c.report.store = v)} /><Field label="Category" value={config.report.category} onChange={v => update(c => c.report.category = v)} /></div><h3 className="subheading">Metrics</h3>{config.report.metrics.map((m, i) => <div className="repeat-card" key={i}><div className="admin-grid two"><Field label="Value" value={m.value} onChange={v => update(c => c.report.metrics[i].value = v)} /><Field label="Label" value={m.label} onChange={v => update(c => c.report.metrics[i].label = v)} /></div><DeleteButton onClick={() => update(c => c.report.metrics.splice(i, 1))} /></div>)}<AddButton onClick={() => update(c => c.report.metrics.push({ value: '0', label: 'New metric' }))}>Add metric</AddButton></Panel>
}

function SegmentsEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  return <Panel title="Who it's for" description="Edit audience cards and their bullet points.">{config.segments.map((item, i) => <div className="repeat-card" key={i}><Field label="Title" value={item.title} onChange={v => update(c => c.segments[i].title = v)} /><Field label="Description" value={item.description} onChange={v => update(c => c.segments[i].description = v)} multiline /><Field label="Bullets (one per line)" value={item.bullets.join('\n')} onChange={v => update(c => c.segments[i].bullets = v.split('\n').filter(Boolean))} multiline /><DeleteButton onClick={() => update(c => c.segments.splice(i, 1))} /></div>)}<AddButton onClick={() => update(c => c.segments.push({ title: 'New audience', description: 'Describe this audience.', bullets: ['Benefit one', 'Benefit two'] }))}>Add audience</AddButton></Panel>
}

function BlocksEditor({ config, update, pickImage }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void; pickImage: (target: 'hero' | number) => void }) {
  return <Panel title="Content blocks" description="Create flexible text + image sections.">{config.blocks.map((item, i) => <div className="repeat-card" key={i}><Field label="Eyebrow" value={item.eyebrow} onChange={v => update(c => c.blocks[i].eyebrow = v)} /><Field label="Title" value={item.title} onChange={v => update(c => c.blocks[i].title = v)} /><Field label="Body" value={item.body} onChange={v => update(c => c.blocks[i].body = v)} multiline /><div className="admin-grid two"><label className="admin-field"><span>Layout</span><select value={item.layout} onChange={e => update(c => c.blocks[i].layout = e.target.value as 'left' | 'right' | 'none')}><option value="left">Image left</option><option value="right">Image right</option><option value="none">Text only</option></select></label><label className="admin-field"><span>Background</span><select value={item.background} onChange={e => update(c => c.blocks[i].background = e.target.value as 'white' | 'paper' | 'dark')}><option value="white">White</option><option value="paper">Paper</option><option value="dark">Dark</option></select></label></div><ImageEditor label={`Block ${i + 1} image`} value={item.image} onChange={v => update(c => c.blocks[i].image = v)} onUpload={() => pickImage(i)} /><DeleteButton onClick={() => update(c => c.blocks.splice(i, 1))} /></div>)}<AddButton onClick={() => update(c => c.blocks.push({ eyebrow: 'New section', title: 'New content block', body: 'Add your content here.', image: '', layout: 'right', background: 'white' }))}>Add content block</AddButton></Panel>
}

function EffectSelect({ value, onChange }: { value: EffectType; onChange: (value: EffectType) => void }) {
  return <label className="admin-field"><span>Effect</span><select value={value} onChange={e => onChange(e.target.value as EffectType)}>
    <option value="card effect">card effect</option><option value="rec_move_left">rec_move_left</option><option value="rec_move_2x">rec_move_2x</option><option value="circle_move_left">circle_move_left</option>
  </select></label>
}

function ArticleSectionEditor({ config, update, kind }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void; kind: 'articles' | 'news' }) {
  const section = config[kind]
  const effect = section.effect || (kind === 'articles' ? 'rec_move_2x' : 'rec_move_left')
  return <Panel title={kind === 'articles' ? 'Insights' : 'News'} description="Edit the section heading, effect and every article card.">
    <Field label="Heading" value={section.heading} onChange={v => update(c => c[kind].heading = v)} />
    <Field label="Subtitle" value={section.subtitle} onChange={v => update(c => c[kind].subtitle = v)} multiline />
    <EffectSelect value={effect} onChange={v => update(c => c[kind].effect = v)} />
    {section.items.map((item, i) => <div className="repeat-card" key={i}><Field label="Title" value={item.title} onChange={v => update(c => c[kind].items[i].title = v)} /><div className="admin-grid two"><Field label="Category" value={item.category} onChange={v => update(c => c[kind].items[i].category = v)} /><Field label="Date" value={item.date} onChange={v => update(c => c[kind].items[i].date = v)} /></div><Field label="Excerpt" value={item.excerpt} onChange={v => update(c => c[kind].items[i].excerpt = v)} multiline /><DeleteButton onClick={() => update(c => c[kind].items.splice(i, 1))} /></div>)}
    <AddButton onClick={() => update(c => c[kind].items.push({ title: 'New article', category: 'Update', excerpt: 'Add a short description.', date: 'Oct 2026' }))}>Add item</AddButton>
  </Panel>
}

function PeopleEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  const effect = config.people.effect || 'card effect'
  return <Panel title="Network" description="Control the Network heading, effect and every person, partner or expert card.">
    <Field label="Heading" value={config.people.heading} onChange={v => update(c => c.people.heading = v)} />
    <Field label="Subtitle" value={config.people.subtitle} onChange={v => update(c => c.people.subtitle = v)} multiline />
    <EffectSelect value={effect} onChange={v => update(c => c.people.effect = v)} />
    {config.people.items.map((item, i) => <div className="repeat-card" key={i}><div className="admin-grid two"><Field label="Name" value={item.name} onChange={v => update(c => c.people.items[i].name = v)} /><Field label="Role" value={item.role} onChange={v => update(c => c.people.items[i].role = v)} /></div><Field label="Region" value={item.region} onChange={v => update(c => c.people.items[i].region = v)} /><Field label="Bio" value={item.bio} onChange={v => update(c => c.people.items[i].bio = v)} multiline /><DeleteButton onClick={() => update(c => c.people.items.splice(i, 1))} /></div>)}
    <AddButton onClick={() => update(c => c.people.items.push({ name: 'New partner', role: 'Partner', region: 'Region', bio: 'Short biography.' }))}>Add network member</AddButton>
  </Panel>
}

function PhilosophyEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  const lines = config.philosophy.lines || []
  return <Panel title="The Shelvion Principle" description="Edit the principle heading, statement lines and supporting text.">
    <Field label="Eyebrow" value={config.philosophy.eyebrow || 'the shelvion principle'} onChange={v => update(c => c.philosophy.eyebrow = v)} />
    <Field label="Title" value={config.philosophy.title} onChange={v => update(c => c.philosophy.title = v)} />
    <h3 className="subheading">Principle lines</h3>
    {lines.map((line, i) => <div className="repeat-card" key={i}><Field label={`Line ${i + 1}`} value={line.text} onChange={v => update(c => c.philosophy.lines[i].text = v)} /><label className="admin-field inline-check"><input type="checkbox" checked={line.highlighted} onChange={e => update(c => c.philosophy.lines[i].highlighted = e.target.checked)} /><span>Highlight this line</span></label><DeleteButton onClick={() => update(c => c.philosophy.lines.splice(i, 1))} /></div>)}
    <AddButton onClick={() => update(c => c.philosophy.lines.push({ text: 'New principle line', highlighted: false }))}>Add principle line</AddButton>
    <Field label="Body" value={config.philosophy.body} onChange={v => update(c => c.philosophy.body = v)} multiline />
  </Panel>
}

function CtaEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  return <Panel title="Call to action" description="Edit the final conversion section."><Field label="Title" value={config.cta.title} onChange={v => update(c => c.cta.title = v)} /><Field label="Body" value={config.cta.body} onChange={v => update(c => c.cta.body = v)} multiline /><Field label="Button" value={config.cta.button} onChange={v => update(c => c.cta.button = v)} /></Panel>
}

function FooterEditor({ config, update }: { config: SiteConfig; update: (f: (c: SiteConfig) => void) => void }) {
  return <Panel title="Footer" description="Edit footer text."><Field label="Footer text" value={config.footer} onChange={v => update(c => c.footer = v)} multiline /></Panel>
}
