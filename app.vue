<script setup lang="ts">
  const numStations = ref(2)
  const addStation = () => {
    numStations.value++
  }
  const remStation = () => {
    numStations.value--
  }

  const hist = $fetch('/api/record/get')
</script>





<template>
  <div>
    <button @click="addStation">Add Station</button>
    <button @click="remStation">Remove Station</button>
    <Station v-for="n in numStations" />

    <div>

    </div>
  </div>
</template>


<style scoped>
div {
  text-align: center;
}

button {
  padding: 10px;
}
</style>