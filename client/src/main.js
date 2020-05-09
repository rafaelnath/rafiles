// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueClipboard from 'vue-clipboard2'
import store from '@/store/index'

Vue.use(VueClipboard);
Vue.config.productionTip = false

router.beforeEach((to, from, next) =>{
  if(to.meta.adminLoginRequired){
    if(store.getters.getAdminToken){
      next();
    } else{
      next('/admin/login');
    }
  }
  next();
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
