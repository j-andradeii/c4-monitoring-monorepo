import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ChurchController } from './church.controller';
import { ChurchService } from './church.service';
import { CreateChurchCommand } from './cqrs/commands/create-church-command';
import { GetChurchCampusStaffByMemberId } from './cqrs/queries/get-church-campus-staff-by-member-id.query';

describe('ChurchController', () => {
  let churchController: ChurchController;
  const commandBus = { execute: jest.fn() };
  const queryBus = { execute: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChurchController],
      providers: [
        ChurchService,
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    churchController = app.get<ChurchController>(ChurchController);
  });

  it('should be defined', () => {
    expect(churchController).toBeDefined();
  });

  it('dispatches CreateChurchCommand with the incoming payload', async () => {
    const payload = { name: 'Test Church' };

    await churchController.authenticate(payload);

    expect(commandBus.execute).toHaveBeenCalledTimes(1);
    const command = commandBus.execute.mock.calls[0][0];
    expect(command).toBeInstanceOf(CreateChurchCommand);
    expect(command.churchCreationDto).toEqual(payload);
  });

  it('queries campus staff by member id and returns the result', async () => {
    const staff = { id: 'staff-1' };
    queryBus.execute.mockResolvedValue(staff);

    const result = await churchController.getChurchCampusStaffByMemberId({ member_id: 'member-1' });

    expect(result).toBe(staff);
    const query = queryBus.execute.mock.calls[0][0];
    expect(query).toBeInstanceOf(GetChurchCampusStaffByMemberId);
    expect(query.member_id).toBe('member-1');
  });
});
