import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilitiesModule } from './utilities/utilities.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [UtilitiesModule, LocationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
