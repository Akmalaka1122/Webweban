#!/bin/bash
# Lighthouse audit script
# Run: ./scripts/lighthouse-audit.sh [URL]

URL=${1:-"http://localhost:8080"}
RESULTS_DIR="./lighthouse-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$RESULTS_DIR"

echo "🔍 Running Lighthouse audit on $URL"

npx lighthouse "$URL" \
  --output=json \
  --output-path="$RESULTS_DIR/report_$TIMESTAMP.json" \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo

echo "✅ Report saved to $RESULTS_DIR/report_$TIMESTAMP.json"
echo "📊 Opening report in browser..."
open "$RESULTS_DIR/report_$TIMESTAMP.json" 2>/dev/null || echo "Open the JSON file manually"
