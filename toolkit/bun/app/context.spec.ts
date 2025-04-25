import { describe, it, expect } from 'bun:test';

describe("test './context.ts' module", () => {
  it("should './context.ts' execute before start", () => {
    expect(global.context.isDev).toBeTrue();
    expect(process.env.NODE_ENV).toEqual('development');
    expect(global.context.startAt).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  });
});
