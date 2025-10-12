import { createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '@project-compass/shared-types';
import api from '../../../../api/axios';

export const createTask = createAsyncThunk<
  Task,
  { title: string; projectId: string; parentId?: string | null },
  { rejectValue: string }
>('tasks/createTask', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<Task>('/tasks', payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? 'Failed to create task',
    );
  }
});
