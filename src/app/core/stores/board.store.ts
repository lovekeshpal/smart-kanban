import { Injectable, signal, computed, effect } from '@angular/core';
import { Task, TaskPriority } from '../../features/board/models/task.model';

const STORAGE_KEY = 'kanban_tasks';

@Injectable({
  providedIn: 'root',
})
export class BoardStore {
  // =====================
  // STATE
  // =====================

  private tasks = signal<Task[]>(this.loadTasks());

  // =====================
  // COMPUTED VALUES
  // =====================

  todoTasks = computed(() =>
    this.tasks().filter((task) => task.status === 'todo'),
  );

  inProgressTasks = computed(() =>
    this.tasks().filter((task) => task.status === 'in-progress'),
  );

  doneTasks = computed(() =>
    this.tasks().filter((task) => task.status === 'done'),
  );

  totalTasks = computed(() => this.tasks().length);

  completedTasks = computed(() => this.doneTasks().length);

  progress = computed(() => {
    const total = this.totalTasks();
    if (!total) return 0;

    return Math.round((this.completedTasks() / total) * 100);
  });

  highPriorityTasks = computed(() =>
    this.tasks().filter((task) => task.priority === 'high' && task.status !== 'done'),
  );

  activeTasks = computed(() =>
    this.tasks().filter((task) => task.status !== 'done').length,
  );

  // =====================
  // MUTATIONS
  // =====================

  addTask(title: string, priority: TaskPriority = 'medium') {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'todo',
      priority,
      createdAt: Date.now(),
    };

    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTaskStatus(taskId: string, status: Task['status']) {
    this.tasks.update((tasks) =>
      tasks.map((task) => 
        task.id === taskId 
          ? { ...task, status, updatedAt: Date.now() } 
          : task
      ),
    );
  }

  updateTask(taskId: string, updates: Partial<Task>) {
    this.tasks.update((tasks) =>
      tasks.map((task) => 
        task.id === taskId 
          ? { ...task, ...updates, updatedAt: Date.now() } 
          : task
      ),
    );
  }

  updateTaskPriority(taskId: string, priority: TaskPriority) {
    this.updateTask(taskId, { priority });
  }

  updateTaskDescription(taskId: string, description: string) {
    this.updateTask(taskId, { description });
  }

  deleteTask(taskId: string) {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
  }

  clearCompleted() {
    this.tasks.update((tasks) => tasks.filter((task) => task.status !== 'done'));
  }

  clearAll() {
    this.tasks.set([]);
  }

  // =====================
  // EFFECTS
  // =====================

  constructor() {
    effect(() => {
      const tasks = this.tasks();

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );
    });
  }

  private loadTasks(): Task[] {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
}
