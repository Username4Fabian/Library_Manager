<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import SearchBar from '../components/SearchBar.vue';
import BookItem from '../components/BookItem.vue';
import Pagination from '../components/Pagination.vue';
import AddBookOverlay from '../components/AddBookOverlay.vue';

const books = ref([]);
const searchQuery = ref('');
const searchProperty = ref('all');
const currentPage = ref(1);
const booksPerPage = 15;
const showOverlay = ref(false);

const fetchBooks = async () => {
  try {
    const response = await axios.get('api/books/GetAllBooks');
    books.value = response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

const addBook = async (newBook) => {
  try {
    const response = await axios.post('api/books/CreateNewBook', newBook);
    books.value.push(response.data);
  } catch (error) {
    console.error('Error adding book:', error);
  }
};

onMounted(() => {
  fetchBooks();
});

const filteredBooks = computed(() => {
  if (!searchQuery.value) {
    return books.value;
  }
  return books.value.filter(book => {
    if (searchProperty.value === 'all') {
      return Object.values(book).some(value =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    } else {
      return String(book[searchProperty.value]).toLowerCase().includes(searchQuery.value.toLowerCase());
    }
  });
});

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * booksPerPage;
  const end = start + booksPerPage;
  return filteredBooks.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / booksPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Book List</h1>
    <SearchBar v-model:searchQuery="searchQuery" v-model:searchProperty="searchProperty" @showOverlay="showOverlay = true" />
    <ul>
      <li v-for="book in paginatedBooks" :key="book.id" class="mb-2">
        <BookItem :book="book" />
      </li>
    </ul>
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @prevPage="prevPage" @nextPage="nextPage" />
    <AddBookOverlay v-if="showOverlay" @closeOverlay="showOverlay = false" @addBook="addBook" />
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style>