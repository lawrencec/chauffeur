var format = require('util').format;

module.exports = {
  WIDTH_MISMATCH: 'Width values do not match for selector "%s".',
  SIZE_MISMATCH: 'Size values do not match for selector "%s".',
  LOCATION_MISMATCH: 'Location values do not match for selector "%s".',
  COLOR_MISMATCH: 'Color values do not match for selector "%s".',
  VISIBLE_MISMATCH: 'Visibility values do not match for selector "%s".',
  INVISIBLE_MISMATCH: 'Invisibility values do not match for selector "%s".',
  TEXT_MISMATCH: 'Text values do not match for selector "%s".',
  VALUE_MISMATCH: 'Value does not match for selector "%s".',
  CLEARANCE_UNSUCCESSFUL: 'Values not cleared for element with selector "%s".',
  CLICK_UNSUCCESSFUL: 'Click unsuccessful for element with selector "%s".',
  DOUBLE_CLICK_UNSUCCESSFUL: 'Double click unsuccessful for element with selector "%s".',
  SUBMIT_UNSUCCESSFUL: 'Submit unsuccessful for element with selector "%s".',
  SELECTED_MISMATCH: 'Expected element with selector "%s" to be selected.',
  UNSELECTED_MISMATCH: 'Expected element with selector "%s" to be unselected.',
  EXISTENCE_MISMATCH: 'Expected element with selector "%s" to exist.',
  NON_EXISTENCE_MISMATCH: 'Expected element with selector "%s" to not exist.',
  NODENAME_MISMATCH: 'Node name does not match selector "%s".',
  SCRIPT_RESULT_MISMATCH: 'Script results value does not match.',
  ATTRIBUTE_MISMATCH: 'Expected attribute with selector "%s" to exist.',
  HAS_CLASS_MISMATCH: 'Expected class with selector "%s" to exist.',
  HASNT_CLASS_MISMATCH: 'Expected class with selector "%s" to not exist.',
  MOVE_TO_UNSUCCESSFUL: 'Not moved cursor to element "%s" successfully.',
  INCORRECT_NUMBER_FOUND: 'Found incorrect number of elements matching "%s".',
  resolve: function resolve(msg, params) {
    return format.call(this, msg, params);
  }
};