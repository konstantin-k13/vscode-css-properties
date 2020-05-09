import * as css from 'css';
import { Sort } from '../../typed/sort';

class Alphabetical implements Sort {
  constructor() { }

  sort(decs: Array<css.Declaration>) {
    const copy = [...decs];
    const sorted = copy.sort((a, b) => {
      if ((!a.property || !b.property) || a.property === b.property) {
        return 0;
      }
      if (a.property < b.property) {
        return -1;
      }
      return 1;
    });
    return sorted;
  }
}

export default Alphabetical;