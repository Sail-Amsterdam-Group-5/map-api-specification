import { Test, TestingModule } from '@nestjs/testing';
import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';
import { Utility } from './entities/utility.entity';
import { CreateUtilityDto } from './dto/create-utility.dto';

describe('UtilitiesController', () => {
  let controller: UtilitiesController;
  let service: UtilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilitiesController],
      providers: [UtilitiesService],
    }).compile();

    controller = module.get<UtilitiesController>(UtilitiesController);
    service = module.get<UtilitiesService>(UtilitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return a utility', async () => {
      const result = new Utility();
      jest.spyOn(service, 'create').mockImplementation(() => result);

      expect(await controller.create(new CreateUtilityDto())).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of utilities', async () => {
      const result = [new Utility()];
      jest.spyOn(service, 'findAll').mockImplementation(() => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a utility', async () => {
      const result = new Utility();
      jest.spyOn(service, 'findOne').mockImplementation(() => result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should return a utility', async () => {
      const result = new Utility();
      jest.spyOn(service, 'update').mockImplementation(() => result);

      expect(await controller.update('1', new Utility())).toBe(result);
    });
  });

  describe('remove', () => {
    it('should return a string', async () => {
      const result = undefined;
      jest.spyOn(service, 'remove').mockImplementation(() => result);

      expect(controller.remove('1')).toBe(result);
    });
  });
});
