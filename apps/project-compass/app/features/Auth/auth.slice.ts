import { AuthResponse, User } from '@project-compass/shared-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { clearProjects } from '../Projects/Projects/projects.slice';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
  isHydrated: false,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    { name, email, password }: Omit<User, 'id' | 'createAt'>,
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
      });

      dispatch(setCredentials(response.data));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed',
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login/User',
  async (
    { email, password }: Pick<User, 'email' | 'password'>,
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      dispatch(setCredentials(response.data));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  },
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      if (typeof window === 'undefined') {
        return rejectWithValue('Cannot hydrate on server');
      }
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        return rejectWithValue('No token found');
      }
      const response = await api.get<User>('/auth/me');

      return {
        user: response.data,
        token: token,
      };
    } catch (error: any) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwtToken');
      }
      dispatch(logout());
      return rejectWithValue(
        error.reponse?.data?.message || 'Failed to re-authenticate',
      );
    }
  },
);

export const logoutUserAndClearState = createAsyncThunk(
  'auth/logoutUSerAndClearState',
  async (_, { dispatch }) => {
    dispatch(logout());
    dispatch(clearProjects());
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User | null; token: string | null }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.user && !!action.payload.token; // nie wykonuje się. action.payload.user ustawia się na null;
      state.status = 'succeeded';
      state.error = null;
      if (typeof window !== 'undefined' && action.payload.token) {
        localStorage.setItem('jwtToken', action.payload.token);
      } else if (typeof window !== 'undefined') {
        localStorage.removeItem('jwtToken');
      }
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      state.isHydrated = true;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwtToken');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwtToken');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwtToken');
        }
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.isAuthenticated = false;
        state.isHydrated = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.isHydrated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = !!action.payload.token && !!action.payload.user;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.isHydrated = true;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
