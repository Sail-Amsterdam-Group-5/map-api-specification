import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { LocationsProfile } from '../profiles/locations.profile';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { User } from '@azure/cosmos';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService, LocationsProfile],
  imports: [
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
  ],
})
export class LocationsModule {}
