import { createRouter, createWebHistory } from "vue-router";
//import { getCurrentUser } from "vuefire";
import TodosPage from "./pages/TodosPage.vue";
import NotFound from "./pages/NotFound.vue";
import AuthForm from "./pages/auth/UserAuth.vue";
//import store from "./store/index.js";
import { useStore } from "./store";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/todos" },
    { path: "/todos", name: "todos", component: TodosPage },
    //      { path: '/auth', component: AuthForm, name: 'auth' },
    { path: "/:notFound(.*)", component: NotFound },
    { path: "/auth", component: AuthForm, name: "auth" },
  ],
});

//   router.beforeEach((to, _from, _next) => {
//     if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
//       _next('/auth');
//     } else {
//       _next();
//     }
//   });

router.beforeEach(async (to, _from, _next) => {
  console.log("to:", to);
  const store = useStore();
  if (to.name === "auth") {
    if (store.isAuthenticated) {
      _next({ name: "todos" });
    }
  } else {
    //const currentUser = await getCurrentUser();
    //console.log("store:", store.isAuthenticated, to);
    if (!store.isAuthenticated && to.name !== "auth") {
      //if (!currentUser) {
      _next({ name: "auth" });
    }
  }
  _next();
});

export default router;
