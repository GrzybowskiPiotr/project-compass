import { Task } from '@project-compass/shared-types';
import bcrypt from 'bcrypt';
import express from 'express';
import * as path from 'path';
import { generateToken, verifyToken } from './auth/auth.service';
import {
  MOCK_USER_EMAIL,
  MOCK_USER_HASHED_PASSWORD,
  MockProject,
} from './consts/mocks';
import {
  createProject,
  createTask,
  createUser,
  deleteTaskAndChildren,
  ensureDbConnection,
  findUserByEmail,
  getProjectWithTasks,
  initializeDatabase,
  updateTask,
} from './database';

const port = process.env.PORT || 3333;
const app = express();
app.use(express.json());
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api/project/1`);
});

async function seedDatabase() {
  const db = await ensureDbConnection();
  const projectExists = await db.get(
    'SELECT * FROM projects WHERE id = ?',
    MockProject.id,
  );

  if (!projectExists) {
    console.log('Seeding database with initial data...');

    await db.run(
      ' INSERT INTO users (id, name, email, password) VALUES (?,?,?,?)',
      'user-test-123',
      'Jan Test Kowalski',
      MOCK_USER_EMAIL,
      MOCK_USER_HASHED_PASSWORD,
    );

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
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);

      if (payload) {
        console.log(`User ${payload.userId} is accessing project...`);
        const { id: projectID } = req.params;
        const userId = payload.userId;
        const project = await getProjectWithTasks(userId, projectID);

        if (project) {
          res.send(project);
        } else {
          res.status(404).send({ message: 'Project not found' });
        }
      } else {
        res.status(401).send({ message: 'Unauthorized: Invalid token' });
      }
    } else {
      res.status(401).send({ message: 'Unauthorized: No token provided' });
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, projectId, parentId } = req.body;

    if (!title || !projectId) {
      res.status(400).send({ message: 'Title and projectId are required' });
      return;
    }

    const createdTask = await createTask(title, projectId, parentId || null);
    res.status(201).send(createdTask);
  } catch (error) {
    console.error('Error. Ctreate task faild', error);
    res.status(500).send({ message: 'Interna; server Error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send({ message: 'Task id is required' });
    }
    await deleteTaskAndChildren(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      res.status(400).send({ message: 'No updates provided' });
      return;
    }

    const updatedTask = await updateTask(id, updates);
    res.status(200).send(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send({ message: 'An internal server error occurred' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if ((!email || !password) && (email === '' || password === '')) {
    res.status(400).send({ message: 'Email and password are required' });
    return;
  }

  const user = await findUserByEmail(email);

  if (user === undefined) res.status(401).send({ message: 'User not found' });

  if (user !== undefined) {
    const dosePasswordMatch = await bcrypt.compare(password, user.password);
    if (dosePasswordMatch) {
      const token = generateToken(user);
      res.status(200).send({ user, token });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  //Prosta walidacja trzymanyc danych.Walidujemy zawsze dane wejsciowe przeda zamisem do DB lub przed przetwarznienm.
  if (!name || !email || !password) {
    return res.status(400).send({ message: 'All fields are required' });
  }
  //haszowanie hasła
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const createdUser = await createUser({ name, email, hashPassword });
    const token = generateToken(createdUser);
    res.status(201).send({ ...createdUser, token });
    return;
  } catch (error) {
    res.status(409).send({
      message:
        'User with given email address exists. Provide unique email for new user',
    });
    console.log(error);
    return;
  }
});
app.post('/api/projects', async (req, res) => {
  try {
    const authHeared = req.headers.authorization;

    if (authHeared && authHeared.startsWith('Bearer ')) {
      const token = authHeared.split(' ')[1];
      const payload = verifyToken(token);

      if (payload) {
        const { name } = req.body;
        const userId = payload.userId;

        if (!name || name.trim().length === 0) {
          return res.status(400).send({ message: 'Project name is required' });
        }

        const newProject = await createProject(name, userId);
        res.status(201).send(newProject);
      } else {
        res.status(401).send({ message: 'Unauthorized: Invalid token' });
      }
    } else {
      res.status(401).send({ message: 'Unauthorized: No token provided' });
    }
  } catch (error) {
    console.error('Error creating project: ', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
  return;
});
server.on('error', console.error);
