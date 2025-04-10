import "./assets/main.css";

import { createApp } from "vue";
import { Quasar, Notify, Dialog } from "quasar";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
  },
});

app.mount("#app");
