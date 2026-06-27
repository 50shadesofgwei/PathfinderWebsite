#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTREACH="$ROOT/outreach"
MD="$OUTREACH/pathfinder-friends-family-round.md"
HTML="$OUTREACH/pathfinder-friends-family-round.html"
PDF="$OUTREACH/pathfinder-friends-family-round.pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

pandoc "$MD" \
  -o "$HTML" \
  --standalone \
  --metadata title="Pathfinder Friends & Family Round" \
  --css pathfinder-friends-family-round.css \
  -V lang=en

python3 - "$HTML" <<'PY'
import re
import sys
from pathlib import Path

html_path = Path(sys.argv[1])
html = html_path.read_text(encoding="utf-8")
html = re.sub(
    r'<h1 id="pathfinder-friends-family-round">.*?</h1>\s*',
    "",
    html,
    count=1,
    flags=re.DOTALL,
)
font_links = (
    '<link rel="preconnect" href="https://fonts.googleapis.com" />\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n'
    '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />\n'
)
html = html.replace("</title>\n", f"</title>\n  {font_links}", 1)
html_path.write_text(html, encoding="utf-8")
PY

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=10000 \
  --print-to-pdf="$PDF" \
  "file://$HTML"

echo "Wrote $PDF"
