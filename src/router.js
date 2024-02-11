import { createRouter, createWebHistory } from "vue-router";
//import { getCurrentUser } from "vuefire";
import TodosPage from "./pages/TodosPage.vue";
import NotFound from "./pages/NotFound.vue";
import AuthForm from "./pages/auth/UserAuth.vue";
import PasswordAuthForm from "./pages/auth/PasswordAuth.vue";
import GoogleAuthForm from "./pages/auth/GoogleAuth.vue";
import FacebookAuthForm from "./pages/auth/FacebookAuth.vue";
import RegisterForm from "./pages/RegisterUser.vue";
//import MicrosoftAuthForm from "./pages/auth/MicrosoftAuth.vue";
//import store from "./store/index.js";
import { useStore } from "./store";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/todos" },
    { path: "/todos", name: "todos", component: TodosPage },
    {
      path: "/auth",
      component: AuthForm,
      name: "auth",
    },
    {
      path: "/auth/password",
      component: PasswordAuthForm,
      name: "passwordauth",
    },
    { path: "/auth/google", component: GoogleAuthForm, name: "googleauth" },
    {
      path: "/auth/facebook",
      component: FacebookAuthForm,
      name: "facebookauth",
    },
    {
      path: "/register",
      component: RegisterForm,
      name: "register",
    },
    // {
    //   path: "/auth/microsoft",
    //   component: MicrosoftAuthForm,
    //   name: "microsoftauth",
    // },

    { path: "/:notFound(.*)", component: NotFound },
  ],
});

//   router.beforeEach((to, _from, _next) => {
//     if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
//       _next('/auth');
//     } else {
//       _next();
//     }
//   });

//if the user has not authenticated, force them to the auth page.
//if they are not registered (after authentication), force them to the register page.
router.beforeEach(async (to, _from, next) => {
  //console.log("to:", to);

  const store = useStore();
  if (store.isAuthenticated) {
    if (store.isRegistered) {
      if (to.fullPath.includes("auth")) {
        next({ name: "todos" });
        return;
      }
      next();
      return;
    } else {
      if (to.fullPath.includes("register")) {
        next();
        return;
      }
      next({ name: "register" });
    }
  } else {
    if (to.fullPath.includes("auth")) {
      next();
      return;
    }
    next({ name: "auth" });
    return;
  }

  // if (to.fullPath.includes("auth")) {
  //   if (store.isAuthenticated) {
  //     next({ name: "todos" });
  //     return;
  //   }
  // } else {
  //   if (!store.isAuthenticated && !to.fullPath.includes("auth")) {
  //     next({ name: "auth" });
  //     return;
  //   }
  // }
  // next();
});

export default router;
