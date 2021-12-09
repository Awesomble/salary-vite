import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { createGtm } from 'vue-gtm'

const app = createApp(App)


app.use(
    createGtm({
            id: 'GTM-5CFZF8C'
    })
)

createApp(App).use(router)
    .mount('#app')

