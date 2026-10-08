// Unit tables: [name, abbreviation, factor to the category's base unit, optional plural].
// Every pair in a category becomes a conversion formula, and the solvers look units up here.
export type Unit=[string,string,number,string?];
export const unitTables:Record<string,{base:string;units:Unit[]}>={
Length:{base:'meter',units:[['millimeter','mm',0.001],['centimeter','cm',0.01],['decimeter','dm',0.1],['meter','m',1],['kilometer','km',1000],['micrometer','µm',1e-6],['inch','in',0.0254,'inches'],['foot','ft',0.3048,'feet'],['yard','yd',0.9144],['mile','mi',1609.344],['nautical mile','nmi',1852],['furlong','fur',201.168],['fathom','ftm',1.8288],['mil','mil',2.54e-5]]},
Weight:{base:'kilogram',units:[['microgram','µg',1e-9],['milligram','mg',1e-6],['gram','g',0.001],['kilogram','kg',1],['metric ton','t',1000],['ounce','oz',0.028349523125],['pound','lb',0.45359237],['stone','st',6.35029318],['US ton','ton',907.18474],['long ton','LT',1016.0469088],['carat','ct',0.0002]]},
Volume:{base:'liter',units:[['milliliter','mL',0.001],['liter','L',1],['cubic meter','m³',1000],['teaspoon','tsp',0.00492892159375],['tablespoon','tbsp',0.01478676478125],['fluid ounce','fl oz',0.0295735295625],['cup','cup',0.2365882365],['pint','pt',0.473176473],['quart','qt',0.946352946],['gallon','gal',3.785411784],['imperial gallon','imp gal',4.54609],['cubic inch','in³',0.016387064],['cubic foot','ft³',28.316846592],['barrel','bbl',158.987294928]]},
Area:{base:'square meter',units:[['square millimeter','mm²',1e-6],['square centimeter','cm²',1e-4],['square meter','m²',1],['hectare','ha',1e4],['square kilometer','km²',1e6],['square inch','in²',0.00064516],['square foot','ft²',0.09290304,'square feet'],['square yard','yd²',0.83612736],['acre','ac',4046.8564224],['square mile','mi²',2589988.110336]]},
Time:{base:'second',units:[['microsecond','µs',1e-6],['millisecond','ms',0.001],['second','s',1],['minute','min',60],['hour','h',3600],['day','d',86400],['week','wk',604800],['year','yr',31536000]]},
Speed:{base:'meter per second',units:[['meter per second','m/s',1,'meters per second'],['centimeter per second','cm/s',0.01,'centimeters per second'],['kilometer per hour','km/h',1/3.6,'kilometers per hour'],['mile per hour','mph',0.44704,'miles per hour'],['foot per second','ft/s',0.3048,'feet per second'],['foot per minute','ft/min',0.00508,'feet per minute'],['knot','kn',1852/3600],['kilometer per second','km/s',1000,'kilometers per second']]},
Pressure:{base:'pascal',units:[['pascal','Pa',1],['kilopascal','kPa',1000],['millibar','mbar',100],['bar','bar',1e5],['atmosphere','atm',101325],['pound per square inch','psi',6894.757293168,'pounds per square inch'],['millimeter of mercury','mmHg',133.322387415,'millimeters of mercury'],['torr','Torr',101325/760],['inch of mercury','inHg',3386.389,'inches of mercury']]},
Energy:{base:'joule',units:[['joule','J',1],['kilojoule','kJ',1000],['calorie','cal',4.184],['kilocalorie','kcal',4184],['watt-hour','Wh',3600],['kilowatt-hour','kWh',3.6e6],['BTU','BTU',1055.05585262,'BTUs'],['foot-pound','ft·lb',1.3558179483314]]},
Power:{base:'watt',units:[['watt','W',1],['kilowatt','kW',1000],['megawatt','MW',1e6],['horsepower','hp',745.69987158227,'horsepower'],['BTU per hour','BTU/h',0.29307107,'BTUs per hour']]},
'Data Storage':{base:'bit',units:[['bit','bit',1],['byte','B',8],['kilobyte','kB',8e3],['megabyte','MB',8e6],['gigabyte','GB',8e9],['terabyte','TB',8e12],['kibibyte','KiB',8192],['mebibyte','MiB',8*2**20],['gibibyte','GiB',8*2**30]]},
Angle:{base:'radian',units:[['degree','°',Math.PI/180],['radian','rad',1],['gradian','grad',Math.PI/200],['turn','turn',2*Math.PI],['arcminute','′',Math.PI/10800]]},
Force:{base:'newton',units:[['newton','N',1],['kilonewton','kN',1000],['pound-force','lbf',4.4482216152605],['kilogram-force','kgf',9.80665],['dyne','dyn',1e-5]]},
Frequency:{base:'hertz',units:[['hertz','Hz',1],['kilohertz','kHz',1e3],['megahertz','MHz',1e6],['gigahertz','GHz',1e9],['revolution per minute','rpm',1/60,'revolutions per minute']]},
};
const plural=(u:Unit)=>u[3]??u[0]+'s';
export const pluralName=(name:string)=>{for(const t of Object.values(unitTables))for(const u of t.units)if(u[0]===name)return plural(u);return name+'s'};
const cap=(s:string)=>s.replace(/(^|[ -])([a-z])/g,(_,a,b)=>a+b.toUpperCase());
const sig=(n:number)=>{const r=+n.toPrecision(10);const a=Math.abs(r);return a!==0&&(a<1e-4||a>=1e9)?r.toExponential().replace('e+','e'):String(r)};

/** Look a unit word up ("kilograms", "kg", "miles per hour") and return its category and base factor. */
export function findUnit(word:string):{cat:string;name:string;abbr:string;factor:number}|null{
const w=word.trim().toLowerCase();
for(const [cat,t] of Object.entries(unitTables))for(const u of t.units)
if([u[0],plural(u),u[1]].some(x=>x.toLowerCase()===w))return {cat,name:u[0],abbr:u[1],factor:u[2]};
return null}

export function unitConversionFormulas(){
const out:{id:string;title:string;category:string;easyFormula:string;standardFormula:string;description:string;aliases:string[];keywords:string[];units:string[];example:string}[]=[];
for(const [cat,t] of Object.entries(unitTables))for(const a of t.units)for(const b of t.units){
if(a===b)continue;
const f=a[2]/b[2];
out.push({id:`conv-${cat}-${a[0]}-${b[0]}`.toLowerCase().replace(/[^a-z0-9]+/g,'-'),
title:`${cap(plural(a))} to ${cap(plural(b))}`,category:`Conversions: ${cat}`,
easyFormula:`${cap(plural(b))} = ${plural(a)} × ${sig(f)}`,standardFormula:`${b[1]} = ${a[1]} × ${sig(f)}`,
description:`Convert ${plural(a)} to ${plural(b)}. 1 ${a[0]} = ${sig(f)} ${f===1?b[0]:plural(b)}.`,
aliases:[`${a[1]} to ${b[1]}`,`${a[0]} to ${b[0]}`],keywords:['conversion','units',cat.toLowerCase(),a[0],b[0]],units:[a[1],b[1]],
example:`10 ${a[1]} = ${sig(10*f)} ${b[1]}`})}
const temps=[['Celsius to Fahrenheit','°F = °C × 9/5 + 32','F = C × 9/5 + 32','100 °C = 212 °F'],['Fahrenheit to Celsius','°C = (°F − 32) × 5/9','C = (F − 32) × 5/9','212 °F = 100 °C'],['Celsius to Kelvin','K = °C + 273.15','K = C + 273.15','0 °C = 273.15 K'],['Kelvin to Celsius','°C = K − 273.15','C = K − 273.15','300 K = 26.85 °C'],['Fahrenheit to Kelvin','K = (°F − 32) × 5/9 + 273.15','K = (F − 32) × 5/9 + 273.15','32 °F = 273.15 K'],['Kelvin to Fahrenheit','°F = (K − 273.15) × 9/5 + 32','F = (K − 273.15) × 9/5 + 32','273.15 K = 32 °F']];
for(const [title,easy,std,ex] of temps)out.push({id:'conv-temp-'+title.toLowerCase().replace(/[^a-z]+/g,'-'),title,category:'Conversions: Temperature',easyFormula:easy,standardFormula:std,description:`Convert ${title.toLowerCase()}.`,aliases:[title.toLowerCase()],keywords:['conversion','temperature'],units:['°C','°F','K'],example:ex});
return out}
