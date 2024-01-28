<template>
  <the-header />
  <router-view v-slot="slotProps">

    <component :is="slotProps.Component"></component>
  </router-view>
</template>

<script setup>
import TheHeader from './components/TheHeader.vue';
import { useStore } from './store';
import { watch } from 'vue';
// import { onBeforeMount, watch } from 'vue';
// import store
//   from './store';
// import router from './router';

// onBeforeMount(() => {
//   store.dispatch('tryLogin');
// });
// watch(() => store.getters.didAutoLogout, (curValue, oldValue) => {
//   console.log('didAutoLogout', curValue, oldValue)
//   if (curValue && curValue !== oldValue) {
//       router.replace('/auth');
//   }
// });

const store = useStore();

// Load persisted state
const persistedState = localStorage.getItem('user');
if (persistedState) {
  store.$patch(JSON.parse(persistedState));
}

// Watch for changes and persist state
watch(() => store.$state, (newState) => {
  localStorage.setItem('user', JSON.stringify(newState));
}, { deep: true });


</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);

}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}
</style>