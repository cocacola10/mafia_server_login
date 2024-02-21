import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ transports: ['websocket'] })
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  // 방 번호에 따른 클라이언트를 관리하는 오브젝트
  private static clients: { [roomId: number]: Socket[] } = {};

  // lobby number
  readonly lobby: number = 0;

  // 방 개수 관리용 변수
  private static roomCount = 0;

  @WebSocketServer()
  server: Server;

  // 재정의한 메서드들
  afterInit(server: Server) {
    console.log('Server Start');
  }

  handleDisconnect(client: Socket) {
    console.log('disconnect : ',client.id);
    // 모든 roomid에 대해 클라이언트를 찾아서 삭제
    for (const roomId in EventsGateway.clients) {
      const index = EventsGateway.clients[roomId].indexOf(client);
      if (index !== -1) {
        // 해당 roomid의 배열에서 클라이언트 삭제
        EventsGateway.clients[roomId].splice(index, 1);
        // 만약 해당 roomid의 배열이 빈 배열이라면 해당 roomid를 삭제
        if (EventsGateway.clients[roomId].length === 0) {
          delete EventsGateway.clients[roomId];
          // 클라이언트 리로드를 브로드캐스트
          // roomId가 0인 socket들에게 broadcast
          
          this.server.emit('reloadRoom', roomId, "delete");
        } 
      }
    }
  }

  // default lobby = 0
  handleConnection(client: Socket) {
    console.log('connect : ',client.id);
    if (!EventsGateway.clients[this.lobby]) {
      // 만약 해당 roomid의 배열이 없다면 새로 생성
      EventsGateway.clients[this.lobby] = [];
    }
    EventsGateway.clients[this.lobby].push(client);
  }

  // 클라이언트에서 'message' 이벤트를 수신할 때 실행되는 핸들러
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string) {
    // 받은 메시지를 로그에 출력
    console.log('Received message:', data);
    // 받은 메시지를 모든 클라이언트에게 브로드캐스팅
    this.server.emit('message', data);
  }

  // 클라이언트에서 'createRoom' 이벤트를 수신할 때 실행되는 핸들러
  @SubscribeMessage('createRoom')
  handleCreateRoom(client: Socket) {
    EventsGateway.roomCount++;
    const num = EventsGateway.roomCount;
    EventsGateway.clients[num] = [];
    EventsGateway.clients[num].push(client);
    
    client.emit('changeRoom', num);
    // 클라이언트 리로드를 브로드캐스트
    this.server.emit('reloadRoom', num, "insert", client.id);
  }

  // 클라이언트에서 'quitroom' 이벤트를 수신할 때 실행되는 핸들러
  @SubscribeMessage('quitRoom')
  handleQuitRoom(client: Socket, room: number) {
    const roomClients = EventsGateway.clients[room];
    if (roomClients){
      const index = roomClients.indexOf(client);

      if (index !== -1) {
        roomClients.splice(index, 1);
        EventsGateway.clients[this.lobby].push(client);

        // 만약 해당 방에 더 이상 클라이언트가 없다면 배열에서 해당 방 번호 삭제
        if (roomClients.length == 0 || roomClients[room][0] == client.id) {
          // 클라이언트 리로드를 브로드캐스트
          this.server.emit('reloadRoom', room, "delete");
          
          // 클라이언트 강제 퇴장을 해당 방 인원들에게 멀티캐스트
          for (const socket of roomClients){
            socket.emit('changeRoom', this.lobby);
            console.log("몇명?");
          }

          delete EventsGateway.clients[room];
        }
      }
    }
  }

  // client room join
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: number){
    const roomClients = EventsGateway.clients[room];

    if (roomClients.length>0 && roomClients.length<8){
      // client room join
      client.emit('SuccessJoinRoom', room);
      // lobby clients reload
      return 0;
    }
    else{
      // Fail
    }
  }
}