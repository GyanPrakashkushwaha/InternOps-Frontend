import {createWebHistory, createRouter} from 'vue-router'

import ApplicationsHistory from '../components/ApplicationsHistory.vue'
import MainDashboard from '../components/MainDashboard.vue'
import NewAnalysis from '../components/NewAnalysis.vue'

const routes = [
    {
        path: "/", 
        redirect: "/dashboard"
    },
    {
        path: "/dashboard", 
        name: 'Dashboard',
        component: ApplicationsHistory
    },
    {
        path: "/new", 
        name: 'NewAnalysis', 
        component: NewAnalysis
    },
    {
        path: "/analysis", 
        redirect: "/analysis/latest" 
    },
    {
        path: "/analysis/:id", 
        name: 'AnalysisReport', 
        component: MainDashboard,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;