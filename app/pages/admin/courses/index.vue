<script setup>
import { computed, ref } from "vue";
import { useDateFormat } from "@vueuse/core";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const toast = useToast();

const {
  data: courses,
  status,
  error,
  refresh,
} = await useAsyncData("admin-courses", () => $fetch("/api/admin/courses"));

const isLoading = computed(() => status.value === "pending");

const formatDate = (value) => {
  try {
    return useDateFormat(new Date(value), "MMM d, yyyy").value;
  } catch {
    return "—";
  }
};

const columns = [
  { key: "title", label: "Course" },
  { key: "slug", label: "Slug" },
  { key: "levelStrategy", label: "Strategy" },
  { key: "durationMinutes", label: "Duration" },
  { key: "updatedAt", label: "Updated" },
  { key: "actions", label: "", class: "w-20" },
];

const deletingCourse = ref(null);
const isDeleteModalOpen = ref(false);

const openDeleteModal = (course) => {
  deletingCourse.value = course;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!deletingCourse.value) {
    return;
  }

  try {
    await $fetch(`/api/admin/courses/${deletingCourse.value.id}`, {
      method: "DELETE",
    });
    toast.add({
      title: "Course removed",
      description: `${deletingCourse.value.title} has been deleted.`,
      color: "emerald",
    });
    isDeleteModalOpen.value = false;
    deletingCourse.value = null;
    await refresh();
  } catch (err) {
    toast.add({
      title: "Delete failed",
      description: err?.data?.message || "We could not delete this course.",
      color: "rose",
    });
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Courses</h1>
        <p class="mt-1 text-sm text-gray-500">
          Keep your program catalog updated. Add new courses, adjust details, or remove offers.
        </p>
      </div>
      <u-button
        color="primary"
        leading-icon="i-heroicons-plus"
        trailing-icon="i-heroicons-arrow-right-20-solid"
        to="/admin/courses/new"
      >
        New course
      </u-button>
    </div>

    <u-card>
      <div v-if="isLoading" class="space-y-4">
        <u-skeleton class="h-10 w-full rounded" />
        <u-skeleton class="h-10 w-full rounded" />
        <u-skeleton class="h-10 w-full rounded" />
      </div>

      <u-alert
        v-else-if="error"
        color="rose"
        icon="i-heroicons-exclamation-triangle"
        :title="error.message ?? 'Unable to load courses'"
        description="Try refreshing the page. If the issue persists, contact support."
        :actions="[
          {
            label: 'Retry',
            color: 'rose',
            variant: 'soft',
            onClick: () => refresh(),
          },
        ]"
      />

      <template v-else>
        <div v-if="!courses?.length" class="py-16 text-center">
          <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <u-icon name="i-heroicons-academic-cap" class="h-8 w-8" />
          </div>
          <h2 class="mt-6 text-lg font-semibold text-gray-900">
            No courses yet
          </h2>
          <p class="mt-2 text-sm text-gray-500">
            Start by adding your first coaching program. You can always edit or extend it later.
          </p>
          <u-button class="mt-6" to="/admin/courses/new" color="primary">
            Create a course
          </u-button>
        </div>

        <div v-else class="overflow-x-auto">
          <u-table :rows="courses" :columns="columns" class="min-w-full">
            <template #title-data="{ row }">
              <div class="flex flex-col">
                <span class="font-medium text-gray-900">
                  {{ row.title }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ row.enrollmentCount }} enrolment<span v-if="row.enrollmentCount !== 1">s</span> ·
                  {{ row.levelCount }} level<span v-if="row.levelCount !== 1">s</span>
                </span>
              </div>
            </template>
            <template #durationMinutes-data="{ row }">
              <span class="text-sm text-gray-700">
                {{ row.durationMinutes ? `${row.durationMinutes} min` : "—" }}
              </span>
            </template>
            <template #updatedAt-data="{ row }">
              <span class="text-sm text-gray-700">
                {{ formatDate(row.updatedAt) }}
              </span>
            </template>
            <template #actions-data="{ row }">
              <div class="flex items-center justify-end gap-2">
                <u-button
                  :to="`/admin/courses/${row.id}/edit`"
                  variant="ghost"
                  color="gray"
                  size="xs"
                  icon="i-heroicons-pencil-square"
                />
                <u-button
                  variant="ghost"
                  color="rose"
                  size="xs"
                  icon="i-heroicons-trash"
                  @click="openDeleteModal(row)"
                />
              </div>
            </template>
          </u-table>
        </div>
      </template>
    </u-card>

    <u-modal v-model="isDeleteModalOpen">
      <u-card class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900">
          Delete course
        </h3>
        <p class="text-sm text-gray-500">
          This will remove <strong>{{ deletingCourse?.title }}</strong> and all associated levels and lectures. This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <u-button variant="ghost" color="gray" @click="isDeleteModalOpen = false">
            Cancel
          </u-button>
          <u-button color="rose" @click="handleDelete">
            Delete
          </u-button>
        </div>
      </u-card>
    </u-modal>
  </div>
</template>
