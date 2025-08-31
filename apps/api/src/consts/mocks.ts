import { Project, User } from '@project-compass/shared-types';
export const MockProject: Project = {
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

export const MockUser: User = {
  id: 'user-123',
  email: 'test@test.com',
  password: 'password',
};
