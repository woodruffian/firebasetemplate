<template>
    <base-card>
        <h1>Choose your Authentication Method</h1>
        <router-link :to="googlepath">
            <base-button>Google</base-button>
        </router-link>
        <router-link :to="facebookpath">
            <base-button>Facebook</base-button>
        </router-link>

        <router-link :to="pwpath">
            <base-button>Password</base-button>
        </router-link>
    </base-card>
</template>
<script setup>

import BaseButton from '../../components/ui/BaseButton.vue';
//import { signInWithPopup } from 'firebase/auth';

const pwpath = { name: 'passwordauth' };
const googlepath = { name: 'googleauth' };
const facebookpath = { name: 'facebookauth' };
//const microsoftpath = { name: 'microsoftauth' };
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