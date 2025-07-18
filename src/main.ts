import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'
import Toast from 'primevue/toast'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			darkModeSelector: 'system',
		},
	},
})
app.use(ToastService)

app.component('Toast', Toast)

app.mount('#app')
