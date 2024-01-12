import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  private apiUrl = 'http://127.0.0.1:8000';
  private wsUrl: any = 'ws://127.0.0.1:8000';
  // public callSocket: any;

  constructor(private http: HttpClient) {}

  startCall(data: { receiver: any; sender: any; peer_id: string; }) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': this.authService.getHeaders()["Authorization"]
    // });

    // var postData = {
    //   text: message,
    //   receiver: receiver,
    // };
    return this.http.post(`${this.apiUrl}/api/call/start-call`, data);
  }

  endCall(data: { receiver: any; sender: any; peer_id: string; }){
    return this.http.post(`${this.apiUrl}/end-call`, data)
  }

  // startCallSocket(peerId) {
  //   return new WebSocket(`${this.wsUrl}/ws/`)
  // }
}
