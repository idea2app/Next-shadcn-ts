import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const FUNCTION_MARKER = "__serializedFunction__" as const;

type Primitive = string | number | boolean | null | undefined | bigint | symbol;

export interface SerializedFunctionNode { [FUNCTION_MARKER]: string }

export type SerializedFunctions<T> = T extends (...args: infer A) => infer R
  ? SerializedFunctionNode
  : T extends Primitive
    ? T
    : T extends Array<infer U>
      ? SerializedFunctions<U>[]
      : T extends object
        ? { [K in keyof T]: SerializedFunctions<T[K]> }
        : T;

export const serializeFunctionMembers = <T>(
  value: T,
): SerializedFunctions<T> => {
  if (typeof value === "function")
    return { [FUNCTION_MARKER]: value.toString() } as SerializedFunctions<T>;

  if (Array.isArray(value))
    return value.map(serializeFunctionMembers) as SerializedFunctions<T>;

  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(value))
      output[key] = serializeFunctionMembers(item);

    return output as SerializedFunctions<T>;
  }

  return value as SerializedFunctions<T>;
};

const isSerializedFunctionNode = (
  value: unknown,
): value is SerializedFunctionNode =>
  !!value &&
  typeof value === "object" &&
  FUNCTION_MARKER in value &&
  typeof (value as SerializedFunctionNode)[FUNCTION_MARKER] === "string";

const reviveFunction = (source: string) => {
  const factory = Function(`"use strict"; return (${source});`);
  const fn = factory();

  if (typeof fn !== "function")
    throw new TypeError("Serialized source does not evaluate to a function.");

  return fn;
};

export const instantiateFunctionMembers = <T>(
  value: SerializedFunctions<T>,
): T => {
  if (isSerializedFunctionNode(value))
    return reviveFunction(value[FUNCTION_MARKER]);

  if (Array.isArray(value)) return value.map(instantiateFunctionMembers) as T;

  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(value))
      output[key] = instantiateFunctionMembers(item);

    return output as T;
  }

  return value as T;
};
