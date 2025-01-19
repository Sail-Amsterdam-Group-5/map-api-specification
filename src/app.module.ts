import { Module } from '@nestjs/common';
import { UtilitiesModule } from './utilities/utilities.module';
import { LocationsModule } from './locations/locations.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UtilitiesModule, LocationsModule, PrometheusModule.register(), ConfigModule.forRoot({
    isGlobal: true,
  })],
})
export class AppModule {}
