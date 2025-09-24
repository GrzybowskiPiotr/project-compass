// features/ProjectTasks/projectTasks.slice.ts
import { Task } from '@project-compass/shared-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../api/axios';

export interface TaskState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedTask: string | null;
}

const initialState: TaskState = {
  tasks: [],
  status: 'idle',
  error: null,
  selectedTask: null,
};

// fetch all tasks for projectId
export const fetchAllTasks = createAsyncThunk<
  Task[],
  string,
  { rejectValue: string }
>('tasks/fetchAll', async (projectId: string, { rejectWithValue }) => {
  try {
    // endpoint: /:projectId/tasks/
    const response = await api.get<Task[]>(`/${projectId}/tasks/`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? 'Failed to fetch tasks',
    );
  }
});

// deleteTask zwraca deleted taskId (string)
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

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask(state, action: PayloadAction<string | null>) {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? action.error.message ?? 'Failed to fetch tasks';
      })
      .addCase(createTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? action.error.message ?? 'Failed to create task';
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        // action.payload to taskId
        state.tasks = state.tasks.filter((task) => action.payload !== task.id);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? action.error.message ?? 'Failed to delete task';
      });
  },
});

export default taskSlice.reducer;
export const { setSelectedTask } = taskSlice.actions;
