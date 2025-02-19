<script setup>
import { defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({
  customer: Object,
  actionType: {
    type: String,
    default: 'delete' // 'delete' or 'return'
  }
});

const emits = defineEmits(['customerDeleted', 'customerUpdated']);

const deleteCustomer = async () => {
  if (window.confirm(`Sind Sie sicher, dass Sie das Kind: ${props.customer.firstName} ${props.customer.lastName} löschen möchten?`)) {
    try {
      await axios.delete(`api/customers/DeleteCustomer/${props.customer.id}`);
      emits('customerDeleted', props.customer);
    } catch (error) {
      console.error('Fehler beim Löschen des Kindes:', error);
    }
  }
};

const returnBook = async () => {
  if (props.customer.book) {
    const bookId = props.customer.book.id;
    try {
      // Optimistic UI update
      props.customer.book = null;
      emits('customerUpdated', { ...props.customer, bookId });

      await axios.post('/api/rental/returnBook', null, {
        params: {
          customerId: props.customer.id,
          bookId: bookId
        }
      });
    } catch (error) {
      console.error('Fehler beim Zurückgeben des Buches:', error);
      // Revert optimistic update
      props.customer.book = { id: bookId };
    }
  }
};
</script>

<template>
  <div class="p-4 bg-white shadow rounded flex justify-between items-center">
    <div>
      <h2 class="text-xl font-semibold">{{ customer.firstName }} {{ customer.lastName }}</h2>
      <p>Gruppe: {{ customer.group ? customer.group : '---' }}</p>
      <p>Buch: {{ customer.book ? `${customer.book.number} | ${customer.book.title}` : '---' }}</p>
    </div>
    <button
      v-if="actionType === 'delete'"
      @click="deleteCustomer"
      class="text-gray-500 hover:text-gray-700 text-2xl hover:cursor-pointer hover:scale-102"
    >
      <i class="fas fa-trash-alt"></i>
    </button>
    <button
      v-else-if="actionType === 'return'"
      @click="returnBook"
      class="text-gray-500 hover:text-gray-700 text-2xl hover:cursor-pointer hover:scale-102"
    >
      <i class="fas fa-undo-alt"></i>
    </button>
  </div>
</template>