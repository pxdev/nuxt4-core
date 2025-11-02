<script setup>
import { computed, ref } from "vue";
import { useDateFormat } from "@vueuse/core";

definePageMeta({
  middleware: ["admin"],
});

const toast = useToast();

const {
  data: pages,
  status,
  error,
  refresh,
} = await useAsyncData("admin-pages", () => $fetch("/api/admin/pages"));

const isLoading = computed(() => status.value === "pending");

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

const columns = [
  { id: "title", key: "title", label: "Title" },
  { id: "slug", key: "slug", label: "Slug" },
  { id: "status", key: "status", label: "Status" },
  { id: "updatedAt", key: "updatedAt", label: "Updated" },
  { id: "actions", key: "actions", label: "", class: "w-20" },
];

const deletingPage = ref(null);
const isDeleteModalOpen = ref(false);

const openDeleteModal = (page) => {
  deletingPage.value = page;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!deletingPage.value) {
    return;
  }

  try {
    await $fetch(`/api/admin/pages/${deletingPage.value.id}`, { method: "DELETE" });
    toast.add({
      title: "Page removed",
      description: `${deletingPage.value.title} has been deleted.`,
      color: "emerald",
    });
    isDeleteModalOpen.value = false;
    deletingPage.value = null;
    await refresh();
  } catch (err) {
    toast.add({
      title: "Delete failed",
      description: err?.data?.message || "We could not delete this page.",
      color: "rose",
    });
  }
};
</script>

<template>
  <u-container class="py-10 space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Pages</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage static pages and keep your marketing site up to date.
        </p>
      </div>
      <u-button
        color="primary"
        leading-icon="i-heroicons-plus"
        trailing-icon="i-heroicons-arrow-right-20-solid"
        to="/admin/pages/new"
      >
        New page
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
        :title="error.message ?? 'Unable to load pages'"
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
        <div v-if="!pages?.length" class="py-16 text-center">
          <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <u-icon name="i-heroicons-document-text" class="h-8 w-8" />
          </div>
          <h2 class="mt-6 text-lg font-semibold text-gray-900">
            No pages yet
          </h2>
          <p class="mt-2 text-sm text-gray-500">
            Create your first page to publish content on the marketing site.
          </p>
          <u-button class="mt-6" to="/admin/pages/new" color="primary">
            Create a page
          </u-button>
        </div>

        <div v-else class="overflow-x-auto">
          <u-table :rows="pages" :columns="columns" class="min-w-full">
            <template #title-data="{ row }">
              <div class="flex flex-col">
                <span class="font-medium text-gray-900">
                  {{ row.title }}
                </span>
                <span class="text-xs uppercase tracking-wide text-gray-500">
                  {{ row.status }}
                </span>
              </div>
            </template>
            <template #updatedAt-data="{ row }">
              <span class="text-sm text-gray-700">
                {{ formatDate(row.updatedAt) }}
              </span>
            </template>
            <template #actions-data="{ row }">
              <div class="flex items-center justify-end gap-2">
                <u-button
                  :to="`/admin/pages/${row.id}/edit`"
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
          Delete page
        </h3>
        <p class="text-sm text-gray-500">
          This will permanently remove <strong>{{ deletingPage?.title }}</strong>. This action cannot be undone.
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
  </u-container>
</template>
