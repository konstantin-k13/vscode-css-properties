import * as css from 'css';
import isPrefixer from '../../../../utils/isPrefixer';
import { getCommentType } from '../../../../utils/helpers';
import {
  Sort,
  Prefix,
  DeclarationObject,
  IndexedDeclaration
} from '../../../../typed/sort';
import order from '../../../../constants/order';

const EMPTY_LINE = {
  type: 'rule',
  selectors: ['\n'],
  declarations: []
};

/*
  TODO: work on the sorting performance.
*/

class Grouped implements Sort {
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

  getPropertyImportance(property: string) {
    const importance = order.indexOf(property);
    return importance !== -1 ? importance : order.length;
  }

  sort(decs: Array<css.Declaration>) {
    const properties = decs.filter(val => val.type !== 'comment');
    const sorted = properties.sort((a, b) => {
      if ((!a.property || !b.property) || (a.property === b.property)) {
        return 0;
      }
      if (a.property < b.property) {
        return -1;
      }
      return 1;
    });
    console.log(order);
    return sorted.sort((a, b) => {
      if ((!a.property || !b.property)) {
        return 0;
      }
      const index1 = this.getPropertyImportance(a.property);
      const index2 = this.getPropertyImportance(b.property);
      // if (order.includes(a.property)) {
      console.log(a.property, order.length - order.indexOf(a.property));
      // }
      // if (order.includes(b.property)) {
      //   console.log(b.property, order.length - order.indexOf(b.property));
      // }
      if (index1 > index2) {
        return 1;
      }
      if (index1 < index2) {
        return -1;
      }
      return 0;
    });
  }

  addComments(decs: Array<css.Declaration>, comments: Array<IndexedDeclaration> = []) {
    let lastDocLine = -1;
    comments.forEach(comment => {
      const { position = {} } = comment.value;
      const commentType = getCommentType(comment.value);
      const line = position.end?.line;

      if (line) {
        if (commentType === 'doc') {
          lastDocLine = comment.index;
          decs.splice(comment.index, 0, comment.value);
          return;
        }
        const decPosition = this.findRelatedPropertyPosition(decs, line);
        if (decPosition !== -1) {
          decs.splice(decPosition, 0, comment.value);
          return;
        }
        decs.splice(comment.index, 0, comment.value);
      }
    });
    if (lastDocLine !== -1) {
      decs.splice(lastDocLine + 1, 0, EMPTY_LINE);
    }
    return decs;
  }

  findRelatedPropertyPosition(decs: Array<css.Declaration>, line: number) {
    const position = decs.reduce((total, current, currentIndex) => {
      const { position = {}, type } = current;
      if (type !== 'comment') {
        if (position.start?.line === line) {
          /* If it's a comment describing current line */
          return currentIndex;
        }
        if (position.start?.line === line + 1 && total === -1) {
          /* If it's a comment describing next line (less importance) */
          return currentIndex;
        }
      }
      return total;
    }, -1);
    return position;
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

export default Grouped;