# Action Plan

- URL: `https://drarunshah.com.np/`
- Overall score: `55/100`

## Priority Fixes

1. **No Organization/Person entity found in JSON-LD.**
   - Priority: `Critical`
   - Area: `Schema`
   - Evidence: See audit output.
   - Fix: Add Organization or Person schema with name, url, logo, and sameAs properties.
2. **6 security headers missing**
   - Priority: `Critical`
   - Area: `environment`
   - Evidence: Missing headers reduce trust and can expose the site to browser/security risks.
   - Fix: Set security headers in `next.config.js` `headers()` or at your edge/CDN.
3. **6 broken links detected**
   - Priority: `Critical`
   - Area: `environment`
   - Evidence: Broken internal links hurt crawl flow and user trust.
   - Fix: Fix links in route components and content source files; validate with link checks in CI.
4. **4 orphan page(s) with zero inbound internal links.**
   - Priority: `Critical`
   - Area: `link_profile`
   - Evidence: See audit output.
   - Fix: Add internal links from relevant content pages to these orphan pages.
5. **No llms.txt found**
   - Priority: `Warning`
   - Area: `environment`
   - Evidence: AI crawlers and assistants have no curated machine-readable guidance for key pages.
   - Fix: Serve `/llms.txt` from `/public/llms.txt`.
6. **Content readability is difficult**
   - Priority: `Warning`
   - Area: `environment`
   - Evidence: Long, complex text can reduce engagement and comprehension.
   - Fix: Rewrite key sections with shorter sentences (15-20 words), shorter paragraphs (2-4 sentences), and clearer subheadings.
7. **No Wikidata entry found for 'National Urology Center'.**
   - Priority: `Info`
   - Area: `Wikidata`
   - Evidence: See audit output.
   - Fix: If the entity meets Wikidata notability guidelines, create or improve an item with accurate third-party references. Do not create one solely for SEO.
8. **No Wikipedia article found for 'National Urology Center'.**
   - Priority: `Info`
   - Area: `Wikipedia`
   - Evidence: See audit output.
   - Fix: Only pursue Wikipedia if the entity meets independent notability standards. Otherwise, strengthen official schema, sameAs profiles, citations, and About/Contact signals.
9. **Performance measurement incomplete**
   - Priority: `Info`
   - Area: `environment`
   - Evidence: PageSpeed API returned an error, so CWV recommendations are less reliable.
   - Fix: Set `PAGESPEED_API_KEY` in your environment or `.env` file (see `.env.example`), then rerun. The CLI also accepts `--api-key`. Prioritize LCP/INP/CLS fixes from that output.
10. **Missing sameAs link to Wikipedia (Primary KG signal).**
   - Priority: `Info`
   - Area: `sameAs`
   - Evidence: See audit output.
   - Fix: Add the existing official 'wikipedia.org' URL to sameAs; do not create this profile solely for SEO.
11. **Missing sameAs link to Wikidata (Primary KG signal).**
   - Priority: `Info`
   - Area: `sameAs`
   - Evidence: See audit output.
   - Fix: Add the existing official 'wikidata.org' URL to sameAs; do not create this profile solely for SEO.
12. **Missing sameAs link to LinkedIn (Strong KG signal).**
   - Priority: `Info`
   - Area: `sameAs`
   - Evidence: See audit output.
   - Fix: Add 'linkedin.com' profile URL to sameAs array in your entity schema.
13. **Missing sameAs link to Twitter/X (Strong KG signal).**
   - Priority: `Info`
   - Area: `sameAs`
   - Evidence: See audit output.
   - Fix: Add 'x.com' profile URL to sameAs array in your entity schema.
