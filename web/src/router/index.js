
import {createWebHistory, createRouter} from 'vue-router'

import App from '../App.vue'
import Home from '../Home.vue'
import MainDashboard from '../MainDashboard.vue'

const routes = [
    {path: "/", component: Home},
    {path: "/dashboard", component: App},
    {path: "/analysis", component: MainDashboard}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;