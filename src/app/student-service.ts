import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentData } from './Interface/IstudentData';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7051/api/Students';

  getAll(): Observable<StudentData[]> {
    return this.http.get<StudentData[]>(this.apiUrl);
  }

  create(dto: StudentData): Observable<StudentData> {
    return this.http.post<StudentData>(this.apiUrl, dto, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  update(dto: StudentData): Observable<StudentData> {
    return this.http.put<StudentData>(`${this.apiUrl}/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
