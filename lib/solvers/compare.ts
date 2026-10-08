import {SolveResult} from '../types';
import {fmt} from '../rounding';

// Meters per second for each supported speed unit. `mile` is filled in at solve time
// so a problem that says "1 mile = 1,609 meters" is honored.
const speedUnits=(mile:number,foot:number):{re:string;label:string;mps:number}[]=>[
{re:'miles?\\s+per\\s+hour|mph|mi\\/h',label:'mi/h',mps:mile/3600},
{re:'kilometers?\\s+per\\s+hour|kph|km\\/h',label:'km/h',mps:1000/3600},
{re:'meters?\\s+per\\s+second|m\\/s',label:'m/s',mps:1},
{re:'meters?\\s+per\\s+minute|m\\/min',label:'m/min',mps:1/60},
{re:'meters?\\s+per\\s+hour|m\\/h',label:'m/h',mps:1/3600},
{re:'feet\\s+per\\s+second|ft\\/s',label:'ft/s',mps:foot},
{re:'feet\\s+per\\s+minute|ft\\/min',label:'ft/min',mps:foot/60},
{re:'feet\\s+per\\s+hour|ft\\/h',label:'ft/h',mps:foot/3600},
{re:'kilometers?\\s+per\\s+minute|km\\/min',label:'km/min',mps:1000/60},
{re:'miles?\\s+per\\s+minute|mi\\/min',label:'mi/min',mps:mile/60},
];
const num=(s:string)=>+s.replace(/,/g,'');
const skip=new Set(['If','The','A','An','Which','What','Who','Each','Both','One','Two','It','They','He','She','In','At','On']);

type Entry={name:string;value:number;unit:string;mps:number};

// Detects "X moves at A <unit>. Y moves at B <unit>. Which is faster?" style problems.
export function compareSpeeds(q:string):SolveResult|null{
const s=q.toLowerCase();
if(!/(faster|slower|compar|which statement|quicker|greater|fastest|slowest|who is|who can)/.test(s))return null;
const mileM=q.match(/1\s*mile\s*(?:=|is|≈|equals|~)?\s*(?:about\s*)?([\d,]+(?:\.\d+)?)\s*(?:meters|metres)/i);
const footM=q.match(/1\s*(?:foot|ft)\s*(?:=|is|≈|equals)?\s*(?:about\s*)?(\d*\.?\d+)\s*(?:meters|metres)/i);
const mile=mileM?num(mileM[1]):1609.344,foot=footM?+footM[1]:0.3048;
const units=speedUnits(mile,foot);
const sentences=q.split(/(?<=[.!?])\s+/);
const found:Entry[]=[];
for(const sent of sentences){
for(const u of units){
const m=sent.match(new RegExp(`(\\d[\\d,]*(?:\\.\\d+)?)\\s*(?:${u.re})`,'i'));
if(!m)continue;
const names=[...sent.matchAll(/\b([A-Z][a-z]+)\b/g)].map(x=>x[1]).filter(n=>!skip.has(n));
const value=num(m[1]);
found.push({name:names[0]||`Speed ${found.length+1}`,value,unit:u.label,mps:value*u.mps});
break;}}
if(found.length<2)return null;
const sorted=[...found].sort((a,b)=>b.mps-a.mps);
const fast=sorted[0],slow=sorted[sorted.length-1];
if(fast.mps===slow.mps)return {solved:true,answer:`All speeds are equal (${fmt(fast.mps,2)} m/s).`,title:'Speed Comparison',category:'Rate / Conversion',easyFormula:'Convert every speed to the same unit, then compare the numbers.',setup:found.map(f=>`${f.name}: ${f.value} ${f.unit} = ${fmt(f.mps,4)} m/s`).join('\n'),steps:['Convert each speed to meters per second.','The converted speeds are equal.']};
const ratio=fast.mps/slow.mps;
const diff=fast.mps-slow.mps;
const conv=(f:Entry)=>f.unit==='m/s'?`${f.name}: ${f.value} m/s (already in m/s)`:`${f.name}: ${f.value} ${f.unit} → ${fmt(f.mps,4)} m/s`;
const mph=(f:Entry)=>f.mps*3600/mile;
const usesMile=found.some(f=>/mi/.test(f.unit));
const answer=found.length===2
?`${fast.name} is faster than ${slow.name}: ${fmt(fast.mps,2)} m/s vs ${fmt(slow.mps,2)} m/s (about ${fmt(ratio,2)}× as fast).`
:`${fast.name} is fastest and ${slow.name} is slowest. Order: ${sorted.map(f=>`${f.name} (${fmt(f.mps,2)} m/s)`).join(' > ')}.`;
return {solved:true,answer,
title:'Speed Comparison',category:'Rate / Conversion',
easyFormula:'Put every speed in the same unit, then compare. Converted speed = speed × (meters per unit of distance) ÷ (seconds per unit of time)',
standardFormula:'v(m/s) = v × (m per distance unit) ÷ (s per time unit)',
setup:[...found.map(conv),usesMile?`Using 1 mile = ${mile} meters`:'',`Difference: ${fmt(diff,2)} m/s; ratio ${fast.name} ÷ ${slow.name} = ${fmt(ratio,2)}`].filter(Boolean).join('\n'),
steps:[
'Speeds are in different units, so convert them all to meters per second (m/s).',
...(usesMile?[`1 mile = ${mile} meters and 1 hour = 3,600 seconds, so 1 mi/h = ${fmt(mile/3600,4)} m/s.`]:[]),
...found.map(conv),
`Compare: ${sorted.map(f=>fmt(f.mps,2)).join(' vs ')} m/s.`,
`${fast.name} is faster by ${fmt(diff,2)} m/s (${fmt(mph(fast)-mph(slow),2)} mi/h).`,
`Check in mi/h: ${sorted.map(f=>`${f.name} ≈ ${fmt(mph(f),2)} mi/h`).join(', ')}.`],
units:'m/s',rounding:'2 decimal places for display'};}
