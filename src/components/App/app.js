import React from 'react'
import { Routes, Route } from 'react-router-dom'

import ArticleList from '../article-list'
import SignInPage from '../sign-in-page'
import SignUpPage from '../sign-up-page/sign-up-page'
import Layout from '../layout/layout'
import ArticleItem from '../article-item/article-item'
import Profile from '../profile'
import NewArticle from '../new-article'
import Auth from '../hoc/auth'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ArticleList />} />
        <Route path="article/:slug" element={<ArticleItem />} />
        <Route
          path="article/:slug/edit"
          element={
            <Auth>
              <NewArticle />
            </Auth>
          }
        />
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route
          path="profile"
          element={
            <Auth>
              <Profile />
            </Auth>
          }
        />
        <Route
          path="new-article"
          element={
            <Auth>
              <NewArticle />
            </Auth>
          }
        />
      </Route>
    </Routes>
  )
}
