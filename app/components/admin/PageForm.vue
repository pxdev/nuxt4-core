<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  initialValue: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  submitLabel: {
    type: String,
    default: "Save page",
  },
});

const emit = defineEmits(["submit"]);

const emptyState = {
  title: "",
  slug: "",
  status: "draft",
  excerpt: "",
  content: "",
  coverImage: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  publishedAt: "",
};

const form = reactive({ ...emptyState });

const toDateTimeLocal = (timestamp) => {
  if (!timestamp) {
    return "";
  }
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

watch(
  () => props.initialValue,
  (value) => {
    const payload = {
      ...emptyState,
      ...(value || {}),
    };

    payload.publishedAt = toDateTimeLocal(payload.publishedAt);

    Object.assign(form, payload);
  },
  { immediate: true, deep: true },
);

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

const handleSubmit = () => {
  const publishedAt =
    form.publishedAt && form.status === "published"
      ? new Date(form.publishedAt).getTime()
      : null;

  emit("submit", {
    title: form.title?.trim(),
    slug: form.slug?.trim(),
    status: form.status,
    excerpt: form.excerpt?.trim() || null,
    content: form.content?.trim() || "",
    coverImage: form.coverImage?.trim() || null,
    seoTitle: form.seoTitle?.trim() || null,
    seoDescription: form.seoDescription?.trim() || null,
    seoKeywords: form.seoKeywords?.trim() || null,
    publishedAt,
  });
};
</script>

<template>
  <u-form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="grid gap-6 lg:grid-cols-2">
      <u-form-group label="Title" required>
        <u-input v-model="form.title" placeholder="About Our Coaching" />
      </u-form-group>

      <u-form-group
        label="Slug"
        description="Unique identifier used in the URL (e.g. /pages/about-our-coaching)."
      >
        <u-input v-model="form.slug" placeholder="about-our-coaching" />
      </u-form-group>

      <u-form-group label="Status">
        <u-select v-model="form.status" :options="statusOptions" />
      </u-form-group>

      <u-form-group label="Published at" description="Set when the page should be considered live.">
        <u-input v-model="form.publishedAt" type="datetime-local" />
      </u-form-group>
    </div>

    <u-form-group label="Excerpt" description="Short summary used in previews.">
      <u-textarea v-model="form.excerpt" :rows="3" placeholder="Highlight the promise of this page." />
    </u-form-group>

    <u-form-group label="Content" required>
      <u-textarea
        v-model="form.content"
        :rows="10"
        placeholder="Write the body content for this page."
      />
    </u-form-group>

    <div class="grid gap-6 lg:grid-cols-2">
      <u-form-group label="Cover image URL">
        <u-input v-model="form.coverImage" placeholder="/images/pages/about.jpg" />
      </u-form-group>

      <u-form-group label="SEO Title">
        <u-input v-model="form.seoTitle" placeholder="Coaching tailored for top performers" />
      </u-form-group>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <u-form-group label="SEO Description">
        <u-textarea
          v-model="form.seoDescription"
          :rows="3"
          placeholder="Search-friendly description for this page."
        />
      </u-form-group>

      <u-form-group label="SEO Keywords" description="Comma separated keywords.">
        <u-textarea v-model="form.seoKeywords" :rows="3" placeholder="coaching, negotiation, real estate" />
      </u-form-group>
    </div>

    <div class="flex flex-wrap items-center justify-end gap-3">
      <slot name="footer" />
      <u-button type="submit" color="primary" :loading="loading">
        {{ submitLabel }}
      </u-button>
    </div>
  </u-form>
</template>
