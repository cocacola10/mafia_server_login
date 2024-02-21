// game.service.ts
import { Injectable } from '@nestjs/common';
import { Player, Role } from 'src/player.model';

@Injectable()
export class GameService {
  [x: string]: any;
  private players: Player[] = [];
  private isDay: boolean = true;
  private votedPlayer: Player = null;
  private readonly totalPlayers: number = 8; // 고정된 플레이어 수
  private currentPhaseIndex = 0;
  private readonly gamePhases = ['morning', 'day', 'night', 'dawn'];
  private phaseDurations = {
    morning: 2 * 60, // 2분
    day: 2 * 60, // 2분
    night: 2 * 60, // 2분
    dawn: 2 * 60 // 2분
  }
  private phaseTimeout: NodeJS.Timeout;

  startGame(playerNames: string[]): void {
    if(playerNames.length < this.totalPlayers){
        console.log("플레이어 수가 부족하여 게임을 시작할 수 없습니다.");
        return;
    }

    // 게임 시작 시 초기화 및 플레이어 설정
    this.players = [];
    const mafiaCount = Math.floor(this.totalPlayers / 4);  //마피아는 총 플레이어 수의 25%
    const citizenCount = this.totalPlayers - mafiaCount;

    //마피아 플레이어 추가
    for(let i = 0; i < mafiaCount; i++){
        this.players.push(new Player(`mafia${i+1}`, Role.Mafia));
    }

    //시민 플레이어 추가
    for(let i = 0; i < citizenCount; i++)
    {
        this.players.push(new Player(`Citizen${i+1}`, Role.Citizen));
    }

    //플레이어 순서 섞기
    this.shufflePlayers();
    
    // 게임 시작 후 첫 번째 단계 실행
    this.nextPhase();
  }

  toggleDayNight(): void {
    // 낮과 밤을 토글
    this.isDay = !this.isDay;
  }

  get isDayTime(): boolean {
    // 현재 낮 시간 여부 반환
    return this.isDay;
  }

  killPlayer(playerName: string): void {
    // 플레이어 제거
    const targetIndex = this.players.findIndex(player => player.name === playerName);
    if (targetIndex !== -1) {
      this.players[targetIndex].isAlive = false; // 플레이어 상태를 사망으로 변경
    }
  }

  votePlayer(playerName: string): void {
    // 투표된 플레이어 설정
    this.votedPlayer = this.players.find(player => player.name === playerName);
  }

  get votedPlayerName(): string {
    // 투표된 플레이어 이름 반환
    return this.votedPlayer ? this.votedPlayer.name : '';
  }

  getResult(): Role {
    // 게임 결과 반환
    const mafiaPlayers = this.players.filter(player => player.role === Role.Mafia && player.isAlive).length;
    const citizenPlayers = this.players.filter(player => player.role === Role.Citizen && player.isAlive).length;

    if (mafiaPlayers === 0) {
      return Role.Citizen; // 시민 승리
    } else if (mafiaPlayers >= citizenPlayers) {
      return Role.Mafia; // 마피아 승리
    } else {
      return null; // 게임 진행 중
    }
  }

  private shufflePlayers(): void {
    // 플레이어 순서 섞기
    for (let i = this.players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
    }
  }

  private nextPhase(): void {
    const currentPhase = this.gamePhases[this.currentPhaseIndex];
    const duration = this.phaseDurations[currentPhase];
    
    // 현재 단계의 시간이 종료되면 다음 단계로 이동
    this.phaseTimeout = setTimeout(() => {
      this.currentPhaseIndex = (this.currentPhaseIndex + 1) % this.gamePhases.length;
      this.nextPhase();
      
      // 각 단계 종료 후 처리 로직 수행
      switch (currentPhase) {
        case 'morning':
          this.handleMorningPhase();
          break;
        case 'day':
          this.handleDayPhase();
          break;
        case 'night':
          this.handleNightPhase();
          break;
        case 'dawn':
          this.handleDawnPhase();
          break;
      }
    }, duration * 1000); // 밀리초 단위로 설정해야 함
  }

  private handleMorningPhase(): void {
    // 아침 시작을 알리는 메시지 표시
    console.log("아침이 밝았습니다.");

    // 유저 목록 및 직업 현황판 업데이트
    // 이 부분은 서비스 메시지로 클라이언트에 전달하거나, 웹소켓을 사용하여 실시간 업데이트 가능

    // 게임 시작 메시지 표시
    console.log("게임이 시작되었습니다.");
  }

  private handleDayPhase(): void {
    // 낮 시작을 알리는 메시지 표시
    console.log("낮이 되었습니다.");

    // 투표 기간 시작
    // 이 부분은 클라이언트에게 투표 시작 메시지를 보내거나, 웹소켓을 사용하여 투표 진행 가능
  }

  private handleNightPhase(): void {
    // 밤 시작을 알리는 메시지 표시
    console.log("밤이 되었습니다.");
  }



}
