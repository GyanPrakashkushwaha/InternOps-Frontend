
import {createWebHistory, createRouter} from 'vue-router'

import ApplicationsHistory from '../components/ApplicationsHistory.vue'
import MainDashboard from '../components/MainDashboard.vue'

const routes = [
    {path: "/", redirect: "/dashboard"},
    {path: "/dashboard", component: ApplicationsHistory},
    {path: "/analysis", redirect: "/analysis/123"},
    {path: "/analysis/:id", component: MainDashboard}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;