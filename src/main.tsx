import React,{useEffect,useState} from 'react';import{createRoot}from'react-dom/client';import'./styles.css';
import{defaultConfig}from'./data/defaultConfig';import type{SiteConfig}from'./types/site';
import{PublicSite}from'./components/PublicSite';import{Admin}from'./admin/Admin';
const KEY='reusable-site-cms-config';
function App(){const[config,setConfig]=useState<SiteConfig>(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||defaultConfig}catch{return defaultConfig}});const[admin,setAdmin]=useState(location.hash==='#admin');useEffect(()=>{const f=()=>setAdmin(location.hash==='#admin');addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);const save=(c:SiteConfig)=>{setConfig(c);localStorage.setItem(KEY,JSON.stringify(c))};return admin?<Admin config={config} onChange={save} onPublic={()=>location.hash=''}/>:<PublicSite config={config} onAdmin={()=>location.hash='admin'}/>}
createRoot(document.getElementById('root')!).render(<App/>);
