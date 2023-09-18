import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { toggleFilter } from '../../store/ticketsSlice'

import styles from './FilterList.module.scss'

function FilterList() {
  const dispatch = useDispatch()

  const filters = useSelector((state) => state.filters.filters)
  const handleCheckboxChange = (name, isChecked) => {
    dispatch(toggleFilter({ name, isChecked }))
  }
  return (
    <div className={styles.filterList}>
      <h1 className={styles.title}>Количество пересадок</h1>
      <div className={styles.checkboxGroup}>
        <label htmlFor="all">
          <input
            type="checkbox"
            id="all"
            name="all"
            checked={filters.all}
            onChange={(e) => handleCheckboxChange('all', e.target.checked)}
            value={filters.all}
          />
          <span>Все</span>
        </label>
        <label htmlFor="noTrans">
          <input
            type="checkbox"
            id="noTrans"
            name="noTrans"
            checked={filters.noTrans}
            onChange={(e) => handleCheckboxChange('noTrans', e.target.checked)}
            value={filters.noTrans}
          />
          <span>Без пересадок</span>
        </label>
        <label htmlFor="oneTrans">
          <input
            type="checkbox"
            id="oneTrans"
            name="oneTrans"
            checked={filters.oneTrans}
            onChange={(e) => handleCheckboxChange('oneTrans', e.target.checked)}
            value={filters.oneTrans}
          />
          <span>1 пересадка</span>
        </label>
        <label htmlFor="twoTrans">
          <input
            type="checkbox"
            id="twoTrans"
            name="twoTrans"
            checked={filters.twoTrans}
            onChange={(e) => handleCheckboxChange('twoTrans', e.target.checked)}
            value={filters.twoTrans}
          />
          <span>2 пересадки</span>
        </label>
        <label htmlFor="threeTrans">
          <input
            type="checkbox"
            id="threeTrans"
            name="threeTrans"
            checked={filters.threeTrans}
            onChange={(e) => handleCheckboxChange('threeTrans', e.target.checked)}
            value={filters.threeTrans}
          />
          <span>3 пересадки</span>
        </label>
      </div>
    </div>
  )
}

export default FilterList
