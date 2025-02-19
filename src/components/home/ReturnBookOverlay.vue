<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { defineEmits } from 'vue';
import axios from 'axios';
import CustomerSearch from './CustomerSearch.vue';
import BookSearch from './BookSearch.vue';
import OverlayActions from './OverlayActions.vue';

const emits = defineEmits(['closeOverlay', 'returnSuccess']);

const customerId = ref('');
const bookId = ref('');
const searchQuery = ref('');
const bookQuery = ref('');
const customers = ref([]);
const books = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const showCustomerDropdown = ref(false);
const showBookDropdown = ref(false);
const fetchInterval = 5 * 60 * 1000; // 5 minutes in milliseconds

const fetchCustomers = async () => {
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
      console.error('Fehler beim Abrufen der Kunden:', error);
    }
  }
};

const fetchBooks = async () => {
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

const returnBook = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  const selectedCustomer = customers.value.find(customer => customer.id === customerId.value);
  const selectedBook = books.value.find(book => book.id === bookId.value);

  if (!selectedCustomer && !selectedBook) {
    errorMessage.value = 'Bitte geben Sie entweder einen Kunden oder eine Buchnummer ein.';
    isLoading.value = false;
    return;
  }

  if (selectedCustomer && !selectedCustomer.book) {
    errorMessage.value = 'Dieser Kunde hat kein Buch ausgeliehen.';
    isLoading.value = false;
    return;
  }

  if (selectedBook) {
    const customerWithBook = customers.value.find(customer => customer.book && customer.book.id === selectedBook.id);
    if (!customerWithBook) {
      errorMessage.value = 'Dieses Buch ist nicht ausgeliehen.';
      isLoading.value = false;
      return;
    }
  }

  // Optimistic UI update
  const previousCustomerState = selectedCustomer ? { ...selectedCustomer } : null;

  if (selectedCustomer) {
    selectedCustomer.book = null;
    localStorage.setItem('customers', JSON.stringify(customers.value));
  } else if (selectedBook) {
    const customerWithBook = customers.value.find(customer => customer.book && customer.book.id === selectedBook.id);
    if (customerWithBook) {
      customerWithBook.book = null;
      localStorage.setItem('customers', JSON.stringify(customers.value));
    }
  }

  emits('returnSuccess', 'Buch erfolgreich zurückgegeben!');
  emits('closeOverlay');

  try {
    await axios.post('/api/rental/returnBook', null, {
      params: {
        customerId: customerId.value || undefined,
        bookId: bookId.value || undefined
      }
    });
  } catch (error) {
    console.error('Error returning book:', error);
    errorMessage.value = 'Failed to return book: ' + (error.response?.data?.message || error.message);

    // Revert optimistic update
    if (previousCustomerState) {
      Object.assign(selectedCustomer, previousCustomerState);
      localStorage.setItem('customers', JSON.stringify(customers.value));
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCustomers();
  fetchBooks();
});

watch(searchQuery, fetchCustomers);
watch(bookQuery, fetchBooks);
</script>

<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-1/3">
      <h2 class="text-2xl font-bold mb-4">Buch zurückgeben</h2>
      <form @submit.prevent="returnBook">
        <CustomerSearch
          v-model:searchQuery="searchQuery"
          :customers="customers"
          :showCustomerDropdown="showCustomerDropdown"
          @selectCustomer="selectCustomer"
        />
        <BookSearch
          v-model:bookQuery="bookQuery"
          :books="books"
          :showBookDropdown="showBookDropdown"
          @selectBook="selectBook"
        />
        <OverlayActions :isLoading="isLoading" actionLabel="Buch zurückgeben" @closeOverlay="$emit('closeOverlay')" />
        <div v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>