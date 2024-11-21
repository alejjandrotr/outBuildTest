import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ErrorActivityNotFound } from "../../errors/not-found.exception";
import { ActivityEntity } from "../../models/activity.entity";
import { DeleteActivityService } from "./delete-activity.service";

jest.mock("../../../clients/PostgresDB/data-source.client");

describe("Delete Activity Service", () => {
  let service: DeleteActivityService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      remove: jest.fn(),
    };
    jest.spyOn(DBSource, "getRepository").mockReturnValueOnce(mockRepository);
    service = new DeleteActivityService();
  });

  it("must be defined", () => {
    expect(service).toBeDefined();
  });

  it("should delete an existing activity associated with a schedule", async () => {
    const idOwner = 1;
    const idSchedule = 1;
    const idActivity = 1;

    // Mocking findOne to return an existing activity
    const existingActivity = new ActivityEntity();
    existingActivity.id = idActivity;
    existingActivity.idOwner = idOwner;

    jest.spyOn(mockRepository, "findOne").mockResolvedValue(existingActivity);

    await service.delete(idOwner, idSchedule, idActivity);

    expect(DBSource.getRepository).toHaveBeenCalledWith(ActivityEntity);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: idActivity, idOwner, schedule: { id: idSchedule } },
    });
    expect(mockRepository.remove).toHaveBeenCalledWith(existingActivity);
  });

  it("should throw an error if the activity does not exist", async () => {
    const idOwner = 1;
    const idSchedule = 1;
    const idActivity = 1;

    // Mocking findOne to return null (activity not found)
    jest.spyOn(mockRepository, "findOne").mockResolvedValue(null);

    await expect(
      service.delete(idOwner, idSchedule, idActivity)
    ).rejects.toThrow(ErrorActivityNotFound);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: idActivity, idOwner, schedule: { id: idSchedule } },
    });
  });
});
