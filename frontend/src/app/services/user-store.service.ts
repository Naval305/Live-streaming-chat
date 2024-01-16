import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private apiUrl = 'http://localhost:8000';

  private usersSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    {
      name: '',
      photo: 'assets/icons/girl.svg',
      online: true,
      status: 'Hi i am using dj chat',
      messages: [
        {
          text: 'This is message',
          read: true,
          date_time: 'Yesterday',
          sender_id: 'me',
        },
        {
          text: 'This is message',
          read: true,
          date_time: 'Yesterday',
          sender_id: 'him',
        },
      ],
    },
  ]);

  private groupsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  constructor(private http: HttpClient, private authService: LoginService) {}

  private selectedUserSubject: BehaviorSubject<any | null> =
    new BehaviorSubject<any | null>(null);

  private selectedGroupSubject: BehaviorSubject<any | null> =
    new BehaviorSubject<any | null>(null);

  users$ = this.usersSubject.asObservable();
  selectedUser$ = this.selectedUserSubject.asObservable();
  groups$ = this.groupsSubject.asObservable();
  selectedGroup$ = this.selectedGroupSubject.asObservable();

  getUsers(): Observable<any[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/api/user/users`, {
      headers: headers,
    });
  }

  fetchUsers() {
    this.getUsers().subscribe(
      (res: any) => {
        this.usersSubject.next(res['results']);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  getGroups() {
    const headers = this.authService.getHeaders();
    return this.http
      .get(`${this.apiUrl}/api/chat/group-message`, {
        headers: headers,
      })
      .subscribe((res: any) => this.groupsSubject.next(res));
  }

  get users(): any[] {
    return this.usersSubject.value;
  }

  set users(value: any[]) {
    this.usersSubject.next(value);
  }

  get selectedUser(): any | null {
    return this.selectedUserSubject.value;
  }

  set selectedUser(value: any | null) {
    this.selectedUserSubject.next(value);
  }

  get groups(): any | null {
    return this.groupsSubject.value;
  }

  set groups(value: any[]) {
    this.groupsSubject.next(value);
  }

  get selectedGroup(): any | null {
    return this.selectedGroupSubject.value;
  }

  set selectedGroup(value: any | null) {
    this.selectedGroupSubject.next(value);
  }
}
