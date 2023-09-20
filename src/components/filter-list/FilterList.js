import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import uniqid from 'uniqid'

import { toggleFilter } from '../../store/ticketsSlice'

import styles from './FilterList.module.scss'

function FilterList() {
  const dispatch = useDispatch()

  const filters = useSelector((state) => state.filters.filters)
  const checkboxData = useSelector((state) => state.filters.checkboxData)
  const handleCheckboxChange = (name, isChecked) => {
    dispatch(toggleFilter({ name, isChecked }))
  }

  const checkboxList = checkboxData.map((item) => (
    <label htmlFor={item.name} key={uniqid()}>
      <input
        type="checkbox"
        id={item.name}
        name={item.name}
        checked={filters[item.name]}
        onChange={(e) => handleCheckboxChange(item.name, e.target.checked)}
        value={filters[item.name]}
      />
      <span>{item.label}</span>
    </label>
  ))

  return (
    <div className={styles.filterList}>
      <h1 className={styles.title}>Количество пересадок</h1>
      <div className={styles.checkboxGroup}>{checkboxList}</div>
    </div>
  )
}

export default FilterList
