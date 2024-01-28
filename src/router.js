import { createRouter, createWebHistory } from "vue-router";
//import { getCurrentUser } from "vuefire";
import TodosPage from "./pages/TodosPage.vue";
import NotFound from "./pages/NotFound.vue";
import AuthForm from "./pages/auth/UserAuth.vue";
import PasswordAuthForm from "./pages/auth/PasswordAuth.vue";
import GoogleAuthForm from "./pages/auth/GoogleAuth.vue";
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

router.beforeEach(async (to, _from, next) => {
  console.log("to:", to);

  const store = useStore();
  if (to.fullPath.includes("auth")) {
    if (store.isAuthenticated) {
      next({ name: "todos" });
      return;
    }
  } else {
    if (!store.isAuthenticated && !to.fullPath.includes("auth")) {
      next({ name: "auth" });
      return;
    }
  }
  next();
});

export default router;
