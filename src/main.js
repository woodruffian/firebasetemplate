import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import { VueFire, VueFireAuth } from "vuefire";
// the file we created above with `database`, `firestore` and other exports
import { firebaseApp } from "./firebaseApp";
//import { defineStore } from "./store";
import { createPinia } from "pinia";
import BaseCard from "./components/ui/BaseCard.vue";
import BaseButton from "./components/ui/BaseButton.vue";
import BaseBadge from "./components/ui/BaseBadge.vue";
import BaseSpinner from "./components/ui/BaseSpinner.vue";
import BaseDialog from "./components/ui/BaseDialog.vue";

const pinia = createPinia();
//useStore();

//hey dummy, stop trying to create a store in here.  Must do pinia stores in a setup function.

const app = createApp(App);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});
app.use(router);
app.use(pinia);
app.component("base-card", BaseCard);
app.component("base-button", BaseButton);
app.component("base-badge", BaseBadge);
app.component("base-spinner", BaseSpinner);
app.component("base-dialog", BaseDialog);
app.mount("#app");
