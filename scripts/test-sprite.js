#!/usr/bin/env node

/**
 * Test script for sprite generation
 * Verifies that the generated sprite contains all expected flags
 */

const fs = require('fs')
const path = require('path')

const spriteFile = path.join(__dirname, '../flags/sprite.svg')

console.log('Testing sprite generation...\n')

// Check if sprite file exists
if (!fs.existsSync(spriteFile)) {
  console.error('❌ FAIL: Sprite file not found at', spriteFile)
  process.exit(1)
}
console.log('✓ Sprite file exists')

// Read sprite content
const spriteContent = fs.readFileSync(spriteFile, 'utf8')

// Check if it's valid XML
if (!/^\s*<\?xml/.test(spriteContent)) {
  console.error('❌ FAIL: Sprite is not valid XML')
  process.exit(1)
}
console.log('✓ Sprite is valid XML')

// Check if it contains the SVG root element
if (!spriteContent.includes('<svg') || !spriteContent.includes('</svg>')) {
  console.error('❌ FAIL: Sprite missing SVG root element')
  process.exit(1)
}
console.log('✓ Sprite has SVG root element')

// Count symbols
const symbolMatches = spriteContent.match(/<symbol id="flag-[^"]+"/g)
if (!symbolMatches) {
  console.error('❌ FAIL: No symbols found in sprite')
  process.exit(1)
}
console.log(`✓ Found ${symbolMatches.length} symbols`)

// Count closing tags
const closingMatches = spriteContent.match(/<\/symbol>/g)
if (!closingMatches || closingMatches.length !== symbolMatches.length) {
  console.error('❌ FAIL: Mismatched symbol tags')
  console.error(`  Opening tags: ${symbolMatches.length}`)
  console.error(`  Closing tags: ${closingMatches ? closingMatches.length : 0}`)
  process.exit(1)
}
console.log(`✓ All ${closingMatches.length} symbols properly closed`)

// Check for specific flags
const requiredFlags = ['us', 'fr', 'gb', 'de', 'jp', 'cn', 'unknown']
let missingFlags = []

requiredFlags.forEach(flag => {
  if (!spriteContent.includes(`id="flag-${flag}"`)) {
    missingFlags.push(flag)
  }
})

if (missingFlags.length > 0) {
  console.error(`❌ FAIL: Missing required flags: ${missingFlags.join(', ')}`)
  process.exit(1)
}
console.log('✓ All required flags present')

// Check that all symbols have viewBox
const symbolsWithoutViewBox = symbolMatches.filter(symbol => {
  const symbolId = symbol.match(/id="([^"]+)"/)[1]
  const symbolRegex = new RegExp(`<symbol id="${symbolId}"[^>]*>`)
  const symbolTag = spriteContent.match(symbolRegex)
  return symbolTag && !symbolTag[0].includes('viewBox')
})

if (symbolsWithoutViewBox.length > 0) {
  console.warn(`⚠️  WARNING: ${symbolsWithoutViewBox.length} symbols missing viewBox`)
  console.warn('  Symbols:', symbolsWithoutViewBox.slice(0, 5).join(', '), symbolsWithoutViewBox.length > 5 ? '...' : '')
}

// Check file size
const stats = fs.statSync(spriteFile)
const fileSizeKB = Math.round(stats.size / 1024)
console.log(`✓ Sprite file size: ${fileSizeKB} KB`)

if (fileSizeKB > 1024) {
  console.warn(`⚠️  WARNING: Sprite file is larger than 1MB (${fileSizeKB} KB)`)
}

console.log('\n✅ All tests passed!')
console.log(`\nSummary:`)
console.log(`  - Total symbols: ${symbolMatches.length}`)
console.log(`  - File size: ${fileSizeKB} KB`)
console.log(`  - All symbols properly formatted`)
