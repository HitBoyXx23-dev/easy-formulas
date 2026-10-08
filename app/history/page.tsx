'use client';import {useEffect,useState} from 'react';
type H={q:string;answer:string;date:number};
export default function Page(){
const [h,setH]=useState<H[]>([]);
useEffect(()=>{try{setH(JSON.parse(localStorage.getItem('fd-problems')||'[]'))}catch{}},[]);
function clear(){try{localStorage.removeItem('fd-problems')}catch{}setH([])}
return <><div className="hero"><h1 className="title">History</h1><p className="muted">Your recent word problems, saved only in this browser.</p></div>
<div className="row"><button className="btn" onClick={clear}>Clear history</button></div><br/>
<div className="stack">{h.map((x,i)=><div className="card" key={i} style={{padding:14}}><div className="muted">{new Date(x.date).toLocaleString()}</div><p>{x.q}</p><b style={{whiteSpace:'pre-line'}}>{x.answer}</b></div>)}</div>
{!h.length&&<div className="card muted">No solved problems yet. Try the word problem solver.</div>}</>}
