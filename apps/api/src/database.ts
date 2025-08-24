import { Project, Task } from '@project-compass/shared-types';
import * as fs from 'fs';
import * as path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

type Database = Awaited<ReturnType<typeof open>>;

let db: Database | null = null;

export async function getDb() {
  if (db) {
    return db;
  }

  const dbDirectory = path.join(process.cwd(), 'apps/api/database');
  const dbPath = path.join(dbDirectory, 'database.db');
  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
    console.log('Database directory not found. Created:', dbDirectory);
  }

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  return db;
}

export async function initializeDatabase() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      userId TEXT
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

  console.log('Database initialized successfully!');
}

export async function getProjectWithTasks(
  projectId: string,
): Promise<Project | null> {
  const db = await getDb();
  const projectData = await db.get(
    'SELECT * FROM projects WHERE id = ?',
    projectId,
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

export async function createTask(
  title: string,
  projectId: string,
  parentId: string | null,
): Promise<Task> {
  const db = await getDb();

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
export async function deleteTaskAndChildren(taskId: string) {
  const db = await getDb();

  const getAllChildrenTasksToDelete = await db.all(
    'SELECT * FROM tasks WHERE parentId = ?',
    taskId,
  );

  for (const childTask of getAllChildrenTasksToDelete) {
    await deleteTaskAndChildren(childTask.id);
  }

  await db.run('DELETE FROM tasks WHERE id = ?', taskId);
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

  if (fieldsToUpdate.length === 0) {
    return db.get('SELECT * FROM tasks WHERE id = ?', taskId);
  }

  const setCalause = fieldsToUpdate.join(', ');
  const query = `UPDATE tasks set ${setCalause} WHERE id = ?`;
  await db.run(query, [...values, taskId]);

  return db.get(`SELECT * FROM tasks WHERE id = ?`, taskId);
}
