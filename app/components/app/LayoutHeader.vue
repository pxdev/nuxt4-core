<script lang="ts" setup>
  import { useScroll } from '@vueuse/core';

  const { t } = useI18n();
  const localePath = useLocalePath();

  interface NavLink {
    id?: number;
    label: string;
    to?: string;
    icon?: string;
    description?: string;
    children?: NavLink[];
  }

  const navLinks: NavLink[] = [
    {
      id: 1,
      label: t('header.home'),
      to: localePath('/'),
    },
    {
      id: 2,
      label: t('header.aboutUs'),
      to: localePath('/company'),
      children: [
        {
          label: 'Introduction',
          description: 'Fully styled and customizable components for Nuxt.',
          icon: 'i-lucide-house',
        },
        {
          label: 'Introduction',
          description: 'Fully styled and customizable components for Nuxt.',
          icon: 'i-lucide-house',
        },
      ],
    },
    {
      id: 3,
      label: t('header.contact'),
      to: localePath('/contact'),
    },
  ];

  const mobileMenuOpen = ref<boolean>(false);

  const { y: scrollY } = useScroll(window, { throttle: 100 });
  const lastScrollPosition = ref<number>(0);
  const isHeaderVisible = ref<boolean>(true);

  const headerClasses = computed(() => {
    const baseClasses = 'transition  duration-500 fixed inset-x-0 top-0 z-50 ';
    const visibilityClass = isHeaderVisible.value ? 'translate-y-0' : '-translate-y-full';
    return `${baseClasses} ${visibilityClass}`;
  });

  watch(scrollY, (newY) => {
    const isAtTop = newY < 200;
    const isScrollingUp = newY < lastScrollPosition.value;

    isHeaderVisible.value = isAtTop || isScrollingUp;
    lastScrollPosition.value = newY;
  });

  const handleNavClick = () => {
    mobileMenuOpen.value = false;
  };
</script>

<template>
  <u-slideover v-model:open="mobileMenuOpen">
    <template #content>
      <div class="h-svh flex flex-col px-4">
        <div class="flex items-center justify-between py-4 z-100">
          <main-logo class="w-[160px]" />

          <u-button class="rounded-full h-[40px] w-[40px] cursor-scale" variant="soft" @click="handleNavClick">
            <span class="sr-only">Close menu</span>
            <icon aria-hidden="true" class="w-8 h-8" name="hugeicons:cancel-01" />
          </u-button>
        </div>

        <div class="flex-1 overflow-x-auto">
          <u-navigation-menu
            orientation="vertical"
            variant="link"
            :items="navLinks"
            class="w-full justify-center mb-4"
          />
        </div>

        <!-- Language switcher in mobile menu -->
        <div class="flex justify-between py-4 items-center border-gray-200">
          <div class="flex items-center">
            <u-color-mode-button />
            <base-language-switcher />
          </div>
          <u-button :to="localePath('/account')" color="primary" size="xs" class="cursor-scale rounded-full py-3 px-6">
            <duplicate-hover-text>My Account</duplicate-hover-text>
          </u-button>
        </div>
      </div>
    </template>
  </u-slideover>
  <!-- Main header with auto-hide on scroll -->
  <header
    :class="[
      'bg-white/90 dark:bg-neutral-950/90 border-b border-gray-100 dark:border-neutral-800 backdrop-blur',
      headerClasses,
    ]"
  >
    <u-container>
      <div class="flex justify-between items-center py-4">
        <!-- Logo section -->
        <div class="flex items-center shrink-0">
          <main-logo class="w-[160px] dark:invert" />
        </div>

        <!-- Desktop navigation links -->
        <nav class="hidden lg:flex mx-auto w-full gap-4 text-lg">
          <u-navigation-menu variant="link" :items="navLinks" class="w-full justify-center" />
        </nav>

        <!-- Mobile menu toggle button -->
        <div class="flex cursor-scale lg:hidden">
          <u-link color="white" variant="link" @click="mobileMenuOpen = true">
            <span class="sr-only">Open</span>
            <icon class="h-8 w-8" name="hugeicons:menu-04" />
          </u-link>
        </div>

        <div class="hidden lg:flex items-center shrink-0 gap-12">
          <div class="flex items-center">
            <u-color-mode-button class="hidden lg:flex" />
            <base-language-switcher class="hidden lg:flex" />
          </div>

          <u-button :to="localePath('/account')" color="primary" size="xl" class="cursor-scale rounded-full py-3 px-6">
            My Account
          </u-button>
        </div>
      </div>
    </u-container>
  </header>
</template>

<style scoped></style>
