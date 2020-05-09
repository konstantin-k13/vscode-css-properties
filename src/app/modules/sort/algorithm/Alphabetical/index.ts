import * as css from 'css';
import isPrefixer from '../../../../utils/isPrefixer';
import {
  Sort,
  Prefix,
  DeclarationObject,
  IndexedDeclaration
} from '../../../../typed/sort';

class Alphabetical implements Sort {
  constructor() { }

  process(decs: Array<css.Declaration>) {
    const copy = [...decs];
    const { props, prefixes, comments } = this.divideDeclarations(copy);
    const _prefixes = this.sortPrefixes(prefixes);
    const sorted = this.sort(props);
    const rearranged = this.rearrangePrefixes(sorted, _prefixes);
    const result = this.addComments(rearranged, comments);
    return result;
  }

  sort(decs: Array<css.Declaration>) {
    const properties = decs.filter(val => val.type !== 'comment');
    return properties.sort((a, b) => {
      if ((!a.property || !b.property) || (a.property === b.property)) {
        return 0;
      }
      if (a.property < b.property) {
        return -1;
      }
      return 1;
    });
  }

  addComments(decs: Array<css.Declaration>, comments: Array<IndexedDeclaration> = []) {
    comments.forEach(comment => {
      const { position = {} } = comment.value;
      const line = position.start?.line;
      if (line) {
        const decPosition = this.findPropertyPositionByLine(decs, line);
        if (decPosition !== -1) {
          decs.splice(decPosition, 0, comment.value);
          return;
        }
        decs.splice(comment.index, 0, comment.value);
      }
    });
    return decs;
  }

  findPropertyPositionByLine(decs: Array<css.Declaration>, line: number) {
    return decs.reduce((total, current, currentIndex) => {
      const { position = {}, type } = current;
      if (type !== 'comment' && position.start?.line === line) {
        return currentIndex;
      }
      return total;
    }, -1);
  }

  sortPrefixes(prefixes: Array<Prefix>) {
    return prefixes.sort((a, b) => {
      if ((!a.property || !b.property) || (a.property === b.property)) {
        return 0;
      }
      if (a.property < b.property) {
        return 1;
      }
      return -1;
    });
  }

  rearrangePrefixes(props: Array<css.Declaration>, prefixes: Array<Prefix>) {
    const rearranged = props.reduce((total: Array<css.Declaration>, current) => {
      const associatedPrefixes = this.getAssociatedPrefixes(current, prefixes);
      return total.concat([...associatedPrefixes, current]);
    }, []);
    const result = rearranged.concat(prefixes);
    return result;
  }

  getAssociatedPrefixes(dec: css.Declaration, prefixes: Array<Prefix>) {
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
  }

  divideDeclarations(decs: Array<css.Declaration>) {
    const initial: DeclarationObject = { props: [], prefixes: [], comments: [] };
    return decs.reduce((total, current, index) => {
      const { props, prefixes, comments = [] } = total;
      if (current.type === 'comment') {
        return {
          props,
          prefixes,
          comments: comments.concat({
            value: current,
            index
          })
        };
      }

      const prefixValue = this.isPrefixer(current);
      if (prefixValue) {
        const prefix: Prefix = {
          ...current,
          prefixValue
        };
        return {
          props,
          prefixes: prefixes.concat(prefix),
          comments
        };
      }

      return {
        props: props.concat(current),
        prefixes,
        comments
      };
    }, initial);
  }

  isPrefixer(dec: css.Declaration) {
    const { property } = dec;
    if (!property) {
      return null;
    }

    return isPrefixer(property);
  }
}

export default Alphabetical;