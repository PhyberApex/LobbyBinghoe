import "./assets/main.css";

import { createApp } from "vue";
import { Quasar, Notify, Dialog } from "quasar";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";
import App from "./App.vue";
import router from "./router";

const umamiScriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL;
const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;

if (umamiScriptUrl && umamiWebsiteId) {
  const script = document.createElement("script");
  script.defer = true;
  script.src = umamiScriptUrl;
  script.setAttribute("data-website-id", umamiWebsiteId);
  document.head.appendChild(script);
}

const app = createApp(App);

app.use(router);
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
  },
  config: {
    dark: true,
  },
});

app.mount("#app");
