import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Peer from 'peerjs';
import { timeout } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-sender-group',
  templateUrl: './sender-group.component.html',
  styleUrls: ['./sender-group.component.scss'],
})
export class SenderGroupComponent implements OnInit {
  @ViewChild('local_video', { static: true }) localVideo!: ElementRef;
  @ViewChild('remote_video', { static: true }) remoteVideo!: ElementRef;

  socket: any;
  peer_id: string = '';
  peer: any = null;
  conn: any;
  call: any;
  localStream: any = null;
  callingStatus = 'calling';
  wsUrl: any = 'wss://localhost:8001';
  getUserMedia = new MediaStream();
  userData: any;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(this.route.snapshot['queryParams']['display']);
    localStorage.setItem('call', 'true');
    this.initializePeer();
  }

  initializePeer() {
    this.peer = new Peer();
    this.peer.on('open', (id: string) => {
      this.peer_id = id;
      this.connectWebSocket();
      this.startCall();
    });

    this.peer.on('connection', (conn: any) => {
      alert('dsgds');
      this.handleConnection(conn);
    });

    this.peer.on('call', (call: any) => {
      this.handleCall(call);
    });

    this.peer.on('error', (data: any) => {
      console.error(data);
    });
  }

  handleConnection(conn: any) {
    this.conn = conn;
    this.conn.on('data', (data: any) => {});
  }

  handleCall(call: any) {
    this.call = call;
    const constraints = {
      video: true,
      audio: true,
    };
    this.connectMedia(constraints);
  }

  streamCall(stream: any) {
    this.callingStatus = 'connected';
    this.call.answer(stream);
    this.localStream = stream;
    this.localVideo.nativeElement.srcObject = stream;
    this.localVideo.nativeElement.play();
    this.call.on('stream', (remoteStream: any) => {
      this.streamRemoteCall(remoteStream);
    });
  }

  streamRemoteCall(remoteStream: any) {
    this.remoteVideo.nativeElement.srcObject = remoteStream;
    this.remoteVideo.nativeElement.play();
  }

  

  connectMedia(constraints: MediaStreamConstraints): void {
    this.localStream = new MediaStream();

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream: MediaStream) => {
        this.streamCall(stream);
      })
      .catch((error) => {
        console.error('Error accessing media device.', error);
      });
  }

  startCall() {
    const data = {
      sender_group: this.userData.id,
      sender: localStorage.getItem('user'),
      peer_id: this.peer_id,
      call: true,
      sender_name: this.userData.name,
    };

    setTimeout(() => {
      this.socket[this.userData.id].send(JSON.stringify(data));
    }, 1000);
  }

  toggleLocalVideo() {
    this.localStream
      .getTracks()
      .forEach(
        (track: { readyState: string; kind: string; enabled: boolean }) => {
          if (track.readyState === 'live' && track.kind === 'video') {
            track.enabled = !track.enabled;
          }
        }
      );
  }

  toggleLocalAudio() {
    this.localStream
      .getTracks()
      .forEach(
        (track: { readyState: string; kind: string; enabled: boolean }) => {
          if (track.readyState === 'live' && track.kind === 'audio') {
            track.enabled = !track.enabled;
          }
        }
      );
  }

  cancelCall() {
    const data = {
      receiver: this.userData.email,
      sender: localStorage.getItem('user'),
      peer_id: this.peer_id,
      end_call: true,
    };

    this.socket.send(JSON.stringify({ data }));

    this.endCall();
  }

  connectWebSocket() {
    this.userData.sockets.map((id: any) => {
      this.messageService.connectGroupChatSocket(parseInt(id));
    });
    this.socket = this.messageService.groupChatSocket;
    console.log(this.socket);
    this.socket[this.userData.id].onmessage = (event: { data: string }) => {
      const message = JSON.parse(event.data);
      switch (message.status) {
        case 'end_call':
          this.endCall();
          break;
      }
    };
  }

  endCall() {
    this.callingStatus = 'rejected';
    setTimeout(() => {
      localStorage.removeItem('call');
      window.close();
    }, 2000);
  }
}
