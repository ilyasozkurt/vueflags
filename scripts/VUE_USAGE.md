# Using SVG Sprite with Vue

While the `<vue-flag>` component uses individual SVG files, you can also use the generated sprite for custom implementations or better performance in specific scenarios.

## Vue Component Example

Here's a simple Vue component that uses the sprite:

```vue
<template>
  <svg :width="width" :height="height" :viewBox="viewBox">
    <use :xlink:href="`${spritePath}#flag-${code}`"></use>
  </svg>
</template>

<script>
export default {
  name: 'FlagSprite',
  props: {
    code: {
      type: String,
      required: true
    },
    width: {
      type: [String, Number],
      default: 64
    },
    height: {
      type: [String, Number],
      default: 48
    },
    spritePath: {
      type: String,
      default: '/flags/sprite.svg'
    }
  },
  computed: {
    viewBox() {
      return '0 0 512 512'
    }
  }
}
</script>

<style scoped>
svg {
  display: inline-block;
}
</style>
```

## Usage Example

```vue
<template>
  <div class="flags">
    <FlagSprite code="us" :width="80" :height="60" />
    <FlagSprite code="fr" :width="80" :height="60" />
    <FlagSprite code="gb" :width="80" :height="60" />
  </div>
</template>

<script>
import FlagSprite from './FlagSprite.vue'

export default {
  components: {
    FlagSprite
  }
}
</script>
```

## Nuxt.js Integration

For Nuxt.js, you can place the sprite in the `static/` directory:

1. Copy `flags/sprite.svg` to `static/flags/sprite.svg`
2. Use the component with `spritePath="/flags/sprite.svg"`

## Benefits of Sprite Approach

1. **Single HTTP Request**: All flags loaded at once
2. **Better Caching**: One file to cache instead of 250+
3. **Smaller Total Size**: Shared SVG definitions reduce overhead
4. **CSS Styling**: Easy to style with CSS (fill, stroke, etc.)

## When to Use Sprite vs Individual Files

### Use Sprite When:
- You need many different flags on the same page
- You want to optimize for HTTP/1.1 connections
- You need all flags available immediately

### Use Individual Files When:
- You only need a few specific flags
- You want lazy loading of flags
- You're using HTTP/2 (multiplexing reduces the benefit of sprites)
- The default `<vue-flag>` component meets your needs

## Advanced: Inlining the Sprite

For even better performance, you can inline the sprite in your HTML/Vue template:

```vue
<template>
  <div>
    <!-- Inline sprite (hidden) -->
    <svg v-once style="display: none;" v-html="spriteContent"></svg>
    
    <!-- Use flags -->
    <svg width="64" height="48" viewBox="0 0 512 512">
      <use xlink:href="#flag-us"></use>
    </svg>
  </div>
</template>

<script>
import spriteContent from '!!raw-loader!@/assets/flags/sprite.svg'

export default {
  data() {
    return {
      spriteContent
    }
  }
}
</script>
```

Note: This requires configuring webpack to load SVG as raw text.
