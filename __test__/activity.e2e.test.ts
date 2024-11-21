import request from "supertest";
import { app } from "../src/index"; 
import { DBSource } from "../src/clients/PostgresDB/data-source.client";
import { UserEntity } from "../src/auth/models/user.entity";
import { ScheduleDto } from "../src/schedule/dtos/schedule.dto";
import { ActivityDto } from "../src/activity/dtos/activity.dto";

describe("End-to-End Tests for Schedules and Activities", () => {
  let token: string;
  let userId: number;
  let scheduleId: number;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await DBSource.initialize();
    await truncateTables();
  }, 20000);

  afterAll(async () => {
    await truncateTables();
    await DBSource.destroy();
  }, 20000);

  const truncateTables = async () => {
    const queryRunner = DBSource.createQueryRunner();

    await queryRunner.connect(); 
    await queryRunner.startTransaction(); 

    try {
      await queryRunner.query(
        "TRUNCATE TABLE activity RESTART IDENTITY CASCADE;"
      );
      await queryRunner.query(
        "TRUNCATE TABLE schedule RESTART IDENTITY CASCADE;"
      );
      await queryRunner.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
      await queryRunner.commitTransaction(); 
    } catch (error) {
      await queryRunner.rollbackTransaction(); 
      throw error;
    } finally {
      await queryRunner.release(); 
    }
  };

  it("should register a new user and log in", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        email: "testuser@example.com",
        password: "securepassword123",
      });

    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "securepassword123",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty("token");

    token = loginResponse.body.token;
  });

  it("should create a schedule", async () => {
    const scheduleResponse = await request(app)
      .post("/api/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "My Test Schedule",
        url: "http://example.com",
      });

    expect(scheduleResponse.status).toBe(201);
    scheduleId = scheduleResponse.body.id; 
  });

  it("should create multiple activities for the schedule", async () => {
    const activities = Array.from({ length: 5 }, (_, index) => ({
      name: `Activity ${index + 1}`,
      startDate: `2023-01-01T00:00:00Z`,
      endDate: `2023-01-02T00:00:00Z`,
    }));

    const response = await request(app)
      .post(`/api/schedule/${scheduleId}/activities`)
      .set("Authorization", `Bearer ${token}`)
      .send(activities);

    expect(response.status).toBe(201);
    expect(response.body.length).toBe(500);
  });

  it("should retrieve activities with pagination", async () => {
    const response = await request(app)
      .get(`/api/schedule/${scheduleId}/activity?page=1&pageSize=10`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.activities.length).toBe(10); 
    expect(response.body.meta.totalItems).toBe(500);
    expect(response.body.meta.totalPages).toBe(Math.ceil(500 / 10)); 
  });
});
