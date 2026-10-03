export type SectionType = 'hero'|'stats'|'steps'|'ticker'|'report'|'segments'|'blocks'|'articles'|'news'|'people'|'philosophy'|'cta'|'footer';
export interface Section { id:string; type:SectionType; label:string; enabled:boolean; }
export interface Stat { value:string; label:string }
export interface Step { title:string; body:string; icon:string }
export interface Finding { category:string; finding:string; status:'ok'|'warn'|'critical'; statusText:string }
export interface Segment { title:string; description:string; bullets:string[] }
export interface ContentBlock { title:string; eyebrow:string; body:string; image:string; layout:'left'|'right'|'none'; background:'white'|'paper'|'dark' }
export interface Article { title:string; category:string; excerpt:string; date:string }
export interface Person { name:string; role:string; region:string; bio:string }
export interface SiteConfig {
  brand:{name:string; tagline:string};
  theme:{primary:string; secondary:string; ink:string; paper:string; grey:string; accent:string; dark:string};
  nav:{label:string; href:string}[];
  sections:Section[];
  hero:{eyebrow:string; title:string; subtitle:string; primaryCta:string; secondaryCta:string; image:string};
  stats:Stat[]; steps:Step[]; findings:Finding[]; report:{title:string; store:string; category:string; metrics:{label:string;value:string}[]};
  segments:Segment[]; blocks:ContentBlock[]; articles:{heading:string; subtitle:string; items:Article[]}; news:{heading:string; subtitle:string; items:Article[]};
  people:{heading:string; subtitle:string; items:Person[]}; philosophy:{title:string; body:string}; cta:{title:string; body:string; button:string}; footer:string;
}
