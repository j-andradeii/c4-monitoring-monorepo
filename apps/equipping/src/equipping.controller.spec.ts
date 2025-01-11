import { Test, TestingModule } from '@nestjs/testing';
import { EquippingController } from './equipping.controller';
import { EquippingService } from './equipping.service';

describe('EquippingController', () => {
  let equippingController: EquippingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EquippingController],
      providers: [EquippingService],
    }).compile();

    equippingController = app.get<EquippingController>(EquippingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(equippingController.getHello()).toBe('Hello World!');
    });
  });
});
