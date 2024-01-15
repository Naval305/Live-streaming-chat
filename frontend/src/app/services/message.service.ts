import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://localhost:8000';
  private wsUrl: any = 'ws://127.0.0.1:8000';
  public messageSocket = this.connectMessageSocket();
  public notificationSocket = this.connectNotificationSocket();
  public groupChatSocket: { [key: string]: WebSocket } = {};

  private groupChatSubjects: { [key: string]: Subject<any> } = {};

  constructor(private http: HttpClient, private authService: LoginService) {}

  connectMessageSocket() {
    var activeEmail = localStorage.getItem('user') ?? '';
    var call = localStorage.getItem('call') ?? '';

    return new WebSocket(
      `${this.wsUrl}/ws/message/${encodeURIComponent(activeEmail)}?call=${call}`
    );
  }

  connectNotificationSocket() {
    return new WebSocket(`${this.wsUrl}/ws/notification`);
  }

  connectGroupChatSocket(group_id: any) {
    if (!this.groupChatSocket[group_id]) {
      this.initGroupChatSocket(group_id);
    }

    return this.groupChatSubjects[group_id].asObservable();
  }

  private initGroupChatSocket(group_id: string): void {
    this.groupChatSocket[group_id] = new WebSocket(
      `${this.wsUrl}/ws/group_chat/${group_id}`
    );

    const groupChatSubject: Subject<any> = new Subject<any>();
    this.groupChatSubjects[group_id] = groupChatSubject;
  }

  public getMessages(url: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get(url, {
      headers: headers,
    });
  }
}
