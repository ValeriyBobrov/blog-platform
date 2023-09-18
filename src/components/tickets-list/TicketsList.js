import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Radio, Button } from 'antd'
import uniqid from 'uniqid'

import TicketsItem from '../tickets-item'
import { toggleRadioButton, fetchApiKey, fetchTicketsList, addAmountItems } from '../../store/ticketsSlice'

import styles from './TicketsList.module.scss'

function TicketsList() {
  const apiKey = useSelector((state) => state.filters.apiKey)
  const tickets = useSelector((state) => state.filters.tickets)
  const amountItems = useSelector((state) => state.filters.amountItems)
  const isAll = useSelector((state) => state.filters.isAll)
  const filters = useSelector((state) => state.filters.filters)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchApiKey())
  }, [dispatch])

  useEffect(() => {
    if (apiKey && !isAll) {
      dispatch(fetchTicketsList(apiKey))
    }
  }, [apiKey, tickets, isAll, dispatch])

  const toggleRadio = (e) => {
    dispatch(toggleRadioButton({ value: e.target.value }))
  }

  const filteredTickets = tickets.filter((item) => {
    if (filters.all) {
      return true
    }
    if (filters.noTrans) {
      return item.segments.length === 0
    }
    if (filters.oneTrans) {
      return item.segments.length === 1
    }
    if (filters.twoTrans) {
      return item.segments.length === 2
    }
    if (filters.threeTrans) {
      return item.segments.length === 3
    }
    return false
  })

  return (
    <div className={styles.ticketsList}>
      <Radio.Group className={styles.radioGroup} optionType="button" buttonStyle="solid" onChange={toggleRadio}>
        <Radio value="cheapest">Самый дешевый</Radio>
        <Radio value="faster">Самый быстрый</Radio>
      </Radio.Group>
      {tickets ? (
        filteredTickets
          .slice(0, amountItems)
          .map((item) => (
            <TicketsItem key={uniqid()} price={item.price} carrier={item.carrier} segments={item.segments} />
          ))
      ) : (
        <div>loading</div>
      )}
      <Button type="primary" onClick={() => dispatch(addAmountItems())}>
        Показать еще 5 билетов!
      </Button>
    </div>
  )
}

export default TicketsList
