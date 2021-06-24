import { cleanEnv, str, port } from 'envalid';

export const validateEnv = () => {
  cleanEnv(process.env, {
    DB_USER: str(),
    DB_USER_PASSWORD: str(),
    DB_PATH: str(),
    PORT: port()
  })
}