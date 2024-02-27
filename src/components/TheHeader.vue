<template>
    <header>
        <nav>
            <h1><router-link to="/todos">TODOS</router-link></h1>
            <ul>
                <li v-if="authenticated"><base-button @click="logout">Log out</base-button></li>
            </ul>
        </nav>
    </header>
</template>

<script setup>


// <li v-if="authenticated"><router-link to="/requests">All Requests</router-link></li>
// <li v-else><router-link to="/auth">Login</router-link></li>
// <li v-if="authenticated"><base-button @click="logout">Log out</base-button></li>

//import { defineStore } from 'pinia'
//import BaseButton from '../components/ui/BaseButton.vue';
import { computed, watch } from 'vue';
const authenticated = computed(() => store.isAuthenticated);
import { useRouter, useRoute } from 'vue-router';
import { useCurrentUser } from "vuefire";
const router = useRouter();
const route = useRoute();
let _user = null;

// }
// watchEffect(() => {
//     console.log('authenticated in theheader', authenticated.value);
// });
import { ref } from 'vue';
import { useStore } from '../store/index.js';
//import { auth } from '@/firebaseApp';
const userid = ref('');
const store = useStore();
//console.log('made it here')
userid.value = store.userid;
//console.log('userid in theheader', userid.value);

watch(authenticated, (value) => {
    //console.log('authenticated in theheader', value);
    if (value) {
        _user = useCurrentUser();
    }
});


const logout = () => {
    if (_user) {
        console.log('user in theheader', _user.value.displayName);
    }
    //console.log('getting ready to logout')
    //this works.
    //const user = useCurrentUser();
    //console.log('user in theheader', user.value.displayName);
    store.logout();
    const redirectUrl = '/' + (route.query.redirect || 'auth');
    //console.log('redirectUrl', redirectUrl);
    router.replace(redirectUrl);
}


</script>

<style scoped>
header {
    width: 100%;
    height: 5rem;
    background-color: #3d008d;
    display: flex;
    justify-content: center;
    align-items: center;
}

header a {
    text-decoration: none;
    color: #f391e3;
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border: 1px solid transparent;
}

a:active,
a:hover,
a.router-link-active {
    border: 1px solid #f391e3;
}

h1 {
    margin: 0;
}

h1 a {
    color: white;
    margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
    border-color: transparent;
}

header nav {
    width: 90%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

li {
    margin: 0 0.5rem;
}
</style>