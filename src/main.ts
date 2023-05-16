import { createApp } from "vue";
import App from "./App.vue";
import "@/assets/css/entire.scss";
import router from "@/router";
import pinia from "@/store";
import Vue3Lottie from "vue3-lottie";
import "vue3-lottie/dist/style.css";

createApp(App).use(Vue3Lottie, { name: "Vue3Lottie" }).use(router).use(pinia).mount("#app");
