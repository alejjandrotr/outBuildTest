import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ErrorActivityNotFound } from "../../errors/not-found.exception";
import { ActivityEntity } from "../../models/activity.entity";
import { GetActivityService } from "./get-activity.service";

jest.mock("../../../clients/PostgresDB/data-source.client");

describe("Get Activity Service", () => {
  let service: GetActivityService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
    };
    jest.spyOn(DBSource, "getRepository").mockReturnValueOnce(mockRepository);
    service = new GetActivityService();
  });

  it("must be defined", () => {
    expect(service).toBeDefined();
  });

  it("should retrieve an existing activity", async () => {
    const idOwner = 1;
    const idActivity = 1;
    const idSchedule = 1;

    // Mocking findOne to return an existing activity
    const existingActivity = new ActivityEntity();
    existingActivity.id = idActivity;
    existingActivity.idOwner = idOwner;

    jest.spyOn(mockRepository, "findOne").mockResolvedValue(existingActivity);

    const result = await service.getById(idOwner, idSchedule, idActivity);

    expect(DBSource.getRepository).toHaveBeenCalledWith(ActivityEntity);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: idActivity, idOwner },
    });
    expect(result).toEqual(existingActivity);
  });

  it("should throw an error if the activity does not exist", async () => {
    const idOwner = 1;
    const idActivity = 1;
    const idSchedule = 1;

    // Mocking findOne to return null (activity not found)
    jest.spyOn(mockRepository, "findOne").mockResolvedValue(null);

    await expect(service.getById(idOwner, idSchedule, idActivity)).rejects.toThrow(
      ErrorActivityNotFound
    );

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: idActivity, idOwner },
    });
  });
});