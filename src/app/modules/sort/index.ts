import GroupedByType from './algorithm/Grouped';
import Alphabetical from './algorithm/Alphabetical';
import { SortConstructable } from '../../typed/sort';
import { ALPHABETICAL, GROUPED_BY_TYPE } from '../../constants/sort';

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