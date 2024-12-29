import {Injectable} from '@angular/core';
import {EMPTY, observable, Observable, of, scheduled} from "rxjs";
import { HttpClient } from '@angular/common/http';
import {delay, map, catchError} from "rxjs/operators";

export interface Todo {
  id: number;
  task: string;
  priority: 1 | 2 | 3;
}

// let mockData: Todo[] = [
//   { id: 0, task: 'Implement loading - frontend only', priority: 1 },
//   { id: 1, task: 'Implement search - frontend only', priority: 2 },
//   { id: 2, task: 'Implement delete on click - frontend only', priority: 1 },
//   { id: 3, task: 'Replace mock service by integrating backend', priority: 3 },
// ];

// function removeFromMockData(id: number) {
//   mockData = mockData.filter(todo => todo.id !== id);
// }

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = "http://localhost:8099/api"

  constructor(private http: HttpClient) {}

  getAll(): Observable<Todo[]> {
    const getAllUrl = this.apiUrl + "/todo/findAll";
    // return of(undefined).pipe(delay(2_000), map(() => mockData));
    return this.http.get<Todo[]>(getAllUrl).pipe(
      delay(2_000),
      catchError((error: any): Observable<Todo[]> => {
          console.error('Get All failed: ', error);
          return EMPTY;
        }
      )
    );
  }

  remove(id: number): Observable<void> {
    const deleteUrl = this.apiUrl + `/todo/delete/${id}`;

    return this.http.delete<void>(deleteUrl).pipe(
      delay(2_000),
      catchError((error: any) => {
        console.error('Delete failed: ', error);
        return EMPTY;
      })
    );
  }
}
