import { Project, User } from '@project-compass/shared-types';
export const MockProject: Project = {
  id: '1',
  name: 'Projet pobrany z Bazy Danych',
  createdAt: new Date(),
  userId: 'user-test-123',
  updatedAt: new Date(),
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

export const MockUser: User = {
  id: 'user-123',
  email: 'test@test.com',
  name: 'Jan Kowaslki',
};

export const MOCK_USER_PASSWORD = 'password';
export const MOCK_USER_EMAIL = 'test@test.com';
export const MOCK_USER_HASHED_PASSWORD =
  '$2b$10$JtM0Pe4MpCFmKECwCHcQSuZBVOStj1A4oq01/BfVwrmqIGSicIoHe';
