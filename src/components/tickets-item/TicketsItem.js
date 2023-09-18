import React from 'react'
import uniqid from 'uniqid'
import { format, add } from 'date-fns'

import styles from './TicketsItem.module.scss'

function TicketsItem({ price, carrier, segments }) {
  const convertTime = (duration) => {
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60

    return `${hours}ч ${minutes}м`
  }

  function formatDateTimeRange(isoDate, addTime) {
    const date = new Date(isoDate)

    const endDate = add(date, { hours: Math.floor(addTime / 60), minutes: addTime % 60 })

    const formattedStartDate = format(date, 'HH:mm')
    const formattedEndDate = format(endDate, 'HH:mm')

    return `${formattedStartDate} – ${formattedEndDate}`
  }

  const segmentsList = segments.map((item) => (
    <div key={uniqid()} className={styles.info}>
      <div className={styles.infoTranfer}>
        <span className={styles.up}>
          {item.origin}-{item.destination}
        </span>
        <span className={styles.down}>{formatDateTimeRange(item.date, item.duration)}</span>
      </div>
      <div className={styles.infoTranfer}>
        <span className={styles.up}>В пути</span>
        <span className={styles.down}>{convertTime(item.duration)}</span>
      </div>
      <div className={styles.infoTranfer}>
        <span className={styles.up}>{item.stops.length} пересадки</span>
        <span className={styles.down}>{item.stops.join(', ')}</span>
      </div>
    </div>
  ))
  return (
    <div className={styles.ticketsItem}>
      <div className={styles.ticketsHeader}>
        <span className={styles.price}>{price} р</span>
        <img src={`http://pics.avs.io/110/36/${carrier}.png`} alt="логотип компании" />
      </div>
      {segmentsList}
    </div>
  )
}

export default TicketsItem
