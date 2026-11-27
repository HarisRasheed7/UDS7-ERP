'use strict';

const {
  formatMoney,
  formatQuantity,
  addMoney,
  subMoney,
  mulMoney,
  divMoney,
  sumMoney,
  verifyDoubleEntryBalance
} = require('../../../shared');

describe('shared/utils/money (decimal.js exact arithmetic)', () => {
  it('eliminates IEEE 754 floating-point drift (0.1 + 0.2 === 0.3000)', () => {
    expect(addMoney('0.1', '0.2')).toBe('0.3000');
    expect(addMoney(0.1, 0.2)).toBe('0.3000');
    expect(sumMoney(['19.995', '0.005', '100.00'])).toBe('120.0000');
  });

  it('performs subtraction, multiplication, division, and quantity formatting at 4 decimal places', () => {
    expect(subMoney('100.0000', '33.3333')).toBe('66.6667');
    expect(mulMoney('12.50', '3.005')).toBe('37.5625');
    expect(divMoney('100', '3')).toBe('33.3333');
    expect(formatMoney('123456789012345.6789')).toBe('123456789012345.6789');
    expect(formatQuantity('5.25')).toBe('5.2500');
  });

  it('rejects division by zero, NaN, Infinity, and empty values', () => {
    expect(() => divMoney('10', '0')).toThrow(/Division by zero/);
    expect(() => formatMoney(NaN)).toThrow(/finite/);
    expect(() => formatMoney(Infinity)).toThrow(/finite/);
    expect(() => formatMoney('')).toThrow(/empty/);
  });

  it('validates balanced double-entry journals and rejects 0.0001 imbalance or negatives', () => {
    const balanced = verifyDoubleEntryBalance([
      { debit: '1000.0000', credit: '0' },
      { debit: '0', credit: '600.0000' },
      { debit: '0', credit: '400.0000' }
    ]);
    expect(balanced).toEqual({
      balanced: true,
      totalDebit: '1000.0000',
      totalCredit: '1000.0000'
    });

    const unbalanced = verifyDoubleEntryBalance([
      { debit: '1000.0000', credit: '0' },
      { debit: '0', credit: '999.9999' }
    ]);
    expect(unbalanced.balanced).toBe(false);

    expect(() =>
      verifyDoubleEntryBalance([
        { debit: '-10', credit: '0' },
        { debit: '0', credit: '-10' }
      ])
    ).toThrow(/negative/);
  });
});
