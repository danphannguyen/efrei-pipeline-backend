const { sum } = require('../../index');

describe('sum', () => {
  it('should add two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('should add negative numbers', () => {
    expect(sum(-2, -3)).toBe(-5);
  });

  it('should add positive and negative numbers', () => {
    expect(sum(2, -3)).toBe(-1);
  });
});