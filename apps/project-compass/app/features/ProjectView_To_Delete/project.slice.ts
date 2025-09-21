import { Project } from '@project-compass/shared-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

export interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentProjectId: string | null;
}

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  status: 'idle',
  error: null,
  currentProjectId: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Project[]>('/projects');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch projects',
      );
    }
  },
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (
    projectData: { name: string; description?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post<Project>('/projects', projectData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create project',
      );
    }
  },
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Project>(`/projects/${projectId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          `Failed to fetch project by ID : ${projectId}`,
      );
    }
  },
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (project: Project, { rejectWithValue }) => {
    try {
      const response = await api.put<Project>(
        `/projects/${project.id}`,
        project,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          `Failed to update project ${project.id}`,
      );
    }
  },
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      await api.delete<void>(`/projects/${projectId}`);
      return projectId;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          `Failed to delete project ${projectId}`,
      );
    }
  },
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.projects = [];
      })
      .addCase(createProject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.projects.push(action.payload);
        state.selectedProject = action.payload;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.selectedProject = null;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'failed';
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.selectedProject = action.payload;
        state.projects = state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        );
      })
      .addCase(updateProject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        );
        if (state.selectedProject?.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'failed';
      })
      .addCase(deleteProject.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      });
  },
});

export default projectSlice.reducer;
