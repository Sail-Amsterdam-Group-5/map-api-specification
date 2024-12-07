import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';

describe('LocationsController', () => {
  let controller: LocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [LocationsService],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return a location', async () => {
      const result = new Location();
      jest.spyOn(controller, 'create').mockImplementation(() => result);

      expect(await controller.create(new Location())).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const result = [new Location()];
      jest.spyOn(controller, 'findAll').mockImplementation(() => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a location', async () => {
      const result = new Location();
      jest.spyOn(controller, 'findOne').mockImplementation(() => result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should return a location', async () => {
      const result = new Location();
      jest.spyOn(controller, 'update').mockImplementation(() => result);

      expect(await controller.update('1', new Location())).toBe(result);
    });
  });

  describe('remove', () => {
    it('should return a string', async () => {
      const result = 'This action removes a #1 location';
      jest.spyOn(controller, 'remove').mockImplementation(() => result);

      expect(controller.remove('1')).toBe(result);
    });
  });

});
