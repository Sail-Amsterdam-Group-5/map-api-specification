import { Module } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { UtilitiesController } from './utilities.controller';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { UtilitiesProfile } from '../profiles/utilities.profile';
import { LocationsService } from '../locations/locations.service';
import { PromModule } from '../prom/prom.module';

@Module({
  controllers: [UtilitiesController],
  providers: [UtilitiesService, UtilitiesProfile, LocationsService],
  imports: [
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    PromModule,
  ],
})
export class UtilitiesModule {}
