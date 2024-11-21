import request from "supertest";
import { app } from "../src/index";
import { DBSourceTest as DBSource } from "../src/clients/PostgresDB/data-source.client";
import { UserEntity } from "../src/auth/models/user.entity";
import { ScheduleDto } from "../src/schedule/dtos/schedule.dto";

describe("End-to-End Tests", () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    await DBSource.initialize();
    await truncateTables();
  });

  afterAll(async () => {
    await truncateTables();
    await DBSource.destroy();
  });

  it("should register a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "testuser@example.com",
      password: "securepassword123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should log in the user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "securepassword123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    token = response.body.token;
  });

  it("should create a schedule for the logged-in user", async () => {
    const scheduleResponse = await request(app)
      .post("/api/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "My First Schedule",
        url: "image.png",
      });

    expect(scheduleResponse.status).toBe(201);
    expect(scheduleResponse.body).toHaveProperty("id"); // Assuming the response contains the schedule ID
  });

  it("should retrieve the logged-in user's schedules", async () => {
    const response = await request(app)
      .get("/api/schedule")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Expect an array of schedules
  });

  it("should not allow another user to access the first user's schedules", async () => {
    // Register and log in the first user
    const firstUserResponse = await request(app)
      .post("/api/auth/register")
      .send({
        email: "testuser@example.com",
        password: "securepassword123",
      });

    const firstUserLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "securepassword123",
      });

    const firstUserToken = firstUserLoginResponse.body.token;

    // Create a schedule for the first user
    await request(app)
      .post("/api/schedule")
      .set("Authorization", `Bearer ${firstUserToken}`)
      .send({
        name: "My First Schedule",
        url: "image.png",
      });

    // Register and log in another user
    const secondUserResponse = await request(app)
      .post("/api/auth/register")
      .send({
        email: "anotheruser@example.com",
        password: "anotherpassword123",
      });

    const secondUserLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "anotheruser@example.com",
        password: "anotherpassword123",
      });

    const secondUserToken = secondUserLoginResponse.body.token;

    // Attempt to retrieve the first user's schedules with the second user's token
    const response = await request(app)
      .get("/api/schedule")
      .set("Authorization", `Bearer ${secondUserToken}`);

    expect(response.status).toBe(200); // Expect successful retrieval of schedules

    // Check that no activities belong to the first user (idOwner should not be the first user's ID)
    const schedules = response.body; // Assuming this returns an array of schedules
    schedules.forEach((schedule: any) => {
      expect(schedule.idOwner).not.toBe(firstUserLoginResponse.body.id); // Ensure idOwner is not equal to the first user's ID
    });
  });

  const truncateTables = async () => {
    const queryRunner = DBSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;"); // Ajusta los nombres según tus tablas
      await queryRunner.query(
        "TRUNCATE TABLE schedule RESTART IDENTITY CASCADE;"
      );
      await queryRunner.query(
        "TRUNCATE TABLE activity RESTART IDENTITY CASCADE;"
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };
});
