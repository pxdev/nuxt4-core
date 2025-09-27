<template>
  <footer
    class="w-full text-sm text-white bg-primary-950 bg-[url('/images/shapes/bl10.webp')] bg-no-repeat"
  >
    <u-container>
      <div class="mx-auto max-w-xl py-12 md:py-24">
        <div class="text-center space-y-2 mb-6">
          <h3 class="text-xl sm:text-2xl md:text-3xl">10% Discount for First Appointment!</h3>
          <p class="text-sm md:text-base">Subscribe to our newsletter</p>
        </div>

        <div class="w-full flex items-center bg-white border border-primary-50/20 rounded-full p-1">
          <u-input class="flex-1 mx-2" type="text" variant="none" placeholder="Enter your email" size="lg" />
          <u-button color="secondary" size="xl" class="shrink-0 rounded-full py-3 px-3 lg:py-4 lg:px-6">
            <span class="hidden md:block">Subscribe Now</span>
            <icon name="hugeicons:mail-send-01" class="block md:hidden w-6 h-6" />
          </u-button>
        </div>
      </div>
    </u-container>
    <div class="bg-primary-900">
      <u-container>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 py-6 md:py-12 rounded-3xl">
          <!-- Left: Logo & social -->
          <div class="flex flex-col gap-4 md:gap-6">
            <p class="opacity-70 leading-relaxed text-xs md:text-sm">
              Medical services are an essential part of our lives, offering care and treatment for various health
              conditions
            </p>
            <div class="flex mt-2 gap-4">
              <a href="#" class="hover:text-secondary-500 transition-colors">
                <icon name="ri:facebook-fill" class="w-4 h-4 md:w-6 md:h-6" />
              </a>
              <a class="hover:text-secondary-500 transition-colors">
                <icon name="ri:twitter-x-fill" class="w-4 h-4 md:w-6 md:h-6" />
              </a>
              <a class="hover:text-secondary-500 transition-colors">
                <icon name="ri:linkedin-box-fill" class="w-4 h-4 md:w-6 md:h-6" />
              </a>
              <a class="hover:text-secondary-500 transition-colors">
                <icon name="ri:instagram-fill" class="w-4 h-4 md:w-6 md:h-6" />
              </a>
            </div>
          </div>

          <!-- Middle 2: Link -->
          <div class="flex flex-col gap-3 mt-6 sm:mt-0">
            <h3 class="text-lg md:text-xl mb-2">Links</h3>
            <ul class="space-y-2 text-xs md:text-sm">
              <li>
                <a href="#" class="hover:text-secondary-500 transition-colors">Terms & Condition</a>
              </li>
              <li>
                <a href="#" class="hover:text-secondary-500 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" class="hover:text-secondary-500 transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" class="hover:text-secondary-500 transition-colors">Terms Of Use</a>
              </li>
            </ul>
          </div>

          <!-- Right: Contact -->
          <div class="flex flex-col gap-4 md:gap-6 mt-6 lg:mt-0">
            <h3 class="text-lg md:text-xl">Contact</h3>
            <div class="flex flex-col space-y-4">
              <!-- Address -->
              <div class="flex items-center gap-3 md:gap-4">
                <div
                  class="w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 text-primary"
                >
                  <icon name="hugeicons:location-06" class="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <div class="opacity-70 text-xs">Address</div>
                  <p class="text-xs md:text-sm">66 Mansoura Egypt</p>
                </div>
              </div>
              <!-- Phone -->
              <div class="flex items-center gap-3 md:gap-4">
                <div
                  class="w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 text-primary"
                >
                  <icon name="hugeicons:call" class="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <div class="opacity-70 text-xs">Emergency</div>
                  <p class="text-xs md:text-sm">012 345 678 9101</p>
                </div>
              </div>
              <!-- Email -->
              <div class="flex items-center gap-3 md:gap-4">
                <div
                  class="w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 text-primary"
                >
                  <icon name="hugeicons:calendar-03" class="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <div class="opacity-70 text-xs">Open Hours</div>
                  <p class="text-xs md:text-sm">Mon - Fri: 8.00 am. - 6.00 pm.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </u-container>
    </div>
    <div class="bg-primary-800 dark:bg-neutral-900/10">
      <u-container>
        <div class="py-4 text-center text-xs">
          <p>Copyright 2025 Components Designed By Components. All Rights Reserved</p>
        </div>
      </u-container>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>