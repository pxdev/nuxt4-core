<script setup>

</script>

<template>
  <section
      class="h-full min-h-[calc(100svh-91px)] flex overflow-hidden relative bg-gradient-to-r from-primary/20  to-secondary/20">


    <img alt="" src="/images/shapes/islamic_s1.svg" class="absolute w-80 right-10 z-0" >
    <img alt="" src="/images/shapes/islamic_ornament.svg" class="absolute w-xl opacity-5  bottom-20 inset-x-0" >


    <u-container class="w-full">
      <article class="flex items-center h-full relative">

        <section class="h-full w-1/2 flex items-center">
          <header class="flex flex-col space-y-4">
            <div class="">
              <p class="text-base font-bold">Your Journey to</p>
              <h2 class="text-5xl tracking-tight font-black">Arabic and Qur’anic
                <icon class="w-14 h-14 text-primary inline-flex" name="tabler:flare-filled"/>
              </h2>
              <h2 class="text-5xl tracking-tight font-black">Fluency</h2>
            </div>

            <p class="text-base">Interactive Arabic and Tajweed courses tailored for beginners. Learn
              pronunciation, grammar, and Qur’anic recitation the easy way — from the alphabet to perfect Tajweed.</p>

            <div class="flex items-center gap-4 mt-4">
              <fill-arrow-button class="inline-flex" size="h-12 w-12">
                Start Learning
              </fill-arrow-button>

            </div>
          </header>
        </section>

        <aside class="flex h-full items-center w-1/2 shrink-0 justify-center relative gap-10">

          <rotating-text
              class="absolute left-24 bottom-10 z-20 "
          />

          <nuxt-img
              src="/images/banners/student_1.png"
              class="will-change-transform rounded-full border-8 h-auto w-[260px] border-white"
              alt=""
          />

          <nuxt-img
              src="/images/banners/student_2.png"
              class="will-change-transform rounded-full border-8 h-auto w-[260px] translate-y-20 border-white"
              alt=""
          />


        </aside>

      </article>
    </u-container>


    <div class="clouds w-full absolute bottom-0 bg-[url('/images/clouds.png')] bg-repeat h-32"/>

  </section>
</template>

