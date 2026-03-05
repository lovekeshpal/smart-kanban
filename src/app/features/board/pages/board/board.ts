import { Component, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { BoardStore } from '../../../../core/stores/board.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Column } from '../../components/column/column';
import { CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  imports: [CommonModule, FormsModule, Column],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board implements AfterViewInit {
  title = '';
  selectedPriority: 'low' | 'medium' | 'high' = 'medium';
  @ViewChildren(Column) columns!: QueryList<Column>;

  constructor(public boardStore: BoardStore) {}

  ngAfterViewInit() {
    // Connect all drop lists to each other
    console.log('Board ngAfterViewInit - columns found:', this.columns?.length);
    
    if (this.columns && this.columns.length > 0) {
      const dropLists = this.columns
        .map(col => col.dropList)
        .filter(list => list !== undefined && list !== null);

      console.log('Drop lists found:', dropLists.length);

      if (dropLists.length > 0) {
        dropLists.forEach((dropList, index) => {
          dropList.connectedTo = dropLists.filter(list => list !== dropList);
          console.log(`Drop list ${index} connected to ${dropLists.length - 1} other lists`);
        });
      }
    } else {
      console.log('No columns found!');
    }
  }

  createTask() {
    if (!this.title.trim()) return;
    this.boardStore.addTask(this.title, this.selectedPriority);
    this.title = '';
    this.selectedPriority = 'medium';
  }

  clearCompleted() {
    if (confirm('Clear all completed tasks?')) {
      this.boardStore.clearCompleted();
    }
  }

  clearAll() {
    if (confirm('This will delete all tasks. Are you sure?')) {
      this.boardStore.clearAll();
    }
  }
}

