<script setup>
import { computed, onMounted, watch } from "vue";
import { useDateFormat } from "@vueuse/core";

definePageMeta({
  middleware() {
    const { loggedIn } = useUserSession()
    if (!loggedIn.value) {
      return navigateTo('/')
    }
  },
})

const { user, fetch: fetchSession } = useUserSession()
await fetchSession()

const items = [
  {
    label: 'Home',
    to: '/'
  },
  {
    label: 'Dashboard',
    to: '/'
  },

]

const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.isAdmin === true)

const accountNavigation = computed(() => {
  const baseNavigation = [
    {
      id: 'dashboard',
      label: "Dashboard",
      to: "/account",
      ico: "hugeicons:home-05"
    },
    {
      id: 'profile',
      label: "My Profile",
      to: "/",
      ico: "hugeicons:user-02"
    },
    {
      id: 'learning',
      label: "My Learning",
      to: "/account/courses",
      ico: "hugeicons:book-02"
    },
    {
      id: 'billing',
      label: "Billing",
      to: "/",
      ico: "hugeicons:credit-card"
    },
    {
      id: 'affiliate',
      label: "Affiliate Program",
      to: "/",
      ico: "hugeicons:user-group"
    }
  ]

  if (isAdmin.value) {
    baseNavigation.unshift(
      {
        id: 'manage-courses',
        label: "Manage Courses",
        to: "/admin/courses",
        ico: "hugeicons:dashboard-square-01"
      },
      {
        id: 'manage-pages',
        label: "Manage Pages",
        to: "/admin/pages",
        ico: "i-heroicons-document-text"
      }
    )
  }

  return baseNavigation
})

const adminCoursesFetcher = () => {
  const headers = useRequestHeaders(["cookie"])
  return $fetch("/api/admin/courses", {
    credentials: "include",
    headers
  })
}

const {
  data: adminCourses,
  status: adminCoursesStatus,
  error: adminCoursesError,
  execute: fetchAdminCourses,
  pending: adminCoursesPending
} = await useAsyncData("account-admin-courses", adminCoursesFetcher, {
  immediate: false
})

const adminCoursesLoading = computed(() => adminCoursesPending.value || adminCoursesStatus.value === "pending")

watch(
  () => isAdmin.value,
  async (value) => {
    if (value && user.value?.id && adminCoursesStatus.value === "idle") {
      await fetchAdminCourses()
    }
  }
)

onMounted(async () => {
  if (isAdmin.value && user.value?.id && adminCoursesStatus.value === "idle") {
    await fetchAdminCourses()
  }
})

const adminCoursesHasRows = computed(() => (adminCourses.value?.length ?? 0) > 0)

const adminCourseColumns = [
  { id: "title", key: "title", label: "Course" },
  { id: "slug", key: "slug", label: "Slug" },
  { id: "levelStrategy", key: "levelStrategy", label: "Strategy" },
  { id: "durationMinutes", key: "durationMinutes", label: "Duration" },
  { id: "updatedAt", key: "updatedAt", label: "Updated" }
]

const formatAdminCourseDate = (value) => {
  if (!value) {
    return "—"
  }
  try {
    return useDateFormat(new Date(value), "MMM d, yyyy").value
  } catch {
    return "—"
  }
}
</script>

<template>
  <section>
    <div class="pages py-10 border-b border-gray-200 bg-white mb-6">
      <u-container>
        <u-breadcrumb class="mb-4" :items="items"/>
        <base-heading is="h1">Profile</base-heading>
      </u-container>
    </div>

    <u-container>
      <div class="flex gap-6">

        <div class="min-w-64">
          <u-card>
            <ul class="space-y-2">
              <li v-for="nav in accountNavigation" :key="nav.id">
                <nuxt-link
                    active-class="bg-primary-500 hover:bg-primary-600 text-white font-semibold"
                    class="flex items-center text-gray-500 rounded gap-2 px-2 py-3 hover:bg-primary-200" :to="nav.to">
                  <u-icon :name="nav.ico" class="w-5 h-5"/>
                  {{ nav.label }}
                </nuxt-link>
              </li>
            </ul>
          </u-card>
        </div>


        <div class="flex-1 space-y-6">
          <u-card>
            <h2 class="text-2xl font-bold">Welcome again <span class="text-primary">{{ user.name }}</span></h2>
          </u-card>

          <u-card v-if="isAdmin" class="space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Course Management</h3>
                <p class="text-sm text-gray-500">
                  Review your catalog and jump into editing or enrolling students.
                </p>
              </div>
              <div class="flex gap-2">
                <u-button to="/admin/courses" color="primary" size="sm" trailing-icon="i-heroicons-arrow-right-20-solid">
                  Courses
                </u-button>
                <u-button to="/admin/pages" variant="soft" color="primary" size="sm" trailing-icon="i-heroicons-arrow-right-20-solid">
                  Pages
                </u-button>
              </div>
            </div>

            <div v-if="adminCoursesLoading" class="space-y-3">
              <u-skeleton class="h-10 w-full rounded" />
              <u-skeleton class="h-10 w-full rounded" />
              <u-skeleton class="h-10 w-full rounded" />
            </div>

            <u-alert
              v-else-if="adminCoursesError"
              color="rose"
              icon="i-heroicons-exclamation-triangle"
              :title="adminCoursesError?.data?.message ?? 'Unable to load courses'"
              description="Try refreshing the page. If this keeps happening, check your database connection."
              :actions="[
                {
                  label: 'Retry',
                  color: 'rose',
                  variant: 'soft',
                  onClick: () => fetchAdminCourses(),
                },
              ]"
            />

            <div v-else-if="adminCoursesHasRows" class="overflow-x-auto">
              <u-table :rows="adminCourses" :columns="adminCourseColumns" class="min-w-full text-sm">
                <template #title-data="{ row }">
                  <div class="flex flex-col">
                    <span class="font-medium text-gray-900">{{ row.title }}</span>
                    <span class="text-xs text-gray-500">
                      {{ row.enrollmentCount }} enrolment<span v-if="row.enrollmentCount !== 1">s</span> ·
                      {{ row.levelCount }} level<span v-if="row.levelCount !== 1">s</span>
                    </span>
                  </div>
                </template>
                <template #durationMinutes-data="{ row }">
                  <span class="text-sm text-gray-700">
                    {{ row.durationMinutes ? `${row.durationMinutes} min` : "—" }}
                  </span>
                </template>
                <template #updatedAt-data="{ row }">
                  <span class="text-sm text-gray-700">
                    {{ formatAdminCourseDate(row.updatedAt) }}
                  </span>
                </template>
              </u-table>
            </div>

            <div v-else class="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              No courses yet. Create your first program from the admin area.
            </div>
          </u-card>
        </div>

      </div>
    </u-container>

  </section>
</template>

<style scoped>

</style>
