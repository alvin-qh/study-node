import dotEnv, { type DotenvConfigOptions } from 'dotenv';
import { expand } from 'dotenv-expand';

interface DotenvConfigOptionsExt {
  resolve?: boolean
}

type EnvConfigOptions = DotenvConfigOptions & DotenvConfigOptionsExt;

export function loadEnvVariables(options?: EnvConfigOptions): Record<string, string> {
  const {
    path,
    override = true,
    processEnv = {},
    encoding = 'utf-8',
    resolve = true,
  } = options ?? {};

  const result = dotEnv.config({
    path,
    override,
    processEnv,
    encoding,
  });


  if (resolve) {
    expand(result);
  }

  if (result.error) {
    throw result.error;
  }

  return result.parsed as Record<string, string>;
}
