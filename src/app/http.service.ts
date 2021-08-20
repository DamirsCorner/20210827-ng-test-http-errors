import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ErrorDetails {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly url = 'https://fake.url';

  constructor(private http: HttpClient) {}

  public get(id: string): Observable<string | undefined> {
    return this.http.get<string>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(undefined);
        } else {
          return throwError(error.error);
        }
      })
    );
  }
}
