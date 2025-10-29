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

const route = useRoute();
const courseId = computed(() => Number.parseInt(route.params.id, 10));

if (!Number.isFinite(courseId.value) || courseId.value <= 0) {
  throw createError({
    statusCode: 404,
    statusMessage: "Course not found",
  });
}

const {
  data: course,
  status,
  error,
  refresh,
} = await useAsyncData(
  () => `account-course-${courseId.value}`,
  () => $fetch(`/api/courses/${courseId.value}`),
  {
    watch: [courseId],
  },
);

const breadcrumbItems = computed(() => [
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
  {
    label: course.value?.title ?? "Loading",
    to: `/account/courses/${courseId.value}`,
  },
]);

const isLoading = computed(() => status.value === "pending");
const activeLevel = computed(() => course.value?.level ?? null);

const formatDate = (timestamp) => {
  if (!timestamp) {
    return "—";
  }
  try {
    return useDateFormat(new Date(timestamp), "MMM d, yyyy").value;
  } catch {
    return "—";
  }
};

const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) {
    return "—";
  }
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours && remaining) {
    return `${hours}h ${remaining}m`;
  }
  if (hours) {
    return `${hours}h`;
  }
  return `${remaining}m`;
};

const lectureRows = computed(() =>
  (course.value?.lectures ?? []).map((lecture) => ({
    id: lecture.id,
    title: lecture.title,
    description: lecture.description,
    duration: formatDuration(lecture.durationMinutes),
    startsAt:
      lecture.startsAt && lecture.startsAt > 0
        ? formatDate(lecture.startsAt)
        : "On-demand",
    resourceLink: lecture.resourceLink,
  })),
);

const lectureColumns = [
  { key: "title", label: "Lecture" },
  { key: "duration", label: "Duration" },
  { key: "startsAt", label: "Schedule" },
  { key: "resourceLink", label: "Resources" },
];
</script>

<template>
  <section class="pb-12">
    <div class="bg-white border-b border-gray-200 py-10">
      <u-container>
        <u-breadcrumb class="mb-4" :items="breadcrumbItems" />
        <base-heading is="h1" class="text-3xl font-semibold">
          {{ course?.title ?? "Loading course..." }}
        </base-heading>
        <p v-if="course?.description" class="mt-2 max-w-3xl text-sm text-gray-500">
          {{ course.description }}
        </p>
      </u-container>
    </div>

    <u-container class="mt-8 space-y-6">
      <div v-if="isLoading" class="space-y-4">
        <u-card>
          <div class="flex flex-col gap-4">
            <u-skeleton class="h-6 w-1/3 rounded" />
            <u-skeleton class="h-4 w-full rounded" />
            <u-skeleton class="h-4 w-2/3 rounded" />
          </div>
        </u-card>
        <u-card>
          <u-skeleton class="h-6 w-1/4 rounded" />
          <u-skeleton class="mt-4 h-32 w-full rounded" />
        </u-card>
      </div>

      <u-alert
        v-else-if="error"
        icon="i-heroicons-exclamation-triangle"
        color="rose"
        :title="error.message ?? 'Unable to load course'"
        description="Please check your connection and try again."
        :actions="[
          {
            label: 'Retry',
            color: 'rose',
            variant: 'soft',
            onClick: () => refresh(),
          },
        ]"
      />

      <template v-else-if="course">
        <u-card class="overflow-hidden">
          <div class="flex flex-col gap-6 md:flex-row">
            <div class="md:w-56">
              <nuxt-img
                v-if="course.thumbnail"
                :src="course.thumbnail"
                :alt="course.title"
                class="h-36 w-full rounded-lg object-cover"
                format="webp"
              />
              <div
                v-else
                class="flex h-36 w-full items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-500"
              >
                No Image
              </div>
            </div>
            <div class="flex flex-1 flex-col gap-4">
              <div class="flex flex-wrap items-center gap-3">
                <course-status-badge :status="course.status" />
                <span class="text-xs text-gray-500">
                  Purchased {{ formatDate(course.purchasedAt) }}
                </span>
              </div>
              <p class="text-sm text-gray-600">
                {{ course.description ?? "This course does not include a description yet." }}
              </p>
              <div class="grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-3 text-xs text-gray-500">
                <div>
                  <span class="font-semibold text-gray-700">Started</span>
                  <p class="mt-1 text-sm text-gray-900">
                    {{ formatDate(course.startedAt) }}
                  </p>
                </div>
                <div>
                  <span class="font-semibold text-gray-700">Completed</span>
                  <p class="mt-1 text-sm text-gray-900">
                    {{ formatDate(course.completedAt) }}
                  </p>
                </div>
                <div>
                  <span class="font-semibold text-gray-700">Active Level</span>
                  <p class="mt-1 text-sm text-gray-900">
                    {{ activeLevel?.label ?? "Not assigned yet" }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex items-end md:w-48 md:justify-end">
              <u-button
                v-if="course.liveRoomLink"
                :to="course.liveRoomLink"
                target="_blank"
                color="primary"
                variant="solid"
                trailing-icon="i-heroicons-arrow-top-right-on-square"
              >
                Join Live Room
              </u-button>
            </div>
          </div>
        </u-card>

        <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <u-card class="space-y-4">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold text-gray-900">
                Curriculum Overview
              </h2>
              <u-badge color="primary" variant="soft">
                {{ course.levels.length }} level<span v-if="course.levels.length !== 1">s</span>
              </u-badge>
            </div>
            <div class="space-y-4">
              <div
                v-for="level in course.levels"
                :key="level.id"
                class="rounded-lg border border-gray-200 p-4"
              >
                <div class="flex flex-wrap items-center gap-3">
                  <span class="text-sm font-semibold text-gray-900">
                    {{ level.label }}
                  </span>
                  <u-badge
                    v-if="activeLevel?.id === level.id"
                    color="emerald"
                    variant="soft"
                  >
                    In progress
                  </u-badge>
                </div>
                <p v-if="level.description" class="mt-2 text-sm text-gray-600">
                  {{ level.description }}
                </p>
                <div class="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span class="flex items-center gap-2">
                    <u-icon name="i-heroicons-bolt" class="h-4 w-4" />
                    Meeting frequency: {{ level.meetingFrequency ?? "Not set" }}
                  </span>
                  <span class="flex items-center gap-2">
                    <u-icon name="i-heroicons-queue-list" class="h-4 w-4" />
                    {{ level.lectureCount }} lesson<span v-if="level.lectureCount !== 1">s</span>
                  </span>
                </div>
              </div>
            </div>
          </u-card>

          <u-card class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900">
              Need help?
            </h2>
            <p class="text-sm text-gray-600">
              Reach out to your coach or our support team any time you need to
              adjust your pace, schedule sessions, or refresh your materials.
            </p>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <u-icon name="i-heroicons-envelope" class="h-5 w-5 text-primary-500" />
                support@example.com
              </div>
              <div class="flex items-center gap-2">
                <u-icon name="i-heroicons-phone" class="h-5 w-5 text-primary-500" />
                +1 (555) 123-4567
              </div>
            </div>
          </u-card>
        </div>

        <u-card class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-gray-900">
              Lessons in this level
            </h2>
            <span v-if="activeLevel" class="text-xs text-gray-500">
              Showing lessons for {{ activeLevel.label }}
            </span>
          </div>
          <div v-if="lectureRows.length" class="overflow-x-auto">
            <u-table :rows="lectureRows" :columns="lectureColumns">
              <template #title-data="{ row }">
                <div class="flex flex-col">
                  <span class="font-medium text-gray-900">
                    {{ row.title }}
                  </span>
                  <span v-if="row.description" class="text-xs text-gray-500">
                    {{ row.description }}
                  </span>
                </div>
              </template>
              <template #duration-data="{ row }">
                <span class="text-sm text-gray-700">
                  {{ row.duration }}
                </span>
              </template>
              <template #startsAt-data="{ row }">
                <span class="text-sm text-gray-700">
                  {{ row.startsAt }}
                </span>
              </template>
              <template #resourceLink-data="{ row }">
                <u-button
                  v-if="row.resourceLink"
                  :to="row.resourceLink"
                  target="_blank"
                  variant="link"
                  size="xs"
                >
                  Open
                </u-button>
                <span v-else class="text-xs text-gray-400">—</span>
              </template>
            </u-table>
          </div>
          <div v-else class="flex flex-col items-center gap-4 py-10 text-center">
            <div class="flex size-14 items-center justify-center rounded-full bg-primary-50 text-primary-500">
              <u-icon name="i-heroicons-book-open" class="h-8 w-8" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                No lessons yet
              </h3>
              <p class="mt-1 max-w-sm text-sm text-gray-500">
                Lessons for this level will appear once they are scheduled.
              </p>
            </div>
          </div>
        </u-card>
      </template>
    </u-container>
  </section>
</template>
