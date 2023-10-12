/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Spin } from 'antd'

import { regNewUser } from '../../store/blogSlice'

import './sign-up-page.css'

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
    .max(40, 'The password must contain a maximum of 40 letters')
    .required('Password is required'),
  repeatPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  personalInfo: yup.bool().oneOf([true], 'It is necessary to allow the processing of personal data'),
})

export default function SignUpPage() {
  const dispatch = useDispatch()
  const { regStatus } = useSelector((state) => state.blog)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const submitForm = (data) => {
    console.log(data)
    dispatch(regNewUser(data))
    sessionStorage.setItem('userData', JSON.stringify(data))
  }

  return (
    <div className="sign-up-form-container">
      <div className="sign-up-form">
        <h1 className="sign-up-form-title">Create new account</h1>
        <form className="sign-up-form-form" onSubmit={handleSubmit(submitForm)}>
          <label className="sign-up-form-label" htmlFor="username">
            <span className="sign-up-form-description">Username</span>
            <input
              className={`sign-up-form-input ${errors.username ? 'input-error' : ''}`}
              type="text"
              name="username"
              placeholder="Username"
              {...register('username')}
            />
          </label>
          {errors.username && <p className="form-error">{errors.username.message}</p>}
          <label className="sign-up-form-label" htmlFor="email">
            <span className="sign-up-form-description">Email</span>
            <input
              className={`sign-up-form-input ${errors.email ? 'input-error' : ''}`}
              type="text"
              {...register('email')}
              name="email"
              placeholder="Email"
            />
          </label>
          {errors.email && <p className="form-error">{errors.email.message}</p>}
          <label className="sign-up-form-label" htmlFor="password">
            <span className="sign-up-form-description">Password</span>
            <input
              className={`sign-up-form-input ${errors.password ? 'input-error' : ''}`}
              type="password"
              {...register('password')}
              name="password"
              placeholder="Password"
            />
          </label>
          {errors.password && <p className="form-error">{errors.password.message}</p>}
          <label
            className={`sign-up-form-label ${errors.repeatPassword ? 'input-error' : ''}`}
            htmlFor="repeatPassword"
          >
            <span className="sign-up-form-description">Repeat Password</span>
            <input
              className="sign-up-form-input"
              type="password"
              {...register('repeatPassword')}
              name="repeatPassword"
              placeholder="Repeat password"
            />
          </label>
          {errors.repeatPassword && <p className="form-error">{errors.repeatPassword.message}</p>}
          <label htmlFor="personalInfo">
            <input type="checkbox" {...register('personalInfo')} name="personalInfo" />I agree to the processing of my
            personal information
          </label>
          {errors.personalInfo && <p className="form-error">{errors.personalInfo.message}</p>}
          {regStatus === 'error' ? <p className="form-error">Login or email already exists</p> : null}
          {regStatus === 'ok' ? <p className="form-ok">Successful login to the account</p> : null}
          {regStatus === 'pending' ? <Spin size="large" /> : null}
          <button type="submit" className="sign-up-form-button">
            Create
          </button>
        </form>
        <p>
          Already have an account?
          <Link className="link" to="/signin">
            Sign In.
          </Link>
        </p>
      </div>
    </div>
  )
}
