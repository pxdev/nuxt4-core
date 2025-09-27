<script setup>
import * as locales from '@nuxt/ui/locale';

const { locale } = useI18n();

 </script>

<template>
  <nuxt-layout>
    <base-network />
    <nuxt-loading-indicator color="#00dc82" :height="5" />
    <u-app :locale="locales[locale]">
      <NuxtPage />
    </u-app>
  </nuxt-layout>
</template>

<style></style>