<template>
  <div class="register-container">
    <div class="auth-form-wrapper">
      <h1 class="text-2xl font-bold mb-6">Create an Account</h1>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div v-if="error" class="error-message mb-4 p-3 bg-red-100 text-red-700 rounded">
          {{ error }}
        </div>

        <div class="form-group mb-4">
          <label for="name" class="block mb-2">Full Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            class="w-full p-2 border rounded"
            placeholder="John Doe"
          />
        </div>

        <div class="form-group mb-4">
          <label for="username" class="block mb-2">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full p-2 border rounded"
            placeholder="johndoe"
          />
        </div>

        <div class="form-group mb-4">
          <label for="email" class="block mb-2">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full p-2 border rounded"
            placeholder="your@email.com"
          />
        </div>

        <div class="form-group mb-4">
          <label for="password" class="block mb-2">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full p-2 border rounded"
            placeholder="********"
            minlength="8"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating account...' : 'Register' }}
        </button>

        <div class="text-center mt-4">
          Already have an account? <NuxtLink to="/app/pages/auth/login" class="text-blue-600">Login</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const error = ref(null);
const isLoading = ref(false);

// Redirect if already logged in
// watchEffect(() => {
//   if (status.value === 'authenticated') {
//     router.push('/');
//   }
// });

async function handleRegister() {
  error.value = null;
  isLoading.value = true;

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        username: username.value,
        email: email.value,
        password: password.value
      }
    });

    // Refresh auth state and redirect to home
    await navigateTo('/', { replace: true });
  } catch (err) {
    error.value = err.data?.message || 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.register-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
}
</style>
