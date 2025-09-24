import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/auth.slice';
import projectReducer from '../features/Projects/projects.slice';
import taskSlice from '../features/Projects/ProjectTasks/projectTasks.slice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
