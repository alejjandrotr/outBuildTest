import * as swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Schedule Activities - Test Para OUTBUIL",
      version: "1.0.0",
      description:
        "Lo siguiente es una prueba técnica desarrollada para Outbuild",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Bearer token in the format **Bearer {token}**',
        },
      },
      schemas: {
        UserDto: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              example: "securepassword123",
            },
          },
          required: ["email", "password"],
        },
        ActivityDto: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Sample Activity",
            },
            startDate: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            endDate: {
              type: "string",
              format: "date-time",
              example: "2023-01-02T00:00:00Z",
            },
          },
          required: ["name", "startDate", "endDate"],
        },
        ScheduleDto: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Sample Schedule",
            },
            url: {
              type: "string",
              example: "http://example.com",
            },
            activities: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ActivityDto",
              },
            },
            idOwner: {
              type: "integer",
              example: 123,
            },
          },
          required: ["name", "url"],
        },

        CreateScheduleDto: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Sample Schedule",
            },
            url: {
              type: "string",
              example: "http://example.com",
            },
          },
          required: ["name", "url"],
        },
      },
    },
  },
  apis: ["./src/**/*.router.ts"],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
