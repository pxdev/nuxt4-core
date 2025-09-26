import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function useDirection() {
  const { t, localeProperties } = useI18n();
  const isRTL = computed(() => localeProperties.value.dir === 'rtl');

  return {
    localeProperties,
    t,
    isRTL,
  };
}
