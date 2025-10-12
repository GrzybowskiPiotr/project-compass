import { Task } from '@project-compass/shared-types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../../api/axios';

export const fetchAllTasks = createAsyncThunk<
  Task[],
  string,
  { rejectValue: string }
>('tasks/fetchAll', async (projectId: string, { rejectWithValue }) => {
  try {
    const response = await api.get<Task[]>(`/${projectId}/tasks/`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? 'Failed to fetch tasks',
    );
  }
});
