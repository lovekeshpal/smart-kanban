import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Task } from '../../app/features/board/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class BoardStore {
  private tasks = signal<Task[]>(this.loadTasks());

  // Computed signals for filtering tasks by status
  todoTasks = computed(() => this.tasks().filter(t => t.status === 'todo'));
  inProgressTasks = computed(() => this.tasks().filter(t => t.status === 'in-progress'));
  doneTasks = computed(() => this.tasks().filter(t => t.status === 'done'));

  // Computed signals for progress tracking
  totalTasks = computed(() => this.tasks().length);
  completedTasks = computed(() => this.doneTasks().length);
  progress = computed(() => {
    const total = this.totalTasks();
    return total === 0 ? 0 : Math.round((this.completedTasks() / total) * 100);
  });

  addTask(title: string): void {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status: 'todo',
      createdAt: Date.now(),
    };
    this.tasks.update(tasks => [...tasks, newTask]);
    this.saveTasks();
  }

  updateTaskStatus(taskId: string, newStatus: Task['status']): void {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    this.saveTasks();
  }

  deleteTask(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId));
    this.saveTasks();
  }

  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks()));
  }

  private loadTasks(): Task[] {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  }
}