<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  searchQuery: String,
  customers: Array,
  showCustomerDropdown: Boolean,
});

const emits = defineEmits(['update:searchQuery', 'selectCustomer']);

const searchQuery = ref(props.searchQuery);
const showCustomerDropdown = ref(props.showCustomerDropdown);

const filteredCustomers = computed(() => {
  if (!searchQuery.value) {
    return [];
  }
  return props.customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectCustomer = (customer) => {
  searchQuery.value = `${customer.firstName} ${customer.lastName}`;
  emits('selectCustomer', customer);
  showCustomerDropdown.value = false;
};

watch(searchQuery, (newValue) => {
  emits('update:searchQuery', newValue);
});
</script>

<template>
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
</template>