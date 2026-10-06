import {Formula} from '@/lib/types';
const base:Formula[]=[
['rectangle-area','Rectangle Area','Geometry','Area = length × width','A = l × w','Find the area inside a rectangle.',['area rectangle'],['length','width','area'],['m²','ft²'],'7.5 × 5.3 = 39.75'],
['gear-ratio','Gear Ratio','Ratio & Proportion','Gear ratio = front teeth ÷ rear teeth','G = F ÷ R','Compares front and rear sprocket teeth.',['bike gear ratio'],['sprocket','teeth','ratio'],['ratio'],'36 ÷ 12 = 3:1'],
['mean','Arithmetic Mean','Statistics','Average = add all numbers ÷ how many numbers there are','x̄ = Σx / n','Find the arithmetic average.',['average'],['mean','average','statistics'],[],'(2+4+6)/3 = 4'],
['inch-mm','Inches to Millimeters','Conversions: Length','Millimeters = inches × 25.4','mm = in × 25.4','Convert inches to millimeters.',['in to mm','inch millimeter'],['bike wheel','diameter','metric'],['in','mm'],'26 in = 660.4 mm'],
['grams-pounds','Grams to Pounds','Conversions: Weight','Pounds = grams ÷ 453.592','lb = g / 453.592','Convert grams to pounds.',['g to lb'],['mass','weight'],['g','lb'],'800 g ≈ 1.76 lb'],
['speed','Speed','Rate','Speed = distance ÷ time','v = d / t','Find speed from distance and time.',['velocity'],['distance','time','rate'],['mph','m/s'],'120 miles / 2 h = 60 mph'],
['percent','Percent of a Number','Percent','Part = percent × whole','P = rW','Find a percentage of a value.',['percentage'],['percent','part','whole'],['%'],'20% of 50 = 10'],
['circle-area','Circle Area','Geometry','Area = π × radius²','A = πr²','Find the area of a circle.',['area circle'],['radius','pi'],['unit²'],'r=3 → 28.274'],
['pythagorean','Pythagorean Theorem','Geometry','hypotenuse² = leg² + leg²','c² = a² + b²','Find a missing side in a right triangle.',['right triangle'],['hypotenuse','triangle'],[],'3²+4²=5²'],
['simple-interest','Simple Interest','Finance','Interest = principal × rate × time','I = Prt','Calculate simple interest.',['interest'],['principal','rate','time'],['$'],'1000×0.05×2=100']
].map(x=>({id:x[0],title:x[1],category:x[2],easyFormula:x[3],standardFormula:x[4],description:x[5],aliases:x[6],keywords:x[7],units:x[8],example:x[9]} as Formula));
const conversions:[string,string,string,string][]=[['Feet to Inches','Conversions: Length','Inches = feet × 12','in = ft × 12'],['Miles to Kilometers','Conversions: Length','Kilometers = miles × 1.609344','km = mi × 1.609344'],['Pounds to Kilograms','Conversions: Weight','Kilograms = pounds × 0.45359237','kg = lb × 0.45359237'],['Minutes to Hours','Conversions: Time','Hours = minutes ÷ 60','h = min ÷ 60'],['Celsius to Fahrenheit','Temperature','Fahrenheit = Celsius × 9/5 + 32','F = C × 9/5 + 32']];
export const formulas=[...base,...conversions.map((x,i)=>({id:`conv-${i}`,title:x[0],category:x[1],easyFormula:x[2],standardFormula:x[3],description:`Useful ${x[0].toLowerCase()} conversion.`,aliases:[x[0].toLowerCase()],keywords:['conversion','units'],units:[],example:''}))];
