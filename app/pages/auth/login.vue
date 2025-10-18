<script setup>
import {z} from 'zod';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const state = reactive({
  email: '',
  password: ''
});

const errorMessage = ref('');
const isLoading = ref(false);

async function handleLogin(event) {
  errorMessage.value = '';

  isLoading.value = true;

  const { email, password } = event.data;

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email,
        password
      }
    });

    await navigateTo('/', { replace: true });
  } catch (err) {
    errorMessage.value = err?.data?.message || err?.message || 'Login failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
    <u-card class="w-full max-w-md shadow-lg">
      <template #header>
        <div class="space-y-1">
          <h1 class="text-xl font-semibold">Welcome back</h1>
      <p class="text-sm text-gray-500">Sign in to continue to your account.</p>
        </div>
      </template>

      <u-form :state="state" :schema="schema" class="space-y-5" @submit.prevent="handleLogin">
        <u-alert
          v-if="errorMessage"
          color="red"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :title="errorMessage"
        />

        <u-form-field label="Email" name="email">
          <u-input
v-model="state.email"
            class="w-full"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
          />
        </u-form-field>

        <u-form-field label="Password" name="password">
          <u-input
v-model="state.password"
            class="w-full"
            type="password"
            autocomplete="current-password"
            placeholder="********"
          />
        </u-form-field>

        <UButton type="submit" color="primary" block :loading="isLoading" :disabled="isLoading">
          Login
        </UButton>
      </u-form>

      <template #footer>
        <p class="text-center text-sm text-gray-500">
          Don't have an account?
          <NuxtLink to="/auth/register" class="font-medium text-blue-600 hover:underline">
            Register
          </NuxtLink>
        </p>
      </template>
    </u-card>
  </div>
</template>
