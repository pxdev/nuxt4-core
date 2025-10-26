<script setup>
// ===============================
// Auth Handling
// ===============================
const {loggedIn, user, clear,  fetch} = useUserSession()


onMounted(async () => {
  await fetch()
})


watch(() => useRoute().fullPath, async () => {
  await fetch()
})

const items = ref([
  {
    label: 'Account',
    icon: 'hugeicons:user-02',
    to: 'account'
  },
  {
    label: 'Billing',
    icon: 'hugeicons:credit-card'

  },
  {
    label: 'Settings',
    icon: 'hugeicons:settings-01'
  },
  {
    label: 'Logout',
    icon: 'hugeicons:logout-04',
    onClick: async () => {
      await clear()
      await navigateTo('/')
    }
  }
])



</script>

<template>
 <div class="">
  <u-dropdown-menu v-if="loggedIn" size="sm"
      arrow
      :items="items"
      :ui="{
      content: 'w-48'
    }"
  >
    <u-user
        :name="user?.name"
        description="Student"
        :avatar="{
       icon: 'hugeicons:user'
    }"
    />
  </u-dropdown-menu>

  <u-button v-else
      color="primary"
      size="xl"
      class="rounded-full py-3 px-6"
      to="/auth/login"
  >
    {{'Students Login' }}
  </u-button>

</div>


</template>

<style scoped>

</style>