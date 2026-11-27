'use strict';

const Decimal = require('decimal.js');

Decimal.set({
  precision: 38,
  rounding: Decimal.ROUND_HALF_UP
});

const MONEY_SCALE = 4;

/**
 * Converts a string, number, or Decimal into a validated Decimal instance.
 * Rejects NaN, Infinity, null, or malformed numeric strings.
 * @param {string | number | Decimal} value
 * @returns {Decimal}
 */
function toDecimal(value) {
  if (value === null || value === undefined || value === '') {
    throw new Error('Numeric value cannot be empty.');
  }
  if (typeof value === 'number' && !Number.isFinite(value)) {
    throw new Error('Numeric value must be finite.');
  }
  const d = new Decimal(value);
  if (!d.isFinite()) {
    throw new Error('Numeric value must be finite.');
  }
  return d;
}

/**
 * Formats a monetary value to fixed 4-decimal string matching PostgreSQL NUMERIC(20, 4).
 * @param {string | number | Decimal} value
 * @returns {string}
 */
function formatMoney(value) {
  return toDecimal(value).toFixed(MONEY_SCALE);
}

/**
 * Formats an inventory quantity to fixed 4-decimal string matching PostgreSQL NUMERIC(20, 4).
 * @param {string | number | Decimal} value
 * @returns {string}
 */
function formatQuantity(value) {
  return toDecimal(value).toFixed(MONEY_SCALE);
}

function addMoney(a, b) {
  return toDecimal(a).plus(toDecimal(b)).toFixed(MONEY_SCALE);
}

function subMoney(a, b) {
  return toDecimal(a).minus(toDecimal(b)).toFixed(MONEY_SCALE);
}

function mulMoney(a, b) {
  return toDecimal(a).times(toDecimal(b)).toFixed(MONEY_SCALE);
}

function divMoney(a, b) {
  const divisor = toDecimal(b);
  if (divisor.isZero()) {
    throw new Error('Division by zero is not permitted.');
  }
  return toDecimal(a).dividedBy(divisor).toFixed(MONEY_SCALE);
}

/**
 * Sums an array of monetary values with zero floating-point drift.
 * @param {Array<string | number | Decimal>} values
 * @returns {string}
 */
function sumMoney(values) {
  const total = values.reduce((acc, item) => acc.plus(toDecimal(item)), new Decimal(0));
  return total.toFixed(MONEY_SCALE);
}

/**
 * Validates double-entry balance: total debits must strictly equal total credits,
 * and every line must hold non-negative debit and credit values.
 * @param {Array<{ debit?: string | number, credit?: string | number }>} lines
 * @returns {{ balanced: boolean, totalDebit: string, totalCredit: string }}
 */
function verifyDoubleEntryBalance(lines) {
  if (!Array.isArray(lines) || lines.length < 2) {
    throw new Error('Double-entry journal requires at least two lines.');
  }

  let totalDebit = new Decimal(0);
  let totalCredit = new Decimal(0);

  for (const line of lines) {
    const debit = toDecimal(line.debit ?? '0');
    const credit = toDecimal(line.credit ?? '0');

    if (debit.isNegative() || credit.isNegative()) {
      throw new Error('Journal line debit and credit values must not be negative.');
    }
    if (debit.isZero() && credit.isZero()) {
      throw new Error('Journal line must have a non-zero debit or credit.');
    }

    totalDebit = totalDebit.plus(debit);
    totalCredit = totalCredit.plus(credit);
  }

  return {
    balanced: totalDebit.equals(totalCredit),
    totalDebit: totalDebit.toFixed(MONEY_SCALE),
    totalCredit: totalCredit.toFixed(MONEY_SCALE)
  };
}

module.exports = {
  MONEY_SCALE,
  toDecimal,
  formatMoney,
  formatQuantity,
  addMoney,
  subMoney,
  mulMoney,
  divMoney,
  sumMoney,
  verifyDoubleEntryBalance
};
