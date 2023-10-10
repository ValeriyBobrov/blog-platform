import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { Spin, Popconfirm } from 'antd'
import Markdown from 'react-markdown'
import './article-item.css'

import { fetchPostInfo, clearCurrentArticle, deleteArticle } from '../../store/blogSlice'

export default function ArticleItem() {
  const postInfo = useSelector((state) => state.blog.currentArticle)
  const apiKey = useSelector((state) => state.blog.token)
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
    dispatch(deleteArticle({ apiKey, slug }))
    dispatch(clearCurrentArticle())
    navigate('/')
  }

  return (
    <div className="container">
      {postInfo ? (
        <>
          <div className="article">
            <p className="title">
              {postInfo.title} {postInfo.favoritesCount}
            </p>
            <p className="tags" />
            <p className="description">{postInfo.description}</p>
            <Markdown className="body">{postInfo.body}</Markdown>
          </div>
          <div className="author-card">
            {postInfo.author ? (
              <>
                <div className="author-description">
                  <p className="author-name">{postInfo.author.username}</p>
                  <p className="author-date">{formatDate(postInfo.createdAt)}</p>
                </div>
                <img src={postInfo.author.image} alt="profile" className="author-img" />
                <div className="button-container">
                  <Popconfirm
                    title="Delete"
                    description="Are you sure to delete this article?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => toggleDeleteArticle(slug, apiKey)}
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
