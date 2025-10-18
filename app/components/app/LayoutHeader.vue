<script setup>
import { useScroll } from '@vueuse/core'

const { t } = useI18n()
const localePath = useLocalePath()
const { loggedIn, clear, openInPopup } = useUserSession()

// ===============================
// Navigation
// ===============================
const navLinks = [
  { id: 1, label: t('Home'), to: localePath('/') },
  { id: 2, label: t('About Us'), to: localePath('/about') },
  { id: 3, label: t('Courses'), to: localePath('/courses') },
  { id: 4, label: t('Blog'), to: localePath('/blog') },
  { id: 5, label: t('Contact Us'), to: localePath('/contact') },
]

const mobileMenuOpen = ref(false)

// ===============================
// Scroll + Header Visibility
// ===============================
const { y: scrollY } = useScroll(window, { throttle: 100 })
const lastScroll = ref(0)
const isHeaderVisible = ref(true)

watch(scrollY, (newY) => {
  const isAtTop = newY < 200
  const isScrollingUp = newY < lastScroll.value
  isHeaderVisible.value = isAtTop || isScrollingUp
  lastScroll.value = newY
})

const headerClasses = computed(() => [
  'transition duration-500 fixed inset-x-0 top-0 z-50',
  isHeaderVisible.value ? 'translate-y-0' : '-translate-y-full',
])

// ===============================
// Auth Handling
// ===============================
const isAuthLoading = ref(false)

const authButtonLabel = computed(() =>
    loggedIn.value ? t('My Account') : t('Students Login')
)

async function handleAuthAction() {
  isAuthLoading.value = true

  try {
    if (loggedIn.value) {
      await clear() // logout
    } else {
      navigateTo(localePath('/auth/login'))
    }
  } catch (e) {
    console.error('Auth error:', e)
  } finally {
    isAuthLoading.value = false
  }
}

const handleNavClick = () => (mobileMenuOpen.value = false)
</script>

<template>
  <!-- Mobile Menu -->
  <u-slideover v-model:open="mobileMenuOpen">
    <template #content>
      <div class="h-svh flex flex-col px-4">
        <!-- Header -->
        <div class="flex items-center justify-between py-4">
          <main-logo class="w-[160px]" />

          <u-button
              class="rounded-full h-[40px] w-[40px]"
              variant="soft"
              @click="handleNavClick"
          >
            <icon name="hugeicons:cancel-01" class="w-6 h-6" />
          </u-button>
        </div>

        <!-- Navigation Links -->
        <div class="flex-1 overflow-y-auto">
          <u-navigation-menu
              orientation="vertical"
              variant="link"
              :items="navLinks"
              class="w-full justify-center mb-6"
              @click="handleNavClick"
          />
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center py-4 border-t border-gray-200">
          <base-language-switcher />

          <u-button
              color="primary"
              size="xs"
              class="rounded-full py-2 px-5"
              :loading="isAuthLoading"
              @click="handleAuthAction"
          >
            {{ authButtonLabel }}
          </u-button>
        </div>
      </div>
    </template>
  </u-slideover>

  <!-- Desktop Header -->
  <header
      :class="[
      'bg-white/90 dark:bg-neutral-950/90 border-b border-gray-100 dark:border-neutral-800 backdrop-blur',
      headerClasses,
    ]"
  >
    <u-container>
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <main-logo class="w-[160px] dark:invert" />

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex mx-auto gap-6 text-lg">
          <u-navigation-menu variant="link" :items="navLinks" />
        </nav>

        <!-- Actions -->
        <div class="hidden lg:flex items-center gap-4">
          <base-language-switcher />

          <u-button
              color="primary"
              size="xl"
              class="rounded-full py-3 px-6"
              :loading="isAuthLoading"
              @click="handleAuthAction"
          >
            {{ authButtonLabel }}
          </u-button>
        </div>

        <!-- Mobile toggle -->
        <div class="lg:hidden flex">
          <u-link variant="link" @click="mobileMenuOpen = true">
            <icon name="hugeicons:menu-04" class="h-8 w-8" />
          </u-link>
        </div>
      </div>
    </u-container>
  </header>
</template>

<style scoped></style>
