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


            <base-button>{{ buttonLabel }}</base-button>
            <base-button type="button" mode="flat" @click="switchAuthMode">{{ switchButtonLabel }}</base-button>
        </form>
    </base-card>
</template>
<script setup>

import { onMounted } from "vue";
import { auth } from "../../firebaseApp";
import { ref } from "vue";
//import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { useStore } from '../../store/index.js'

import {
    signInWithPopup,
    //signOut,
    GoogleAuthProvider,
    signInWithRedirect
} from 'firebase/auth'
//import { ref as dbRef } from "firebase/database";
const googleAuthProvider = new GoogleAuthProvider()
googleAuthProvider.addScope('profile')
googleAuthProvider.addScope('email')
//...
const store = useStore();
const error = ref(null);

async function signinPopup() {
    console.log('signinPopup', auth);
    //error.value = null
    await signInWithRedirect(auth, googleAuthProvider);
    const user = signInWithPopup(auth, googleAuthProvider).catch((reason) => {
        console.error('Failed sign', reason)
        error.value = reason
    })
    console.log('user', user);
    store.setUser({
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
    })

}

onMounted(() => {
    //console.log('mounted')
    signinPopup();
    //const { user } = useCurrentUser()
    //console.log('user', user)
    //const { user } = useFirebaseAuth()
    //console.log('user', user)
    //console.log('auth', auth)
    //console.log('auth.currentUser', auth.currentUser)
    //console.log('auth.currentUser.uid', auth.currentUser.uid)
    //console.log('auth.currentUser.displayName', auth.currentUser.displayName)
    //console.log('auth.currentUser.email', auth.currentUser.email)
    //console.log('auth.currentUser.photoURL', auth.currentUser.photoURL)
    //console.log('auth.currentUser.phoneNumber', auth.currentUser.phoneNumber)
    //console.log('auth.currentUser.providerData', auth.currentUser.providerData)
    //console.log('auth.currentUser.providerId', auth.currentUser.providerId)
    //console.log('auth.currentUser.refreshToken', auth.currentUser.refreshToken)
    //console.log('auth.currentUser.uid', auth.currentUser.uid)
    //}
})
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