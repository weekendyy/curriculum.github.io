import Vue from 'vue'
import App from './App.vue'
import { Button } from 'vant';
import { Icon } from 'vant';
import { DropdownMenu, DropdownItem } from 'vant';
import { Cell, CellGroup } from 'vant';

Vue.use(Button);
Vue.use(Icon);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
