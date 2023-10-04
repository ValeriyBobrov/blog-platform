import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchPostData, loginUser } from '../../store/blogSlice'
import ArticleList from '../article-list'
import SignInPage from '../sign-in-page'
import SignUpPage from '../sign-up-page/sign-up-page'
import Layout from '../layout/layout'
import ArticleItem from '../article-item/article-item'
import Profile from '../profile'
import NewArticle from '../new-article'
import EditArticle from '../edit-article'

export default function App() {
  const dispatch = useDispatch()
  const currentPage = useSelector((state) => state.blog.currentPage)

  useEffect(() => {
    dispatch(fetchPostData(currentPage))
  }, [dispatch, currentPage])

  useEffect(() => {
    if (sessionStorage.getItem('userData')) {
      const userData = sessionStorage.getItem('userData')
      dispatch(loginUser(JSON.parse(userData)))
    }
  })

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ArticleList />} />
        <Route path="article/:slug" element={<ArticleItem />} />
        <Route path="article/:slug/edit" element={<EditArticle />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="new-article" element={<NewArticle />} />
      </Route>
    </Routes>
  )
}
