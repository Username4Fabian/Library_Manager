<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { defineEmits } from 'vue';
import axios from 'axios';

const emits = defineEmits(['closeOverlay', 'rentSuccess']);

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

const filteredCustomers = computed(() => {
  if (!searchQuery.value) {
    return [];
  }
  return customers.value.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredBooks = computed(() => {
  if (!bookQuery.value) {
    return [];
  }
  return books.value.filter(book =>
    book.number.toString().includes(bookQuery.value)
  );
});

const selectCustomer = (customer) => {
  customerId.value = customer.id;
  searchQuery.value = `${customer.firstName} ${customer.lastName}`;
  showCustomerDropdown.value = false;
};

const selectBook = (book) => {
  bookId.value = book.id;
  bookQuery.value = book.number.toString();
  showBookDropdown.value = false;
};

const rentBook = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await axios.post('/api/rental/rentBook', null, {
      params: {
        customerId: customerId.value,
        bookId: bookId.value
      }
    });

    // Update local storage for the customer with the rented book
    const updatedCustomers = customers.value.map(customer => {
      if (customer.id === customerId.value) {
        return { ...customer, book: books.value.find(book => book.id === bookId.value) };
      }
      return customer;
    });
    customers.value = updatedCustomers;
    localStorage.setItem('customers', JSON.stringify(customers.value));

    emits('rentSuccess', 'Buch erfolgreich ausgeliehen!');
    emits('closeOverlay');
  } catch (error) {
    console.error('Error renting book:', error);
    errorMessage.value = 'Failed to rent book: ' + (error.response?.data?.message || error.message);
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
      <h2 class="text-2xl font-bold mb-4">Buch ausleihen</h2>
      <form @submit.prevent="rentBook">
        <div class="mb-4 relative">
          <label class="block text-gray-700">Kunde</label>
          <input
            v-model="searchQuery"
            @focus="showCustomerDropdown = true"
            @input="showCustomerDropdown = true"
            type="text"
            placeholder="Kunden suchen..."
            class="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <ul v-if="showCustomerDropdown && filteredCustomers.length" class="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
            <li
              v-for="customer in filteredCustomers"
              :key="customer.id"
              @click="selectCustomer(customer)"
              class="p-2 cursor-pointer hover:bg-gray-200"
            >
              {{ customer.firstName }} {{ customer.lastName }}
            </li>
          </ul>
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700">Buch Nummer</label>
          <input
            v-model="bookQuery"
            @focus="showBookDropdown = true"
            @input="showBookDropdown = true"
            type="text"
            placeholder="Buch Nummer"
            class="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <ul v-if="showBookDropdown && filteredBooks.length" class="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
            <li
              v-for="book in filteredBooks"
              :key="book.id"
              @click="selectBook(book)"
              class="p-2 cursor-pointer hover:bg-gray-200"
            >
              {{ book.number }} - {{ book.title }}
            </li>
          </ul>
        </div>
        <div class="flex justify-end items-center">
          <div v-if="isLoading" class="loader mr-2"></div>
          <button type="button" @click="$emit('closeOverlay')" class="mr-2 p-2 bg-gray-500 hover:bg-gray-700 text-white rounded">Abbrechen</button>
          <button type="submit" :disabled="isLoading" class="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">Buch ausleihen</button>
        </div>
        <div v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 24px;
  height: 24px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>