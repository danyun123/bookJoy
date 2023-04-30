import { createApp } from "vue";
import App from "./App.vue";
import "@/assets/css/entire.scss";
import router from "@/router";
import pinia from "@/store";

createApp(App).use(router).use(pinia).mount("#app");
