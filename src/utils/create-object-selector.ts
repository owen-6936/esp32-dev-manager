export const createObjectSelector =
  <T>() =>
  <K extends keyof T>(keys: readonly K[]) => {
    return (state: T): Pick<T, K> => {
      const result = {} as Pick<T, K>;
      for (const key of keys) {
        result[key] = state[key];
      }
      return result;
    };
  };
