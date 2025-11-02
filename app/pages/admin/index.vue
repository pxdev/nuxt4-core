<script setup>
definePageMeta({
  middleware: ["admin"],
});
</script>

<template>
  <u-container class="py-10 space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Welcome, Admin</h1>
      <p class="mt-2 text-sm text-gray-500">
        Manage your learning catalog and site content from one place.
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <u-card class="space-y-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Course library</h2>
            <p class="text-sm text-gray-500">
              Review, create, and update coaching programs.
            </p>
          </div>
          <u-icon name="i-heroicons-academic-cap" class="h-10 w-10 text-primary-500" />
        </div>
        <u-button to="/admin/courses" color="primary" trailing-icon="i-heroicons-arrow-right-20-solid">
          Manage courses
        </u-button>
      </u-card>

      <u-card class="space-y-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Site pages</h2>
            <p class="text-sm text-gray-500">
              Create and maintain marketing and help center pages.
            </p>
          </div>
          <u-icon name="i-heroicons-document-text" class="h-10 w-10 text-primary-500" />
        </div>
        <u-button to="/admin/pages" color="primary" trailing-icon="i-heroicons-arrow-right-20-solid">
          Manage pages
        </u-button>
      </u-card>

      <u-card class="space-y-4 opacity-60">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Admin management</h2>
            <p class="text-sm text-gray-500">
              Invite teammates and manage roles. Coming soon.
            </p>
          </div>
          <u-icon name="i-heroicons-user-group" class="h-10 w-10 text-gray-400" />
        </div>
        <u-button color="gray" variant="soft" disabled>
          In progress
        </u-button>
      </u-card>
    </div>
  </u-container>
</template>
