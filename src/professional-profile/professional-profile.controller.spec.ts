import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalProfileController } from './professional-profile.controller';
import { ProfessionalProfileService } from './professional-profile.service';

describe('ProfessionalProfileController', () => {
  let controller: ProfessionalProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalProfileController],
      providers: [ProfessionalProfileService],
    }).compile();

    controller = module.get<ProfessionalProfileController>(ProfessionalProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
