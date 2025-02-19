<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  bookQuery: String,
  books: Array,
  showBookDropdown: Boolean,
});

const emits = defineEmits(['update:bookQuery', 'selectBook']);

const bookQuery = ref(props.bookQuery);
const showBookDropdown = ref(props.showBookDropdown);

const filteredBooks = computed(() => {
  if (!bookQuery.value) {
    return [];
  }
  return props.books.filter(book =>
    `${book.number} | ${book.title}`.toLowerCase().includes(bookQuery.value.toLowerCase())
  );
});

const selectBook = (book) => {
  bookQuery.value = `${book.number} | ${book.title}`;
  emits('selectBook', book);
  showBookDropdown.value = false;
};

watch(bookQuery, (newValue) => {
  emits('update:bookQuery', newValue);
});
</script>

<template>
  <div class="mb-4 relative">
    <label class="block text-gray-700">Buch Nummer</label>
    <input
      v-model="bookQuery"
      @focus="showBookDropdown = true"
      @input="showBookDropdown = true"
      type="text"
      placeholder="Buch Nummer..."
      class="w-full p-2 border border-gray-300 rounded mb-2"
    />
    <ul v-if="showBookDropdown && filteredBooks.length" class="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
      <li
        v-for="book in filteredBooks"
        :key="book.id"
        @click="selectBook(book)"
        class="p-2 cursor-pointer hover:bg-gray-200"
      >
        {{ book.number }} | {{ book.title }}
      </li>
    </ul>
  </div>
</template>