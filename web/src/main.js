import { createApp } from 'vue'
import './style.css'
import Home from './Home.vue'
import router from './router'
import '../assets/main.css'

createApp(Home).use(router).mount('#app')
