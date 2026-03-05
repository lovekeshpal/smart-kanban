import { Injectable, signal, computed, effect } from '@angular/core';
import { Task } from '../../features/board/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class BoardStore {
  // =====================
  // STATE
  // =====================

  private tasks = signal<Task[]>([]);

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

  // =====================
  // MUTATIONS
  // =====================

  addTask(title: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'todo',
      createdAt: Date.now(),
    };

    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTaskStatus(taskId: string, status: Task['status']) {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    );
  }

  deleteTask(taskId: string) {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
  }

  // =====================
  // EFFECTS
  // =====================

  constructor() {
    effect(() => {
      console.log('Tasks changed:', this.tasks());
    });
  }
}
