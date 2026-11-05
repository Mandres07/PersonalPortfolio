---
target: portfolio UI/UX review
total_score: 19
max_score: 28
na_heuristics: 5,9,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/mandres07/VS Code/PersonalPortfolio/src/components/pages/Page.astro"
target_fingerprint: "sha256:f90c6756ba89c203d0153d67b30325a51b1eb2f42d86159bbae6dc9128661cd8"
target_path: /Users/mandres07/VS Code/PersonalPortfolio/src/components/pages/Page.astro
timestamp: 2026-11-05T14-53-12Z
slug: src-components-pages-page-astro
---

# Portfolio UI/UX critique

Target: src/components/pages/Page.astro, English and Spanish portfolio. Mode: Experience. Two independent assessments: design review and detector/browser evidence.

The friendly avatar, consistent green palette, sticky identity column, bilingual content, and real production screenshots provide a solid foundation. The biggest opportunity is to give selected work and outcomes greater prominence. The visual language is coherent but its resume layout and repeated technology badges feel fairly interchangeable with developer templates; the production veterinary software provides more distinctive evidence.

## Heuristic assessment

| Heuristic               | Score / 4 | Finding                                                                         |
| ----------------------- | --------: | ------------------------------------------------------------------------------- |
| System status           |         3 | Active section navigation and disclosure states work.                           |
| Real-world language     |         3 | Familiar headings; technical intro and emoji navigation require interpretation. |
| User control            |         3 | Direct links, native disclosures, theme/language controls.                      |
| Consistency             |         3 | Coherent components; mixed emoji and icon language.                             |
| Error prevention        |       n/a | No consequential input or transaction flow.                                     |
| Recognition over recall |         2 | Mobile navigation hides visible labels.                                         |
| Efficiency              |         3 | Section anchors and command palette support navigation.                         |
| Minimalist design       |         2 | Repeated stacks, eight equal projects, long gallery.                            |
| Error recovery          |       n/a | No recoverable form/task error observed.                                        |
| Help/documentation      |       n/a | Dedicated help unnecessary for this portfolio.                                  |

Total: 19/28 (68%, Acceptable). These are design judgments, not an accessibility compliance score.

## Priority issues

1. **P1 — Put selected work earlier.** Projects start approximately 1,828px down on desktop and 2,988px on mobile, after five jobs. Lead with two or three selected projects and concise case studies covering problem, personal role, decisions and verified outcomes. Existing 3,500+/9,000+ pet counts and years in use are strong evidence. Group Luvet deployments and related SDS portals while retaining individual examples. Suggested command: impeccable layout.
2. **P1 — Make contact explicit.** Email, WhatsApp and profiles compete as equal 32px icons. Add a labeled Email me action and a secondary View selected work link near the introduction, plus a contact invitation at the end. Sharpen introductory positioning using verified strengths without inventing claims. Suggested command: impeccable clarify.
3. **P2 — Improve mobile navigation and touch targets.** Navigation begins around y=764 at 390px and hides labels, leaving five emoji. Actual anchors are only 20x21px; padding is on their noninteractive parent. The theme button is 20x20px and selects 36px high. Keep short visible labels and enlarge actual interactive areas toward 44px. Make language selection available earlier. Suggested command: impeccable adapt.
4. **P2 — Reduce repetition and scrolling.** The first two jobs show 20 and 14 technology chips respectively, followed later by another skills list. Show a few relevant technologies and a meaningful outcome per job, retaining details in disclosures. Curate certificates and condense the personal gallery, which occupies about 2,426px on mobile. Place professional skills before the optional personal gallery. Suggested command: impeccable distill.
5. **P2 — Strengthen visual hierarchy.** Pale green covers the canvas and similarly tinted cards and controls. Preserve green identity and the illustrated avatar while testing a quieter canvas, stronger project emphasis and green reserved for selected accents/actions. Increase readability of small metadata and reduce badge density. Suggested command: impeccable typeset.

## Cognitive load and emotional journey

Single focus, chunking and progressive disclosure need improvement: 20 chips and eight equally weighted projects require visitors to prioritize for themselves. Existing job disclosures are a good foundation. The journey begins with a friendly introduction, continues through a long resume, reaches product evidence later, and ends without a strong contact invitation. Move professional evidence forward and close with a clear next step.

## Persona red flags

- First-time/recruiter visitor: title is clear, but product evidence takes several screens to reach.
- Distracted mobile visitor: emoji navigation and small touch targets increase effort on a roughly 10,677px document.
- Accessibility-dependent visitor: labels, focus treatment and reduced-motion support exist; small hit areas remain a motor-access concern.

## Minor observations and verification

Repeated Responsive on all devices and Made with bullets provide less evidence than contribution and outcomes. Proofread English experience copy. City/country is sufficient professional location detail if the street address serves no visitor need. Reduce the prominence of appearance controls relative to contact actions. Review command-palette heading hierarchy.

Source detector: zero findings. Injected browser detector: six wrapping stragglers and one skipped heading level in command-palette content; the latter is a secondary mounted-state issue. Clean Axe scans found zero violations in tested English/Spanish default-light mobile views. No horizontal overflow at 1440, 390 or 320px. Anchor navigation, language switch, dark mode, color selection and gallery open/Escape/focus restoration worked. Lazy images load after scrolling; full-page lazy placeholders are not broken assets. All themes and external destinations were not exhaustively tested.

## Questions to consider

Which should lead the next pass: selected projects, mobile clarity or contact flow? Should the scope cover the top three priorities or all five? Keep the current green canvas or test a quieter background with green accents?
