<script lang="ts" setup>
  /**
   * Get localized path helper from Nuxt i18n
   */
  const localePath = useLocalePath();

  /**
   * Component props interface
   */
  interface Props {
    isDark?: boolean; // Controls whether to apply dark mode styling
  }

  /**
   * Default props configuration
   */
  const props = withDefaults(defineProps<Props>(), {
    isDark: false, // Default to light mode styling
  });
</script>

<template>
  <!--
    Logo component with link to homepage
    - Supports dark/light mode via isDark prop
    - Includes proper accessibility features
    - Uses cursor-scale class for hover effects
  -->
  <nuxt-link :to="localePath('/')" class="block cursor-scale">
    <!-- Screen reader text for accessibility -->
    <span class="sr-only">Components</span>

    <!-- Logo image with conditional dark mode styling -->
    <img :class="{ 'brightness-0 invert': props.isDark }" alt="" src="/images/logos/components_logo.svg" />
  </nuxt-link>
</template>

<style scoped></style>
