import {Component} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {BehaviorSubject, Observable} from "rxjs";
import { filter, finalize, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div class="title">
      <h1>
        A list of TODOs
      </h1>
    </div>
    <div class="list">
      <label for="search">Search...</label>
      <input id="search" type="text" [(ngModel)]="searchInput" (change)="filterTodoList()">
      <app-progress-bar *ngIf="isLoading"></app-progress-bar>
      <app-todo-item *ngFor="let todo of todos$ | async" [item]="todo"></app-todo-item>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  readonly todos$: Observable<Todo[]>;
  isLoading: boolean = true
  searchInput: string = ""
  private searchSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(todoService: TodoService) {
    this.todos$ = this.searchSubject.pipe(
      switchMap(searchTerm => {
        this.isLoading = true;
        return todoService.getAll().pipe(
          map(todos => todos.filter(
            todo => todo.task.includes(searchTerm)
          )),
          finalize(()=>(this.isLoading = false))
        );
      })
    )
  }

  filterTodoList() {
    this.searchSubject.next(this.searchInput);
  }
}
