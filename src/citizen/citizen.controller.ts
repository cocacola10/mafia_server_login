// citizen.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('citizen')
export class CitizenController {
  @Get()
  getCitizenPage() {
    return 'This is the Citizen page.';
  }
}
