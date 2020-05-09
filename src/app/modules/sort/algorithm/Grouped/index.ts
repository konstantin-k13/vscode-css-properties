import * as css from 'css';
import { Sort } from '../../../../typed/sort';

class GroupedByType implements Sort {
  constructor() { }

  process(decs: Array<css.Declaration>) {
    return decs;
  };

  sort(decs: Array<css.Declaration>) {
    return decs;
  };
}

export default GroupedByType;