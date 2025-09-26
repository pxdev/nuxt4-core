<script lang="ts" setup>
  const { createAnimationClipReveal } = useAnimation();
</script>

<template>
  <section class="h-full min-h-svh flex overflow-hidden relative bg-primary-50 dark:bg-neutral-950">
    <gradient-circle class="absolute opacity-80 top-0 left-0 dark:invert" />
    <u-container class="w-full">
      <article class="flex flex-col lg:flex-row h-full gap-6 md:gap-8 lg:gap-12 relative z-20">
        <section class="flex shrink-0 flex-1 h-full items-center order-2 lg:order-1">
          <parallax-scroll :speed="350" class="mx-auto w-full">
            <header class="flex flex-col space-y-4 md:space-y-6 lg:space-y-8">
              <div class="space-y-2 md:space-y-3">
                <u-badge color="primary" variant="soft" class="text-sm md:text-base">The RoyalClinic </u-badge>
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
                  Bring Quality Healthcare Services to You.
                </h1>
              </div>
              <p class="text-base md:text-lg">Bring Quality Healthcare Services to You</p>
              <arrow-button
                size="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
                class="text-lg md:text-xl lg:text-2xl gap-2 md:gap-3 lg:gap-4"
              >
                {{ $t('banner.make_appointment') }}
              </arrow-button>
            </header>
          </parallax-scroll>
        </section>
        <aside class="flex items-end justify-center relative h-full flex-1 order-2 lg:order-2">
          <rotating-text
            class="absolute left-4 bottom-4 md:left-6 md:bottom-6 lg:left-8 lg:bottom-8 z-20 scale-75 md:scale-90 lg:scale-100"
          />
          <div
            class="experience bg-white text-primary-500 text-center rounded-xl absolute bottom-1/4 right-0 p-2 md:p-3 lg:p-4 z-10 shadow-xl shadow-primary-500/5 scale-75 md:scale-90 lg:scale-100"
          >
            <p class="text-2xl md:text-3xl lg:text-4xl font-bold">
              <count-up :to="28" :from="0" :duration="1000" />
              +
            </p>
            <p class="text-xs md:text-sm">Years of Experience</p>
          </div>
          <div
            v-motion="createAnimationClipReveal('bottom', { delay: 0, duration: 500 })"
            :speed="100"
            class="w-3/4 md:w-4/5 lg:w-full mx-auto lg:mx-0 h-full flex items-end"
          >
            <nuxt-img
              src="/images/banners/hero-img_male.png"
              fit="cover"
              class="will-change-transform w-full h-auto object-cover"
            />
          </div>
        </aside>
      </article>
    </u-container>
    <gradient-circle class="absolute opacity-40 bottom-0 right-0 dark:invert" />
  </section>
</template>
