/// <reference types="@testing-library/jest-dom" />

declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
