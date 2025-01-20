import { Module } from '@nestjs/common';
import { UtilitiesModule } from './utilities/utilities.module';
import { LocationsModule } from './locations/locations.module';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { PromModule } from './prom/prom.module';

@Module({
  imports: [
    UtilitiesModule,
    LocationsModule,
    PromModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
