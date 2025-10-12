import { Task } from '@project-compass/shared-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//helpers import
import { addSubTaskToTree } from './helpers/addSubTaskToTree';
import { deleteTaskFromTree } from './helpers/deleteTasksfromTree';
import { updateTaskInTree } from './helpers/updateTaskInTree';
// thunks import

import {
  createSubtask,
  createTask,
  deleteTask,
  editTask,
  fetchAllTasks,
  toggleTaskComplete,
} from './thunks/';
//local types delaration
export interface TaskState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedTask: string | null;
}
//slice initila state declaration
const initialState: TaskState = {
  tasks: [],
  status: 'idle',
  error: null,
  selectedTask: null,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask(state, action: PayloadAction<string | null>) {
      state.selectedTask = action.payload;
    },
    clearTasks(state) {
      state.tasks = [];
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createSubtask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSubtask.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? action.error.message ?? 'Failed to create subtask';
      })
      .addCase(createSubtask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const newTasks = addSubTaskToTree(
          action.payload,
          [...state.tasks],
          action.payload.parentId,
        );
        state.tasks = newTasks;
      })
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
      .addCase(toggleTaskComplete.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ??
          action.error.message ??
          'Faild to toggle complete task';
      })
      .addCase(toggleTaskComplete.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const updatetState = updateTaskInTree(
          [...state.tasks],
          action.payload.id,
          action.payload,
        );
        state.tasks = updatetState;
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const tasksAfterDelete = deleteTaskFromTree(
          [...state.tasks],
          action.payload,
        );
        state.tasks = tasksAfterDelete;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? action.error.message ?? 'Failed to delete task';
      })
      .addCase(editTask.rejected, (state, action) => {
        state.error =
          action.payload ?? action.error.message ?? 'FAiled to edit task';
        state.status = 'failed';
      })
      .addCase(editTask.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        const updatetState = updateTaskInTree(
          [...state.tasks],
          action.payload.id,
          action.payload,
        );
        state.tasks = updatetState;
      });
  },
});

export default taskSlice.reducer;
export const { setSelectedTask, clearTasks } = taskSlice.actions;
