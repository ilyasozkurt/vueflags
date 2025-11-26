#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const flagsDir = path.join(__dirname, '../flags')
const outputFile = path.join(__dirname, '../flags/sprite.svg')
const INDENT = '  '

// Read all SVG files from flags directory
const flagFiles = fs.readdirSync(flagsDir)
  .filter(file => file.endsWith('.svg') && file !== 'sprite.svg')
  .sort()

console.log(`Found ${flagFiles.length} flag files`)

// Start building the sprite
let spriteContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
`

// Process each flag file
flagFiles.forEach(file => {
  const countryCode = path.basename(file, '.svg')
  const filePath = path.join(flagsDir, file)
  const content = fs.readFileSync(filePath, 'utf8')
  
  // Extract the content between <svg> tags
  const svgMatch = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
  
  if (svgMatch) {
    const innerContent = svgMatch[1]
    
    // Extract viewBox from original SVG
    const viewBoxMatch = content.match(/viewBox="([^"]*)"/i)
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 512 512'
    
    // Create a symbol element for this flag
    spriteContent += `${INDENT}<symbol id="flag-${countryCode}" viewBox="${viewBox}">
${innerContent}${INDENT}</symbol>
`
  } else {
    console.warn(`Could not parse SVG content from ${file}`)
  }
})

// Close the sprite SVG
spriteContent += '</svg>\n'

// Write the sprite file
fs.writeFileSync(outputFile, spriteContent, 'utf8')

console.log(`SVG sprite generated successfully at ${outputFile}`)
console.log(`Total symbols: ${flagFiles.length}`)
