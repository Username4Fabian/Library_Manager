<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  message: String,
  duration: {
    type: Number,
    default: 3000 // default duration is 3 seconds
  }
});

const emits = defineEmits(['close']);

const isVisible = ref(true);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = false;
  }, props.duration);
});

watch(isVisible, (newVal) => {
  if (!newVal) {
    emits('close');
  }
});
</script>

<template>
  <div v-if="isVisible" class="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg z-50">
    {{ message }}
  </div>
</template>