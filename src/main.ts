import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia()).use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			darkModeSelector: 'system',
		},
	},
})

app.mount('#app')
