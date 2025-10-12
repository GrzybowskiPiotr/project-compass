import { Task } from '@project-compass/shared-types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../../api/axios';
import { findTaskInTree } from '../helpers/findTaskInTree';

export const toggleTaskComplete = createAsyncThunk<
  Task,
  { taskId: string; tasks: Task[] },
  { rejectValue: string }
>('task/toggleTaskComplete', async ({ taskId, tasks }, { rejectWithValue }) => {
  try {
    if (!taskId) throw new Error('Task Id is required');
    const taskToToggle = findTaskInTree(taskId, tasks);

    const response = await api.patch<Task>(`/tasks/${taskId}`, {
      isCompleted: !taskToToggle?.isCompleted,
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.resposne?.data?.message ?? 'Failed to toggle complete task',
    );
  }
});
