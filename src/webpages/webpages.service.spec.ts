import { Test, TestingModule } from '@nestjs/testing';
import { WebpagesService } from './webpages.service';

describe('WebpagesService', () => {
  let service: WebpagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebpagesService],
    }).compile();

    service = module.get<WebpagesService>(WebpagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
