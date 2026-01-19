import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import '../assets/main.css'
import AnalysisHistorySidebar from './components/AnalysisHistorySidebar.vue'

const app = createApp(App)
app.component(AnalysisHistorySidebar)
app.use(router)
app.mount('#app')
