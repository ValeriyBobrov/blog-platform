/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { updateCurrentUser } from '../../store/blogSlice'

import './profile.css'

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'The username must contain at least 3 letters')
    .max(20, 'The user name must contain a maximum of 20 letters')
    .required('Username is required'),
  email: yup
    .string()
    .email('Incorrect email')
    .lowercase('The mail should be written in small letters')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'The password must contain at least 6 letters')
    .max(40, 'The password must contain a maximum of 40 letters'),
  url: yup.string().url('Enter correct url'),
})

export default function SignUpPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.blog.currentUser)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const submitForm = (data) => {
    const apiKey = currentUser.token
    try {
      console.log({ data, apiKey })
      dispatch(updateCurrentUser({ data, apiKey }))
      sessionStorage.setItem('userData', JSON.stringify(data))
      reset()
      navigate('/')
    } catch (err) {
      throw new Error(err.message)
    }
  }

  return (
    <div className="sign-up-form-container">
      <div className="sign-up-form">
        <h1 className="sign-up-form-title">Edit profile</h1>
        <form className="sign-up-form-form" onSubmit={handleSubmit(submitForm)}>
          <label className="sign-up-form-label" htmlFor="username">
            <span className="sign-up-form-description">Username</span>
            <input
              className={`sign-up-form-input ${errors.username ? 'input-error' : ''}`}
              type="text"
              name="username"
              placeholder="username"
              {...register('username')}
            />
          </label>
          {errors.username && <p className="form-error">{errors.username.message}</p>}
          <label className="sign-up-form-label" htmlFor="email">
            <span className="sign-up-form-description">Email address</span>
            <input
              className={`sign-up-form-input ${errors.email ? 'input-error' : ''}`}
              type="text"
              {...register('email')}
              name="email"
              placeholder="email"
            />
          </label>
          {errors.email && <p className="form-error">{errors.email.message}</p>}
          <label className="sign-up-form-label" htmlFor="password">
            <span className="sign-up-form-description">New password</span>
            <input
              className={`sign-up-form-input ${errors.password ? 'input-error' : ''}`}
              type="password"
              {...register('password')}
              name="password"
              placeholder="Password"
            />
          </label>
          {errors.password && <p className="form-error">{errors.password.message}</p>}
          <label className={`sign-up-form-label ${errors.url ? 'input-error' : ''}`} htmlFor="url">
            <span className="sign-up-form-description">Avatar image (url)</span>
            <input
              className="sign-up-form-input"
              type="text"
              {...register('url')}
              name="url"
              placeholder="Avatar image"
            />
          </label>
          {errors.url && <p className="form-error">{errors.url.message}</p>}
          <button type="submit" className="sign-up-form-button">
            Save
          </button>
        </form>
      </div>
    </div>
  )
}
