import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  browserLocalPersistence,
  setPersistence,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, fireStore } from '@services/firebase'
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore'

const initialState = {
  uid: null,
  loading: false,
  error: null,
  loggedOut: false,
  auth: null,
}

export const getPersistence = createAsyncThunk(
  'auth/getPersistence',
  async () => {
    console.log('hi')
    // await setPersistence(auth.Auth.Persistence.LOCAL)
    //   .then(() => {
    //     // Persistence set successfully
    //     console.log('Persistence set successfully')
    //   })
    //   .catch((error) => {
    //     // Handle errors
    //     console.error('Error setting persistence:', error)
    //   })
  }
)

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (
    { email, password },
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      // The user is signed in
      const user = userCredential.user
      // if (userCredential && user) {
      //   dispatch(setAuthPersistence())
      // }
      // You can execute any function here after successful sign-in
      console.log('User signed in:', user.uid)
      return fulfillWithValue(user.uid)
    } catch (error) {
      // Handle errors here
      console.error('Sign-in error:', error.message)
      return rejectWithValue(error.message)
    }
  }
)

export const signInAndSetUp = createAsyncThunk(
  'auth/signInAndSetUp',
  async (
    { email, password },
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      // The user is signed in
      const user = userCredential.user

      // You can execute any function here after successful sign-in
      console.log('User signed in:', user.uid)
      const userRef = doc(fireStore, 'users', user.uid)
      try {
        await setDoc(userRef, { items: [], categories: [] })
        // if (userCredential && userCredential.user)
        //   dispatch(setAuthPersistence())
        return fulfillWithValue(user.uid)
      } catch (error) {
        console.error('Error setting up user:', error.message)
        return rejectWithValue(error.message)
      }
    } catch (error) {
      // Handle errors here
      console.error('Sign-in error:', error.message)
      return rejectWithValue(error.message)
    }
  }
)

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async (
    { email, password },
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      if (userCredential && userCredential.user) {
        dispatch(signInAndSetUp({ email, password }))
        return fulfillWithValue(userCredential.user.uid)
      } else {
        return rejectWithValue('Error creating user')
      }
    } catch (error) {
      console.error('Sign-in error:', error.message)
      return rejectWithValue(error.message)
    }
  }
)

export const signOutUser = createAsyncThunk(
  'auth/signOutUser',
  async ({ rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      await signOut(auth)
      return null
    } catch (error) {
      console.error('Sign-out error:', error.message)
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signIn.pending, (state) => {
      state.loading = true
    })
    builder.addCase(signIn.fulfilled, (state, { payload }) => {
      state.loading = false
      state.uid = payload
      state.error = null
    })
    builder.addCase(signIn.rejected, (state, { payload }) => {
      state.loading = false
      state.user = null
      state.error = payload
    })
    builder.addCase(signUpUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(signUpUser.fulfilled, (state, { payload }) => {
      state.loading = false
      state.uid = payload
      state.error = null
    })
    builder.addCase(signUpUser.rejected, (state, { payload }) => {
      state.loading = false
      state.user = null
      state.error = payload
    })
    builder.addCase(signOutUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(signOutUser.fulfilled, (state, { payload }) => {
      state.loading = false
      state.uid = null
    })
    builder.addCase(signOutUser.rejected, (state, { payload }) => {
      state.loading = false
      state.user = null
      state.error = payload
    })
    builder.addCase(signInAndSetUp.pending, (state) => {
      state.loading = true
    })
    builder.addCase(signInAndSetUp.fulfilled, (state, { payload }) => {
      state.loading = false
      state.uid = payload
      state.error = null
    })
    builder.addCase(signInAndSetUp.rejected, (state, { payload }) => {
      state.loading = false
      state.user = null
      state.error = payload
    })
    builder.addCase(getPersistence.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getPersistence.fulfilled, (state, { payload }) => {
      state.loading = false
      state.auth = payload
      state.error = null
    })
    builder.addCase(getPersistence.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })
  },
})

export default authSlice.reducer
