//mafia.controller.ts
// mafia.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('mafia')
export class MafiaController {
  @Get()
  getMafiaPage() {
    return 'This is the Mafia page.';
  }
}

/* 
import { Controller, Get } from '@nestjs/common';

@Controller('Mafia')
export class MafiaController{
    @Get()
    getMafiaPage(){
        const c = ['hello','secret'];
        const test = {
            master: '100',
            b: '200',
            c: c
        };
        return test;
    }
}
*/
//        return 'hello secret!';