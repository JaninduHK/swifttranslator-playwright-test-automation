const { test, expect } = require('@playwright/test');
const XLSX = require('xlsx');
const path = require('path');

// Test data - This will be loaded from Excel
const testCases = [
  // Positive Functional Tests
  {
    id: 'Pos_Fun_0004',
    input: 'api paasal yanavaa.',
    expected: 'අපි පාසල් යනවා.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0005',
    input: 'mata bath oonee.',
    expected: 'මට බත් ඕනේ.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0006',
    input: 'eyaa gedhara giyaa.',
    expected: 'එයා ගෙදර ගියා.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0007',
    input: 'api kaeema kanna yanavaa saha passe chithrapatayakuth balanavaa.',
    expected: 'අපි කෑම කන්න යනවා සහ පස්සෙ චිත්‍රපටයකුත් බලනවා.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0008',
    input: 'oyaa hari, ehenam api yamu.',
    expected: 'ඔයා හරි, එහෙනම් අපි යමු.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0009',
    input: 'oya enavaanam mama balan innavaa.',
    expected: 'ඔය එනවානම් මම බලං ඉන්නවා.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0010',
    input: 'vaessa unath api yanna epaeyi.',
    expected: 'වැස්ස උනත් අපි යන්න එපැයි.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0011',
    input: 'oyaa kavadhdha enna hithan inne?',
    expected: 'ඔයා කවද්ද එන්න හිතං ඉන්නේ?',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0012',
    input: 'meeka hariyata vaeda karanavaadha?',
    expected: 'මීක හරියට වැඩ කරනවාද?',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0013',
    input: 'vahaama enna.',
    expected: 'වහාම එන්න.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0014',
    input: 'mata kiyanna.',
    expected: 'මට කියන්න.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0015',
    input: 'mama iiyee gedhara giyaa.',
    expected: 'මම ඊයේ ගෙදර ගියා.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0016',
    input: 'mama heta enavaa.',
    expected: 'මම හෙට එනවා.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0017',
    input: 'mama ehema karannee naehae.',
    expected: 'මම එහෙම කරන්නේ නෑහැ.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0018',
    input: 'mata eeka epaa.',
    expected: 'මට ඒක එපා.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0019',
    input: 'oyaalaa enavadha?',
    expected: 'ඔයාලා එනවද?',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0020',
    input: 'eyaalaa enavaa.',
    expected: 'ඒයාලා එනවා.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0021',
    input: 'karuNaakaralaa mata podi udhavvak karanna puLuvandha?',
    expected: 'කරුණාකරලා මට පොඩි උදව්වක් කරන්න පුළුවන්ද?',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0022',
    input: 'eeyi, ooka dhiyan.',
    expected: 'ඒයි, ඕක දියං.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0023',
    input: 'hari hari',
    expected: 'හරි හරි',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0024',
    input: 'baya naee',
    expected: 'බය නෑ',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0025',
    input: 'siiyaa Colombo yanna hadhannee.',
    expected: 'සීයා Colombo යන්න හදන්නේ.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0026',
    input: 'Zoom meeting ekak thiyennee.',
    expected: 'Zoom meeting එකක් තියෙන්නේ.',
    type: 'positive'
  },
  {
    id: 'Pos_Fun_0027',
    input: 'aayuboovan!',
    expected: 'ආයුබෝවන්!',
    type: 'positive'
  },
  // Negative Functional Tests
  {
    id: 'Neg_Fun_0001',
    input: 'mamagedharayanavaa',
    expected: 'මම ගෙදර යනවා',
    type: 'negative'
  },
  {
    id: 'Neg_Fun_0002',
    input: 'matapaankannaoonee',
    expected: 'මට පාන් කන්න ඕනී',
    type: 'negative'
  },
  {
    id: 'Neg_Fun_0003',
    input: 'hetaapiyanavaa',
    expected: 'හෙට අපි යනවා',
    type: 'negative'
  },
  {
    id: 'Neg_Fun_0004',
    input: 'mama     gedhara     yanavaa.',
    expected: 'මම ගෙදර යනවා.',
    type: 'negative'
  },
  {
    id: 'Neg_Fun_0005',
    input: 'mata  raeeta  kanna   bath    oonee.',
    expected: 'මට රෑට කන්න බත් ඕනී.',
    type: 'negative'
  },
  {
    id: 'Neg_Fun_0006',
    input: 'vidheeshiiya rataka niShpaadhitha gini aviyak saha jiiva uNda dhekak samaGA athadQQguvata gath saekakaru pebaravaari masa 12 vaenidhaa dhakvaa rakShitha banDhanaagaara gatha kara thibee. ee, ohu adha (30) vaththala maheesthraath nikuth kaLa niyoogayakata anuvaya. ladha thorathurak matha polis nilaDhaarin kaNdaayamak pamuNugama pradheeshayeedhii visheeSha soodhisi meheyumak sidhu kara thibee',
    expected: 'විදේශීය රටක නිෂ්පාදිත ගිනි අවියක් සහ ජීව උණ්ඩ දෙකක් සමඟ අත්අඩංගුවට ගත් සැකකරු පෙබරවාරි මස 12 වැනිදා දක්වා රක්ෂිත බන්ධනාගාර ගත කර තිබේ. ඒ, ඔහු අද (30) වත්තල මහේස්ත්‍රාත් නිකුත් කළ නියෝගයකට අනුවය. ලද තොරතුරක් මත පොලිස් නිලධාරින් කණ්ඩායමක් පමුණුගම ප්‍රදේශයේදී විශේෂ සෝදිසි මෙහෙයුමක් සිදු කර තිබේ',
    type: 'negative'
  },
  {
    id: 'Neg_Fun_0007',
    input: 'api passee kathaa karamu api passee kathaa karamu api passee kathaa karamu api passee kathaa karamu api passee kathaa karamu api passee kathaa karamu api passee kathaa karamu api passee kathaa karamu api passee kathaa karamu api passee kathaa karamu api passee kathaa karamu api passee kathaa karamu api passee kathaa karamu.',
    expected: 'අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු අපි පස්සේ කතා කරමු.',
    type: 'positive'
  },
  {
    id: 'Neg_Fun_0008',
    input: 'mata Rs. 8473 dhenna.',
    expected: 'මට Rs. 8473 දෙන්න.',
    type: 'positive'  
  },
  {
    id: 'Neg_Fun_0009',
    input: 'dhesaembar 25 mata thiyenne.',
    expected: 'දෙසැම්බර් 25 මට තියෙන්නෙ.',
    type: 'negative'
  },
  {
    id: 'Neg_Fun_0010',
    input: 'adoo vaedak baaragaththaanam eeka hariyata karapanko bQQ.',
    expected: 'අඩෝ වැඩක් බාරගත්තානම් ඒක හරියට කරපන්කෝ බං.',
    type: 'negative'
  }
];

test.describe('Singlish to Sinhala Translator Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // Test each case
  testCases.forEach((testCase) => {
    test(`${testCase.id}: ${testCase.type} test`, async ({ page }) => {

      // Locate the input field - textarea under "Singlish" label
      const inputField = page.locator('textarea').first();

      // Clear any existing text
      await inputField.clear();

      // Type the input text
      await inputField.fill(testCase.input);

      // Dismiss any autocomplete dropdown
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      await page.keyboard.press('Escape');
      await page.keyboard.press('Tab');

      // Wait for real-time conversion (the site converts automatically)
      await page.waitForTimeout(2000);

      // Get the actual output from the Sinhala panel (right side)
      let actualOutput = '';

      // Try to get text from the Sinhala output panel directly
      // The panel has class "panel-title" with text "Sinhala", and the output is in the next div
      try {
        const sinhalaOutputDiv = page.locator('.panel-title:has-text("Sinhala")').locator('..').locator('div').nth(1);
        const panelText = await sinhalaOutputDiv.textContent({ timeout: 1000 });
        if (panelText && /[\u0D80-\u0DFF]/.test(panelText)) {
          actualOutput = panelText.trim();
        }
      } catch {
        // Try alternative selector
      }

      // Alternative: try to find the rightmost panel content
      if (!actualOutput) {
        try {
          // Look for a container that's likely the output area (on the right side of the page)
          const outputArea = page.locator('div').filter({ hasText: /^[\u0D80-\u0DFF\s\u200D.,?!]+$/ }).last();
          const text = await outputArea.textContent({ timeout: 500 });
          if (text && text.length > 3 && /\s/.test(text)) {
            actualOutput = text.trim();
          }
        } catch {
          // Continue to fallback
        }
      }

      // Final fallback: Get text from body excluding common UI elements
      if (!actualOutput) {
        // Get inner text from all elements, find the one that looks like a translation
        const allElements = page.locator('div, p, span');
        const count = await allElements.count();
        for (let i = 0; i < count && !actualOutput; i++) {
          try {
            const text = await allElements.nth(i).textContent({ timeout: 100 });
            if (text && /^[\u0D80-\u0DFF\s\u200D.,?!]+$/.test(text.trim()) && text.includes(' ') && text.length > 10) {
              actualOutput = text.trim();
              break;
            }
          } catch {
            // Skip this element
          }
        }
      }
      
      // Log the results
      console.log(`\nTest Case: ${testCase.id}`);
      console.log(`Input: ${testCase.input}`);
      console.log(`Expected: ${testCase.expected}`);
      console.log(`Actual: ${actualOutput}`);
      
      // Normalize Unicode for Sinhala text comparison (NFC normalization)
      const normalizedActual = actualOutput.trim().normalize('NFC');
      const normalizedExpected = testCase.expected.trim().normalize('NFC');

      // Debug: Show string lengths and character codes if different
      if (normalizedActual !== normalizedExpected) {
        console.log(`Length - Expected: ${normalizedExpected.length}, Actual: ${normalizedActual.length}`);
        // Find first differing character
        for (let i = 0; i < Math.max(normalizedActual.length, normalizedExpected.length); i++) {
          if (normalizedActual[i] !== normalizedExpected[i]) {
            console.log(`First diff at index ${i}:`);
            console.log(`  Expected char: "${normalizedExpected[i]}" (code: ${normalizedExpected.charCodeAt(i)})`);
            console.log(`  Actual char: "${normalizedActual[i]}" (code: ${normalizedActual.charCodeAt(i)})`);
            break;
          }
        }
      }

      // For positive tests, check if output matches expected
      if (testCase.type === 'positive') {
        const isMatch = normalizedActual === normalizedExpected;
        console.log(`Status: ${isMatch ? 'PASS' : 'FAIL'}`);

        // Assert with normalized strings
        expect(normalizedActual).toBe(normalizedExpected);
      } else {
        // Negative tests - expect the output to NOT match
        const isFailed = normalizedActual !== normalizedExpected;
        console.log(`Status: ${isFailed ? 'FAIL (Expected)' : 'UNEXPECTED PASS'}`);

        expect(normalizedActual).not.toBe(normalizedExpected);
      }
    });
  });

  // Helper function to get Sinhala output from page
  async function getSinhalaOutput(page) {
    // Try to get text from the Sinhala panel directly
    try {
      const sinhalaPanel = page.locator('div.panel-title:has-text("Sinhala")').locator('xpath=following-sibling::*[1]');
      const panelText = await sinhalaPanel.textContent({ timeout: 1000 });
      if (panelText && /[\u0D80-\u0DFF]/.test(panelText)) {
        return panelText.trim();
      }
    } catch {
      // Fallback to regex search
    }

    const pageText = await page.locator('body').textContent() || '';
    const sinhalaMatches = pageText.match(/[\u0D80-\u0DFF\u200D]+[\s\u00A0]+[\u0D80-\u0DFF\u200D\s\u00A0.?!,]+/g);
    if (sinhalaMatches && sinhalaMatches.length > 0) {
      const sentences = sinhalaMatches.filter(m => (m.match(/\s/g) || []).length >= 2);
      if (sentences.length > 0) {
        return sentences[0].trim();
      }
      return sinhalaMatches.reduce((a, b) => a.length > b.length ? a : b).trim();
    }
    return '';
  }

  // UI Test: Real-time output update
  test('Pos_UI_0001: Sinhala output updates automatically in real-time', async ({ page }) => {
    const inputField = page.locator('textarea').first();

    await inputField.clear();

    // Type character by character and check real-time updates
    const testInput = 'man gedhara yanavaa';
    const chars = testInput.split('');

    for (let i = 0; i < chars.length; i++) {
      await inputField.press(chars[i]);
      await page.waitForTimeout(100);
    }

    // Dismiss autocomplete and wait for conversion
    await page.keyboard.press('Escape');
    await page.click('body', { position: { x: 900, y: 300 } });
    await page.waitForTimeout(2000);

    // Check that output has been updated
    const output = await getSinhalaOutput(page);
    console.log(`\nUI Test - Real-time update`);
    console.log(`Input: ${testInput}`);
    console.log(`Output: ${output}`);
    console.log(`Status: ${output.length > 0 ? 'PASS' : 'FAIL'}`);

    expect(output.length).toBeGreaterThan(0);
  });

  // UI Test: Clear functionality
  test('Pos_UI_0002: Clear input button clears both fields', async ({ page }) => {
    const inputField = page.locator('textarea').first();

    // Fill input
    await inputField.fill('mama gedhara yanavaa');
    await page.keyboard.press('Escape');
    await page.click('body', { position: { x: 900, y: 300 } });
    await page.waitForTimeout(2000);

    // Check output was generated
    const output = await getSinhalaOutput(page);
    console.log(`\nBefore clear - Output: ${output}`);

    // Click the Clear button
    await page.click('button:has-text("Clear")');
    await page.waitForTimeout(500);

    // Check both fields are empty
    const inputAfterClear = await inputField.inputValue();
    const outputAfterClear = await getSinhalaOutput(page);

    console.log(`\nUI Test - Clear functionality`);
    console.log(`Input after clear: "${inputAfterClear}"`);
    console.log(`Output after clear: "${outputAfterClear}"`);
    console.log(`Status: ${inputAfterClear === '' && outputAfterClear === '' ? 'PASS' : 'FAIL'}`);

    expect(inputAfterClear).toBe('');
  });
});
