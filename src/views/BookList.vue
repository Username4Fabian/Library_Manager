<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import SearchBar from '../components/SearchBar.vue';
import BookItem from '../components/BookItem.vue';
import Pagination from '../components/Pagination.vue';
import AddBookOverlay from '../components/AddBookOverlay.vue';
import Toast from '../components/Toast.vue';

const books = ref([]);
const searchQuery = ref('');
const searchProperty = ref('all');
const currentPage = ref(1);
const booksPerPage = 15;
const showOverlay = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const fetchInterval = 5 * 60 * 1000; // 5 minutes in milliseconds

const fetchBooks = async () => {
  const cachedBooks = localStorage.getItem('books');
  const lastFetchTime = localStorage.getItem('lastFetchTime');
  const now = Date.now();

  if (cachedBooks && lastFetchTime && (now - lastFetchTime < fetchInterval)) {
    books.value = JSON.parse(cachedBooks);
  } else {
    try {
      const response = await axios.get('api/books/GetAllBooks');
      books.value = response.data;
      localStorage.setItem('books', JSON.stringify(books.value));
      localStorage.setItem('lastFetchTime', now.toString());
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }
};

const addBook = (newBook) => {
  books.value.push(newBook);
  localStorage.setItem('books', JSON.stringify(books.value));
  toastMessage.value = 'Book added successfully!';
  showToast.value = true;
};

const deleteBook = async (bookId) => {
  try {
    await axios.delete(`api/books/DeleteBook/${bookId}`);
    books.value = books.value.filter(book => book.id !== bookId);
    localStorage.setItem('books', JSON.stringify(books.value));
    toastMessage.value = 'Book deleted successfully!';
    showToast.value = true;
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};

const closeToast = () => {
  showToast.value = false;
};

onMounted(() => {
  fetchBooks();
});

watch([searchQuery, searchProperty], () => {
  currentPage.value = 1;
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

const firstPage = () => {
  currentPage.value = 1;
};

const lastPage = () => {
  currentPage.value = totalPages.value;
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Book List</h1>
    <SearchBar
      v-model:searchQuery="searchQuery"
      v-model:searchProperty="searchProperty"
      @showOverlay="showOverlay = true"
    />
    <ul>
      <li v-for="book in paginatedBooks" :key="book.id" class="mb-2">
        <BookItem :book="book" @deleteBook="deleteBook" />
      </li>
    </ul>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @prevPage="prevPage"
      @nextPage="nextPage"
      @firstPage="firstPage"
      @lastPage="lastPage"
    />
    <AddBookOverlay v-if="showOverlay" @closeOverlay="showOverlay = false" @addBook="addBook" />
    <Toast v-if="showToast" :message="toastMessage" @close="closeToast" />
  </div>
</template>
