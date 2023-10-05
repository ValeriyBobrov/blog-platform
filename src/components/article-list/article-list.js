import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import uniqid from 'uniqid'
import { format, parseISO } from 'date-fns'
import './article-list.css'
import { Pagination } from 'antd'

import { togglePage, favoriteArticle, fetchPostData } from '../../store/blogSlice'

export default function ArticleList() {
  const articleData = useSelector((state) => state.blog.article)
  const articlesCount = useSelector((state) => state.blog.articlesCount)
  const apiKey = useSelector((state) => state.blog.token)
  const currentPage = useSelector((state) => state.blog.currentPage)

  const dispatch = useDispatch()

  const handlePageChange = (page) => {
    dispatch(togglePage(page))
  }

  function formatDate(oldDate) {
    const parsedDate = parseISO(oldDate)
    const formattedDate = format(parsedDate, 'MMMM d, yyyy')
    return formattedDate
  }

  const articleList = articleData.map((item) => {
    // eslint-disable-next-line prefer-destructuring
    const slug = item.slug
    return (
      <Link key={uniqid()} to={`/article/${item.slug}`} className="article-container">
        <div>
          <div className="header-article">
            <h2 className="title">{item.title}</h2>
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault()
                await dispatch(favoriteArticle({ apiKey, slug }))
                await dispatch(fetchPostData(currentPage))
              }}
            >
              {item.favoritesCount}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                <path
                  fill="#db0d40"
                  d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"
                />
              </svg>
            </button>
          </div>
          <p>{item.tagList.join(' ')}</p>
          <p className="description">{item.description}</p>
          <div className="author-card">
            <div className="author-description">
              <p className="author-name">{item.author.username}</p>
              <p className="author-date">{formatDate(item.createdAt)}</p>
            </div>
            <img src={item.author.image} alt="profile" className="author-img" />
          </div>
        </div>
      </Link>
    )
  })

  return (
    <div className="article-list-container">
      {articleList}
      <Pagination
        defaultCurrent={1}
        total={articlesCount}
        pageSize={20}
        showSizeChanger={false}
        onChange={(page) => handlePageChange(page)}
      />
    </div>
  )
}
