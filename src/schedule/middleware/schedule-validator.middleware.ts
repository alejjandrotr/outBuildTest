import { Request, Response, NextFunction } from "express";
import { validateOrReject, ValidationError } from "class-validator";

export const validateDto = <T extends Record<string, any>>(
  ctor: new () => T
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createValidator(req, res, next, ctor);
    } catch (e) {
      next(e);
    }
  };
};

export const createValidator = async <T extends Record<string, any>>(
  req: Request,
  res: Response,
  next: NextFunction,
  ctor: new () => T
) => {
  if (!req.body) {
    return res.status(400).send({ message: "Missing request body!" });
  }

  if (Array.isArray(req.body)) {
    const promises = req.body.map(async (obj, index) => {
      return validateObject(ctor, obj);
    });
    const result = await Promise.allSettled(promises);
    const mapRejected = result.map((obj: any, i: number) => ({
      ...obj,
      status: obj.value.length > 0 ? "rejected" : obj.status,
      index: i,
    }));
    const filterRejected = mapRejected.filter((r) => r.status === "rejected");
    if (filterRejected.length > 0) {
      console.log({ filterRejected });
      res.status(400).send(filterRejected);
      return;
    }
    next();
    return;
  }
  const resp = await validateObject<T>(ctor, req.body);
  if (resp.length > 0) {
    res.status(400).send(resp);
    return;
  }
  next();
};

async function validateObject<T extends Record<string, any>>(
  ctor: new () => T,
  obj: any
) {
  const reqObject: T = new ctor();
  mapObject(reqObject, obj);
  try {
    await validateOrReject(reqObject);
    return [];
  } catch (error) {
    if (Array.isArray(error)) {
      const errors = error.map((e: any) => {
        if (e instanceof ValidationError) {
          return {
            [e.property]: Object.values(e.constraints || {}),
          };
        }
      });
      return errors;
    }
    throw error;
  }
}

function mapObject<T extends Record<string, any>>(
  obj: T,
  source: Record<string, any>
): T {
  Object.keys(source).forEach((key) => {
    obj[key as keyof T] = source[key];
  });
  return obj;
}
