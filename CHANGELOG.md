# 1.1.3 - 3 Jan 2026
Fix:
- remove `overflow-hidden` from ripple to prevent missing ripple effect on Safari

# 1.1.2 - 2 Jan 2026
Improvement:
- add `--ripple-color` to set default ripple color

Fix:
- default ripple to center when using keyboard event

# 1.1.1 - 30 Dec 2025
Fix:
- ripple sharing element

# 1.1.0 - 30 Dec 2025
Improvement:
- add `pointer-events: none` to ripple element to prevent blocking pointer events on parent elements
- automatic disable ripple effect based on parent element
- add `overflow: hidden`, `border-radius: inherit` to ripple container

# 1.0.2 - 22 Jun 2025
Fix:
- Unexpected semi-colon in CSS

# 1.0.1 - 22 Jun 2025
Improvement:
- Export `main`, `module`, and `types` in package.json
- Exclude `react-jsx-runtime` from `dist`

Fix:
- remove duplicated CSS

Change:
- inline class instead of map-filter
- reduce object destructuring
