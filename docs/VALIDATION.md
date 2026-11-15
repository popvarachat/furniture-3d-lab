# Validation

Source checks include strict UTF-8 decoding and detection of common mojibake and replacement characters in tracked text files. Production build is required.

Browser review passed for all six scenes: finite geometry, nonempty assemblies, render calls, fitted overall envelopes, explode/reset, part selection, top view, wireframe, finish switching and no horizontal overflow at 390 px.

Envelope fitting does NOT validate component dimensions or mechanical correctness. No manufacturing, load-bearing, BOM, nesting, joinery or assembly-sequence verification is claimed.

The optional CI template is docs/ci.example.yml; it is not enabled by default. The local browser script scripts/browser-qa.cjs expects Windows Chrome and preview server port 5187.
