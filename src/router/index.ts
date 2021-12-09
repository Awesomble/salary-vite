import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
]

const router: Router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
