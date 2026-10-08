# Formula Desk

A compact Next.js math utility with deterministic word-problem solvers (including comparing speeds given in different units, e.g. mph vs m/s), calculator, unit converter, formula search, local favorites/history, and persistent theme.

## Run
```bash
npm install
npm run dev
```

## Deploy
Import the repository into Vercel as a Next.js project.

Note: The library ships 1,200+ real formulas: hand-written references (geometry, algebra, trig, statistics, probability, physics, chemistry, finance, calculus) plus every unit-to-unit conversion generated from the tables in `data/units.ts`. No placeholders or duplicates. Add units to a table or formulas to `data/extra.ts` to grow it.
