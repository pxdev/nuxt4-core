<script setup>
import { computed, ref } from "vue";
import { useDateFormat } from "@vueuse/core";
import AdminPageForm from "~/components/admin/PageForm.vue";

definePageMeta({
  middleware: ["admin"],
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const pageId = computed(() => Number.parseInt(route.params.id, 10));

if (!Number.isFinite(pageId.value) || pageId.value <= 0) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

const {
  data: page,
  status,
  error,
  refresh,
} = await useAsyncData(
  () => `admin-page-${pageId.value}`,
  () => $fetch(`/api/admin/pages/${pageId.value}`),
  {
    watch: [pageId],
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

const handleSubmit = async (values) => {
  if (isSaving.value) {
    return;
  }

  isSaving.value = true;

  try {
    await $fetch(`/api/admin/pages/${pageId.value}`, {
      method: "PATCH",
      body: values,
    });

    toast.add({
      title: "Page saved",
      description: "Updates are live on your site.",
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
</script>

<template>
  <u-container class="py-10 space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ page?.title ?? "Edit page" }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Last updated {{ formatDate(page?.updatedAt) }}
        </p>
      </div>
      <div class="flex gap-3">
        <u-button variant="ghost" color="gray" to="/admin/pages">
          Back to pages
        </u-button>
        <u-button
          variant="soft"
          color="primary"
          trailing-icon="i-heroicons-arrow-top-right-on-square"
          :to="`/pages/${page?.slug}`"
          target="_blank"
        >
          View live
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
      :title="error.message ?? 'Unable to load page'"
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

    <template v-else-if="page">
      <u-card>
        <admin-page-form
          :initial-value="page"
          :loading="isSaving"
          submit-label="Save page"
          @submit="handleSubmit"
        >
          <template #footer>
            <u-button
              variant="ghost"
              color="gray"
              @click="router.push('/admin/pages')"
            >
              Cancel
            </u-button>
          </template>
        </admin-page-form>
      </u-card>
    </template>
  </u-container>
</template>
