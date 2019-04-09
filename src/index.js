import ScrollPicker from "./scroll-picker";

let installed = false;

export default {
  install(Vue) {
    if (installed) return;
    installed = true;
    Vue.component(ScrollPicker.name, ScrollPicker);
  }
};
