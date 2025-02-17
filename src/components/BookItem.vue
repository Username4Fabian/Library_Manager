<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  book: Object
});

const formatDate = (date) => {
  const d = new Date(date);
  return d.getTime() === 0 ? '---' : d.toLocaleDateString();
};

const purchaseDate = computed(() => formatDate(props.book.purchaseDate));
const borrowDate = computed(() => formatDate(props.book.borrowDate));
</script>

<template>
  <div class="p-4 bg-white shadow rounded">
    <h2 class="text-xl font-semibold">{{ book.title }}</h2>
    <p>Author: {{ book.author }}</p>
    <p>Number: {{ book.number }}</p>
    <p>Purchase Date: {{ purchaseDate }}</p>
    <p>Borrow Date: {{ borrowDate }}</p>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style>