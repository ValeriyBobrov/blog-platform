import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchPostData = createAsyncThunk('blog/fetchPostData', async (page) => {
  const response = await fetch(`https://blog.kata.academy/api/articles?offset=${page * 20 - 20}`)
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

export const regNewUser = createAsyncThunk('blog/regNewUser', async (userInfo) => {
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

  const response = await fetch('https://blog.kata.academy/api/users', option)
  const data = await response.json()

  console.log(data)

  return data
})

export const loginUser = createAsyncThunk('blog/loginUser', async (userInfo) => {
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

  const response = await fetch('https://blog.kata.academy/api/users/login', option)
  const data = await response.json()

  console.log(data)

  return data
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
    builder.addCase(regNewUser.fulfilled, (state, action) => {
      state.currentUser = action.payload.user
      state.token = action.payload.user.token
      state.isLogin = true
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.currentUser = action.payload.user
      state.token = action.payload.user.token
      state.isLogin = true
    })
    builder.addCase(updateCurrentUser.fulfilled, (state, action) => {
      state.currentUser = action.payload.user
    })
  },
})

export const { togglePage, clearCurrentArticle, logout } = blogSlice.actions

export default blogSlice.reducer
