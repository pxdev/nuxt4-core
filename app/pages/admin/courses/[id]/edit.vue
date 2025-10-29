<script setup>
import { computed, ref } from "vue";
import { useDateFormat } from "@vueuse/core";
import AdminCourseForm from "~/components/admin/CourseForm.vue";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const courseId = computed(() => Number.parseInt(route.params.id, 10));

if (!Number.isFinite(courseId.value) || courseId.value <= 0) {
  throw createError({ statusCode: 404, statusMessage: "Course not found" });
}

const {
  data: course,
  status,
  error,
  refresh,
} = await useAsyncData(
  () => `admin-course-${courseId.value}`,
  () => $fetch(`/api/admin/courses/${courseId.value}`),
  {
    watch: [courseId],
  },
);

const isLoading = computed(() => status.value === "pending");
const isSaving = ref(false);

const formatDate = (value) => {
  if (!value) {
    return "—";
  }
  try {
    return useDateFormat(new Date(value), "MMM d, yyyy").value;
  } catch {
    return "—";
  }
};

const metrics = computed(() => [
  {
    label: "Levels",
    value: course.value?.levelCount ?? 0,
    icon: "i-heroicons-squares-2x2",
  },
  {
    label: "Lectures",
    value: course.value?.lectureCount ?? 0,
    icon: "i-heroicons-queue-list",
  },
  {
    label: "Enrollments",
    value: course.value?.enrollmentCount ?? 0,
    icon: "i-heroicons-user-group",
  },
]);

const handleSubmit = async (values) => {
  if (isSaving.value) {
    return;
  }

  isSaving.value = true;

  try {
    await $fetch(`/api/admin/courses/${courseId.value}`, {
      method: "PATCH",
      body: values,
    });

    toast.add({
      title: "Course saved",
      description: "Updates are live for learners.",
      color: "emerald",
    });

    await refresh();
  } catch (err) {
    toast.add({
      title: "Save failed",
      description: err?.data?.message || "Please review the form and try again.",
      color: "rose",
    });
  } finally {
    isSaving.value = false;
  }
};

const handleViewCourse = () => {
  router.push(`/account/courses/${courseId.value}`);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ course?.title ?? "Edit course" }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Last updated {{ formatDate(course?.updatedAt) }}
        </p>
      </div>
      <div class="flex gap-3">
        <u-button variant="ghost" color="gray" to="/admin/courses">
          Back to courses
        </u-button>
        <u-button
          variant="soft"
          color="primary"
          trailing-icon="i-heroicons-arrow-top-right-on-square"
          @click="handleViewCourse"
        >
          View as learner
        </u-button>
      </div>
    </div>

    <u-card v-if="isLoading" class="space-y-4">
      <u-skeleton class="h-6 w-1/3 rounded" />
      <u-skeleton class="h-32 w-full rounded" />
      <u-skeleton class="h-10 w-full rounded" />
    </u-card>

    <u-alert
      v-else-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="rose"
      :title="error.message ?? 'Unable to load course'"
      description="Try refreshing the page. If the issue continues, contact support."
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
      <div class="grid gap-6 md:grid-cols-3">
        <u-card
          v-for="metric in metrics"
          :key="metric.label"
          class="flex items-center gap-4"
        >
          <div class="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <u-icon :name="metric.icon" class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-gray-500">
              {{ metric.label }}
            </p>
            <p class="text-lg font-semibold text-gray-900">
              {{ metric.value }}
            </p>
          </div>
        </u-card>
      </div>

      <u-card class="space-y-6">
        <admin-course-form
          :initial-value="course"
          :loading="isSaving"
          submit-label="Save changes"
          @submit="handleSubmit"
        >
          <template #footer>
            <u-button
              variant="ghost"
              color="gray"
              @click="router.push('/admin/courses')"
            >
              Cancel
            </u-button>
          </template>
        </admin-course-form>
      </u-card>
    </template>
  </div>
</template>
