import {SolveResult} from '../types';
import {decimalsFrom,fmt} from '../rounding';
import {findUnit,pluralName} from '../../data/units';

// "28 kilograms in 1 week ... 2.2 pounds in 1 kilogram ... how many pounds each day?"
const periods:Record<string,number>={second:1,minute:60,hour:3600,day:86400,week:604800,month:30*86400,year:365*86400};
const periodOf=(w:string)=>{const k=w.toLowerCase().replace(/s$/,'');return k in periods?k:null};
const N='(\\d[\\d,]*(?:\\.\\d+)?|an?|one)';
const toNum=(s:string)=>/^(an?|one)$/i.test(s)?1:+s.replace(/,/g,'');
const singular=(w:string)=>w.toLowerCase().replace(/(es|s)$/,'');
const sameUnit=(a:string,b:string)=>{const x=findUnit(a),y=findUnit(b);return x&&y?x.name===y.name:singular(a)===singular(b)};

export function solveRateConversion(q:string):SolveResult|null{
const d=decimalsFrom(q);
const ask=q.match(/how\s+(?:many|much)\s+([a-z]+(?:\s+[a-z]+)?)[^?.]*?\b(?:each|every|per|a|an)\s+(second|minute|hour|day|week|month|year)\b/i);
if(!ask)return null;
// words in the asked unit may include trailing words, so try one word first
const askWords=ask[1].split(/\s+/);const askUnit=findUnit(askWords[0])?askWords[0]:ask[1];
const askPeriod=periodOf(ask[2]);if(!askPeriod)return null;

// total over a time span: "28 kilograms in 1 week"
const tot=[...q.matchAll(new RegExp(`${N}\\s+([a-z]+(?:\\s+[a-z]+)?)\\s+(?:in|over|during|within|after|for)\\s+${N}\\s+(second|minute|hour|day|week|month|year)s?\\b`,'gi'))]
.find(m=>!periodOf(m[2].split(/\s+/)[0]));
if(!tot)return null;
const amount=toNum(tot[1]),fromWord=tot[2].split(/\s+/)[0],span=toNum(tot[3]),spanPeriod=periodOf(tot[4])!;

// conversion: "2.2 pounds in 1 kilogram" or "1 kilogram is about 2.2 pounds"
let factor:number|null=null,stated=false;
const c1=[...q.matchAll(new RegExp(`${N}\\s+([a-z]+(?:\\s+[a-z]+)?)\\s+(?:in|per|for)\\s+(?:each\\s+)?(?:1|one|a|an|every)\\s+([a-z]+)`,'gi'))]
.find(m=>sameUnit(m[2].split(/\s+/)[0],askUnit)&&sameUnit(m[3],fromWord));
if(c1){factor=toNum(c1[1]);stated=true}
if(factor===null){const c2=q.match(new RegExp(`(?:1|one|an?)\\s+([a-z]+)\\s+(?:is|=|equals|≈)\\s+(?:about\\s+|approximately\\s+)?${N}\\s+([a-z]+)`,'i'));
if(c2&&sameUnit(c2[1],fromWord)&&sameUnit(c2[3],askUnit)){factor=toNum(c2[2]);stated=true;}}
let note='';
if(factor===null){
if(sameUnit(fromWord,askUnit))factor=1;
else{const a=findUnit(fromWord),b=findUnit(askUnit);if(!a||!b||a.cat!==b.cat)return null;factor=a.factor/b.factor;note=`Using the standard value 1 ${a.name} = ${fmt(factor,6)} ${b.name}s.`}}

const converted=amount*factor,seconds=span*periods[spanPeriod],perPeriod=converted/(seconds/periods[askPeriod]),count=seconds/periods[askPeriod];
const u=askWords[0]===askUnit?askUnit:ask[1];
const ans=`${fmt(perPeriod,d??2)} ${u} per ${askPeriod}`;
const countTxt=`${span} ${spanPeriod}${span===1?'':'s'} = ${fmt(count)} ${askPeriod}${count===1?'':'s'}`;
return {solved:true,answer:`About ${ans}`,title:'Rate with Unit Conversion',category:'Rate / Conversion',
easyFormula:'Amount per period = (total × conversion factor) ÷ number of periods',
standardFormula:'r = (T × k) ÷ n',
setup:`${amount} × ${fmt(factor)} = ${fmt(converted)} ${u}\n${countTxt}\n${fmt(converted)} ÷ ${fmt(count)} = ${fmt(perPeriod,d??2)} ${u} per ${askPeriod}`,
steps:[`Total: ${amount} ${fromWord} over ${span} ${spanPeriod}${span===1?'':'s'}.`,
stated?`Given: ${fmt(factor)} ${u} in 1 ${singular(fromWord)}.`:(note||'Units already match.'),
`Convert the total: ${amount} × ${fmt(factor)} = ${fmt(converted)} ${u}.`,
`Count the periods: ${countTxt}. (The loss/change is at a constant rate.)`,
`Divide: ${fmt(converted)} ÷ ${fmt(count)} = ${fmt(perPeriod,d??2)} ${u} per ${askPeriod}.`],
units:u,rounding:d===null?'Rounded to 2 decimal places':`${d} decimal places`};}

// "Convert 5 miles to kilometers" / "How many feet are in 3 miles?"
export function solveConversion(q:string):SolveResult|null{
const d=decimalsFrom(q);
let m=q.match(/convert\s+(\d[\d,]*(?:\.\d+)?)\s*([\p{L}µ°²³·′/ -]+?)\s+(?:to|into)\s+([\p{L}µ°²³·′/ -]+?)(?:[?.,]|$)/iu);
let n:number,a:string,b:string;
if(m){n=+m[1].replace(/,/g,'');a=m[2];b=m[3]}
else{m=q.match(/how\s+many\s+([a-z ]+?)\s+(?:are\s+)?in\s+(\d[\d,]*(?:\.\d+)?)\s*([a-z ]+?)\s*[?.]?$/i);if(!m)return null;n=+m[2].replace(/,/g,'');a=m[3];b=m[1]}
const x=findUnit(a),y=findUnit(b);if(!x||!y||x.cat!==y.cat)return null;
const f=x.factor/y.factor,v=n*f,vs=d===null?fmt(+v.toPrecision(12)):fmt(v,d),fs=fmt(+f.toPrecision(12));
const cap=(t:string)=>t[0].toUpperCase()+t.slice(1);
return {solved:true,answer:`${vs} ${v===1?y.name:pluralName(y.name)}`,title:`${cap(pluralName(x.name))} to ${cap(pluralName(y.name))}`,category:`Conversions: ${x.cat}`,
easyFormula:`${cap(pluralName(y.name))} = ${pluralName(x.name)} × ${fs}`,standardFormula:`${y.abbr} = ${x.abbr} × ${fs}`,
setup:`${n} × ${fs} = ${vs}`,steps:[`1 ${x.name} = ${fs} ${pluralName(y.name)}.`,`Multiply ${n} by ${fs}.`,`${n} ${x.abbr} = ${vs} ${y.abbr}.`],units:y.abbr,rounding:d===null?'Full precision (12 significant digits)':`${d} decimal places`}}
