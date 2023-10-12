import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { Spin, Popconfirm } from 'antd'
import Markdown from 'react-markdown'
import './article-item.css'

import { fetchPostInfo, clearCurrentArticle, deleteArticle } from '../../store/blogSlice'

export default function ArticleItem() {
  const { currentArticle, token, currentUser } = useSelector((state) => state.blog)

  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchPostInfo(slug))
  }, [dispatch, slug])

  function formatDate(oldDate) {
    const parsedDate = parseISO(oldDate)
    const formattedDate = format(parsedDate, 'MMMM d, yyyy')
    return formattedDate
  }

  function toggleDeleteArticle() {
    dispatch(deleteArticle({ token, slug }))
    dispatch(clearCurrentArticle())
    navigate('/')
  }

  return (
    <div className="container">
      {currentArticle ? (
        <>
          <div className="article">
            <p className="title">
              {currentArticle.title} {currentArticle.favoritesCount}
            </p>
            <p className="tags" />
            <p className="description">{currentArticle.description}</p>
            <Markdown className="body">{currentArticle.body}</Markdown>
          </div>
          <div className="author-card">
            {currentArticle.author ? (
              <>
                <div className="author-description">
                  <p className="author-name">{currentArticle.author.username}</p>
                  <p className="author-date">{formatDate(currentArticle.createdAt)}</p>
                </div>
                <img src={currentArticle.author.image} alt="profile" className="author-img" />
                {currentArticle.author.username === currentUser.username ? (
                  <div className="button-container">
                    <Popconfirm
                      title="Delete"
                      description="Are you sure to delete this article?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => toggleDeleteArticle(slug, token)}
                    >
                      <button type="button" className="article-form-button-delete">
                        Delete
                      </button>
                    </Popconfirm>
                    <Link to="edit">
                      <button type="button" className="article-form-button-edit">
                        Edit
                      </button>
                    </Link>
                  </div>
                ) : null}
              </>
            ) : (
              <Spin />
            )}
          </div>
        </>
      ) : (
        <Spin />
      )}
    </div>
  )
}
