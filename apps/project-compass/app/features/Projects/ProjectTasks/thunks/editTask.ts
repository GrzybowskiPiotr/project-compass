import { Task } from '@project-compass/shared-types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../../api/axios';

export const editTask = createAsyncThunk<
  Task,
  { taskId: string; newTitle: string },
  { rejectValue: string }
>('tasks/editTask', async ({ taskId, newTitle }, { rejectWithValue }) => {
  try {
    const response = await api.patch<Task>(`/tasks/${taskId}`, {
      title: newTitle,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ?? 'Failed to edit task',
    );
  }
});
