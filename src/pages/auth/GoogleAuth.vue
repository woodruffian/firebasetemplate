<template>
    <base-card>
        <h1>GOOGLE Authentication</h1>
    </base-card>
</template>
<script setup>

import { onMounted } from "vue";
import { auth } from "../../firebaseApp";
import { ref } from "vue";
//import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { useStore } from '../../store/index.js'
import { useRoute, useRouter } from 'vue-router';

import {
    signInWithPopup,
    //signOut,
    GoogleAuthProvider,
    //signInWithRedirect, getRedirectResult
} from 'firebase/auth'
//import { ref as dbRef } from "firebase/database";
const router = useRouter();
const route = useRoute();
const provider = new GoogleAuthProvider()
provider.addScope('profile')
provider.addScope('email')
//...
const store = useStore();
const error = ref(null);

async function signinPopup() {
    //console.log('signinPopup', auth);
    // const yo = window.confirm(store.loginAttempts);
    // console.log('yo', yo);
    if (store.loginAttempts > 3) {
        const userWantsToContinue = window.confirm('Too many login attempts. Do you want to continue?');
        if (!userWantsToContinue) {
            return;
        }
        error.value = 'Too many login attempts, please try again later.'
        return;
    }

    //signinWithRedirect was stuck in a loop.  NOt sure why.
    //but the store.loginAttempts was NOT incrementing.

    // await signInWithRedirect(auth, googleAuthProvider);
    // // This will trigger a full page redirect away from your app

    // // After returning from the redirect when your app initializes you can obtain the result
    // const result = await getRedirectResult(auth);
    // if (result) {
    //     console.log('result (userCredential?)', result);
    //     // This is the signed-in user
    //     const user = result.user;
    //     await store.loginWithUser(user);
    //     // This gives you a Facebook Access Token.
    //     //const credential = provider.credentialFromResult(auth, result);
    //     //const token = credential.accessToken;
    // }


    //error.value = null
    //await signInWithRedirect(auth, googleAuthProvider);

    /* 2024-02-26:

    https://firebase.google.com/docs/auth/web/redirect-best-practices

    According to this document, signinwithPopup is the best practice for web apps.  It's not going to be affected
    by the third party cookie issues that signinWithRedirect is.
    */
    const userCredential = await signInWithPopup(auth, provider).catch((reason) => {
        console.error('Failed sign', reason)
        error.value = reason
    })
    const user = userCredential.user;
    console.log('usercredential', userCredential)
    //console.log('user', user);
    await store.loginWithUser(user);

    // store.setUser({
    //     id: user.uid,
    //     email: user.email,
    //     displayName: user.displayName,
    //     photoURL: user.photoURL
    // })


    const redirectUrl = '/' + (route.query.redirect || 'todos');
    router.replace(redirectUrl);

    /*  facebook example 

// Sign in using a redirect.
const provider = new FacebookAuthProvider();
// You can add additional scopes to the provider:
provider.addScope('user_birthday');
// Start a sign in process for an unauthenticated user.
await signInWithRedirect(auth, provider);
// This will trigger a full page redirect away from your app

// After returning from the redirect when your app initializes you can obtain the result
const result = await getRedirectResult(auth);
if (result) {
  // This is the signed-in user
  const user = result.user;
  // This gives you a Facebook Access Token.
  const credential = provider.credentialFromResult(auth, result);
  const token = credential.accessToken;
}
// As this API can be used for sign-in, linking and reauthentication,
// check the operationType to determine what triggered this redirect
// operation.
const operationType = result.operationType;

    */

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