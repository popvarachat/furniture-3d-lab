# Validation
Production build and source checks are required. Browser review covers all six scenes, finite geometry, nonempty assemblies, successful render calls, fitted overall envelopes, explode/reset, part selection, top view, wireframe, finish switching and mobile horizontal overflow at 390 px.
Overall fitting is intentional in the demonstration and DOES NOT validate component dimensions or mechanical correctness.
No manufacturing, load-bearing, BOM, nesting, joinery or assembly-sequence verification is claimed.
Browser QA is local; An optional CI template is provided in docs/ci.example.yml; it is not enabled by default. Manual checklist: inspect every product assembled/exploded, front/side/top/isometric, PNG export, selection/reset and narrow layout.

