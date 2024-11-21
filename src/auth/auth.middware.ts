import { expressjwt as jwt } from "express-jwt";
import { CONFIG_VARS } from "../common/configs/config";
import { EXCLUDE_AUTH_PATH } from "./const/EXCLUDE_AUTH_PATH";

export const isAuthenticateJWT = jwt({
  secret: CONFIG_VARS.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
}).unless({ path: EXCLUDE_AUTH_PATH });
