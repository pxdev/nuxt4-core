<script setup>
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only include letters, numbers, and underscores'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const state = reactive({
  name: '',
  username: '',
  email: '',
  password: ''
});

const errorMessage = ref('');
const isLoading = ref(false);

watch(() => [state.name, state.username, state.email, state.password], () => {
  if (errorMessage.value) {
    errorMessage.value = '';
  }
});

async function handleRegister(event) {
  errorMessage.value = '';
  isLoading.value = true;

  const formData = event?.data ?? state;
  const { name, username, email, password } = formData;

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name,
        username,
        email,
        password
      }
    });

    await navigateTo('/', { replace: true });
  } catch (err) {
    errorMessage.value = err?.data?.message || err?.message || 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
    <UCard class="w-full max-w-md shadow-lg">
      <template #header>
        <div class="space-y-1">
          <h1 class="text-xl font-semibold">Create an account</h1>
          <p class="text-sm text-gray-500">Sign up to get started.</p>
        </div>
      </template>

      <UForm :state="state" :schema="schema" class="space-y-5" @submit.prevent="handleRegister">
        <UAlert
          v-if="errorMessage"
          color="red"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :title="errorMessage"
        />

        <UFormGroup label="Full name" name="name">
          <UInput v-model="state.name" type="text" autocomplete="name" placeholder="John Doe" />
        </UFormGroup>

        <UFormGroup label="Username" name="username">
          <UInput v-model="state.username" type="text" autocomplete="username" placeholder="johndoe" />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" type="email" autocomplete="email" placeholder="you@example.com" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="new-password"
            placeholder="********"
          />
        </UFormGroup>

        <UButton type="submit" color="primary" block :loading="isLoading" :disabled="isLoading">
          Create account
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-gray-500">
          Already have an account?
          <NuxtLink to="/auth/login" class="font-medium text-blue-600 hover:underline">Login</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
