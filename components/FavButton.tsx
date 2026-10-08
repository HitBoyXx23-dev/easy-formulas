'use client';
import {useEffect,useState} from 'react';
export default function FavButton({id}:{id:string}){
const [on,setOn]=useState(false);
useEffect(()=>{try{setOn((JSON.parse(localStorage.getItem('fd-favs')||'[]') as string[]).includes(id))}catch{}},[id]);
function toggle(){try{const a:string[]=JSON.parse(localStorage.getItem('fd-favs')||'[]');const n=a.includes(id)?a.filter(x=>x!==id):[...a,id];localStorage.setItem('fd-favs',JSON.stringify(n));setOn(n.includes(id))}catch{}}
return <button className="btn" onClick={toggle}>{on?'★ Saved to favorites':'☆ Save to favorites'}</button>}
