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
    default: "Save course",
  },
});

const emit = defineEmits(["submit"]);

const emptyState = {
  title: "",
  slug: "",
  description: "",
  thumbnail: "",
  levelStrategy: "",
  liveRoomLink: "",
  durationMinutes: "",
};

const form = reactive({ ...emptyState });

watch(
  () => props.initialValue,
  (value) => {
    const payload = {
      ...emptyState,
      ...(value || {}),
    };

    payload.durationMinutes =
      payload.durationMinutes === null || payload.durationMinutes === undefined
        ? ""
        : String(payload.durationMinutes);

    Object.assign(form, payload);
  },
  { immediate: true, deep: true },
);

const levelStrategyOptions = ["progressive", "adaptive", "self-paced", "blended"];

const handleSubmit = () => {
  emit("submit", {
    title: form.title?.trim(),
    slug: form.slug?.trim(),
    description: form.description?.trim() || null,
    thumbnail: form.thumbnail?.trim() || null,
    levelStrategy: form.levelStrategy || null,
    liveRoomLink: form.liveRoomLink?.trim() || null,
    durationMinutes: form.durationMinutes === "" ? null : form.durationMinutes,
  });
};
</script>

<template>
  <u-form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="grid gap-6 lg:grid-cols-2">
      <u-form-group label="Title" required>
        <u-input v-model="form.title" placeholder="Executive Arabic Immersion" />
      </u-form-group>

      <u-form-group
        label="Slug"
        description="Unique identifier used for URLs."
      >
        <u-input v-model="form.slug" placeholder="executive-arabic-immersion" />
      </u-form-group>

      <u-form-group label="Level Strategy">
        <u-select
          v-model="form.levelStrategy"
          :options="levelStrategyOptions"
          placeholder="Select approach"
          clearable
        />
      </u-form-group>

      <u-form-group label="Live room link">
        <u-input
          v-model="form.liveRoomLink"
          placeholder="https://meet.example.com/coaching"
        />
      </u-form-group>
    </div>

    <u-form-group label="Thumbnail URL">
      <u-input
        v-model="form.thumbnail"
        placeholder="/images/courses/arabic-immersion.jpg"
      />
    </u-form-group>

    <u-form-group label="Description">
      <u-textarea
        v-model="form.description"
        :rows="5"
        placeholder="Add a short summary to help learners understand what this course offers."
      />
    </u-form-group>

    <div class="grid gap-6 lg:grid-cols-2">
      <u-form-group
        label="Duration (minutes)"
        description="Leave blank if the course duration varies."
      >
        <u-input
          v-model="form.durationMinutes"
          type="number"
          min="0"
          placeholder="90"
        />
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
