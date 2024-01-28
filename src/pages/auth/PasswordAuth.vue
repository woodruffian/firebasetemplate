<template>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
        <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
        <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
        <h1>YO: {{ authenticated }}</h1>
        <form @submit.prevent="submitForm">

            <div class="form-control">
                <label for="email">Your E-Mail</label>
                <input type="email" id="email" v-model.trim="email" autocomplete="username">
            </div>
            <div class="form-control">
                <label for="password">Your Password</label>
                <input type="password" id="password" autocomplete="current-password" v-model.trim="password">
            </div>
            <p v-if="!formIsValid" class="errors">Please enter a valid email and password (at least 6 characters)!</p>
            <base-button>{{ buttonLabel }}</base-button>
            <base-button type="button" mode="flat" @click="switchAuthMode">{{ switchButtonLabel }}</base-button>
        </form>
    </base-card>
</template>
<script setup>
import { ref, computed } from 'vue';
//import store from '../../store/index.js';
import { useStore } from '../../store/index.js';
import BaseButton from '../../components/ui/BaseButton.vue';
//import { signInWithPopup } from 'firebase/auth';
import { useRoute, useRouter } from 'vue-router';

import {
    //createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    //setPersistence,
    //browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../../firebaseApp";
//console.log('in passwordauth');
const store = useStore();
const email = ref('');
const password = ref('');

const formIsValid = ref(true);
const error = ref(null);
const isLoading = ref(false);
const mode = ref('login'); //login or register
const buttonLabel = computed(() => mode.value === 'login' ? 'Login' : 'Register');
const switchButtonLabel = computed(() => mode.value === 'login' ? 'Go to Registration' : 'Go to Log in');

const router = useRouter();
const route = useRoute();
const authenticated = computed(() => store.isAuthenticated);
//const token = computed(() => store.token);


//console.log("authenticated in userauth", authenticated.value);
const submitForm = async () => {
    if (email.value === '' || !email.value.includes('@') || password.value.length < 6) {
        formIsValid.value = false;
        return;
    }
    const formData = {
        email: email.value,
        password: password.value
    };
    //send http request to database.
    //console.log('formData', formData);
    isLoading.value = true;
    try {
        if (mode.value === 'login') {
            //await store.dispatch('login', formData);

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email.value,
                password.value
            );
            const user = userCredential.user;
            await store.loginWithUser(user); //store.login(formData);
        } else {
            //await store.dispatch('signup', formData);
            await store.signup(formData);
        }
        //const token = computed(() => store.token);
        //console.log('after completing login/signup authenticated in userauth', authenticated.value, token.value);
        const redirectUrl = '/' + (route.query.redirect || 'todos');
        router.replace(redirectUrl);

    } catch (err) {
        console.log('yoerr', err.message || 'Failed to authenticate, try later.');
        error.value = err.message || 'Failed to authenticate, try later.';
    }

    isLoading.value = false;

}

const switchAuthMode = () => {
    mode.value = mode.value === 'login' ? 'register' : 'login';
}

const handleError = () => {
    error.value = null;
}
</script>
<style scoped>
form {
    margin: 1rem;
    padding: 1rem;
}

.form-control {
    margin: 0.5rem 0;
}

label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
}

input,
textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.15rem;
}

input:focus,
textarea:focus {
    border-color: #3d008d;
    background-color: #faf6ff;
    outline: none;
}
</style>