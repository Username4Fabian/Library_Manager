<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  book: Object
});

const emits = defineEmits(['deleteBook']);

const formatDate = (date) => {
  const d = new Date(date);
  return d.getTime() === 0 ? '---' : d.toLocaleDateString();
};

const purchaseDate = computed(() => formatDate(props.book.purchaseDate));
const borrowDate = computed(() => formatDate(props.book.borrowDate));

const deleteBook = () => {
  if (window.confirm(`Sind Sie sicher, dass Sie das Buch "${props.book.title}" löschen möchten?`)) {
    emits('deleteBook', props.book.id);
  }
};
</script>

<template>
  <div class="p-4 bg-white shadow rounded flex justify-between items-center">
    <div>
      <h2 class="text-xl font-semibold">{{ book.title }}</h2>
      <p>Autor: {{ book.author }}</p>
      <p>Nummer: {{ book.number }}</p>
      <p>Verlag: {{ book.publisher }}</p>
      <p>Kategorie: {{ book.category }}</p>
      <p>Kaufdatum: {{ purchaseDate }}</p>
      <p>Ausleihdatum: {{ borrowDate }}</p>
      <p>Zusammenfassung: {{ book.summary }}</p>
    </div>
    <button @click="deleteBook" class="text-gray-500 hover:text-gray-700 text-2xl">
      <i class="fas fa-trash-alt"></i>
    </button>
  </div>
</template>