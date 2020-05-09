import * as vscode from 'vscode';
import * as css from 'css';

export interface Sort {
  process: (decs: Array<css.Declaration>) => Array<css.Declaration>;
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

type IndexedDeclaration = {
  index: number,
  value: css.Declaration
};

export type DeclarationObject = {
  props: Array<css.Declaration>,
  prefixes: Array<Prefix>,
  comments?: Array<IndexedDeclaration>
};

export type ControlRule = css.Media | css.Supports;

export type Preferences = {
  sorting: string,
  keepComments: boolean
};

export type Workers = {
  [type: string]: any
};