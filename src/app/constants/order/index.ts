/**
 * @file Describes the grouped sorting of CSS Properties.
 * Provided properties are borrowed from https://htmldog.com/references/css/properties/
 * If you want more information about the "Outside In" order, see:
 * https://webdesign.tutsplus.com/articles/outside-in-ordering-css-properties-by-importance--cms-21685
 */

import layout from './layout';
import box from './box';
import visual from './visual';
import typography from './typography';
import transform from './transformations';
import transitions from './transitions';

export default [
  ...layout,
  ...box,
  ...visual,
  ...typography,
  ...transform,
  ...transitions
];