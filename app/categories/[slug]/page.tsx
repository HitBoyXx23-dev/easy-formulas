import Link from 'next/link';import {notFound} from 'next/navigation';import {formulas} from '@/data/formulas';import {slugify} from '@/lib/slug';
export default async function Page({params}:{params:Promise<{slug:string}>}){
const {slug}=await params;const list=formulas.filter(f=>slugify(f.category)===slug);if(!list.length)notFound();
return <><div className="hero"><div className="muted"><Link href="/categories">Categories</Link></div><h1 className="title">{list[0].category}</h1><p className="muted">{list.length} formulas</p></div>
<div className="formula-grid">{list.map(f=><Link key={f.id} href={`/formulas/${f.id}`} className="formula-card"><b>{f.title}</b><p>{f.easyFormula}</p></Link>)}</div></>}
