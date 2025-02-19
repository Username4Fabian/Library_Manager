<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import CustomerSearchBar from '../components/customer/CustomerSearchBar.vue';
import CustomerItem from '../components/customer/CustomerItem.vue';
import Pagination from '../components/Pagination.vue';
import Toast from '../components/Toast.vue';

const customers = ref([]);
const searchQuery = ref('');
const searchProperty = ref('all');
const currentPage = ref(1);
const customersPerPage = 15;
const showToast = ref(false);
const toastMessage = ref('');
const fetchInterval = 3 * 60 * 1000; // 5 minutes in milliseconds

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

const handleCustomerUpdated = async (updatedCustomer) => {
  const customerIndex = customers.value.findIndex(c => c.id === updatedCustomer.id);
  if (customerIndex !== -1) {
    const previousCustomerState = { ...customers.value[customerIndex] };

    // Optimistic UI update
    customers.value[customerIndex].book = null;
    localStorage.setItem('customers', JSON.stringify(customers.value));
    toastMessage.value = 'Buch erfolgreich zurückgegeben!';
    showToast.value = true;

    const totalPages = Math.ceil(customers.value.length / customersPerPage);
    if (currentPage.value > totalPages) {
      currentPage.value = totalPages;
    }

    try {
      await axios.post('/api/rental/returnBook', null, {
        params: {
          customerId: updatedCustomer.id,
          bookId: updatedCustomer.bookId
        }
      });
    } catch (error) {
      console.error('Fehler beim Zurückgeben des Buches:', error);
      // Revert optimistic update
      customers.value[customerIndex] = previousCustomerState;
      localStorage.setItem('customers', JSON.stringify(customers.value));
      toastMessage.value = 'Fehler beim Zurückgeben des Buches!';
      showToast.value = true;
    }
  }
};

const closeToast = () => {
  showToast.value = false;
};

onMounted(() => {
  fetchCustomers();
});

watch([searchQuery, searchProperty], () => {
  currentPage.value = 1;
});

const filteredCustomers = computed(() => {
  if (!searchQuery.value) {
    return customers.value.filter(customer => customer.book);
  }
  return customers.value.filter(customer => {
    if (searchProperty.value === 'all') {
      return (
        customer.book &&
        (customer.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        customer.group.toLowerCase().includes(searchQuery.value.toLowerCase()))
      );
    } else {
      return customer.book && String(customer[searchProperty.value]).toLowerCase().includes(searchQuery.value.toLowerCase());
    }
  });
});

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * customersPerPage;
  const end = start + customersPerPage;
  return filteredCustomers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / customersPerPage);
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
    <h1 class="text-2xl font-bold mb-4">Aktuell ausgeliehene Bücher</h1>
    <CustomerSearchBar
      v-model:searchQuery="searchQuery"
      v-model:searchProperty="searchProperty"
      :showAddButton="false"
    />
    <ul>
      <li v-for="customer in paginatedCustomers" :key="customer.id" class="mb-2">
        <CustomerItem :customer="customer" actionType="return" @customerUpdated="handleCustomerUpdated" />
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
    <Toast v-if="showToast" :message="toastMessage" @close="closeToast" />
  </div>
</template>