import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ActivityDto } from "../../dtos/activity.dto";
import { ActivityEntity } from "../../models/activity.entity";
import { UpdateActivityService } from "./update-activity.service";
import { mockActivity } from "../../mocks/mock-activity";
import { ErrorActivityNotFound } from "../../errors/not-found.exception";

jest.mock("../../../clients/PostgresDB/data-source.client");

describe("Update Activity Service", () => {
  let service: UpdateActivityService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn().mockResolvedValue(mockActivity()),
    };
    jest.spyOn(DBSource, "getRepository").mockReturnValueOnce(mockRepository);
    service = new UpdateActivityService();
  });

  it("must be defined", () => {
    expect(service).toBeDefined();
  });

  it("must update an activity", async () => {
    const activityDto: ActivityDto = mockActivity();
    const idOwner = 1;
    const idActivity = 1;
    const idSchedule = 1;

    const existingActivity = new ActivityEntity();
    existingActivity.id = idActivity;
    existingActivity.idOwner = idOwner;

    jest.spyOn(mockRepository, "findOne").mockResolvedValue(mockActivity());
    jest
      .spyOn(mockRepository, "save")
      .mockResolvedValue({ ...existingActivity, ...activityDto });

    const result = await service.update(idOwner, idActivity, idSchedule, activityDto);

    expect(DBSource.getRepository).toHaveBeenCalledWith(ActivityEntity);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: idActivity, idOwner },
    });
    expect(result).toEqual({ ...existingActivity, ...activityDto });
  });

  it("should throw an error if the activity does not exist", async () => {
    const idOwner = 1;
    const idActivity = 1;
    const idSchedule = 1;

    jest.spyOn(mockRepository, "findOne").mockResolvedValue(null);

    await expect(
      service.update(idOwner, idActivity, idSchedule, mockActivity())
    ).rejects.toThrow(ErrorActivityNotFound);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: idActivity, idOwner },
    });
  });

  it("should handle errors during save", async () => {
    const activityDto: ActivityDto = mockActivity();
    const idOwner = 1;
    const idActivity = 1;
    const idSchedule = 1;

    const existingActivity = new ActivityEntity();
    existingActivity.id = idActivity;
    existingActivity.idOwner = idOwner;

    jest.spyOn(mockRepository, "findOne").mockResolvedValue(existingActivity);

    // Mocking save to throw an error
    jest
      .spyOn(mockRepository, "save")
      .mockRejectedValue(new Error("Database error"));

    await expect(
      service.update(idOwner, idActivity, idSchedule, activityDto)
    ).rejects.toThrow("Database error");
  });
});
