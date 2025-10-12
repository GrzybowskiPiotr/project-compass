import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../../api/axios';

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('tasks/deleteTask', async (taskId: string, { rejectWithValue }) => {
  try {
    if (!taskId) throw new Error('Task ID is undefined');
    await api.delete(`/tasks/${taskId}`);
    return taskId;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? 'Failed to delete task',
    );
  }
});
