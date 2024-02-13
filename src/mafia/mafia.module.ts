// mafia.module.ts
import { Module } from '@nestjs/common';
import { MafiaController } from './mafia.controller';

@Module({
  controllers: [MafiaController],
})
export class MafiaModule {}


/* 
import { Module } from '@nestjs/common';

@Module({})
export class MafiaModule {}
*/