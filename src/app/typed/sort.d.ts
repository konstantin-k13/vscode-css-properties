import * as css from 'css';

export interface Sort {
  sort: (decs: Array<css.Declaration>) => Array<css.Declaration>;
}

export interface SortConstructable {
  new(): Sort;
}