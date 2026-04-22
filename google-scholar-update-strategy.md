# Google Scholar Website Update Strategy

## Goal

Update the website every 3 months with new papers that appear on Google Scholar, while keeping the current hand-curated site content stable and avoiding fragile automation.

## Recommended Approach

Use a semi-automatic quarterly import workflow:

- Keep Google Scholar as the visible source of truth for "what is new".
- Do not scrape Google Scholar live on every site build.
- Instead, export your Google Scholar entries on a quarterly basis and import them into the website with a small script.
- Only add new papers.
- Leave all existing publication entries untouched.

This is the best balance between:

- low maintenance
- high reliability
- preserving your current website structure
- reducing manual editing

## Why This Fits The Current Website

The site is a Jekyll-style static website, and publication content is currently hardcoded directly into `index.html`, with some overlapping research content in `1Research.md`.

That means the main inefficiency today is not the stack itself, but:

- manual editing in HTML
- duplicated publication content
- no structured source for publication entries

So the most efficient path is not a redesign of the site, but a small content pipeline that adds new entries safely.

## Core Principle

Preserve the current curated publication lists exactly as they are.

The automation should only append newly detected papers into the correct section:

- `Working Papers`
- `Academic Publications`
- `Policy Publications`

Old entries should not be rewritten, reformatted, or reclassified.

## Classification Rules For New Papers

New imported papers should be classified with these rules:

- OECD papers go under `Policy Publications`
- Papers published in academic journals go under `Academic Publications`
- Other working papers, including SSRN/preprints, go under `Working Papers`

If a paper is ambiguous, the workflow should support a small manual override instead of changing the script logic each time.

## Suggested Implementation Shape

Create a lightweight import pipeline with these pieces:

### 1. A structured data file

Add a file that stores only imported papers, for example:

- `_data/imported_publications.yml`

This file should contain only the new auto-managed entries, not the old hand-written ones.

### 2. Generated sections on the homepage

Keep the current manually written publication entries in `index.html`.

Then add a generated block after the existing entries in each relevant section:

- new imported `Working Papers`
- new imported `Academic Publications`
- new imported `Policy Publications`

This keeps the old content stable while allowing future additions to flow in automatically.

### 3. A small import script

Add a script that:

- reads a quarterly Google Scholar export
- normalizes titles
- compares imported entries against already-known titles
- filters out duplicates
- classifies new papers into the correct section
- writes only the new entries to the structured data file

### 4. A small override file

Add a manual override file for edge cases, for example:

- `_data/publication_overrides.yml`

This can be used to:

- force a paper into a specific section
- add a missing link
- correct metadata when needed

## Quarterly Workflow

Every 3 months:

1. Export your publications from Google Scholar.
2. Run the import script.
3. Review the newly detected entries.
4. Commit the updated data file.
5. Publish the site as usual.

This keeps the quarterly workflow simple and reviewable, without depending on brittle live scraping.

## Why Not Full Google Scholar Scraping

Google Scholar is a good source for what should appear on your profile, but it is not ideal as a fully automated machine-readable website feed.

A direct scraping solution would be more fragile because:

- page structure can change
- automated access can be rate-limited or blocked
- failures may happen silently

For that reason, export/import is safer than unattended scraping.

## Why Not Replace Everything With A New Database

That would be more work than necessary for this site.

Your current structure already works well for a personal academic website. The efficient improvement is to add a small data layer for future papers, not to rebuild the whole publications system.

## Final Recommendation

When you come back to this, the best next step is:

- keep the current publication HTML untouched
- add one auto-managed data file for future papers
- add generated "new papers" blocks under the existing sections
- use a quarterly Scholar export plus import script
- only append new entries

This gives you a low-risk, maintainable workflow that matches how the site is already built.
