import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt'; // JwtService import 추가
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module'; 
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'username',
      password: 'password',
      database: 'database_name',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    JwtModule.register({
      // JwtModule 설정
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService, // JwtService를 providers에 추가
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
