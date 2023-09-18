import { configureStore } from '@reduxjs/toolkit'

import filtersReduser from './ticketsSlice'

export default configureStore({
  reducer: {
    filters: filtersReduser,
  },
})
