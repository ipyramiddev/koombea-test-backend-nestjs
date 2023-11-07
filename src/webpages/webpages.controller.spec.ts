import { Test, TestingModule } from '@nestjs/testing';
import { WebpagesController } from './webpages.controller';

describe('WebpagesController', () => {
  let controller: WebpagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebpagesController],
    }).compile();

    controller = module.get<WebpagesController>(WebpagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
