<script setup lang="ts">
import config from '@/assets/fontello/config.json';
const props = defineProps({
  icon: {
    required: true,
    type: String,
  },
  inline: {
    required: false,
    default: false,
    type: Boolean,
  },
});
const fontData = reactive<Record<string, number>>({});
config.glyphs.forEach((glyph) => {
  fontData[glyph.css] = glyph.code;
});
</script>
<template>
  <div class="icon" :class="{ inline: inline }">
    {{ String.fromCharCode(fontData[icon]!) }}
  </div>
</template>
<style scoped lang="scss">
@use '@/styles/themes.scss' as *;
.icon {
  font-family: 'fontello';
  display: block;
  user-select: none;
  height: 1em;
  width: 1em;
  line-height: 1em;
  &.inline {
    display: inline;
  }
  @include useTheme {
    color: getTheme(text-color);
  }
}
</style>
