# The Daily Code

**The Daily Code** is a calm, opinionated daily tracker for people who want discipline without dashboards, streak addiction, or productivity theater.

It behaves like a personal operating system:
open it, see today, do the work, move on.

## Philosophy

Most habit tools optimize for engagement.
This one optimizes for honesty.

No accounts.
No feeds.
No badges.
No noise.

Just a clear record of whether you did the work.

Consistency is not motivated here. It is made visible.

## What it does

- Tracks a fixed set of daily practices
- Defaults to today so action is immediate
- Supports day, week, and month views for reflection
- Uses instant toggles with persistent state
- Auto-creates days as they are accessed
- Locks future days, allows past edits
- Surfaces a single stoic prompt (optional, quiet)

Default practices:

1. Wake at dawn
2. Move the body
3. Journal
4. Read actively
5. Walk outdoors
6. Deep work
7. Memento mori
8. Skip phone usage *(optional)*

## Why it exists

Most people are not inconsistent.
They are forgetful.

They forget the days they showed up.
They overweight the days they didn't.

This tool corrects that distortion.

## What matters

The monthly view.

A field of days.
Green or not.

No interpretation.
No excuses.

## Built with

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Local development

```bash
npm install
cp .env.example .env
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `DATABASE_URL` in `.env` to a running PostgreSQL instance. A local example:

```bash
postgresql://postgres:postgres@localhost:5432/daily_code?schema=public
```

## Available scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the local Next.js app |
| `npm run build` | Generate Prisma client and build for production |
| `npm run start` | Run the production server |
| `npm run db:migrate` | Run local Prisma migrations |
| `npm run db:deploy` | Apply migrations in deployment environments |
| `npm run db:seed` | Seed the default habits |
| `npm run db:studio` | Open Prisma Studio |

## Deployment

This project is Vercel-friendly and works well with hosted Postgres providers like Neon or Supabase.

Typical deployment flow:

1. Import the repo into Vercel
2. Provision PostgreSQL
3. Add `DATABASE_URL`
4. Run `prisma migrate deploy`
5. Seed the default habits once

## What this repo demonstrates

- Strong product point of view
- Constraint-driven UX design
- Simple, durable data model
- End-to-end execution from idea to deploy

## Next ideas

- One-line nightly reflection
- Yearly completion heatmap
- Daily stoic prompt

## References

- Ryan Holiday — reflections on daily discipline and stoic practice  
  [https://www.instagram.com/reel/DWMVGbpBfWa/](https://www.instagram.com/reel/DWMVGbpBfWa/)

## License

MIT

---

**No drama. Return to the code.**
