import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ActivityDto } from "../../dtos/activity.dto";
import { ActivityEntity } from "../../models/activity.entity";
import { CreateActivityService } from "./create-activity.service";
import { mockActivity } from "../../mocks/mock-activity";
import {
  mockScheduleEntity,
} from "../../../schedule/mocks/mock-schedule";

jest.mock("../../../clients/PostgresDB/data-source.client");
describe("Create a Schedule", () => {
  let service: CreateActivityService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn().mockResolvedValue(mockActivity()),
      create: jest.fn().mockResolvedValue(new ActivityEntity()),
    };
    jest.spyOn(DBSource, "getRepository").mockReturnValueOnce(mockRepository);
    jest
      .spyOn(DBSource.manager, "transaction")
      .mockReturnValue(Promise.resolve([mockActivity()]));
    service = new CreateActivityService();
    jest
      .spyOn(service.finderSchedule, "findOneBy")
      .mockResolvedValue(Promise.resolve(mockScheduleEntity()));
  });

  it("must be defined", () => {
    expect(service).toBeDefined();
  });

  it("must create an activity", async () => {
    const activityDto: ActivityDto = mockActivity();
    const result = await service.create(1, 1, activityDto);
    expect(DBSource.getRepository).toHaveBeenCalledWith(ActivityEntity);
    expect(result).toEqual(mockActivity());
  });

  it("must create severals activity", async () => {
    jest
      .spyOn(DBSource.manager, "transaction")
      .mockReturnValue(
        Promise.resolve([mockActivity(), mockActivity(), mockActivity()])
      );
    const activityDto: ActivityDto[] = [
      mockActivity(),
      mockActivity(),
      mockActivity(),
    ];
    const result = await service.createMany(1, 1, activityDto);
    expect(DBSource.getRepository).toHaveBeenCalledWith(ActivityEntity);
    expect(result).toEqual([mockActivity(), mockActivity(), mockActivity()]);
  });

  it("should handle errors", async () => {
    const activityDto: ActivityDto = mockActivity();
    jest
      .spyOn(DBSource.manager, "transaction")
      .mockRejectedValueOnce(new Error("Database error"));

    await expect(service.create(1, 1, activityDto)).rejects.toThrow(
      "Database error"
    );
  });
});
