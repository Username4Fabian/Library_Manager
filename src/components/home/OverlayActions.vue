<script setup>
const props = defineProps({
  isLoading: Boolean,
  actionLabel: String,
});

const emits = defineEmits(['closeOverlay']);

const closeOverlay = () => {
  emits('closeOverlay');
};
</script>

<template>
  <div class="flex justify-end items-center">
    <button type="button" @click="closeOverlay" class="mr-2 p-2 bg-gray-500 hover:bg-gray-700 text-white rounded hover:scale-102 hover:cursor-pointer">Abbrechen</button>
    <button type="submit" :disabled="isLoading" class="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded hover:scale-102 hover:cursor-pointer">{{ actionLabel }}</button>
  </div>
</template>