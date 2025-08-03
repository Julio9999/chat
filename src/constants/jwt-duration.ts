import { Envs } from "./envs";

export const LOGIN_JWT_DURATION = Math.floor(Date.now() / 1000) + Number(Envs.JWT_DURATION_SECONDS);
