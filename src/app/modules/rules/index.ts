import * as css from 'css';
import getSortingAlgorithm from '../sort';
import * as ruleTypes from '../../constants/rule';
import { ALPHABETICAL } from '../../constants/sort';
import { Preferences, Workers, Sort, SortConstructable, ControlRule } from '../../typed/sort';

const defaultPreferences = {
  sorting: ALPHABETICAL,
  keepComments: true
};

class RuleHandler {
  preferences: Preferences;
  workers: Workers;

  constructor(preferences?: Preferences) {
    this.preferences = preferences || defaultPreferences;
    this.workers = {
      [ruleTypes.KEYFRAMES]: this.handleKeyFrames,
      [ruleTypes.RULE]: this.handleDeclarations,
      [ruleTypes.QUERY]: this.handleQueries
    };
  }

  process = (rule: any): css.Rule => {
    const ruleType = this.getRuleType(rule);
    if (ruleType) {
      const worker = this.workers[ruleType];
      if (worker) {
        rule = worker(rule);
      }
    }

    return rule;
  };

  getRuleType = (rule: any): string | undefined => {
    if (rule.declarations) {
      return ruleTypes.RULE;
    }
    if (rule.keyframes) {
      return ruleTypes.KEYFRAMES;
    }
    if (rule.rules) {
      return ruleTypes.QUERY;
    }
  };

  handleQueries = (globalRule: ControlRule) => {
    const rules = globalRule.rules?.reduce((total: Array<css.Rule>, current: css.Rule) => {
      const declarations: any = this.process(current);
      return total.concat(declarations);
    }, []);
    globalRule.rules = rules;
    return globalRule;
  };

  handleKeyFrames = (globalRule: css.KeyFrames) => {
    const keyframes = globalRule.keyframes?.reduce((total: Array<css.Rule>, current: css.Rule) => {
      const declarations: any = this.handleDeclarations(current);
      return total.concat(declarations);
    }, []);
    globalRule.keyframes = keyframes;
    return globalRule;
  };

  getDeclarations = (entries: Array<css.Declaration>) => {
    const { keepComments } = this.preferences;
    if (keepComments) {
      return entries;
    }      
    return entries.filter(val => val.type === 'declaration');

  };

  handleDeclarations = (rule: css.Rule): css.Rule => {
    const entries: Array<css.Comment | css.Declaration> | undefined = rule.declarations;
    if (entries) {
      const decs: Array<css.Declaration> = entries;
      const Algorithm: SortConstructable | undefined = getSortingAlgorithm(this.preferences.sorting);
      if (Algorithm) {
        const sort: Sort = new Algorithm();
        const sorted = sort.process(decs);
        rule.declarations = sorted;
      }
    }

    return rule;
  };
}

export default RuleHandler;