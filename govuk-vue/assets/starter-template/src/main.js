import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import GovUkVue from 'govuk-vue'
import App from './App.vue'

// Import routes
import HomePage from './pages/HomePage.vue'
import FormPage from './pages/FormPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/form', component: FormPage }
  ]
})

const app = createApp(App)
app.use(router)
app.use(GovUkVue)
app.mount('#app')
