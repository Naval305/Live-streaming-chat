import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Peer from 'peerjs';
import { CallService } from 'src/app/services/call.service';
import { MessageService } from 'src/app/services/message.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.scss'],
})
export class SenderComponent implements OnInit {
  @ViewChild('local_video', { static: true }) localVideo!: ElementRef;
  @ViewChild('remote_video', { static: true }) remoteVideo!: ElementRef;

  socket: any;
  peer_id: string = '';
  peer: any = null;
  conn: any;
  call: any;
  localStream: any = null;
  callingStatus = 'calling';
  wsUrl: any = 'ws://127.0.0.1:8000';
  getUserMedia = new MediaStream();
  userData: any;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public userData: any,
    // private dialogRef: MatDialogRef<SenderComponent>,
    private callService: CallService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(this.route.snapshot['queryParams']['display']);
    // var item = window.location.search.split("=")[1] ||
    // this.displayUser = JSON.parse(window.location.search.split('=')[1]);
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

    // this.peer.on('connection', this.handleConnection.bind(this));
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
    // this.call.on('stream', this.streamRemoteCall.bind(this));
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
        // this.localStream = stream;
        // this.localVideo.nativeElement.srcObject = this.localStream;
        // this.localVideo.nativeElement.muted = true;
      })
      .catch((error) => {
        console.error('Error accessing media device.', error);
      });
  }

  startCall() {
    const data = {
      receiver: this.userData.email,
      sender: localStorage.getItem('user'),
      peer_id: this.peer_id,
    };
    console.log(this.userData);
    this.socket.send(
      JSON.stringify({
        data,
      })
    );
    // this.callService.startCall(data).subscribe(
    //   (response: any) => {
    //   },
    //   (error) => {
    //     console.error(error.response);
    //   }
    // );
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

    // this.callService.endCall(data).subscribe(
    //   (response) => {},
    //   (error) => {
    //     console.error(error);
    //   }
    // );
    this.endCall();
  }

  connectWebSocket() {
    this.socket = this.messageService.messageSocket;
    this.socket.onmessage = (event: { data: string }) => {
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
      //this.dialogRef.close();
    }, 2000);
  }
}
