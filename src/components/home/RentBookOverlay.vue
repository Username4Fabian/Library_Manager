<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { defineEmits } from 'vue';
import axios from 'axios';
import CustomerSearch from './CustomerSearch.vue';
import BookSearch from './BookSearch.vue';
import OverlayActions from './OverlayActions.vue';

const emits = defineEmits(['closeOverlay', 'rentSuccess']);

const customerId = ref('');
const bookId = ref('');
const searchQuery = ref('');
const bookQuery = ref('');
const customers = ref([]);
const books = ref([]);
const isLoading = ref(false);
const isFetchingCustomers = ref(false);
const isFetchingBooks = ref(false);
const errorMessage = ref('');
const showCustomerDropdown = ref(false);
const showBookDropdown = ref(false);
const fetchInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
const customerInputRef = ref(null);

const fetchCustomers = async () => {
  isFetchingCustomers.value = true;
  const cachedCustomers = localStorage.getItem('customers');
  const lastFetchTime = localStorage.getItem('lastFetchTime');
  const now = Date.now();

  if (cachedCustomers && lastFetchTime && (now - lastFetchTime < fetchInterval)) {
    customers.value = JSON.parse(cachedCustomers);
  } else {
    try {
      const response = await axios.get('/api/customers/GetAllCustomers');
      customers.value = response.data;
      localStorage.setItem('customers', JSON.stringify(customers.value));
      localStorage.setItem('lastFetchTime', now.toString());
    } catch (error) {
      console.error('Fehler beim Abrufen der Kinder:', error);
    }
  }
  isFetchingCustomers.value = false;
};

const fetchBooks = async () => {
  isFetchingBooks.value = true;
  const cachedBooks = localStorage.getItem('books');
  const lastFetchTime = localStorage.getItem('lastBookFetchTime');
  const now = Date.now();

  if (cachedBooks && lastFetchTime && (now - lastFetchTime < fetchInterval)) {
    books.value = JSON.parse(cachedBooks);
  } else {
    try {
      const response = await axios.get('/api/books/GetAllBooks');
      books.value = response.data;
      localStorage.setItem('books', JSON.stringify(books.value));
      localStorage.setItem('lastBookFetchTime', now.toString());
    } catch (error) {
      console.error('Fehler beim Abrufen der Bücher:', error);
    }
  }
  isFetchingBooks.value = false;
};

const selectCustomer = (customer) => {
  customerId.value = customer.id;
  searchQuery.value = `${customer.firstName} ${customer.lastName}`;
  showCustomerDropdown.value = false;
};

const selectBook = (book) => {
  bookId.value = book.id;
  bookQuery.value = `${book.number} | ${book.title}`;
  showBookDropdown.value = false;
};

const rentBook = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  if (!customerId.value) {
    errorMessage.value = 'Bitte wählen Sie einen Kind aus.';
    isLoading.value = false;
    return;
  }

  if (!bookId.value) {
    errorMessage.value = 'Bitte wählen Sie ein Buch aus.';
    isLoading.value = false;
    return;
  }

  const selectedCustomer = customers.value.find(customer => customer.id === customerId.value);
  const selectedBook = books.value.find(book => book.id === bookId.value);

  if (selectedCustomer && selectedCustomer.book) {
    errorMessage.value = 'Dieses Kind hat bereits ein Buch ausgeliehen.';
    isLoading.value = false;
    return;
  }

  // Optimistic UI update
  const previousCustomerState = { ...selectedCustomer };

  if (selectedCustomer && selectedBook) {
    selectedCustomer.book = selectedBook;
    localStorage.setItem('customers', JSON.stringify(customers.value));
    emits('rentSuccess', 'Buch erfolgreich ausgeliehen!');
    emits('closeOverlay');
  }

  try {
    await axios.post('/api/rental/rentBook', null, {
      params: {
        customerId: customerId.value,
        bookId: bookId.value
      }
    });
  } catch (error) {
    console.error('Error renting book:', error);
    errorMessage.value = 'Failed to rent book: ' + (error.response?.data?.message || error.message);

    // Revert optimistic update
    Object.assign(selectedCustomer, previousCustomerState);
    localStorage.setItem('customers', JSON.stringify(customers.value));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCustomers();
  fetchBooks();
  nextTick(() => {
    if (customerInputRef.value) {
      customerInputRef.value.focus();
    }
  });
});

watch(searchQuery, fetchCustomers);
watch(bookQuery, fetchBooks);
</script>

<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl">
      <h2 class="text-2xl font-bold mb-4">Buch ausleihen</h2>
      <form @submit.prevent="rentBook">
        <div v-if="isFetchingCustomers" class="text-gray-500 text-sm mt-1">Lade Kunden...</div>
        <CustomerSearch
          v-else
          v-model:searchQuery="searchQuery"
          :customers="customers"
          :showCustomerDropdown="showCustomerDropdown"
          @selectCustomer="selectCustomer"
        />
        <div v-if="isFetchingBooks" class="text-gray-500 text-sm mt-1">Lade Bücher...</div>
        <BookSearch
          v-else
          v-model:bookQuery="bookQuery"
          :books="books"
          :showBookDropdown="showBookDropdown"
          @selectBook="selectBook"
        />
        <OverlayActions :isLoading="isLoading" actionLabel="Buch ausleihen" @closeOverlay="$emit('closeOverlay')" />
        <div v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>