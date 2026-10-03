import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'

type Product = {
  variant: string
  x: number
  y: number
  w: number
  h: number
}

type Brand = {
  name: string
  facing: number
  color: string
  area: { x: number; y: number; w: number; h: number }
  products: Product[]
}

const BRANDS: Brand[] = [
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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function HeroShelfAudit({ image }: { image: string }) {
  const [brandIndex, setBrandIndex] = useState(0)
  const [stage, setStage] = useState<'scanning' | 'brand' | 'complete'>('scanning')
  const [productIndex, setProductIndex] = useState(-1)
  const [brandText, setBrandText] = useState('')
  const [productText, setProductText] = useState('')

  const brand = BRANDS[brandIndex]
  const product = brand.products[productIndex]

  const spotStyle = useMemo<CSSProperties>(() => ({
    '--spot-x': `${brand.area.x}%`,
    '--spot-y': `${brand.area.y}%`,
    '--spot-r': `${100 - brand.area.x - brand.area.w}%`,
    '--spot-b': `${100 - brand.area.y - brand.area.h}%`,
  } as CSSProperties), [brand])

  useEffect(() => {
    let cancelled = false

  const typeLines = async (
    lines: string[],
    setter: (value: string) => void,
    speed: number
  ) => {
    let completed = ''
  
    for (const line of lines) {
      for (let i = 1; i <= line.length; i += 1) {
        if (cancelled) return
  
        setter(`${completed}${line.slice(0, i)}`)
        await sleep(speed)
      }
  
      completed += `${line}\n`
    }
  
    setter(completed.trimEnd())
  }

    const run = async () => {
      setStage('scanning')
      setProductIndex(-1)
      setBrandText('')
      setProductText('')
      await sleep(1900)
      if (cancelled) return

      setStage('brand')
      await Promise.all([
        typeLines([`Brand: ${brand.name}`, `Facing(s): ${brand.facing}`], setBrandText, 28),
        sleep(1300),
      ])
      if (cancelled) return

      for (let i = 0; i < brand.products.length; i += 1) {
        if (cancelled) return
        setProductIndex(i)
        setProductText('')
        await typeLines(
          [`Brand: ${brand.name}`, `Name/Variant: ${brand.products[i].variant}`, 'Facing(s): 1'],
          setProductText,
          22,
        )
        await sleep(1120)
        setProductIndex(-1)
        setProductText('')
        await sleep(140)
      }

      if (cancelled) return
      setStage('scanning')
      await sleep(760)
      if (cancelled) return
      const next = (brandIndex + 1) % BRANDS.length

      if (next === 0) {
        setStage('complete')
        await sleep(1900)
        if (cancelled) return
        setStage('scanning')
        await sleep(360)
      }

      if (cancelled) return
      setBrandIndex(next)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [brandIndex])

  return (
    <div className="hero-audit-wrap">
      <div
        className={`hero-audit-frame ${stage === 'scanning' ? 'scanning' : ''}`}
        style={{ '--brand-color': brand.color, ...spotStyle } as CSSProperties}
      >
        <img className="hero-audit-img" src={image} alt="" />
        <div className="hero-audit-dim" />
        <div className="hero-audit-spotlight"><img src={image} alt="" /></div>

        <div className="hero-audit-scan" />
        <div className="hero-audit-status">
          {stage === 'scanning' ? 'SCANNING SHELF...' : stage === 'complete' ? 'AUDIT COMPLETE' : 'ANALYSING PRODUCTS...'}
        </div>

        <div
          className={`hero-audit-box ${stage === 'brand' ? 'active' : ''}`}
          style={{ left: `${brand.area.x}%`, top: `${brand.area.y}%`, width: `${brand.area.w}%`, height: `${brand.area.h}%` }}
        >
          <span className="corner-tr" />
          <span className="corner-bl" />
        </div>

        <div className={`hero-audit-brand-card ${stage === 'brand' ? 'show' : ''}`}>
          <div className="hero-audit-card-label">Detected brand</div>
          <div className="hero-audit-card-value">{brandText || `Brand: ${brand.name}`}</div>
        </div>

        {product && stage === 'brand' && (
          <>
            <div
              className="hero-audit-product-marker show"
              style={{ left: `${product.x}%`, top: `${product.y}%`, width: `${product.w}%`, height: `${product.h}%` }}
            />
            <div
              className="hero-audit-product-card show"
              style={{ left: `${Math.min(64, Math.max(2, product.x + product.w + 1))}%`, top: `${Math.min(76, Math.max(5, product.y - 2))}%` }}
            >
              {productText.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          </>
        )}

        <div className={`hero-audit-complete ${stage === 'complete' ? 'show' : ''}`}>
          <div className="title">AUDIT COMPLETE</div>
          <div className="line">Brands detected: 3</div>
          <div className="line">Facings detected: 15</div>
          <div className="ok">Structured result ready</div>
        </div>
      </div>
    </div>
  )
}
