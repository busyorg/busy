/**
 * This function is extracted from steemit.com source code and does the same tasks with some slight-
 * adjustments to meet our needs. Refer to the main one in case of future problems:
 * https://github.com/steemit/steemit.com/blob/06c90aa8260f09c4ae061e652d884f68b8a6a409/app/utils/ChainValidation.js
 */

export function validateAccountName(value) {
  let label;
  let suffix;

  suffix = 'Account name should ';
  if (!value) {
    return `${suffix}not be empty.`;
  }
  const length = value.length;
  if (length < 3) {
    return `${suffix}be longer.`;
  }
  if (length > 16) {
    return `${suffix}be shorter.`;
  }
  if (/\./.test(value)) {
    suffix = 'Each account segment should ';
  }
  const ref = value.split('.');
  for (let i = 0, len = ref.length; i < len; i += 1) {
    label = ref[i];
    if (!/^[a-z]/.test(label)) {
      return `${suffix}start with a letter.`;
    }
    if (!/^[a-z0-9-]*$/.test(label)) {
      return `${suffix}have only letters, digits, or dashes.`;
    }
    if (/--/.test(label)) {
      return `${suffix}have only one dash in a row.`;
    }
    if (!/[a-z0-9]$/.test(label)) {
      return `${suffix}end with a letter or digit.`;
    }
    if (!(label.length >= 3)) {
      return `${suffix}be longer`;
    }
  }
  return null;
}

export default null;
