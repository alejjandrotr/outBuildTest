import { Response, Request, Router } from "express";
import { UserDto } from "./dtos/user.dto";
import { ErrorUserAlredyExist } from "./errors/UserAlredyExiste.exception";
import { registerService } from "./services/register.service";
import { validateDto } from "../schedule/middleware/schedule-validator.middleware";
import { CONFIG_VARS } from "../common/configs/config";
import { logger } from "../common/logger/logger";
import { loginService } from "./services/login.service";

const SECRET_KEY = CONFIG_VARS.JWT_SECRET;

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The auth managing API
 * /auth/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDto'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Invalid input data or email already in use.
 */
router.post(
  "/register",
  validateDto(UserDto),
  async (req: Request, res: Response) => {
    try {
      const newUser = await registerService.register(req.body);
      res.status(201).send(newUser);
    } catch (error) {
      logger.error("An error was happend", error);
      if (error instanceof ErrorUserAlredyExist) {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: "Internal server error" });
      }
    }
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Successful login, returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid email or password.
 */
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "email and password are required" });
    return;
  }

  try {
    const result = await loginService.login({ email: email, password });
    res.json(result);
  } catch (error: any) {
    logger.error("Login error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

export default router;
