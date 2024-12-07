import { Module } from '@nestjs/common';
import { UtilitiesModule } from './utilities/utilities.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [UtilitiesModule, LocationsModule]
})
export class AppModule {}
