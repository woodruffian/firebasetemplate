import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  //setPersistence,
  //browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../firebaseApp";
//import dayjs from "dayjs";
//import coachesModule from './modules/coaches/index.js';
//import requestsModule from './modules/requests/index.js';
//import { authModule } from "./modules/auth/index.js";
let timer;

export const useStore = defineStore("user", {
  state: () => ({
    userId: null,
    uid: null,
    token: null,
    //loginAttempts: 0,
    //tokenExpiration: null,
    setAutoLogout: false,
  }),
  getters: {
    isAuthenticated() {
      return !!this.token;
    },

    loginAttempts() {
      const attempts = localStorage.getItem("loginAttempts");
      return parseInt(attempts) || 0;
    },
    // userId(state) {
    //   return state.userId;
    // },
    // token(state) {
    //   return state.token;
    // },
    // autoLogout(state) {
    //   return state.autoLogout;
    // },
  },
  //   doubleCount() {
  //     return this.count * 2;
  //   },
  // },

  actions: {
    // increment() {
    //   this.count++;
    // },
    setUser(payload) {
      //do this in the actions.
      // localStorage.setItem('userId', payload.userId);
      // localStorage.setItem('token', payload.token);
      // localStorage.setItem('tokenExpiration', payload.tokenExpiration);

      this.userId = payload.userId;
      this.uid = payload.userId;
      this.token = payload.token;
      this.autoLogout = payload.autoLogout;
      // state.tokenExpiration = payload.tokenExpiration;
    },

    //tryLogin will attempt to get user credentials out of local storage.
    async tryLogin() {
      const userid = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const tokenExpiration = localStorage.getItem("tokenExpiration");

      const now = Date.now();
      if (tokenExpiration < now) {
        return;
      }

      //set the timer to logout when the token expires.
      //again not sure this is the smart play, but matches the training.
      const expiresIn = tokenExpiration - now;

      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        this.autoLogout();
      }, expiresIn);

      if (userid && token) {
        console.log("trying login");
        this.setUser({
          userId: userid,
          token: token,
          //we don't need expiration in the store, only in local storage.
          //tokenExpiration: null,
        });
      }
    },
    async IncrementLoginAttempts() {
      const attempts = localStorage.getItem("loginAttempts");
      const newAttempts = parseInt(attempts) + 1;
      localStorage.setItem("loginAttempts", newAttempts);
    },

    async loginWithUser(user) {
      console.log("user", user);
      this.IncrementLoginAttempts();

      const token = user.stsTokenManager.accessToken; //await user.getIdToken();
      const uid = user.uid;
      const expirationTime = user.stsTokenManager.expirationTime;
      console.log("token", token);
      localStorage.setItem("userId", uid);
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      //we know the token expires in 60 minutes, convert from milliseconds to minutes.
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      //set the timer to logout when the token expires.
      //I tested this with a 5 second expiration, and it worked.
      timer = setTimeout(function () {
        console.log("timer expiring");
      }, 1000 * 60 * 60);
      this.setUser({
        userId: uid,
        uid: uid,
        token: token, //user.stsTokenManager.accessToken,
        //tokenExpiration: user.stsTokenManager.expirationTime,
      });
    },

    async login(payload) {
      console.log("login", payload);

      //try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
      const user = userCredential.user;
      console.log("user", user);

      localStorage.setItem("userId", user.uid);
      localStorage.setItem("token", user.stsTokenManager.accessToken);
      localStorage.setItem(
        "tokenExpiration",
        userCredential.user.stsTokenManager.expirationTime
      );

      //we know the token expires in 60 minutes, convert from milliseconds to minutes.
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      //set the timer to logout when the token expires.
      //I tested this with a 5 second expiration, and it worked.
      timer = setTimeout(function () {
        console.log("timer expiring");
      }, 1000 * 60 * 60);
      this.setUser({
        userId: user.uid,
        uid: user.uid,
        token: user.stsTokenManager.accessToken,
        tokenExpiration: user.stsTokenManager.expirationTime,
      });

      //!!!!token expiration is 60 minutes. !!!!!
      //console.log('expiration', context.state.tokenExpiration);
      //const now = new Date();
      // const now = Date.now();
      // const diff = context.state.tokenExpiration - now;
      // console.log('diff', diff);
      //} catch (err) {
      //console.log('throwing an error');
      //console.log('err', err);
      //  throw err;
      //}
    },

    async signup(payload) {
      //you can also refactor this like above to use await
      //await setPersistence(auth, browserSessionPersistence);
      console.log("auth = ", auth);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );

      //const expirationDate = new Date().getTime() + 1000 * 60 * 60;
      localStorage.setItem("userId", userCredential.user.uid);
      localStorage.setItem(
        "token",
        userCredential.user.stsTokenManager.accessToken
      );
      //localStorage.setItem('tokenExpiration', expirationDate);
      localStorage.setItem(
        "tokenExpiration",
        userCredential.user.stsTokenManager.expirationTime
      );

      const user = userCredential.user;
      this.setUser({
        userId: user.uid,
        uid: user.uid,
        token: user.stsTokenManager.accessToken,
        tokenExpiration: user.stsTokenManager.expirationTime,
      });

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(function () {
        this.autoLogout();
      }, 1000 * 60 * 60);

      // ).then((userCredential) => {
      //   // Signed up
      //   const user = userCredential.user;
      //   console.log('user', user);

      //   context.commit('setUser', {
      //     userId: user.uid,
      //     token: user.stsTokenManager.accessToken,
      //     tokenExpiration: user.stsTokenManager.expirationTime,
      //   });
      //   // ...
      // });

      // const response = await firebase
      //   .auth()
      //   .createUserWithEmailAndPassword(payload.email, payload.password);

      // const responseData = await response.json();
      // if (!response.ok) {
      //   const error = new Error(
      //     responseData.message ||
      //       'Failed to authenticate. Check your login data.'
      //   );
      //   throw error;
      // }

      //now valid response and auth has succeeded.
      //now we can store the userid in the store.

      // context.commit('setUser', {
      //   userId: responseData.localId,
      //   token: responseData.idToken,
      //   tokenExpiration: responseData.expiresIn,
      // });
    },

    async autoLogout() {
      this.logout();
      this.setAutoLogout = true;
    },
    async logout() {
      if (timer) {
        clearTimeout(timer);
      }
      //this.loginAttempts = 0;
      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      this.setUser({
        userId: null,
        uid: null,
        token: null,
        tokenExpiration: null,
        autoLogout: false,
      });
    },
  },
});

//export default store;
