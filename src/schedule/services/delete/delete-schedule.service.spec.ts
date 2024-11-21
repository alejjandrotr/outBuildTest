import { DeleteScheduleService } from "./delete-schedule.service";
import { ScheduleEntity } from "../../models/schedule.entity";
import { Repository } from "typeorm";
import { ErrorScheduleNotFound } from "../../errors/not-found.exception";
import { mockScheduleEntity } from "../../mocks/mock-schedule"; // Ensure you have a mock available
import { DBSource } from "../../../clients/PostgresDB/data-source.client";
import { ActivityEntity } from "../../../activity/models/activity.entity";

jest.mock("../../../clients/PostgresDB/data-source.client");

describe("DeleteScheduleService", () => {
  let deleteScheduleService: DeleteScheduleService;
  let mockRepository: any;
  let mockActivityRepository: any; // Mock for activity repository

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    mockActivityRepository = {
      remove: jest.fn(),
    };

    jest.spyOn(DBSource, "getRepository").mockImplementation((entity) => {
      if (entity === ScheduleEntity) return mockRepository;
      if (entity === ActivityEntity) return mockActivityRepository;
    });

    deleteScheduleService = new DeleteScheduleService();
    jest.clearAllMocks();
  });

  it("should delete an existing schedule and its associated activities", async () => {
    const idOwner = 1;
    const id = 1;

    const existingSchedule = mockScheduleEntity(); 
    existingSchedule.activities = [new ActivityEntity(), new ActivityEntity()]; 
    jest.spyOn(mockRepository, "findOne").mockResolvedValue(existingSchedule);

    await deleteScheduleService.delete(idOwner, id);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id, idOwner },
      relations: ["activities"],
    });
    expect(mockActivityRepository.remove).toHaveBeenCalledWith(
      existingSchedule.activities
    );
    expect(mockRepository.remove).toHaveBeenCalledWith(existingSchedule);
  });

  it("should throw an error if the schedule does not exist", async () => {
    const idOwner = 1;
    const id = 1;

    jest.spyOn(mockRepository, "findOne").mockResolvedValue(null);

    await expect(deleteScheduleService.delete(idOwner, id)).rejects.toThrow(
      ErrorScheduleNotFound
    );

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id, idOwner },
      relations: ["activities"],
    });
  });
});
