import money from 'v-money'
import store from '../store'

export { VMoney } from 'v-money'
export const config = {
  precision: store.state.config.precision,
  decimal: store.state.config.decimalSeparator,
  thousands: store.state.config.thousandsSeparator,
  prefix: store.state.config.prefix,
  masked: false
}

export default async ({ Vue }) => {
  Vue.use(money, config)
}
