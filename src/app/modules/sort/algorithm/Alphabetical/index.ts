import * as css from 'css';
import isPrefixer from '../../../../utils/isPrefixer';
import { Sort, DeclarationObject, Prefix } from '../../../../typed/sort';

class Alphabetical implements Sort {
  constructor() {
   }

  sort = (decs: Array<css.Declaration>) => {
    const copy = [...decs];
    const { props, prefixes } = this.divideDeclarations(copy);
    const _prefixes = this.sortPrefixes(prefixes);
    const sorted = props.sort((a, b) => {
      if ((!a.property || !b.property) || (a.property === b.property)) {
        return 0;
      }
      if (a.property < b.property) {
        return -1;
      }
      return 1;
    });

    return this.rearrangePrefixes(sorted, _prefixes);
  };

  sortPrefixes = (prefixes: Array<Prefix>) => {
    return prefixes.sort((a, b) => {
      if ((!a.property || !b.property) || (a.property === b.property)) {
        return 0;
      }
      if (a.property < b.property) {
        return 1;
      }
      return -1;
    });
  };

  rearrangePrefixes = (props: Array<css.Declaration>, prefixes: Array<Prefix>) => {
    const rearranged = props.reduce((total: Array<css.Declaration>, current) => {
      const associatedPrefixes = this.getAssociatedPrefixes(current, prefixes);
      return total.concat([...associatedPrefixes, current]);
    }, []);
    const result = rearranged.concat(prefixes);
    return result;
  };

  getAssociatedPrefixes = (dec: css.Declaration, prefixes: Array<Prefix>) => {
    const toRemove: Array<number> = [];
    const associated = prefixes.filter((value, index) => {
      const result = value.prefixValue === dec.property;
      if (result) {
        toRemove.push(index);
      }
      return result;
    });
    if (associated.length) {
      for (let i = toRemove.length - 1; i >= 0; i--) {
        prefixes.splice(toRemove[i], 1);
        toRemove.splice(i, 1);
      }
    }
    return associated;
  };

  divideDeclarations = (decs: Array<css.Declaration>) => {
    const initial: DeclarationObject = { props: [], prefixes: [] };
    return decs.reduce((total: DeclarationObject, current: css.Declaration) => {
      const { props, prefixes } = total;
      const prefixValue = this.isPrefixer(current);
      if (prefixValue) {
        const prefix: Prefix = {
          ...current,
          prefixValue
        };
        return {
          props,
          prefixes: prefixes.concat(prefix)
        };
      }

      return {
        props: props.concat(current),
        prefixes
      };
    }, initial);
  };

  isPrefixer = (dec: css.Declaration) => {
    const { property } = dec;
    if (!property) {
      return null;
    }

    return isPrefixer(property);
  };
}

export default Alphabetical;