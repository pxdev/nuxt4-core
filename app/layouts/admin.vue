<script setup>
const navigation = [
  {
    label: "Admin Dashboard",
    to: "/admin",
    icon: "i-heroicons-home-modern",
  },
  {
    label: "Courses",
    to: "/admin/courses",
    icon: "i-heroicons-academic-cap",
  },
  {
    label: "Admins",
    to: "/admin/admins",
    icon: "i-heroicons-user-group",
    disabled: true,
  },
];

const route = useRoute();

const isActive = (to) => route.path === to || route.path.startsWith(`${to}/`);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="border-b border-gray-200 bg-white">
      <u-container class="flex items-center justify-between py-4">
        <div class="flex items-center gap-3">
          <u-icon name="i-heroicons-cog-6-tooth" class="h-6 w-6 text-primary-500" />
          <span class="text-lg font-semibold text-gray-900">Admin Control</span>
        </div>
        <slot name="header-actions" />
      </u-container>
    </header>

    <div class="mx-auto flex w-full max-w-7xl">
      <aside class="hidden w-64 border-r border-gray-200 bg-white lg:block">
        <nav class="flex flex-col gap-1 px-4 py-6">
          <u-button
            v-for="item in navigation"
            :key="item.to"
            :to="item.disabled ? undefined : item.to"
            :variant="isActive(item.to) ? 'solid' : 'ghost'"
            :color="isActive(item.to) ? 'primary' : 'gray'"
            :disabled="item.disabled"
            class="justify-start"
            block
          >
            <template #leading>
              <u-icon :name="item.icon" class="h-5 w-5" />
            </template>
            {{ item.label }}
          </u-button>
        </nav>
      </aside>

      <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>
