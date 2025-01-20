import { Test, TestingModule } from '@nestjs/testing';
import { UtilitiesService } from './utilities.service';
import { LocationsService } from '../locations/locations.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ConfigModule } from '@nestjs/config';

describe('UtilitiesService', () => {
  let service: UtilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilitiesService, LocationsService],
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        ConfigModule.forRoot({ isGlobal: true }),
      ],
    }).compile();

    service = module.get<UtilitiesService>(UtilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
