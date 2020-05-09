import GroupedByType from './sort/GroupedByType';
import Alphabetical from './sort/Alphabetical';
import { SortConstructable } from '../typed/sort';
import { ALPHABETICAL, GROUPED_BY_TYPE } from '../constants/sort';

const defaultPreference = GROUPED_BY_TYPE;
const algorithmHolder: any = {
  [GROUPED_BY_TYPE]: GroupedByType,
  [ALPHABETICAL]: Alphabetical
};

const getSortingAlgorithm = (preference: string): SortConstructable | undefined => {
  if (algorithmHolder[preference]) {
    return algorithmHolder[preference];
  }
  return algorithmHolder[defaultPreference];
};

export default getSortingAlgorithm;