import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { logout } from '../../store/blogSlice'
import './layout.css'

export default function Layout() {
  const { isLogin, currentUser } = useSelector((state) => state.blog)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const toggleLogout = () => {
    dispatch(logout())
    sessionStorage.removeItem('userData')
    navigate('/')
  }

  return (
    <>
      <header className="header">
        <div className="header-list">
          <Link className="header-item header-item-logo" to="/">
            Realworld Blog
          </Link>
          {isLogin ? (
            <>
              <Link to="/new-article" className="header-item">
                Create article
              </Link>
              <Link to="/profile" className="header-item header-item-profile">
                <p>{currentUser.username}</p>
                <img
                  className="header-img"
                  src={
                    currentUser.image ? currentUser.image : 'https://static.productionready.io/images/smiley-cyrus.jpg'
                  }
                  alt="Иконка"
                />
              </Link>
              <Link to="/" className="header-item">
                <button type="button" onClick={toggleLogout}>
                  Log out
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link className="header-item" to="/signin">
                Sign In
              </Link>
              <Link className="header-item" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>
      <Outlet />
    </>
  )
}
