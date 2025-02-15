import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            // Mock PrismaService functions
            subscriber: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue(null),
              update: jest.fn(),
              delete: jest.fn(),
            },
            botSettings: {
              findFirst: jest.fn(),
              update: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch subscribers', async () => {
    await service.subscriber.findMany();
    expect(service.subscriber.findMany).toHaveBeenCalled();
  });

  it('should return null for non-existing user', async () => {
    const user = await service.subscriber.findUnique({
      where: { chatId: BigInt(123) },
    });
    expect(user).toBeNull();
  });
});
