import Vue from 'vue'
import App from './App.vue'
import { Button, Toast, Dialog, Cell, CellGroup, DropdownMenu, DropdownItem, Icon, Form, Field } from 'vant';

Vue.use(Button);
Vue.use(Icon);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(Field);
Vue.use(Toast);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
