<script setup>
import { ref } from "vue";
import AdminPageForm from "~/components/admin/PageForm.vue";

definePageMeta({
  middleware: ["admin"],
});

const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);

const handleSubmit = async (values) => {
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const created = await $fetch("/api/admin/pages", {
      method: "POST",
      body: values,
    });

    toast.add({
      title: "Page created",
      description: "Your page is ready. Add more details any time.",
      color: "emerald",
    });

    await router.push(`/admin/pages/${created.id}/edit`);
  } catch (err) {
    toast.add({
      title: "Unable to create page",
      description: err?.data?.message || "Please review the form and try again.",
      color: "rose",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <u-container class="py-10 space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Create a page</h1>
        <p class="mt-1 text-sm text-gray-500">
          Publish marketing or support content that appears on your site.
        </p>
      </div>
      <u-button to="/admin/pages" variant="ghost" color="gray">
        Back to pages
      </u-button>
    </div>

    <u-card>
      <admin-page-form
        :loading="isSubmitting"
        submit-label="Create page"
        @submit="handleSubmit"
      >
        <template #footer>
          <u-button to="/admin/pages" variant="ghost" color="gray">
            Cancel
          </u-button>
        </template>
      </admin-page-form>
    </u-card>
  </u-container>
</template>
