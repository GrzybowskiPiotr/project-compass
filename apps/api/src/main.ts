import { Project, Task } from '@project-compass/shared-types';
import express from 'express';
import * as path from 'path';
import { getDb, getProjectWithTasks, initializeDatabase } from './database';

const app = express();

const MockProject: Project = {
  id: '1',
  name: 'Projet pobrany z Bazy Danych',
  createdAt: new Date(),
  userId: 'user-123',
  tasks: [
    {
      id: '1',
      title: 'Skonfigurować środowisko',
      isCompleted: true,
      createdAt: new Date(),
      subTasks: [],
    },
    {
      id: '2',
      title: 'Zbudować komponenty UI',
      isCompleted: false,
      createdAt: new Date(),
      subTasks: [
        {
          id: 't2-1',
          title: 'Stworzyć TaskItem',
          isCompleted: true,
          createdAt: new Date(),
          subTasks: [],
        },
        {
          id: 't2-2',
          title: 'stworzyć TaskList',
          isCompleted: true,
          createdAt: new Date(),
          subTasks: [
            {
              id: 't2-2-1',
              title: 'stworzyć TaskListItem',
              isCompleted: false,
              createdAt: new Date(),
              subTasks: [],
            },
          ],
        },
      ],
    },
    {
      id: '3',
      title: 'Dodać logikę rekurencyjną',
      isCompleted: false,
      createdAt: new Date(),
      subTasks: [],
    },
  ],
};

async function seedDatabase() {
  const db = await getDb();
  const projectExists = await db.get(
    'SELECT * FROM projects WHERE id = ?',
    MockProject.id,
  );

  if (!projectExists) {
    console.log('Seeding database with initial data...');
    await db.run(
      'INSERT INTO projects (id, name, createdAt, userId) VALUES (?,?,?,?)',
      MockProject.id,
      MockProject.name,
      MockProject.createdAt.toISOString(),
      MockProject.userId,
    );

    const insertTasksRecursively = async (
      tasks: Task[],
      parentId: string | null,
    ) => {
      for (const task of tasks) {
        await db.run(
          'INSERT INTO tasks (id, title, isCompleted, createdAt, projectId, parentId) VALUES (?,?,?,?,?,?)',
          task.id,
          task.title,
          task.isCompleted,
          task.createdAt.toISOString(),
          MockProject.id,
          parentId,
        );
        if (task.subTasks && task.subTasks.length > 0) {
          await insertTasksRecursively(task.subTasks, task.id);
        }
      }
    };
    await insertTasksRecursively(MockProject.tasks, null);
    console.log('Seeding complete!');
  }
}

initializeDatabase().then(() => {
  seedDatabase().catch(console.error);
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/project/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await getProjectWithTasks(id);

    if (project) {
      res.send(project);
    } else {
      res.status(404).send({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api/project/1`);
});

server.on('error', console.error);
