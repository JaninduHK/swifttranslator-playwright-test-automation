# Singlish to Sinhala Translator - Automated Tests

Automated testing for the translator at https://www.swifttranslator.com/

---

## Setup

You'll need Node.js (v16+) installed. Then:

```bash
npm install
npx playwright install
```

## Running Tests

```bash
# Run all tests (headless)
npm test

# Watch tests run in browser
npm run test:headed

# Debug mode
npm run test:debug

# Interactive UI
npm run test:ui
```

To run specific tests:

```bash
npx playwright test --grep "Pos_Fun_0004"   # single test
npx playwright test --grep "Pos_Fun"         # all positive tests
npx playwright test --grep "Neg_Fun"         # all negative tests
```

## Viewing Results

After tests run, open the HTML report:

```bash
npx playwright show-report
```

You'll see pass/fail status, screenshots of failures, and execution times.

---

## What's Being Tested

### Positive Tests (24)
- Simple, compound, and complex sentences
- Questions and commands
- Different tenses and negations
- Polite vs informal speech
- Mixed language (English place names, technical terms)

### Negative Tests (10)
- Missing or excessive spaces
- Very long paragraphs
- Numbers, dates, currency
- Heavy slang

### UI Tests (2)
- Real-time output updates while typing
- Clear button works correctly

---

## Good to Know

- Negative tests are *supposed* to fail — they check how the system handles bad input
- If tests time out, increase the timeout in `playwright.config.js`

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Module not found | Run `npm install` |
| Browser not found | Run `npx playwright install` |
| Tests timing out | Check your internet or increase timeout |

---

**Created for:** IT3040 ITPM Assignment 1  
**Date:** January 2026
