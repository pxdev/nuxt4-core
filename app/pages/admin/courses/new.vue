<script setup>
import { ref } from "vue";
import AdminCourseForm from "~/components/admin/CourseForm.vue";

definePageMeta({
  layout: "admin",
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
    const created = await $fetch("/api/admin/courses", {
      method: "POST",
      body: values,
    });

    toast.add({
      title: "Course created",
      description: "Your course is ready. Add levels and lectures next.",
      color: "emerald",
    });

    await router.push(`/admin/courses/${created.id}/edit`);
  } catch (err) {
    toast.add({
      title: "Unable to create course",
      description: err?.data?.message || "Please review the form and try again.",
      color: "rose",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Create a course</h1>
        <p class="mt-1 text-sm text-gray-500">
          Set up a new coaching program with a clear description and delivery details.
        </p>
      </div>
      <u-button to="/admin/courses" variant="ghost" color="gray">
        Back to courses
      </u-button>
    </div>

    <u-card>
      <admin-course-form
        :loading="isSubmitting"
        submit-label="Create course"
        @submit="handleSubmit"
      >
        <template #footer>
          <u-button to="/admin/courses" variant="ghost" color="gray">
            Cancel
          </u-button>
        </template>
      </admin-course-form>
    </u-card>
  </div>
</template>
