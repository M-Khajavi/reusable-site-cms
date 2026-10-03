import React,{useEffect,useState} from 'react';import{createRoot}from'react-dom/client';import'./styles.css';
import{defaultConfig}from'./data/defaultConfig';import type{SiteConfig}from'./types/site';import{PublicSite}from'./components/PublicSite';import{Admin}from'./admin/Admin';
const KEY='reusable-site-cms-config';
function hydrate(raw:Partial<SiteConfig>|null):SiteConfig{
  if(!raw)return defaultConfig;
  return {
    ...defaultConfig,
    ...raw,
    brand:{...defaultConfig.brand,...(raw.brand||{})},
    theme:{...defaultConfig.theme,...(raw.theme||{})},
    hero:{...defaultConfig.hero,...(raw.hero||{})},
    articles:{...defaultConfig.articles,...(raw.articles||{})},
    news:{...defaultConfig.news,...(raw.news||{})},
    people:{...defaultConfig.people,...(raw.people||{})},
    philosophy:{...defaultConfig.philosophy,...(raw.philosophy||{})},
    sections:defaultConfig.sections.map(s=>({...s,...((raw.sections||[]).find(x=>x.id===s.id)||{})}))
  };
}
function App(){const[config,setConfig]=useState<SiteConfig>(()=>{try{return hydrate(JSON.parse(localStorage.getItem(KEY)||'null'))}catch{return defaultConfig}});const[admin,setAdmin]=useState(location.hash==='#admin');useEffect(()=>{const f=()=>setAdmin(location.hash==='#admin');addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);const save=(c:SiteConfig)=>{const next=hydrate(c);setConfig(next);localStorage.setItem(KEY,JSON.stringify(next))};return admin?<Admin config={config} onChange={save} onPublic={()=>location.hash=''}/>:<PublicSite config={config} onAdmin={()=>location.hash='admin'}/>;}
createRoot(document.getElementById('root')!).render(<App/>);
