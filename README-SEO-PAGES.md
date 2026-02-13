# SEO Pages Build

SEO content pages are built from **https://ial-rewrite.vercel.app/**.

## Already Created

- `/personal-injury` — Personal Injury hub
- `/personal-injury/auto-accidents` — Auto accidents
- `/personal-injury/brain-injuries` — Brain injuries
- `/personal-injury/truck-accidents` — Truck accidents
- `/personal-injury/wrongful-death` — Wrongful death
- `/insurance-company-playbook` — How insurance companies handle claims

## Generate Remaining Pages

**Requires Node.js.** Run:

```bash
node scripts/build-seo-pages.js
```

This fetches content from ial-rewrite and generates all pages listed in the script.

## Page Rules (from prompt)

- One H1 only
- Proper H2/H3 structure
- CTA link to homepage form (`/#case-evaluation`)
- Contextual internal links in body
- "Related Pages" list in footer (SEO pages only)
- Same theme/styles as homepage
- No menu changes to homepage
- No edits to PPC repo

## Vercel Rewrites

`vercel.json` includes rewrites for all SEO paths. Pages live in `public/<path>/index.html`.

## Live URL

SEO pages are canonical to **https://www.insiderlawyers.com/** (e.g. `/personal-injury`, `/personal-injury/auto-accidents`). Ensure the deployment serving www.insiderlawyers.com uses this repo.
