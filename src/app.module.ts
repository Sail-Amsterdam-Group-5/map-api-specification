import { Module } from '@nestjs/common';
import { UtilitiesModule } from './utilities/utilities.module';
import { LocationsModule } from './locations/locations.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [UtilitiesModule, LocationsModule, PrometheusModule.register()]
})
export class AppModule {}
