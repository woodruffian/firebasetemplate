<template>
    <section>
        <base-card>
            <h2>Page Not found</h2>
            <p>Page not found -- check out the spiffy <router-link :to="todosLink">todos</router-link> page.</p>
        </base-card>
    </section>
</template>
      
<script setup>
const todosLink = { name: 'todos' };
</script>
  
<style scoped>
/* Your styles go here */
</style>