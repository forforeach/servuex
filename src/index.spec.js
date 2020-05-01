import { A } from "./index";

describe('A', () => {
  it('returns bar', () => {
    const a = new A()
    expect(a.bar()).toBe('bar')
  });
});