import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriumsController } from './auditoriums.controller';

describe('AuditoriumsController', () => {
  let controller: AuditoriumsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditoriumsController],
    }).compile();

    controller = module.get<AuditoriumsController>(AuditoriumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
