import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Staff {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface CreateStaffDto {
  fullName: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class StaffService {
  private apiUrl = `${environment.apiUrl}/adminstaff`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.apiUrl);
  }

  create(dto: CreateStaffDto): Observable<Staff> {
    return this.http.post<Staff>(this.apiUrl, dto);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
