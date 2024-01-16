import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Peer from 'peerjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-receiver-group',
  templateUrl: './receiver-group.component.html',
  styleUrls: ['./receiver-group.component.scss'],
})
export class ReceiverGroupComponent implements OnInit, OnDestroy {
  @ViewChild('local_video', { static: true }) localVideo!: ElementRef;
  @ViewChild('remote_video', { static: true }) remoteVideo!: ElementRef;
  @Output() clickCallback: EventEmitter<void> = new EventEmitter<void>();

  socket: any = null;
  peer: any = null;
  conn: any;
  call: any;
  localStream: any = null;
  remotePeerId: string = '';
  wsUrl: any = 'ws://127.0.0.1:8000';
  callingStatus = 'calling';
  micStashed = false;
  micIcon = 'fa-solid fa-microphone';
  videoStashed = false;
  videoIcon = 'fa-solid fa-video';
  userData: any;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(this.route.snapshot['queryParams']['display']);
    this.initializePeer();
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', () => this.endCall());
  }

  initializePeer(): void {
    this.peer = new Peer();
    this.peer.on('open', (id: string) => {
      this.remotePeerId = this.userData.peer_id;
      this.initializeWebSocket(this.remotePeerId);
      this.displayPeerId(id);
    });

    this.peer.on('connection', (conn: any) => {
      this.receiveData(conn);
    });
  }

  displayPeerId(id: string): void {
    this.remotePeerId = this.userData.peer_id;
  }

  receiveData(conn: any): void {
    conn.on('data', (data: any) => {});
  }

  answerCall(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        this.streamCall(stream);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  streamCall(stream: MediaStream): void {
    this.callingStatus = 'connected';
    this.localStream = stream;
    this.call = this.peer.call(this.userData.peer_id, stream);
    this.localVideo.nativeElement.srcObject = stream;
    this.localVideo.nativeElement.play();
    this.call.on('stream', (remoteStream: MediaStream) =>
      this.streamRemoteCall(remoteStream)
    );
  }

  streamRemoteCall(remoteStream: MediaStream): void {
    this.remoteVideo.nativeElement.srcObject = remoteStream;
    this.remoteVideo.nativeElement.play();
  }

  toggleLocalVideo(): void {
    if (!this.videoStashed) {
      this.videoIcon += '-slash';
    } else {
      this.videoIcon = 'fa-solid fa-video';
    }
    this.videoStashed = !this.videoStashed;

    this.localStream
      .getTracks()
      .forEach(
        (track: { readyState: string; kind: string; enabled: boolean }) => {
          if (track.readyState === 'live' && track.kind === 'video') {
            track.enabled = !track.enabled;
          }
        }
      );
    this.clickCallback.emit();
  }

  toggleLocalAudio(): void {
    if (!this.micStashed) {
      this.micIcon += '-slash';
    } else {
      this.micIcon = 'fa-solid fa-microphone';
    }
    this.micStashed = !this.micStashed;
    this.localStream
      .getTracks()
      .forEach(
        (track: { readyState: string; kind: string; enabled: boolean }) => {
          if (track.readyState === 'live' && track.kind === 'audio') {
            track.enabled = !track.enabled;
          }
        }
      );
    this.clickCallback.emit();
  }

  rejectCall(): void {
    const data = {
      receiver: this.userData.email,
      sender: localStorage.getItem('user'),
      end_call: true,
      peer_id: this.remotePeerId,
    };

    this.socket.send(JSON.stringify({ data }));
    this.endCall();
  }

  initializeWebSocket(peerId: string): void {
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

  endCall(): void {
    this.callingStatus = 'rejected';
    setTimeout(() => {
      localStorage.removeItem('call');
      window.close();
    }, 500);
  }
}
