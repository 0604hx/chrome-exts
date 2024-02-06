import { createApp } from "vue"
import App from './popup.vue'

import { NFormItemGridItem } from 'naive-ui'

createApp(App).component('n-form-item-gi', NFormItemGridItem).mount("#app")
