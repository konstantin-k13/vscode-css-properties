import * as vscode from 'vscode';
import * as css from 'css';

export interface Sort {
  sort: (decs: Array<css.Declaration>) => Array<css.Declaration>;
}

export interface SortConstructable {
  new(): Sort;
}

export type Prefix = {
  type?: string | undefined,
  property?: string | undefined,
  value?: string | undefined,
  position?: any,
  prefixValue?: string | undefined
};

export type DeclarationObject = {
  props: Array<css.Declaration>,
  prefixes: Array<Prefix>
};