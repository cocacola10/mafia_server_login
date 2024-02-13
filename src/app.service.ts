import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '접속에 성공하셨습니다!';
  }
}
//return 'Hello, World!';
