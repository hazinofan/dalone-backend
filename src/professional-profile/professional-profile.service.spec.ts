import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalProfileService } from './professional-profile.service';

describe('ProfessionalProfileService', () => {
  let service: ProfessionalProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessionalProfileService],
    }).compile();

    service = module.get<ProfessionalProfileService>(ProfessionalProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
