import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchPostData = createAsyncThunk('blog/fetchPostData', async (pageInfo) => {
  let { token } = pageInfo
  const { currentPage } = pageInfo
  let option = null
  if (sessionStorage.getItem('token')) {
    token = sessionStorage.getItem('token')
  }
  if (token) {
    option = {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  }
  const response = await fetch(`https://blog.kata.academy/api/articles?offset=${currentPage * 20 - 20}`, option)
  const data = await response.json()
  console.log(data)
  return data
})

export const fetchPostInfo = createAsyncThunk('blog/fetchPostInfo', async (slug) => {
  const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`)
  const data = await response.json()
  console.log(data)
  return data
})

export const regNewUser = createAsyncThunk('blog/regNewUser', async (userInfo, { rejectWithValue }) => {
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password,
      },
    }),
  }
  try {
    const response = await fetch('https://blog.kata.academy/api/users', option)
    if (!response.ok) {
      throw new Error('Error')
    }
    const data = await response.json()

    console.log(data)

    return data
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const loginUser = createAsyncThunk('blog/loginUser', async (userInfo, { rejectWithValue }) => {
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email: userInfo.email,
        password: userInfo.password,
      },
    }),
  }
  try {
    const response = await fetch('https://blog.kata.academy/api/users/login', option)
    if (!response.ok) {
      throw new Error('Login error')
    }
    const data = await response.json()

    console.log(data)
    return data
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateCurrentUser = createAsyncThunk('blog/updateCurrentUser', async (userData) => {
  const { data, apiKey } = userData
  const option = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
        image: data.url,
      },
    }),
  }

  const response = await fetch('https://blog.kata.academy/api/user', option)
  const body = await response.json()

  console.log(data)

  return body
})

export const createArticle = createAsyncThunk('blog/createArticle', async (articleInfo) => {
  const { data, apiKey } = articleInfo

  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
        tags: data.tags,
      },
    }),
  }

  const response = await fetch('https://blog.kata.academy/api/articles', option)
  const body = await response.json()

  console.log(body)

  return body
})

export const editArticle = createAsyncThunk('blog/editArticle', async (articleInfo) => {
  const { data, apiKey, slug } = articleInfo

  const option = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
        tags: data.tags,
      },
    }),
  }

  const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, option)
  const body = await response.json()

  console.log(body)

  return body
})

export const deleteArticle = createAsyncThunk('blog/deleteArticle', async (articleInfo) => {
  const { apiKey, slug } = articleInfo

  const option = {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${apiKey}`,
    },
  }

  const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, option)
  const data = await response.json()

  console.log(data)

  return data
})

export const favoriteArticle = createAsyncThunk('blog/favoriteArticle', async (articleInfo) => {
  const { apiKey, slug } = articleInfo

  const option = {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
    },
  }

  const response = await fetch(`https://blog.kata.academy/api/articles/${slug}/favorite`, option)
  const data = response.json()

  console.log(data)

  return data
})

const initialState = {
  article: [],
  currentArticle: {},
  articlesCount: 0,
  currentPage: 1,
  num: 0,
  token: '',
  isLogin: false,
  currentUser: {},
  loginStatus: '',
  regStatus: '',
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    togglePage: (state, action) => {
      state.currentPage = action.payload
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = {}
    },
    logout: (state) => {
      state.isLogin = false
      state.currentUser = {}
      state.token = ''
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPostData.fulfilled, (state, action) => {
      state.article = action.payload.articles
      state.articlesCount = action.payload.articlesCount
    })
    builder.addCase(fetchPostInfo.fulfilled, (state, action) => {
      state.currentArticle = action.payload.article
    })
    builder.addCase(regNewUser.pending, (state) => {
      state.regStatus = 'pending'
    })
    builder.addCase(regNewUser.fulfilled, (state, action) => {
      state.currentUser = action.payload.user
      state.token = action.payload.user.token
      state.isLogin = true
      state.regStatus = 'ok'
    })
    builder.addCase(regNewUser.rejected, (state) => {
      state.regStatus = 'error'
    })
    builder.addCase(loginUser.pending, (state) => {
      state.loginStatus = 'pending'
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.currentUser = action.payload.user
      state.token = action.payload.user.token
      state.isLogin = true
      state.loginStatus = 'ok'
      sessionStorage.setItem('token', action.payload.user.token)
      sessionStorage.setItem('userData', JSON.stringify(action.payload.user))
    })
    builder.addCase(loginUser.rejected, (state) => {
      state.loginStatus = 'error'
    })
    builder.addCase(updateCurrentUser.fulfilled, (state, action) => {
      state.currentUser = action.payload.user
    })
  },
})

export const { togglePage, clearCurrentArticle, logout } = blogSlice.actions

export default blogSlice.reducer
