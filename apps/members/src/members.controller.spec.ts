import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { GetMemberByAuthIdQuery } from './cqrs/queries/get-member-by-auth-id.query';

describe('MembersController', () => {
  let membersController: MembersController;
  const commandBus = { execute: jest.fn() };
  const queryBus = { execute: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        MembersService,
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    membersController = app.get<MembersController>(MembersController);
  });

  it('should be defined', () => {
    expect(membersController).toBeDefined();
  });

  it('queries a member by auth id and returns the result', async () => {
    const member = { id: 'member-1' };
    queryBus.execute.mockResolvedValue(member);

    const result = await membersController.getMemberByAuthId({ auth_id: 'auth-1' });

    expect(result).toBe(member);
    const query = queryBus.execute.mock.calls[0][0];
    expect(query).toBeInstanceOf(GetMemberByAuthIdQuery);
    expect(query.auth_id).toBe('auth-1');
  });

  it('propagates query errors to the caller', async () => {
    queryBus.execute.mockRejectedValue(new Error('not found'));

    await expect(membersController.getMemberByAuthId({ auth_id: 'missing' })).rejects.toThrow('not found');
  });
});
