import { Project, Task, User, UserDB } from '@project-compass/shared-types';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
type DatabaseType = Awaited<ReturnType<typeof open>>;
let db: DatabaseType | null = null;

export async function getDb(): Promise<DatabaseType | null> {
  if (db) return db;

  if (process.env.DATABASE_PATH === undefined) {
    console.error('Path to database is not provided');
    return null;
  }

  const dbPath = process.env.DATABASE_PATH;
  const dbDirectory = path.dirname(dbPath);

  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
    console.log('Database directory not found. Created:', dbDirectory);
  }

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  await db.exec('PRAGMA foreign_keys = ON;');
  await db.exec('PRAGMA journal_mode = WAL;');
  await db.exec('PRAGMA busy_timeout = 5000;');
  return db;
}

export async function ensureDbConnection(): Promise<DatabaseType> {
  const database = await getDb();
  if (!database) {
    throw new Error(
      'Database connection not established. Check DATABASE_PATH in .env',
    );
  }
  return database;
}

export async function closeDbConnection() {
  if (db) {
    try {
      await db.close();
    } catch (error) {
      console.error('Error closing DB: ', error);
    } finally {
      db = null;
    }
  }
}
export async function forceReopenDbIfClosed() {
  if (db) {
    try {
      await db.get('SELECT 1');
      return db;
    } catch (error) {
      console.warn('DB connection was closed, reopening...', error);
      try {
        await db.close();
      } catch {
        console.warn('DB was already closed.');
      }
      db = null;
    }
  }
  return ensureDbConnection();
}
export async function initializeDatabase() {
  const db = await ensureDbConnection();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT,
      userId TEXT NOT NULL,
      description TEXT
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      isCompleted BOOLEAN NOT NULL,
      createdAt TEXT NOT NULL,
      projectId TEXT NOT NULL,
      parentId TEXT,
      FOREIGN KEY (projectId) REFERENCES projects(id),
      FOREIGN KEY (parentId) REFERENCES tasks(id)
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
    );
    `);
  console.log('Database initialized successfully!');
}
// CRUD operations for Projects
export async function createProject(
  name: string,
  userId: string,
  description: string,
): Promise<Project> {
  const db = await ensureDbConnection();

  const newProject: Project = {
    id: `project-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId,
    tasks: [],
    description,
    name,
  };

  await db.run(
    `INSERT INTO projects (id, name, createdAt, description, userId) VALUES (?,?,?,?,?)`,
    newProject.id,
    newProject.name,
    newProject.createdAt.toISOString(),
    newProject.description,
    newProject.userId,
  );
  return newProject;
}

export async function deleteProject(projectId: string) {
  const db = await ensureDbConnection();

  try {
    const tasksToDelete = await db.all<{ id: string }[]>(
      'SELECT id FROM tasks WHERE projectId = ?',
      projectId,
    );
    for (const { id } of tasksToDelete) {
      await deleteTaskAndChildren(id, db);
    }

    await db.run('DELETE FROM projects WHERE id = ?', projectId);
  } catch (error) {
    console.error('Error deleting project and its tasks:', error);
    throw error;
  }
}

export async function getAllProjectsForUser(userId: string) {
  const db = await ensureDbConnection();
  const allProjects = await db.all(
    'SELECT * FROM projects WHERE userId = ?',
    userId,
  );
  if (allProjects.length === 0) {
    return null;
  }
  return allProjects;
}

export async function getProjectWithTasks(
  userId: string,
  projectId: string,
): Promise<Project | null> {
  const db = await ensureDbConnection();
  const projectData = await db.get(
    'SELECT * FROM projects WHERE id = ? AND userId = ?',
    projectId,
    userId,
  );

  if (!projectData) {
    return null;
  }

  const tasksFromDb = await db.all(
    'SELECT * FROM tasks WHERE projectId = ?',
    projectId,
  );

  const buildTaskTree = (
    tasks: typeof tasksFromDb,
    parentid: string | null = null,
  ): Task[] => {
    return tasks
      .filter((task) => task.parentId === parentid)
      .map((task) => ({
        ...task,
        isCompleted: !!task.isCompleted,
        createdAt: new Date(task.createdAt),
        subTasks: buildTaskTree(tasks, task.id),
      }));
  };
  const tasksTree = buildTaskTree(tasksFromDb);

  return {
    ...projectData,
    createdAt: new Date(projectData.createdAt),
    tasks: tasksTree,
  };
}
// CRUD operations for Tasks
export async function createTask(
  title: string,
  projectId: string,
  parentId: string | null,
): Promise<Task> {
  const db = await ensureDbConnection();

  const newTask: Task = {
    id: `task-${Date.now()}`,
    title,
    isCompleted: false,
    createdAt: new Date(),
    subTasks: [],
  };

  await db.run(
    'INSERT INTO tasks (id,title, isCompleted, createdAt, projectId, parentId) VALUES (?,?,?,?,?,?)',
    newTask.id,
    newTask.title,
    newTask.isCompleted,
    newTask.createdAt.toISOString(),
    projectId,
    parentId,
  );
  return newTask;
}
export async function deleteTaskAndChildren(
  taskId: string,
  db?: DatabaseType,
  visited?: Set<string>,
) {
  const localDb = db ?? (await ensureDbConnection());

  visited = visited ?? new Set<string>();
  if (visited?.has(taskId)) return;
  visited?.add(taskId);

  try {
    const children = await localDb.all<{ id: string }[]>(
      `SELECT id FROM tasks WHERE parentId = ?`,
      taskId,
    );

    for (const { id } of children) {
      await deleteTaskAndChildren(id, localDb, visited);
    }

    await localDb.run('DELETE FROM tasks WHERE id = ?', taskId);
  } catch (error) {
    console.error('Error deleting task and its children:', error);
    throw error;
  }
}
export async function getTasksWithinProject(projectId: string) {
  const db = await ensureDbConnection();
  const tasks = await db.all(
    'SELECT * FROM tasks WHERE projectId = ?',
    projectId,
  );
  return tasks;
}
export async function updateTask(
  taskId: string,
  updates: { title?: string; isCompleted?: boolean },
) {
  const db = await getDb();

  const fieldsToUpdate: string[] = [];
  const values: (string | number)[] = [];

  if (updates.title !== undefined) {
    fieldsToUpdate.push('title = ?');
    values.push(updates.title);
  }

  if (updates.isCompleted !== undefined) {
    fieldsToUpdate.push('isCompleted = ?');
    values.push(updates.isCompleted ? 1 : 0);
  }
  if (!db) {
    throw new Error('Database connection failed');
  }
  if (fieldsToUpdate.length === 0) {
    return db.get('SELECT * FROM tasks WHERE id = ?', taskId);
  }

  const setCalause = fieldsToUpdate.join(', ');
  const query = `UPDATE tasks set ${setCalause} WHERE id = ?`;
  await db.run(query, [...values, taskId]);

  return db.get(`SELECT * FROM tasks WHERE id = ?`, taskId);
}
// CRUD operations for Users
export async function createUser(
  newUserData: Omit<UserDB, 'id'>,
): Promise<User> {
  const db = await ensureDbConnection();

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: newUserData.name,
    email: newUserData.email,
  };

  await db.run(
    `INSERT INTO users (id, name, email, password ) VALUES (?,?,?,?)`,
    newUser.id,
    newUser.name,
    newUser.email,
    newUserData.hashPassword,
  );
  return newUser;
}
export async function findUserByEmail(email: string) {
  if (email.trim().length === 0) return;

  const db = await ensureDbConnection();
  const foundUserFromDB = await db.get(
    `
    SELECT * FROM users WHERE email = ?
    `,
    email,
  );

  return foundUserFromDB;
}
export async function getUserById(userId: string) {
  const db = await ensureDbConnection();
  const foundedUser = db.get(
    `
  SELECT * FROM users WHERE id = ?
  `,
    userId,
  );
  return foundedUser;
}
