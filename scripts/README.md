# SVG Sprite Generation

This directory contains a script to generate an SVG sprite from all flag SVG files.

## What is an SVG Sprite?

An SVG sprite is a single SVG file that contains multiple symbols (in this case, all country flags). Using a sprite instead of individual SVG files can improve performance by:

- Reducing the number of HTTP requests
- Allowing for better caching
- Enabling efficient reuse of flag symbols across your application

## Generating the Sprite

To generate the sprite file, run:

```bash
npm run generate-sprite
```

This will create a `sprite.svg` file in the `flags/` directory containing all flag symbols.

## Using the Sprite

Once the sprite is generated, you can use it in your HTML like this:

### Method 1: Inline the sprite in your HTML

```html
<!-- Include the sprite content at the start of your HTML -->
<div style="display: none;">
  <!-- Content of flags/sprite.svg goes here -->
</div>

<!-- Use the flags -->
<svg width="64" height="48">
  <use xlink:href="#flag-us"></use>
</svg>

<svg width="64" height="48">
  <use xlink:href="#flag-fr"></use>
</svg>
```

### Method 2: External sprite file

```html
<!-- Reference the external sprite file -->
<svg width="64" height="48">
  <use xlink:href="path/to/flags/sprite.svg#flag-us"></use>
</svg>

<svg width="64" height="48">
  <use xlink:href="path/to/flags/sprite.svg#flag-fr"></use>
</svg>
```

### Flag Symbol IDs

All flags are accessible using the pattern `flag-{countryCode}`, where `{countryCode}` is the two-letter ISO 3166-1 alpha-2 country code in lowercase. For example:

- `flag-us` - United States
- `flag-fr` - France
- `flag-gb` - United Kingdom
- `flag-de` - Germany
- `flag-jp` - Japan
- etc.

## Benefits of Using the Sprite

1. **Performance**: Load all flags with a single HTTP request
2. **Caching**: The sprite file can be cached by the browser
3. **Flexibility**: Easily style and manipulate flags with CSS
4. **File Size**: The combined sprite is often smaller than the sum of individual files due to shared definitions
5. **Maintenance**: Easier to manage and update flags in bulk

## Script Details

The generation script (`scripts/generate-sprite.js`) performs the following:

1. Reads all `.svg` files from the `flags/` directory
2. Extracts the SVG content and viewBox from each file
3. Wraps each flag in a `<symbol>` element with an ID
4. Combines all symbols into a single SVG sprite file
5. Outputs the sprite to `flags/sprite.svg`

The script automatically excludes the sprite file itself from processing to avoid circular references.
