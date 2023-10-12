/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'

import { loginUser } from '../../store/blogSlice'

import './sign-in-page.css'

const schema = yup.object().shape({
  email: yup.string().email('Incorrect email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

export default function SignInPage() {
  const dispatch = useDispatch()
  const { loginStatus } = useSelector((state) => state.blog)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const submitForm = (data) => {
    dispatch(loginUser(data))
  }

  return (
    <div className="sign-in-form-container">
      <div className="sign-in-form">
        <h1 className="sign-in-form-title">Sign in</h1>
        <form className="sign-in-form-form" onSubmit={handleSubmit(submitForm)}>
          <label className="sign-in-form-label" htmlFor="email">
            <span className="sign-in-form-description">Email</span>
            <input
              className={`sign-up-form-input ${errors.email ? 'input-error' : ''}`}
              type="text"
              name="email"
              placeholder="Email"
              {...register('email')}
            />
          </label>
          {errors.email && <p className="form-error">{errors.email.message}</p>}
          <label className="sign-in-form-label" htmlFor="password">
            <span className="sign-in-form-description">Password</span>
            <input
              className={`sign-in-form-input ${errors.email ? 'input-error' : ''}`}
              type="text"
              {...register('password')}
              name="password"
              placeholder="Password"
            />
          </label>
          {errors.password && <p className="form-error">{errors.password.message}</p>}
          {loginStatus === 'error' ? <p className="form-error">Incorrect login or password</p> : null}
          {loginStatus === 'ok' ? <p className="form-ok">Successful login to the account</p> : null}
          {loginStatus === 'pending' ? <Spin size="large" /> : null}
          <button type="submit" className="sign-up-form-button">
            Login
          </button>
        </form>
        <p>
          Don’t have an account?
          <Link className="link" to="/signup">
            Sign Up.
          </Link>
        </p>
      </div>
    </div>
  )
}
