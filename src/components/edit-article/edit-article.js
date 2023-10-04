/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { editArticle, clearCurrentArticle } from '../../store/blogSlice'

const schema = yup.object().shape({
  title: yup.string().required('title is required'),
  description: yup.string().required('description is required'),
  body: yup.string().required('text is required'),
})

export default function EditArticle() {
  const currentArticle = useSelector((state) => state.blog.currentArticle)
  const apiKey = useSelector((state) => state.blog.token)
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tags: currentArticle.tagList,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  })

  const submitForm = (data) => {
    try {
      console.log(data)
      dispatch(editArticle({ data, apiKey, slug }))
      dispatch(clearCurrentArticle())
      reset()
      navigate('/')
    } catch (err) {
      throw new Error(err.message)
    }
  }

  return (
    <div className="article-form-container">
      <div className="article-form">
        <h1 className="article-form-title">Edit article</h1>
        <form className="article-form-form" onSubmit={handleSubmit(submitForm)}>
          <label className="article-form-label" htmlFor="title">
            <span className="article-form-description">Title</span>
            <input
              className={`article-form-input ${errors.title ? 'input-error' : ''}`}
              type="text"
              name="title"
              placeholder="Title"
              {...register('title')}
              defaultValue={currentArticle.title}
            />
          </label>
          {errors.title && <p className="form-error">{errors.title.message}</p>}
          <label className="article-form-label" htmlFor="description">
            <span className="article-form-description">Short description</span>
            <input
              className={`article-form-input ${errors.description ? 'input-error' : ''}`}
              type="text"
              {...register('description')}
              name="description"
              placeholder="Description"
              defaultValue={currentArticle.description}
            />
          </label>
          {errors.description && <p className="form-error">{errors.description.message}</p>}
          <label className="article-form-label" htmlFor="text">
            <span className="article-form-description">Text</span>
            <textarea
              rows={8}
              className={`article-form-input ${errors.body ? 'input-error' : ''}`}
              type="textarea"
              {...register('body')}
              name="body"
              placeholder="Text"
              defaultValue={currentArticle.body}
            />
          </label>
          {errors.body && <p className="form-error">{errors.body.message}</p>}
          <ul>
            {fields.map((item, index) => (
              <li key={item.id} className="article-form-list">
                <input {...register(`tags.[${index}]`)} className="article-form-input article-form-input-tags" />
                <button type="button" onClick={() => remove(index)} className="article-form-button-delete">
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => append('')} className="article-form-button-add">
            Add tag
          </button>
          <button type="submit" className="article-form-button">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
