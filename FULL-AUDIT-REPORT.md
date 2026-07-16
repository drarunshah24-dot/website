# Full Audit Report

- URL: `https://drarunshah.com.np/`
- Generated: `2026-07-15T20:59:04.215646`
- Overall score: `55/100`
- Score confidence: `Medium`
- Scoring version: `1`

## Score Card

| Category | Weight | Score |
| --- | ---: | ---: |
| Security Headers | 8 | 25 |
| Social Meta | 5 | 77 |
| Robots and Crawlers | 8 | 94 |
| Broken Links | 10 | 0 |
| Internal Links | 8 | 80 |
| Redirects | 3 | 100 |
| AI Search | 5 | 0 |
| Performance and Core Web Vitals | 13 | 0 |
| On-Page SEO | 10 | 100 |
| Readability | 8 | 37 |
| Entity SEO | 5 | 0 |
| Link Profile | 7 | 65 |
| Hreflang | 5 | 0 |
| Content Uniqueness | 5 | 100 |

## Findings

| Severity | Area | Finding | Evidence | Fix |
| --- | --- | --- | --- | --- |
| Critical | Schema | No Organization/Person entity found in JSON-LD. |  | Add Organization or Person schema with name, url, logo, and sameAs properties. |
| Critical | broken_links | 🔴 6 broken link(s) found |  |  |
| Critical | environment | 6 security headers missing | Missing headers reduce trust and can expose the site to browser/security risks. | Set security headers in `next.config.js` `headers()` or at your edge/CDN. |
| Critical | environment | 6 broken links detected | Broken internal links hurt crawl flow and user trust. | Fix links in route components and content source files; validate with link checks in CI. |
| Critical | link_profile | 4 orphan page(s) with zero inbound internal links. |  | Add internal links from relevant content pages to these orphan pages. |
| Critical | security | 🔴 6 security headers missing — poor security posture |  |  |
| Warning | environment | No llms.txt found | AI crawlers and assistants have no curated machine-readable guidance for key pages. | Serve `/llms.txt` from `/public/llms.txt`. |
| Warning | environment | Content readability is difficult | Long, complex text can reduce engagement and comprehension. | Rewrite key sections with shorter sentences (15-20 words), shorter paragraphs (2-4 sentences), and clearer subheadings. |
| Warning | internal_links | ⚠️ 8 potential orphan page(s) (≤1 internal link pointing to them) |  |  |
| Warning | readability | ⚠️ Content is difficult to read (Flesch: 22.5) — may reduce engagement |  |  |
| Warning | readability | ⚠️ 30.3% complex words (3+ syllables) — consider simplifying |  |  |
| Warning | readability | ⚠️ Thin content (175 words) — may rank poorly |  |  |
| Warning | robots | ⚠️ 4 AI crawlers not explicitly managed: ChatGPT-User, PerplexityBot, anthropic-ai, FacebookBot |  |  |
| Info | Wikidata | No Wikidata entry found for 'National Urology Center'. |  | If the entity meets Wikidata notability guidelines, create or improve an item with accurate third-party references. Do not create one solely for SEO. |
| Info | Wikipedia | No Wikipedia article found for 'National Urology Center'. |  | Only pursue Wikipedia if the entity meets independent notability standards. Otherwise, strengthen official schema, sameAs profiles, citations, and About/Contact signals. |
| Info | environment | Performance measurement incomplete | PageSpeed API returned an error, so CWV recommendations are less reliable. | Set `PAGESPEED_API_KEY` in your environment or `.env` file (see `.env.example`), then rerun. The CLI also accepts `--api-key`. Prioritize LCP/INP/CLS fixes from that output. |
| info | pagespeed | pagespeed measurement incomplete | Rate limited by Google API. Wait a few minutes or add an API key. | Rerun this check after resolving the environment/API/network limitation. |
| Info | sameAs | Missing sameAs link to Wikipedia (Primary KG signal). |  | Add the existing official 'wikipedia.org' URL to sameAs; do not create this profile solely for SEO. |
| Info | sameAs | Missing sameAs link to Wikidata (Primary KG signal). |  | Add the existing official 'wikidata.org' URL to sameAs; do not create this profile solely for SEO. |
| Info | sameAs | Missing sameAs link to LinkedIn (Strong KG signal). |  | Add 'linkedin.com' profile URL to sameAs array in your entity schema. |
| Info | sameAs | Missing sameAs link to Twitter/X (Strong KG signal). |  | Add 'x.com' profile URL to sameAs array in your entity schema. |

## Measurement Notes

1 checks returned errors or incomplete measurements; treat affected scores as directional.
