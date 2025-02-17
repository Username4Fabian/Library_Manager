<script setup>
import { defineEmits } from 'vue';

const emits = defineEmits(['showOverlay']);
</script>

<template>
  <button @click="$emit('showOverlay')">
    Add Book
  </button>
</template>

<style scoped>
/* Add any additional styling here */
</style>