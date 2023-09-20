import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchApiKey = createAsyncThunk('tickets/fetchApiKey', async () => {
  const response = await fetch('https://aviasales-test-api.kata.academy/search')
  const data = await response.json()
  return data.searchId
})

export const fetchTicketsList = createAsyncThunk('tickets/fetchTicketsList', async (apiKey) => {
  try {
    const response = await fetch(`https://aviasales-test-api.kata.academy/tickets?searchId=${apiKey}`)

    if (!response.ok) {
      throw new Error('HTTP Error')
    }

    const data = await response.json()

    return data
  } catch (err) {
    const response = await fetch(`https://aviasales-test-api.kata.academy/tickets?searchId=${apiKey}`)

    if (!response.ok) {
      throw new Error('HTTP Error')
    }

    const data = await response.json()

    return data
  }
})

const initialState = {
  tickets: [],
  amountItems: 5,
  apiKey: '',
  isAll: null,
  isLoading: false,
  isError: false,
  filters: {
    all: false,
    noTrans: false,
    oneTrans: false,
    twoTrans: false,
    threeTrans: false,
    cheapest: false,
    faster: false,
  },
  checkboxData: [
    {
      name: 'all',
      label: 'Все',
    },
    {
      name: 'noTrans',
      label: 'Без пересадок',
    },
    {
      name: 'oneTrans',
      label: '1 пересадка',
    },
    {
      name: 'twoTrans',
      label: '2 пересадки',
    },
    {
      name: 'threeTrans',
      label: '3 пересадки',
    },
  ],
}

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    toggleFilter: (state, actions) => {
      const { name, isChecked } = actions.payload
      if (name === 'all') {
        state.filters.all = isChecked
        state.filters.noTrans = isChecked
        state.filters.oneTrans = isChecked
        state.filters.twoTrans = isChecked
        state.filters.threeTrans = isChecked
      } else {
        state.filters[name] = isChecked
      }
      if (
        state.filters.all === true &&
        (!state.filters.noTrans || !state.filters.oneTrans || !state.filters.twoTrans || !state.filters.threeTrans)
      ) {
        state.filters.all = false
      }
      if (state.filters.noTrans && state.filters.oneTrans && state.filters.twoTrans && state.filters.threeTrans) {
        state.filters.all = true
      }
    },
    toggleRadioButton: (state, action) => {
      const { value } = action.payload
      if (value === 'cheapest') {
        state.filters.cheapest = true
        state.filters.faster = false
        state.tickets.sort((a, b) => a.price - b.price)
      } else {
        state.filters.cheapest = false
        state.filters.faster = true
        state.tickets.sort(
          (a, b) => a.segments[0].duration + a.segments[1].duration - (b.segments[0].duration + b.segments[1].duration)
        )
      }
    },
    addAmountItems: (state) => {
      state.amountItems += 5
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchApiKey.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchApiKey.fulfilled, (state, action) => {
      state.apiKey = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchApiKey.rejected, (state, action) => {
      state.isLoading = false
      state.isError = action.payload.error()
    })
    builder.addCase(fetchTicketsList.fulfilled, (state, action) => {
      state.tickets = [...state.tickets, ...action.payload.tickets]
      state.isAll = action.payload.stop
    })
  },
})

export const { toggleFilter, toggleRadioButton, addAmountItems } = ticketsSlice.actions

export default ticketsSlice.reducer
