# Formula Desk

A compact Next.js math utility with deterministic word-problem solvers (including comparing speeds given in different units, e.g. mph vs m/s), calculator, unit converter, formula search, local favorites/history, and persistent theme.

## Run
```bash
npm install
npm run dev
```

## Deploy
Import the repository into Vercel as a Next.js project.

Note: The library ships 2,100+ real formulas: hand-written references (geometry, algebra, trig, statistics, probability, physics, chemistry, finance, calculus) plus every unit-to-unit conversion generated from the tables in `data/units.ts`. No placeholders or duplicates. Add units to a table or formulas to `data/extra.ts` to grow it.

Every formula has an `easyFormula` written in plain words (hard ones are simplified, e.g. pi shown as 3.14 and calculus rules described in sentences) and a `standardFormula` with the textbook notation. Conversions use `÷` when that gives a shorter number (`km = mm ÷ 1,000,000`) and round long factors to 4 digits, with the exact factor kept in the standard formula.
