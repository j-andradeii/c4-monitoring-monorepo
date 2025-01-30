import { Test, TestingModule } from '@nestjs/testing';
import { ChurchController } from './church.controller';
import { ChurchService } from './church.service';

describe('ChurchController', () => {
  let churchController: ChurchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChurchController],
      providers: [ChurchService],
    }).compile();

    churchController = app.get<ChurchController>(ChurchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
    });
  });
});
