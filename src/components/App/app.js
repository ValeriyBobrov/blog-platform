import React from 'react'
import { Provider } from 'react-redux'

import store from '../../store'
import FilterList from '../filter-list'
import TicketsList from '../tickets-list'
import logo from '../../img/Logo.svg'

import styles from './App.module.scss'

function App() {
  return (
    <Provider store={store}>
      <div className={styles.main}>
        <img className={styles.logo} src={logo} alt="logo" />
        <div className={styles.wrapper}>
          <FilterList />
          <TicketsList />
        </div>
      </div>
    </Provider>
  )
}

export default App
