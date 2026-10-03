            onClick={() => setSelected(i)}
          >
            <span>{b.name}</span>
          </div>
        ))}
      </div>

      <div className="hero-calibration-values">
        <label>
          X
          <input
            type="number"
            step="0.1"
            value={brand.area.x}
            onChange={e => updateArea('x', Number(e.target.value))}
          />
        </label>

        <label>
          Y
          <input
            type="number"
            step="0.1"
            value={brand.area.y}
            onChange={e => updateArea('y', Number(e.target.value))}
          />
        </label>

        <label>
          Width
          <input
            type="number"
            step="0.1"
            value={brand.area.w}
            onChange={e => updateArea('w', Number(e.target.value))}
          />
        </label>

        <label>
          Height
          <input
            type="number"
            step="0.1"
            value={brand.area.h}
            onChange={e => updateArea('h', Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  )
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
