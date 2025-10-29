<script setup>
import { computed } from "vue";
import { useDateFormat } from "@vueuse/core";

definePageMeta({
  middleware() {
    const { loggedIn } = useUserSession();
    if (!loggedIn.value) {
      return navigateTo("/");
    }
  },
});

const breadcrumbItems = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Account",
    to: "/account",
  },
  {
    label: "My Learning",
    to: "/account/courses",
  },
];

const {
  data: courses,
  status,
  error,
  refresh,
} = await useAsyncData("account-courses", () => $fetch("/api/courses"));

const isLoading = computed(() => status.value === "pending");
const hasCourses = computed(() => (courses.value?.length ?? 0) > 0);

const formatDate = (timestamp) => {
  try {
    return useDateFormat(new Date(timestamp), "MMM d, yyyy").value;
  } catch {
    return "";
  }
};
</script>

<template>
  <section class="pb-12">
    <div class="bg-white border-b border-gray-200 py-10">
      <u-container>
        <u-breadcrumb class="mb-4" :items="breadcrumbItems" />
        <base-heading is="h1" class="text-3xl font-semibold">
          My Learning
        </base-heading>
        <p class="mt-2 max-w-2xl text-sm text-gray-500">
          Track your active coaching programs, review progress, and jump back
          into upcoming sessions.
        </p>
      </u-container>
    </div>

    <u-container class="mt-8 space-y-6">
      <div v-if="isLoading" class="space-y-4">
        <u-card v-for="n in 2" :key="`course-skeleton-${n}`" class="overflow-hidden">
          <div class="flex flex-col gap-6 md:flex-row">
            <div class="md:w-48">
              <u-skeleton class="h-32 w-full rounded-lg" />
            </div>
            <div class="flex flex-1 flex-col gap-4">
              <u-skeleton class="h-6 w-1/2 rounded" />
              <u-skeleton class="h-4 w-full rounded" />
              <u-skeleton class="h-4 w-3/4 rounded" />
              <div class="flex items-center justify-between">
                <u-skeleton class="h-5 w-24 rounded" />
                <u-skeleton class="h-9 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </u-card>
      </div>

      <u-alert
        v-else-if="error"
        icon="i-heroicons-exclamation-triangle"
        color="rose"
        :title="error.message ?? 'Unable to load courses'"
        description="We couldn’t load your course list. Please try again."
        :actions="[
          {
            label: 'Retry',
            color: 'rose',
            variant: 'soft',
            onClick: () => refresh(),
          },
        ]"
      />

      <u-card v-else-if="!hasCourses">
        <div class="flex flex-col items-center gap-4 py-8 text-center">
          <div class="flex size-16 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <u-icon name="i-heroicons-academic-cap" class="h-8 w-8" />
          </div>
          <div>
            <base-heading is="h2" class="text-lg font-semibold">
              You’re not enrolled yet
            </base-heading>
            <p class="mt-2 max-w-sm text-sm text-gray-500">
              When you join a coaching program, it will appear here so you can manage your learning journey.
            </p>
          </div>
          <u-button to="/services" color="primary" variant="solid">
            Explore Programs
          </u-button>
        </div>
      </u-card>

      <u-card
        v-for="course in courses"
        v-else
        :key="course.id"
        class="overflow-hidden"
      >
        <div class="flex flex-col gap-6 md:flex-row">
          <div class="md:w-48">
            <nuxt-img
              v-if="course.thumbnail"
              :src="course.thumbnail"
              :alt="course.title"
              class="h-32 w-full rounded-lg object-cover"
              format="webp"
            />
            <div
              v-else
              class="flex h-32 w-full items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-500"
            >
              No Image
            </div>
          </div>

          <div class="flex flex-1 flex-col justify-between gap-4">
            <div>
              <div class="flex flex-wrap items-start gap-3">
                <base-heading is="h2" class="text-xl font-semibold">
                  {{ course.title }}
                </base-heading>
                <course-status-badge :status="course.status" />
              </div>
              <p class="mt-2 text-sm text-gray-600">
                {{ course.description }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span class="flex items-center gap-2">
                <u-icon name="i-heroicons-calendar" class="h-4 w-4" />
                Purchased {{ formatDate(course.purchasedAt) }}
              </span>
              <span v-if="course.level" class="flex items-center gap-2">
                <u-icon name="i-heroicons-academic-cap" class="h-4 w-4" />
                Active level: {{ course.level.label }}
              </span>
            </div>
          </div>

          <div class="flex items-end md:w-40 md:justify-end">
            <u-button
              :to="`/account/courses/${course.id}`"
              color="primary"
              variant="solid"
              trailing-icon="i-heroicons-arrow-right-20-solid"
            >
              View
            </u-button>
          </div>
        </div>
      </u-card>
    </u-container>
  </section>
</template>
