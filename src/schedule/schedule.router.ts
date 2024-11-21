import { Response, Router } from "express";
import { isAuthenticateJWT } from "../auth/auth.middware";
import { UnathorizedErrorResponse } from "../auth/errors/UnathorizedErrorResponse";
import { createErrorResponse } from "../common/errors/createErrorResponse";
import { logger } from "../common/logger/logger";
import { finderScheduleService } from "./services/find/find-schedule.service";
import { RequestWithAuth } from "../auth/request-auth";
import { validateDto } from "./middleware/schedule-validator.middleware";
import { ScheduleDto } from "./dtos/schedule.dto";
import { createScheduleService } from "./services/create/create-schedule.service";
import { updateScheduleService } from "./services/update/update-schedule.service";
import { deleteScheduleService } from "./services/delete/delete-schedule.service";

const router = Router();

router.use(isAuthenticateJWT);
router.use(UnathorizedErrorResponse);

/**
 * tags:
 *   name: Schedule
 *   description: The Schedule managing API
 * @swagger
 * /schedule:
 *   get:
 *     summary: Get all schedules for the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     tags: [Schedule]
 *     responses:
 *       200:
 *         description: A list of schedules.
 *       500:
 *         description: Internal server error.
 */
router.get("/", async (req: RequestWithAuth, res: Response) => {
  try {
    const userId = req.auth?.id || -1;
    const response = await finderScheduleService.findAllUserSchedule(userId);
    res.status(200).send(response);
  } catch (error) {
    logger.error("Error retrieving schedules", error);
    const errorResponse = createErrorResponse(error);
    res.status(500).send(errorResponse);
  }
});

/**
 * @swagger
 * /schedule/{id}:
 *   get:
 *     summary: Get a specific schedule by ID with paginated activities.
 *     security:
 *       - BearerAuth: []
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the schedule.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number for pagination.
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         required: false
 *         description: The number of items per page.
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successful response with schedule details and activities.
 *       400:
 *         description: Invalid ID or pagination parameters provided.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", async (req: RequestWithAuth, res: Response) => {
  try {
    const idParam = req.params.id;
    const id = parseInt(idParam, 10);
    const userId = req.auth?.id || -1;

    if (isNaN(id) || id <= 0) {
      res
        .status(400)
        .send({ message: "Invalid ID. It must be a positive number." });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const paginateDto = { page, pageSize };

    const response = await finderScheduleService.findOneWithActivities(
      userId,
      id,
      paginateDto
    );

    res.status(200).send(response);
  } catch (error) {
    logger.error("Error retrieving schedule", error);
    const errorResponse = createErrorResponse(error);
    res.status(500).send(errorResponse);
  }
});

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Create a new schedule.
 *     security:
 *       - BearerAuth: []
 *     tags: [Schedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateScheduleDto'
 *     responses:
 *       201:
 *         description: Schedule created successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post(
  "/",
  validateDto(ScheduleDto),
  async (req: RequestWithAuth, res: Response) => {
    try {
      const userId = req.auth?.id || -1;
      const response = await createScheduleService.create(userId, req.body);
      res.status(201).send(response); // Created response
    } catch (error) {
      logger.error("Error creating schedule", error);
      const errorResponse = createErrorResponse(error);
      res.status(500).send(errorResponse);
    }
  }
);

/**
 * @swagger
 * /schedule/{id}:
 *   put:
 *     summary: Update an existing schedule by ID.
 *     security:
 *       - BearerAuth: []
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the schedule to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateScheduleDto'
 *     responses:
 *       200:
 *         description: Schedule updated successfully.
 *       400:
 *         description: Invalid ID provided or input data.
 *       500:
 *         description: Internal server error.
 */
router.put(
  "/:id",
  validateDto(ScheduleDto),
  async (req: RequestWithAuth, res: Response) => {
    try {
      const idParam = req.params.id;
      const id = parseInt(idParam, 10);
      const userId = req.auth?.id || -1;

      if (isNaN(id) || id <= 0) {
        res
          .status(400)
          .send({ message: "Invalid ID. It must be a positive number." });
        return;
      }

      const updatedSchedule = await updateScheduleService.update(
        userId,
        id,
        req.body
      );
      res.status(200).send(updatedSchedule);
    } catch (error) {
      logger.error("Error updating schedule", error);
      const errorResponse = createErrorResponse(error);
      res.status(500).send(errorResponse);
    }
  }
);

/**
 * @swagger
 * /schedule/{id}:
 *   delete:
 *     summary: Delete a schedule by ID.
 *     security:
 *       - BearerAuth: []
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the schedule to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Schedule deleted successfully.
 *       400:
 *         description: Invalid ID provided.
 */
router.delete("/:id", async (req: RequestWithAuth, res: Response) => {
  try {
    const idParam = req.params.id;
    const id = parseInt(idParam, 10);
    const userId = req.auth?.id || -1;

    if (isNaN(id) || id <= 0) {
      res
        .status(400)
        .send({ message: "Invalid ID. It must be a positive number." });
      return;
    }

    await deleteScheduleService.delete(userId, id);
  } catch (error) {
    logger.error("Error deleting schedule", error);
    const errorResponse = createErrorResponse(error);
    res.status(500).send(errorResponse);
  }
});

export default router;
