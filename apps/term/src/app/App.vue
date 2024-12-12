<script setup lang="ts">
import { ref, onMounted } from "vue";

let rsvp = ref([]);

onMounted(() => {
  fetch('/rsvp/list')
    .then(response => response.json())
    .then(data => rsvp.value = data);
});

</script>

<template>

  <div>
    <h1>RSVP Viewer</h1>
    <p>View RSVPs for an event</p>
  </div>
  <div style="display: grid; ; width: 100%;">
  <!-- Add your grid items here -->
</div>
    <h2>RSVPs</h2>
    <table style="width: 100%;">
      <tr v-for="item in rsvp" :key="item.id">
        <td>{{ item.name }}</td> 
        <td>{{ item.message }}</td>
        <td>{{ item.attend }}</td>
        <td>{{ item.createdAt }}</td>
        <td>{{ item.id }}</td>
      </tr>
    </table>
</template>
