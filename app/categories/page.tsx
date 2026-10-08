import Link from 'next/link';import {formulas} from '@/data/formulas';import {slugify} from '@/lib/slug';
export const metadata={title:'Categories | Formula Desk'};
export default function Page(){
const groups=new Map<string,number>();for(const f of formulas)groups.set(f.category,(groups.get(f.category)||0)+1);
const top=new Map<string,[string,number][]>();for(const [c,n] of [...groups].sort((a,b)=>a[0].localeCompare(b[0]))){const k=c.includes(':')?c.split(':')[0]:c.split(':')[0];(top.get(k)||top.set(k,[]).get(k)!).push([c,n])}
return <><div className="hero"><h1 className="title">Categories</h1><p className="muted">{formulas.length} formulas in {groups.size} categories. Pick a topic to browse.</p></div>
{[...top].map(([k,list])=><section key={k} style={{marginBottom:20}}>{list.length>1&&<div className="label">{k}</div>}<div className="formula-grid">{list.map(([c,n])=><Link key={c} href={`/categories/${slugify(c)}`} className="formula-card"><b>{c}</b><div className="muted">{n} formulas</div></Link>)}</div></section>)}</>}
