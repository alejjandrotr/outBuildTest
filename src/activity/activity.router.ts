import { Response, Router } from "express";
import { isAuthenticateJWT } from "../auth/auth.middware";
import { UnathorizedErrorResponse } from "../auth/errors/UnathorizedErrorResponse";
import { createErrorResponse } from "../common/errors/createErrorResponse";
import { logger } from "../common/logger/logger";
import { RequestWithAuth } from "../auth/request-auth";
import { ActivityDto } from "./dtos/activity.dto";
import { createActivityService } from "./services/create/create-activity.service";
import { updateActivityService } from "./services/update/update-activity.service";
import { deleteActivityService } from "./services/delete/delete-activity.service";
import { getActivityService } from "./services/get/get-activity.service";
import { validateDto } from "../schedule/middleware/schedule-validator.middleware";

const router = Router();

router.use(isAuthenticateJWT);
router.use(UnathorizedErrorResponse);

/**
 * @swagger
 * tags:
 *   name: Activity
 *   description: The Activity managing API
 *
 * /schedule/{idSchedule}/activity/{idActivity}:
 *   get:
 *     summary: Get a specific activity by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Activity]
 *     parameters:
 *       - in: path
 *         name: idSchedule
 *         required: true
 *         description: The ID of the schedule.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idActivity
 *         required: true
 *         description: The ID of the activity.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with activity details.
 *       400:
 *         description: Invalid IDs provided.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/schedule/:idSchedule/activity/:idActivity",
  async (req: RequestWithAuth, res: Response) => {
    try {
      const idSchedule = parseInt(req.params.idSchedule, 10);
      const idActivity = parseInt(req.params.idActivity, 10);
      const userId = req.auth?.id || -1;

      if (
        isNaN(idSchedule) ||
        isNaN(idActivity) ||
        idSchedule <= 0 ||
        idActivity <= 0
      ) {
        res
          .status(400)
          .send({ message: "Invalid IDs. They must be positive numbers." });
        return;
      }

      const activity = await getActivityService.getById(
        userId,
        idSchedule,
        idActivity
      );
      res.status(200).send(activity);
    } catch (error) {
      logger.error("Error retrieving activity", error);
      const errorResponse = createErrorResponse(error);
      res.status(500).send(errorResponse);
    }
  }
);

/**
 * @swagger
 * /schedule/{idSchedule}/activity:
 *   post:
 *     summary: Create a new activity for a specific schedule
 *     security:
 *       - BearerAuth: []
 *     tags: [Activity]
 *     parameters:
 *       - in: path
 *         name: idSchedule
 *         required: true
 *         description: The ID of the schedule.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivityDto'
 *     responses:
 *       201:
 *         description: Activity created successfully.
 *       400:
 *         description: Invalid Schedule ID.
 */
router.post(
  "/schedule/:idSchedule/activity",
  validateDto(ActivityDto),
  async (req: RequestWithAuth, res: Response) => {
    try {
      const idSchedule = parseInt(req.params.idSchedule, 10);
      const userId = req.auth?.id || -1;

      if (isNaN(idSchedule) || idSchedule <= 0) {
        res.status(400).send({
          message: "Invalid Schedule ID. It must be a positive number.",
        });
        return;
      }

      const response = await createActivityService.create(
        userId,
        idSchedule,
        req.body
      );
      res.status(201).send(response);
    } catch (error) {
      logger.error("Error creating activity", error);
      const errorResponse = createErrorResponse(error);
      res.status(500).send(errorResponse);
    }
  }
);

/**
 * @swagger
 * /schedule/{idSchedule}/activities:
 *   post:
 *     summary: Create multiple activities for a specific schedule
 *     security:
 *       - BearerAuth: []
 *     tags: [Activity]
 *     parameters:
 *       - in: path
 *         name: idSchedule
 *         required: true
 *         description: The ID of the schedule.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ActivityDto'
 *     responses:
 *       201:
 *         description: Activities created successfully.
 *       400:
 *         description: Invalid Schedule ID or input data.
 */
router.post(
  "/schedule/:idSchedule/activities",
  validateDto(ActivityDto),
  async (req: RequestWithAuth, res: Response) => {
    try {
      const idSchedule = parseInt(req.params.idSchedule, 10);
      const userId = req.auth?.id || -1;

      if (isNaN(idSchedule) || idSchedule <= 0) {
        res.status(400).send({
          message: "Invalid Schedule ID. It must be a positive number.",
        });
        return;
      }

      const activitiesDto = req.body;

      const activitiesResult = await createActivityService.createMany(
        userId,
        idSchedule,
        activitiesDto
      );

      res.status(201).send(activitiesResult);
    } catch (error) {
      logger.error("Error creating multiple activities", error);
      const errorResponse = createErrorResponse(error);
      res.status(500).send(errorResponse);
    }
  }
);

/**
 * @swagger
 * /schedule/{idSchedule}/activity/{idActivity}:
 *   put:
 *     summary: Update an existing activity by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Activity]
 *     parameters:
 *       - in: path
 *         name: idSchedule
 *         required: true
 *         description: The ID of the schedule.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idActivity
 *         required: true
 *         description: The ID of the activity.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivityDto'
 *     responses:
 *       200:
 *         description: Activity updated successfully.
 *       400:
 *         description: Invalid IDs provided.
 *       500:
 *         description: Internal server error.
 */
router.put(
  "/schedule/:idSchedule/activity/:idActivity",
  validateDto(ActivityDto),
  async (req: RequestWithAuth, res: Response) => {
    try {
      const idSchedule = parseInt(req.params.idSchedule, 10);
      const idActivity = parseInt(req.params.idActivity, 10);
      const userId = req.auth?.id || -1;

      if (
        isNaN(idSchedule) ||
        isNaN(idActivity) ||
        idSchedule <= 0 ||
        idActivity <= 0
      ) {
        res
          .status(400)
          .send({ message: "Invalid IDs. They must be positive numbers." });
        return;
      }

      const updatedActivity = await updateActivityService.update(
        userId,
        idSchedule,
        idActivity,
        req.body
      );
      res.status(200).send(updatedActivity);
    } catch (error) {
      logger.error("Error updating activity", error);
      const errorResponse = createErrorResponse(error);
      res.status(500).send(errorResponse);
    }
  }
);

/**
 * @swagger
 * /schedule/{idSchedule}/activity/{idActivity}:
 *   delete:
 *     summary: Delete an activity by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Activity]
 *     parameters:
 *       - in: path
 *         name: idSchedule
 *         required: true
 *         description: The ID of the schedule.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idActivity
 *         required: true
 *         description: The ID of the activity.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Activity deleted successfully.
 *       400:
 *         description: Invalid IDs provided.
 */
router.delete(
  "/schedule/:idSchedule/activity/:idActivity",
  async (req: RequestWithAuth, res: Response) => {
    try {
      const idSchedule = parseInt(req.params.idSchedule, 10);
      const idActivity = parseInt(req.params.idActivity, 10);
      const userId = req.auth?.id || -1;

      if (
        isNaN(idSchedule) ||
        isNaN(idActivity) ||
        idSchedule <= 0 ||
        idActivity <= 0
      ) {
        res
          .status(400)
          .send({ message: "Invalid IDs. They must be positive numbers." });
        return;
      }

      await deleteActivityService.delete(userId, idSchedule, idActivity); // Call the delete service
      res.status(204).send(); // No content response for successful deletion
    } catch (error) {
      logger.error("Error deleting activity", error);
      const errorResponse = createErrorResponse(error);
      res.status(500).send(errorResponse);
    }
  }
);

export default router;
