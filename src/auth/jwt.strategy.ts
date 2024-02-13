// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // 여기에 사용하는 secret key를 입력해야 합니다.
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}


/*
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { JwtStrategy } from './auth/jwt.strategy'; // 예시: JwtStrategy가 정의된 파일의 경로

@Module({
  imports: [
    JwtModule.register({
      // JwtModule 설정
    }),
    // 다른 모듈 import
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, JwtStrategy], // JwtStrategy를 providers에 추가
})
export class AppModule {}
export { JwtStrategy };

*/

