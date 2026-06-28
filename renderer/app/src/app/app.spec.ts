import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TodoService } from './services/todo.service';

// Mock de TodoService pour éviter les appels à window.api dans les tests
const todoServiceMock = {
  getTodos: () => Promise.resolve([]),
  addTodo: (text: string) => Promise.resolve({ id: 1, text, done: false }),
  toggleTodo: (id: number) => Promise.resolve({ id, text: 'Test', done: true }),
  deleteTodo: (id: number) => Promise.resolve(),
  toggleAll: () => Promise.resolve([]),
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: TodoService, useValue: todoServiceMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Todo');
  });
});
