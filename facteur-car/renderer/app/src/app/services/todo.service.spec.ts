import { TestBed } from '@angular/core/testing';

import { TodoService } from './todo.service';
import { ElectronService } from './electron.service';

// Mock de ElectronService pour éviter les appels à window.api dans les tests
const electronServiceMock = {
  isElectron: () => true,
  getApi: () => ({
    getTodos: () => Promise.resolve([]),
    addTodo: (text: string) => Promise.resolve({ id: 1, text, done: false }),
    toggleTodo: (id: number) => Promise.resolve({ id, text: 'Test', done: true }),
    deleteTodo: (_id: number) => Promise.resolve(),
    toggleAll: () => Promise.resolve([]),
  }),
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElectronService, useValue: electronServiceMock },
      ],
    });
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
