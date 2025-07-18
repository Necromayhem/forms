import { createRouter, createWebHistory } from 'vue-router'
import Forms from '@/components/Forms.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [{ path: '/', component: Forms }],
})

export default router
