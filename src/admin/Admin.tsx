import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  CardShadow,
  CardStyle,
  EffectType,
  MenuPlacement,
  MenuVariant,
  SectionType,
  SiteConfig,
} from '../types/site'

type Props = {
  config: SiteConfig
  onChange: (config: SiteConfig) => void
  onPublic: () => void
}

type Tab = SectionType | 'site' | 'theme' | 'navigation'
type ImageTarget = 'hero' | 'logo' | number

export function Admin({ config, onChange, onPublic }: Props) {
  const [active, setActive] = useState<Tab>('site')
  const fileInput = useRef<HTMLInputElement>(null)
  const [imageTarget, setImageTarget] = useState<ImageTarget | null>(null)

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
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    })
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

  const pickImage = (target: ImageTarget) => {
    setImageTarget(target)
    fileInput.current?.click()
  }

  const onImageSelected = (file?: File) => {
    if (!file || imageTarget === null) return

    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result)

      update(draft => {
        if (imageTarget === 'hero') {
          draft.hero.image = value
        } else if (imageTarget === 'logo') {
          draft.brand.logo = value
        } else if (draft.blocks[imageTarget]) {
          draft.blocks[imageTarget].image = value
        }
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
        onChange={event => onImageSelected(event.target.files?.[0])}
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
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={event =>
                event.target.files?.[0] &&
                importConfig(event.target.files[0])
              }
            />
          </label>

          <button
            className="primary"
            onClick={() => {
              localStorage.setItem(
                'reusable-site-cms-config',
                JSON.stringify(config),
              )
              alert('Saved locally.')
            }}
          >
            Save
          </button>

          <button onClick={reset}>Reset</button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title">Site</div>
          <button
            className={active === 'site' ? 'selected' : ''}
            onClick={() => setActive('site')}
          >
            Brand
          </button>
          <button
            className={active === 'navigation' ? 'selected' : ''}
            onClick={() => setActive('navigation')}
          >
            Navigation
          </button>
          <button
            className={active === 'theme' ? 'selected' : ''}
            onClick={() => setActive('theme')}
          >
            Theme
          </button>

          <div className="admin-sidebar-title">Sections</div>
          {config.sections.map((section, index) => (
            <div
              className={`section-nav ${
                active === section.type ? 'selected' : ''
              }`}
              key={section.id}
            >
              <button
                className="section-nav-main"
                onClick={() => setActive(section.type)}
              >
                <span>{section.label}</span>
                <small>{section.enabled ? 'ON' : 'OFF'}</small>
              </button>

              <div className="section-nav-tools">
                <button
                  title="Move up"
                  disabled={index === 0}
                  onClick={() => moveSection(index, -1)}
                >
                  ↑
                </button>
                <button
                  title="Move down"
                  disabled={index === config.sections.length - 1}
                  onClick={() => moveSection(index, 1)}
                >
                  ↓
                </button>
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={event =>
                    update(draft => {
                      const current = draft.sections.find(
                        item => item.id === section.id,
                      )
                      if (current) {
                        current.enabled = event.target.checked
                      }
                    })
                  }
                />
              </div>
            </div>
          ))}
        </aside>

        <main className="admin-main">
          {active === 'site' && (
            <SiteEditor
              config={config}
              update={update}
              pickImage={pickImage}
            />
          )}
          {active === 'navigation' && (
            <NavigationEditor config={config} update={update} />
          )}
          {active === 'theme' && (
            <ThemeEditor config={config} update={update} />
          )}
          {active === 'hero' && (
            <HeroEditor
              config={config}
              update={update}
              pickImage={pickImage}
            />
          )}
          {active === 'stats' && (
            <StatsEditor config={config} update={update} />
          )}
          {active === 'steps' && (
            <StepsEditor config={config} update={update} />
          )}
          {active === 'ticker' && (
            <TickerEditor config={config} update={update} />
          )}
          {active === 'report' && (
            <ReportEditor config={config} update={update} />
          )}
          {active === 'segments' && (
            <SegmentsEditor config={config} update={update} />
          )}
          {active === 'blocks' && (
            <BlocksEditor
              config={config}
              update={update}
              pickImage={pickImage}
            />
          )}
          {active === 'articles' && (
            <ArticleSectionEditor
              config={config}
              update={update}
              kind="articles"
            />
          )}
          {active === 'news' && (
            <ArticleSectionEditor
              config={config}
              update={update}
              kind="news"
            />
          )}
          {active === 'people' && (
            <PeopleEditor config={config} update={update} />
          )}
          {active === 'philosophy' && (
            <PhilosophyEditor config={config} update={update} />
          )}
          {active === 'cta' && (
            <CtaEditor config={config} update={update} />
          )}
          {active === 'footer' && (
            <FooterEditor config={config} update={update} />
          )}
        </main>
      </div>
    </div>
  )
}

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  placeholder?: string
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={event => onChange(event.target.value)}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={event => onChange(event.target.value)}
        />
      )}
    </label>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const isHex = /^#[0-9A-Fa-f]{6}$/.test(value)

  return (
    <label className="color-field color-field-editable">
      <span>{label}</span>
      {isHex && (
        <input
          type="color"
          value={value}
          onChange={event => onChange(event.target.value)}
        />
      )}
      <input
        className="color-text-input"
        value={value}
        onChange={event => onChange(event.target.value)}
        spellCheck={false}
      />
    </label>
  )
}

function AddButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button className="add-button" onClick={onClick}>
      + {children}
    </button>
  )
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="delete-button" onClick={onClick}>
      Delete
    </button>
  )
}

function SectionAppearanceEditor({
  config,
  update,
  sectionType,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
  sectionType: SectionType
}) {
  const section = config.sections.find(
    item => item.type === sectionType,
  )

  if (!section) return null

  return (
    <div className="appearance-card">
      <div className="appearance-card-heading">
        <strong>Section appearance</strong>
        <span>Background and font color</span>
      </div>

      <div className="color-grid">
        <ColorField
          label="Background color"
          value={section.appearance.backgroundColor}
          onChange={value =>
            update(draft => {
              const current = draft.sections.find(
                item => item.type === sectionType,
              )
              if (current) {
                current.appearance.backgroundColor = value
              }
            })
          }
        />

        <ColorField
          label="Font color"
          value={section.appearance.fontColor}
          onChange={value =>
            update(draft => {
              const current = draft.sections.find(
                item => item.type === sectionType,
              )
              if (current) {
                current.appearance.fontColor = value
              }
            })
          }
        />
      </div>
    </div>
  )
}

function CardStyleEditor({
  title,
  value,
  onChange,
}: {
  title: string
  value: CardStyle
  onChange: (mutate: (style: CardStyle) => void) => void
}) {
  return (
    <div className="appearance-card">
      <div className="appearance-card-heading">
        <strong>{title}</strong>
        <span>Visual settings for all cards in this section</span>
      </div>

      <div className="color-grid">
        <ColorField
          label="Card background"
          value={value.backgroundColor}
          onChange={next => onChange(style => (style.backgroundColor = next))}
        />
        <ColorField
          label="Card font color"
          value={value.fontColor}
          onChange={next => onChange(style => (style.fontColor = next))}
        />
        <ColorField
          label="Border color"
          value={value.borderColor}
          onChange={next => onChange(style => (style.borderColor = next))}
        />
      </div>

      <div className="admin-grid two">
        <label className="admin-field">
          <span>Font size (px)</span>
          <input
            type="number"
            min="10"
            max="32"
            value={value.fontSize}
            onChange={event =>
              onChange(style => {
                style.fontSize = Number(event.target.value)
              })
            }
          />
        </label>

        <label className="admin-field">
          <span>Border width (px)</span>
          <input
            type="number"
            min="0"
            max="6"
            step="0.5"
            value={value.borderWidth}
            onChange={event =>
              onChange(style => {
                style.borderWidth = Number(event.target.value)
              })
            }
          />
        </label>

        <label className="admin-field">
          <span>Border radius (px)</span>
          <input
            type="number"
            min="0"
            max="40"
            value={value.borderRadius}
            onChange={event =>
              onChange(style => {
                style.borderRadius = Number(event.target.value)
              })
            }
          />
        </label>

        <label className="admin-field">
          <span>Padding (px)</span>
          <input
            type="number"
            min="8"
            max="60"
            value={value.padding}
            onChange={event =>
              onChange(style => {
                style.padding = Number(event.target.value)
              })
            }
          />
        </label>

        <label className="admin-field">
          <span>Shadow</span>
          <select
            value={value.shadow}
            onChange={event =>
              onChange(style => {
                style.shadow = event.target.value as CardShadow
              })
            }
          >
            <option value="none">None</option>
            <option value="soft">Soft</option>
            <option value="strong">Strong</option>
          </select>
        </label>
      </div>
    </div>
  )
}

function SiteEditor({
  config,
  update,
  pickImage,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
  pickImage: (target: ImageTarget) => void
}) {
  return (
    <Panel
      title="Brand & site identity"
      description="Control the main identity used throughout the website."
    >
      <div className="admin-grid two">
        <Field
          label="Brand name"
          value={config.brand.name}
          onChange={value => update(c => (c.brand.name = value))}
        />
        <Field
          label="Tagline"
          value={config.brand.tagline}
          onChange={value => update(c => (c.brand.tagline = value))}
        />
      </div>

      <ImageEditor
        label="Brand logo"
        value={config.brand.logo}
        onChange={value => update(c => (c.brand.logo = value))}
        onUpload={() => pickImage('logo')}
      />
    </Panel>
  )
}

function NavigationEditor({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  return (
    <Panel
      title="Header & menu items"
      description="Choose which sections appear in the header and how they look. All visible entries are called menu-items."
    >
      <h3 className="subheading">Section menu-items</h3>

      {config.sections.map(section => (
        <div className="repeat-card" key={section.id}>
          <div className="menu-item-admin-header">
            <strong>{section.label}</strong>
            <label className="inline-check">
              <input
                type="checkbox"
                checked={section.menu.enabled}
                onChange={event =>
                  update(draft => {
                    const current = draft.sections.find(
                      item => item.id === section.id,
                    )
                    if (current) {
                      current.menu.enabled = event.target.checked
                    }
                  })
                }
              />
              Show as menu-item
            </label>
          </div>

          <div className="admin-grid two">
            <Field
              label="Menu label"
              value={section.menu.label}
              onChange={value =>
                update(draft => {
                  const current = draft.sections.find(
                    item => item.id === section.id,
                  )
                  if (current) current.menu.label = value
                })
              }
            />

            <label className="admin-field">
              <span>Position</span>
              <select
                value={section.menu.placement}
                onChange={event =>
                  update(draft => {
                    const current = draft.sections.find(
                      item => item.id === section.id,
                    )
                    if (current) {
                      current.menu.placement = event.target.value as MenuPlacement
                    }
                  })
                }
              >
                <option value="normal">Normal</option>
                <option value="bottom">Bottom row</option>
              </select>
            </label>

            <label className="admin-field">
              <span>Menu item type</span>
              <select
                value={section.menu.variant}
                onChange={event =>
                  update(draft => {
                    const current = draft.sections.find(
                      item => item.id === section.id,
                    )
                    if (current) {
                      current.menu.variant = event.target.value as MenuVariant
                    }
                  })
                }
              >
                <option value="link">Normal link</option>
                <option value="button">Button</option>
              </select>
            </label>
          </div>
        </div>
      ))}

      <h3 className="subheading">Login / Sign up</h3>

      <div className="repeat-card">
        <label className="admin-field inline-check">
          <input
            type="checkbox"
            checked={config.header.login.enabled}
            onChange={event =>
              update(c => {
                c.header.login.enabled = event.target.checked
              })
            }
          />
          Show Login / Sign up
        </label>

        <div className="admin-grid two">
          <Field
            label="Label"
            value={config.header.login.label}
            onChange={value =>
              update(c => (c.header.login.label = value))
            }
          />
          <Field
            label="Link"
            value={config.header.login.href}
            onChange={value =>
              update(c => (c.header.login.href = value))
            }
          />
          <label className="admin-field">
            <span>Type</span>
            <select
              value={config.header.login.variant}
              onChange={event =>
                update(c => {
                  c.header.login.variant = event.target.value as MenuVariant
                })
              }
            >
              <option value="link">Normal link</option>
              <option value="button">Button</option>
            </select>
          </label>
        </div>
      </div>

      <h3 className="subheading">Language selector</h3>

      <div className="repeat-card">
        <label className="admin-field inline-check">
          <input
            type="checkbox"
            checked={config.header.language.enabled}
            onChange={event =>
              update(c => {
                c.header.language.enabled = event.target.checked
              })
            }
          />
          Show language selector
        </label>

        <Field
          label="Languages (comma separated)"
          value={config.header.language.options.join(', ')}
          onChange={value =>
            update(c => {
              c.header.language.options = value
                .split(',')
                .map(item => item.trim())
                .filter(Boolean)

              if (
                !c.header.language.options.includes(
                  c.header.language.defaultLanguage,
                )
              ) {
                c.header.language.defaultLanguage =
                  c.header.language.options[0] || 'EN'
              }
            })
          }
        />

        <label className="admin-field">
          <span>Default language</span>
          <select
            value={config.header.language.defaultLanguage}
            onChange={event =>
              update(c => {
                c.header.language.defaultLanguage = event.target.value
              })
            }
          >
            {config.header.language.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </Panel>
  )
}

function ThemeEditor({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  const colors: Array<
    [keyof SiteConfig['theme'], string]
  > = [
    ['primary', 'Primary'],
    ['secondary', 'Secondary'],
    ['ink', 'Text'],
    ['paper', 'Paper'],
    ['grey', 'Grey'],
    ['accent', 'Accent'],
    ['dark', 'Dark'],
  ]

  return (
    <Panel
      title="Theme"
      description="Change the global visual color system. Individual section colors can be overridden in each section editor."
    >
      <div className="color-grid">
        {colors.map(([key, label]) => (
          <ColorField
            label={label}
            value={config.theme[key]}
            onChange={value =>
              update(c => {
                c.theme[key] = value
              })
            }
            key={key}
          />
        ))}
      </div>
    </Panel>
  )
}

function HeroEditor({
  config,
  update,
  pickImage,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
  pickImage: (target: ImageTarget) => void
}) {
  return (
    <Panel
      title="Hero"
      description="Control the first screen visitors see, including image, text position, text style and calibration."
    >
      <SectionAppearanceEditor
        config={config}
        update={update}
        sectionType="hero"
      />

      <Field
        label="Eyebrow"
        value={config.hero.eyebrow}
        onChange={value => update(c => (c.hero.eyebrow = value))}
      />

      <Field
        label="Title"
        value={config.hero.title}
        onChange={value => update(c => (c.hero.title = value))}
        multiline
      />

      <Field
        label="Subtitle"
        value={config.hero.subtitle}
        onChange={value => update(c => (c.hero.subtitle = value))}
        multiline
      />

      <div className="admin-grid two">
        <Field
          label="Primary button"
          value={config.hero.primaryCta}
          onChange={value =>
            update(c => (c.hero.primaryCta = value))
          }
        />
        <Field
          label="Secondary button"
          value={config.hero.secondaryCta}
          onChange={value =>
            update(c => (c.hero.secondaryCta = value))
          }
        />
      </div>

      <ImageEditor
        label="Hero image"
        value={config.hero.image}
        onChange={value => update(c => (c.hero.image = value))}
        onUpload={() => pickImage('hero')}
      />

      <label className="admin-field">
        <span>Hero image width (%)</span>
        <input
          type="range"
          min="25"
          max="100"
          step="1"
          value={config.hero.imageSize ?? 48}
          onChange={event =>
            update(c => {
              c.hero.imageSize = Number(event.target.value)
            })
          }
        />
        <div className="range-value-row">
          <small>25%</small>
          <strong>{config.hero.imageSize ?? 48}%</strong>
          <small>100%</small>
        </div>
      </label>

      <div className="admin-grid two">
        <label className="admin-field">
          <span>Hero title size (px)</span>
          <input
            type="range"
            min="48"
            max="120"
            step="1"
            value={config.hero.titleSize ?? 100}
            onChange={event =>
              update(c => {
                c.hero.titleSize = Number(event.target.value)
              })
            }
          />
          <div className="range-value-row">
            <small>48</small>
            <strong>{config.hero.titleSize ?? 100}px</strong>
            <small>120</small>
          </div>
        </label>

        <label className="admin-field">
          <span>Hero text vertical position (Y)</span>
          <input
            type="range"
            min="10"
            max="90"
            step="1"
            value={config.hero.textY ?? 50}
            onChange={event =>
              update(c => {
                c.hero.textY = Number(event.target.value)
              })
            }
          />
          <div className="range-value-row">
            <small>10%</small>
            <strong>{config.hero.textY ?? 50}%</strong>
            <small>90%</small>
          </div>
        </label>
      </div>

      <ColorField
        label="Hero text color"
        value={config.hero.textColor ?? '#FFFFFF'}
        onChange={value =>
          update(c => {
            c.hero.textColor = value
          })
        }
      />

      <HeroCalibration config={config} update={update} />
    </Panel>
  )
}

function HeroCalibration({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  const [selected, setSelected] = useState(0)
  const [showGrid, setShowGrid] = useState(true)
  const brand = config.hero.calibration?.[selected]

  if (!brand) {
    return (
      <div className="hero-calibration">
        <p>No Hero calibration data available.</p>
      </div>
    )
  }

  const updateArea = (
    key: 'x' | 'y' | 'w' | 'h',
    value: number,
  ) => {
    update(draft => {
      const selectedBrand = draft.hero.calibration?.[selected]
      if (selectedBrand) {
        selectedBrand.area[key] = value
      }
    })
  }

  return (
    <div className="hero-calibration">
      <div className="hero-calibration-heading">
        <strong>Hero Calibration</strong>
        <span>Align brand detection boxes with the actual shelf image.</span>
      </div>

      <div className="hero-calibration-toolbar">
        <label className="inline-check">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={event => setShowGrid(event.target.checked)}
          />
          Show grid
        </label>

        <select
          value={selected}
          onChange={event => setSelected(Number(event.target.value))}
        >
          {config.hero.calibration.map((item, index) => (
            <option key={`${item.name}-${index}`} value={index}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="hero-calibration-preview">
        <img src={config.hero.image} alt="Hero calibration preview" />

        {showGrid && <div className="hero-calibration-grid" />}

        {config.hero.calibration.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className={`hero-calibration-box ${
              index === selected ? 'selected' : ''
            }`}
            style={{
              left: `${item.area.x}%`,
              top: `${item.area.y}%`,
              width: `${item.area.w}%`,
              height: `${item.area.h}%`,
              borderColor: item.color,
            }}
            onClick={() => setSelected(index)}
          >
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      <div className="hero-calibration-values">
        {(['x', 'y', 'w', 'h'] as const).map(key => (
          <label key={key}>
            {key === 'w' ? 'Width' : key === 'h' ? 'Height' : key.toUpperCase()}
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={brand.area[key]}
              onChange={event =>
                updateArea(key, Number(event.target.value))
              }
            />
          </label>
        ))}
      </div>
    </div>
  )
}

function ImageEditor({
  label,
  value,
  onChange,
  onUpload,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onUpload: () => void
}) {
  return (
    <div className="image-editor">
      <div className="image-editor-head">
        <span>{label}</span>
        <button onClick={onUpload}>Upload image</button>
      </div>

      <Field
        label="Image URL"
        value={value}
        onChange={onChange}
        placeholder="https://... or uploaded image"
      />

      {value && (
        <img
          className="admin-image-preview"
          src={value}
          alt="Preview"
        />
      )}
    </div>
  )
}

function StatsEditor({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  return (
    <Panel title="Stats strip" description="Edit every statistic shown on the page.">
      <SectionAppearanceEditor config={config} update={update} sectionType="stats" />
      {config.stats.map((item, index) => (
        <div className="repeat-card" key={index}>
          <div className="admin-grid two">
            <Field label="Value" value={item.value} onChange={v => update(c => (c.stats[index].value = v))} />
            <Field label="Label" value={item.label} onChange={v => update(c => (c.stats[index].label = v))} />
          </div>
          <DeleteButton onClick={() => update(c => c.stats.splice(index, 1))} />
        </div>
      ))}
      <AddButton onClick={() => update(c => c.stats.push({ value: '00', label: 'New stat' }))}>Add statistic</AddButton>
    </Panel>
  )
}

function StepsEditor({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  return (
    <Panel title="How it works" description="Edit the steps, titles, descriptions and icons.">
      <SectionAppearanceEditor config={config} update={update} sectionType="steps" />
      {config.steps.map((item, index) => (
        <div className="repeat-card" key={index}>
          <Field label="Icon / number" value={item.icon} onChange={v => update(c => (c.steps[index].icon = v))} />
          <Field label="Title" value={item.title} onChange={v => update(c => (c.steps[index].title = v))} />
          <Field label="Description" value={item.body} onChange={v => update(c => (c.steps[index].body = v))} multiline />
          <DeleteButton onClick={() => update(c => c.steps.splice(index, 1))} />
        </div>
      ))}
      <AddButton onClick={() => update(c => c.steps.push({ icon: String(c.steps.length + 1).padStart(2, '0'), title: 'New step', body: 'Describe this step.' }))}>Add step</AddButton>
    </Panel>
  )
}

function TickerEditor({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  return (
    <Panel title="Ticker / findings" description="Control the scrolling findings or status messages.">
      <SectionAppearanceEditor config={config} update={update} sectionType="ticker" />
      {config.findings.map((item, index) => (
        <div className="repeat-card" key={index}>
          <div className="admin-grid two">
            <Field label="Category" value={item.category} onChange={v => update(c => (c.findings[index].category = v))} />
            <Field label="Status text" value={item.statusText} onChange={v => update(c => (c.findings[index].statusText = v))} />
          </div>
          <Field label="Finding" value={item.finding} onChange={v => update(c => (c.findings[index].finding = v))} />
          <label className="admin-field">
            <span>Status</span>
            <select value={item.status} onChange={event => update(c => (c.findings[index].status = event.target.value as 'ok' | 'warn' | 'critical'))}>
              <option value="ok">OK</option>
              <option value="warn">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </label>
          <DeleteButton onClick={() => update(c => c.findings.splice(index, 1))} />
        </div>
      ))}
      <AddButton onClick={() => update(c => c.findings.push({ category: 'New', finding: 'New finding', status: 'ok', statusText: 'Ready' }))}>Add ticker item</AddButton>
    </Panel>
  )
}

function ReportEditor({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  return (
    <Panel title="Report preview" description="Edit the report heading and every metric displayed in the preview.">
      <SectionAppearanceEditor config={config} update={update} sectionType="report" />
      <Field label="Title" value={config.report.title} onChange={v => update(c => (c.report.title = v))} />
      <div className="admin-grid two">
        <Field label="Store / company" value={config.report.store} onChange={v => update(c => (c.report.store = v))} />
        <Field label="Category" value={config.report.category} onChange={v => update(c => (c.report.category = v))} />
      </div>
      <h3 className="subheading">Metrics</h3>
      {config.report.metrics.map((metric, index) => (
        <div className="repeat-card" key={index}>
          <div className="admin-grid two">
            <Field label="Value" value={metric.value} onChange={v => update(c => (c.report.metrics[index].value = v))} />
            <Field label="Label" value={metric.label} onChange={v => update(c => (c.report.metrics[index].label = v))} />
          </div>
          <DeleteButton onClick={() => update(c => c.report.metrics.splice(index, 1))} />
        </div>
      ))}
      <AddButton onClick={() => update(c => c.report.metrics.push({ value: '0', label: 'New metric' }))}>Add metric</AddButton>
    </Panel>
  )
}

function SegmentsEditor({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  return (
    <Panel title="Who it's for" description="Edit audience cards and their bullet points.">
      <SectionAppearanceEditor config={config} update={update} sectionType="segments" />
      {config.segments.map((item, index) => (
        <div className="repeat-card" key={index}>
          <Field label="Title" value={item.title} onChange={v => update(c => (c.segments[index].title = v))} />
          <Field label="Description" value={item.description} onChange={v => update(c => (c.segments[index].description = v))} multiline />
          <Field label="Bullets (one per line)" value={item.bullets.join('\n')} onChange={v => update(c => (c.segments[index].bullets = v.split('\n').filter(Boolean)))} multiline />
          <DeleteButton onClick={() => update(c => c.segments.splice(index, 1))} />
        </div>
      ))}
      <AddButton onClick={() => update(c => c.segments.push({ title: 'New audience', description: 'Describe this audience.', bullets: ['Benefit one', 'Benefit two'] }))}>Add audience</AddButton>
    </Panel>
  )
}

function BlocksEditor({
  config,
  update,
  pickImage,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
  pickImage: (target: ImageTarget) => void
}) {
  return (
    <Panel title="Content blocks" description="Create flexible text + image sections.">
      <SectionAppearanceEditor config={config} update={update} sectionType="blocks" />
      {config.blocks.map((item, index) => (
        <div className="repeat-card" key={index}>
          <Field label="Eyebrow" value={item.eyebrow} onChange={v => update(c => (c.blocks[index].eyebrow = v))} />
          <Field label="Title" value={item.title} onChange={v => update(c => (c.blocks[index].title = v))} />
          <Field label="Body" value={item.body} onChange={v => update(c => (c.blocks[index].body = v))} multiline />
          <div className="admin-grid two">
            <label className="admin-field">
              <span>Layout</span>
              <select value={item.layout} onChange={event => update(c => (c.blocks[index].layout = event.target.value as 'left' | 'right' | 'none'))}>
                <option value="left">Image left</option>
                <option value="right">Image right</option>
                <option value="none">Text only</option>
              </select>
            </label>
            <label className="admin-field">
              <span>Background preset</span>
              <select value={item.background} onChange={event => update(c => (c.blocks[index].background = event.target.value as 'white' | 'paper' | 'dark'))}>
                <option value="white">White</option>
                <option value="paper">Paper</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>
          <ImageEditor label={`Block ${index + 1} image`} value={item.image} onChange={v => update(c => (c.blocks[index].image = v))} onUpload={() => pickImage(index)} />
          <DeleteButton onClick={() => update(c => c.blocks.splice(index, 1))} />
        </div>
      ))}
      <AddButton onClick={() => update(c => c.blocks.push({ eyebrow: 'New section', title: 'New content block', body: 'Add your content here.', image: '', layout: 'right', background: 'white' }))}>Add content block</AddButton>
    </Panel>
  )
}

function EffectSelect({
  value,
  onChange,
}: {
  value: EffectType
  onChange: (value: EffectType) => void
}) {
  return (
    <label className="admin-field">
      <span>Effect</span>
      <select value={value} onChange={event => onChange(event.target.value as EffectType)}>
        <option value="card effect">card effect</option>
        <option value="rec_move_left">rec_move_left</option>
        <option value="rec_move_2x">rec_move_2x</option>
        <option value="circle_move_left">circle_move_left</option>
      </select>
    </label>
  )
}

function ArticleSectionEditor({
  config,
  update,
  kind,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
  kind: 'articles' | 'news'
}) {
  const section = config[kind]
  const effect = section.effect || (kind === 'articles' ? 'rec_move_2x' : 'rec_move_left')

  return (
    <Panel title={kind === 'articles' ? 'Insights' : 'News'} description="Edit the section, effect and card visuals.">
      <SectionAppearanceEditor config={config} update={update} sectionType={kind} />
      <Field label="Heading" value={section.heading} onChange={v => update(c => (c[kind].heading = v))} />
      <Field label="Subtitle" value={section.subtitle} onChange={v => update(c => (c[kind].subtitle = v))} multiline />
      <EffectSelect value={effect} onChange={v => update(c => (c[kind].effect = v))} />

      <CardStyleEditor
        title={`${kind === 'articles' ? 'Insights' : 'News'} card style`}
        value={section.cardStyle}
        onChange={mutate => update(c => mutate(c[kind].cardStyle))}
      />

      {section.items.map((item, index) => (
        <div className="repeat-card" key={index}>
          <Field label="Title" value={item.title} onChange={v => update(c => (c[kind].items[index].title = v))} />
          <div className="admin-grid two">
            <Field label="Category" value={item.category} onChange={v => update(c => (c[kind].items[index].category = v))} />
            <Field label="Date" value={item.date} onChange={v => update(c => (c[kind].items[index].date = v))} />
          </div>
          <Field label="Excerpt" value={item.excerpt} onChange={v => update(c => (c[kind].items[index].excerpt = v))} multiline />
          <DeleteButton onClick={() => update(c => c[kind].items.splice(index, 1))} />
        </div>
      ))}

      <AddButton onClick={() => update(c => c[kind].items.push({ title: 'New article', category: 'Update', excerpt: 'Add a short description.', date: 'Oct 2026' }))}>Add item</AddButton>
    </Panel>
  )
}

function PeopleEditor({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  const effect = config.people.effect || 'card effect'

  return (
    <Panel title="Network" description="Control the Network section, effect, card visuals and appearance.">
      <SectionAppearanceEditor config={config} update={update} sectionType="people" />
      <Field label="Heading" value={config.people.heading} onChange={v => update(c => (c.people.heading = v))} />
      <Field label="Subtitle" value={config.people.subtitle} onChange={v => update(c => (c.people.subtitle = v))} multiline />
      <EffectSelect value={effect} onChange={v => update(c => (c.people.effect = v))} />
      <CardStyleEditor
        title="Network card style"
        value={config.people.cardStyle}
        onChange={mutate => update(c => mutate(c.people.cardStyle))}
      />

      {config.people.items.map((item, index) => (
        <div className="repeat-card" key={index}>
          <div className="admin-grid two">
            <Field label="Name" value={item.name} onChange={v => update(c => (c.people.items[index].name = v))} />
            <Field label="Role" value={item.role} onChange={v => update(c => (c.people.items[index].role = v))} />
          </div>
          <Field label="Region" value={item.region} onChange={v => update(c => (c.people.items[index].region = v))} />
          <Field label="Bio" value={item.bio} onChange={v => update(c => (c.people.items[index].bio = v))} multiline />
          <DeleteButton onClick={() => update(c => c.people.items.splice(index, 1))} />
        </div>
      ))}

      <AddButton onClick={() => update(c => c.people.items.push({ name: 'New partner', role: 'Partner', region: 'Region', bio: 'Short biography.' }))}>Add network member</AddButton>
    </Panel>
  )
}

function PhilosophyEditor({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  const lines = config.philosophy.lines || []

  return (
    <Panel title="The Shelvion Principle" description="Edit the principle heading, statement lines and supporting text.">
      <SectionAppearanceEditor config={config} update={update} sectionType="philosophy" />
      <Field label="Eyebrow" value={config.philosophy.eyebrow || 'the shelvion principle'} onChange={v => update(c => (c.philosophy.eyebrow = v))} />
      <Field label="Title" value={config.philosophy.title} onChange={v => update(c => (c.philosophy.title = v))} />

      <h3 className="subheading">Principle lines</h3>
      {lines.map((line, index) => (
        <div className="repeat-card" key={index}>
          <Field label={`Line ${index + 1}`} value={line.text} onChange={v => update(c => (c.philosophy.lines[index].text = v))} />
          <label className="admin-field inline-check">
            <input type="checkbox" checked={line.highlighted} onChange={event => update(c => (c.philosophy.lines[index].highlighted = event.target.checked))} />
            <span>Highlight this line</span>
          </label>
          <DeleteButton onClick={() => update(c => c.philosophy.lines.splice(index, 1))} />
        </div>
      ))}
      <AddButton onClick={() => update(c => c.philosophy.lines.push({ text: 'New principle line', highlighted: false }))}>Add principle line</AddButton>
      <Field label="Body" value={config.philosophy.body} onChange={v => update(c => (c.philosophy.body = v))} multiline />
    </Panel>
  )
}

function CtaEditor({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  return (
    <Panel title="Call to action" description="Edit the final conversion section.">
      <SectionAppearanceEditor config={config} update={update} sectionType="cta" />
      <Field label="Title" value={config.cta.title} onChange={v => update(c => (c.cta.title = v))} />
      <Field label="Body" value={config.cta.body} onChange={v => update(c => (c.cta.body = v))} multiline />
      <Field label="Button" value={config.cta.button} onChange={v => update(c => (c.cta.button = v))} />
    </Panel>
  )
}

function FooterEditor({
  config,
  update,
}: {
  config: SiteConfig
  update: (f: (c: SiteConfig) => void) => void
}) {
  return (
    <Panel title="Footer" description="Edit footer text and appearance.">
      <SectionAppearanceEditor config={config} update={update} sectionType="footer" />
      <Field label="Footer text" value={config.footer} onChange={v => update(c => (c.footer = v))} multiline />
    </Panel>
  )
}
