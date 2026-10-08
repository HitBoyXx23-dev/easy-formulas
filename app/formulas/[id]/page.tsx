import Link from 'next/link';import {notFound} from 'next/navigation';
import {formulas} from '@/data/formulas';import {slugify} from '@/lib/slug';import FavButton from '@/components/FavButton';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const f=formulas.find(x=>x.id===id);return {title:f?`${f.title} | Formula Desk`:'Formula not found'}}
export default async function Page({params}:{params:Promise<{id:string}>}){
const {id}=await params;const f=formulas.find(x=>x.id===id);if(!f)notFound();
const related=formulas.filter(x=>x.category===f.category&&x.id!==f.id).slice(0,8);
return <><div className="hero"><div className="muted"><Link href="/categories">Categories</Link> / <Link href={`/categories/${slugify(f.category)}`}>{f.category}</Link></div><h1 className="title">{f.title}</h1><p className="muted">{f.description}</p></div>
<div className="card result-card"><div className="result-body">
<div className="result-section"><div className="label">Easy formula</div><div className="answer">{f.easyFormula}</div></div>
<div className="result-section"><div className="label">Standard formula</div><span>{f.standardFormula}</span></div>
{f.example&&<div className="result-section"><div className="label">Example</div><span>{f.example}</span></div>}
{f.units.length>0&&<div className="result-section"><div className="label">Units</div><span>{f.units.join(', ')}</span></div>}
{f.aliases.length>0&&<div className="result-section"><div className="label">Also known as</div><span>{f.aliases.join(', ')}</span></div>}
<div className="row wraprow"><FavButton id={f.id}/><Link className="btn" href="/solver">Try the word problem solver</Link></div>
</div></div>
{related.length>0&&<><h2 style={{marginTop:24}}>More in {f.category}</h2><div className="formula-grid">{related.map(r=><Link key={r.id} href={`/formulas/${r.id}`} className="formula-card"><b>{r.title}</b><p>{r.easyFormula}</p></Link>)}</div></>}</>}
