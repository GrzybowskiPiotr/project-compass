import { CreateTaskDTO, Task } from '@project-compass/shared-types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../../api/axios';

export const createSubtask = createAsyncThunk<
  Task,
  CreateTaskDTO,
  { rejectValue: string }
>('tasks/createSubtask', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<Task>('/tasks', payload);
    return response.data;
  } catch (error: any) {
    console.error('Error occurse while adding subTask');
    return rejectWithValue(
      error?.response?.data?.message || 'Failed to create subtask',
    );
  }
});
