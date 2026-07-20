# Stage 1 — SERP evidence: "web design lincolnton nc"

Data: 3 same-day Apify readings, 2026-07-20 (raw in `01-serp-raw.json`;
full snapshots in `../../serp-snapshots/`). No junk artifacts in runs 2-3.

## Our rank across readings (the volatility finding)

| Reading | Our rank | Note |
|---|---|---|
| run 1 (early) | **#13** | lincolnton-nc-web-design page, page 2 |
| run 2 (midday) | not in top ~30 | same batch found kings-mountain #25 instead |
| run 3 (midday) | not in top ~30 | clean reading, no junk |

**Read:** the page FLICKERS into the top 15 and out again — classic
post-recrawl re-evaluation of a new/changed page (v2 template shipped 7/18-19,
re-index requested 7/8). Google has the page in consideration but hasn't
settled it. This is precisely the state internal links + real entry points are
supposed to stabilize.

## SERP composition (run 3, top 10)

1. maidenwebdesign.com/lincolnton-nc — solo freelancer (Maiden NC), thin proximity town page
2. m.yelp.com — directory search page
3. nextwaveservices.com/.../lincolnton — national location-page farm
4. maidenwebdesign.com/contact — same freelancer, second slot
5. lincolntonwebdesign.com — local freelancer, exact-match domain
6. yelp.com — directory again
7. thriveagency.com — national agency location page
8. visualbrandingagency.com — small agency
9. thumbtack.com — directory (Hickory page, not even Lincolnton)
10. hickorytradewebdesign.com — freelancer in the wrong town

- Map pack: n/a in actor data (organic only). AI overview: not present (run 3).
- Zero strong authorities. Two directory slots + a location-page farm + a
  freelancer holding TWO slots + two wrong-town pages.

## GATE 1 — PASS

Page 1 is directories, thin national location farms, and freelancer pages
(one occupying two slots, two targeting the wrong town). No cluster of strong
direct answers. This is a soft, winnable SERP per the low-authority doctrine —
and we've already flickered to #13 in it.

## PAA set (AEO targets for the page's FAQ block)

- "How much does it cost to pay someone to design a website?" (cost cluster — recurs on 5+ of our 12 tracked terms)
- "What is the 3 second rule in web design?"
- "What are the 7 C's of web design?"
- "Who can design a website for me?"

Related queries: "Online web design lincolnton nc", "Best web design lincolnton nc".

**Next stage:** 02 competitor autopsy of maidenwebdesign.com/lincolnton-nc,
nextwaveservices.com Lincolnton page, lincolntonwebdesign.com — what they
answer, what they don't, local specificity check.
