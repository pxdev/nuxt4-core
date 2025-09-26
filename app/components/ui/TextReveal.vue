<script lang="ts" setup>
  import { onMounted, ref, nextTick } from 'vue';
  import SplitType from 'split-type';

  interface SplitTypeResult {
    chars: HTMLElement[];
    words: HTMLElement[];
    lines: HTMLElement[];
  }

  const { isRTL } = useDirection();

  const textElement = ref<HTMLElement | null>(null);

  const animate = (el: HTMLElement, i: number) =>
    useMotion(el, {
      initial: {
        y: 10,
        opacity: 0,
      },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 400,
          delay: i * 10,
          repeatType: 'mirror',
        },
      },
    });

  onMounted(async () => {
    if (!textElement.value) return;

    // Wait for next tick to ensure content is rendered
    await nextTick();

    const text = new SplitType(textElement.value, {
      types: isRTL.value ? 'words' : 'words,chars',
    }) as SplitTypeResult;

    if (!text.words) return;

    if (isRTL.value) {
      text.words.forEach((word, i) => {
        animate(word, i * 10);
      });
    } else {
      text.chars.forEach((char, i) => {
        animate(char, i);
      });
    }
  });
</script>

<template>
  <div class="relative overflow-hidden">
    <span ref="textElement" class="text-reveal overflow-hidden will-change-transform">
      <slot />
    </span>
  </div>
</template>
