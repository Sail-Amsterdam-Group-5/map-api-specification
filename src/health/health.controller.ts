import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor() {}

  // Add a health check endpoint
  @Get()
  getHealth() {
    return 'OK';
  }
}
