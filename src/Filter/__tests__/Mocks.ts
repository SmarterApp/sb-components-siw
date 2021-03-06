import { GradeLevel, GradeLevels } from "../../GradeLevels/GradeLevels";
import {
  FilterOptionModel,
  FilterCategoryModel,
  FilterType
} from "../FilterModels";
import {
  SubjectModel,
  TargetModel,
  ClaimModel,
  ItemsSearchModel,
  SearchAPIParamsModel,
  TestNameModel
} from "../../ItemSearch/ItemSearchModels";
import { Filter } from "../Filter";
import { InteractionTypeModel } from "../../AboutTestItems/AboutTestItemsModels";

export const subjectSelectedOptions: FilterOptionModel[] = [
  { label: "ELA", key: "ELA", isSelected: false, filterType: FilterType.Grade },
  { label: "Math", key: "Math", isSelected: true, filterType: FilterType.Grade }
];

export const subjectSelectedCategory: FilterCategoryModel = {
  disabled: false,
  label: "Subject",
  code: FilterType.Subject,
  filterOptions: subjectSelectedOptions
};

export const claimSelectedOptions: FilterOptionModel[] = [
  {
    label: "Claim1",
    key: "MATH1",
    isSelected: true,
    filterType: FilterType.Claim
  },
  {
    label: "Claim2",
    key: "MATH2",
    isSelected: true,
    filterType: FilterType.Claim
  }
];

export const claimOptions = claimSelectedOptions.map(c => {
  return { ...c, isSelected: false };
});

export const claimSelectedCategory: FilterCategoryModel = {
  disabled: false,
  label: "Claim",
  code: FilterType.Claim,
  filterOptions: claimSelectedOptions
};

export const claimCategory = {
  ...claimSelectedCategory,
  filterOptions: claimOptions
};

export const claimEmptyCategory = {
  ...claimSelectedCategory,
  filterOptions: []
};

export const gradeSelectedOptions: FilterOptionModel[] = [
  {
    label: "Middle",
    key: GradeLevels.Middle.toString(),
    isSelected: true,
    filterType: FilterType.Grade
  },
  {
    label: "Elementary",
    key: GradeLevels.Elementary.toString(),
    isSelected: true,
    filterType: FilterType.Grade
  },

  {
    label: "Grade11",
    key: GradeLevels.Grade11.toString(),
    isSelected: false,
    filterType: FilterType.Grade
  }
];

export const gradeSelectedCategory: FilterCategoryModel = {
  disabled: false,
  label: "Grade",
  code: FilterType.Grade,
  filterOptions: gradeSelectedOptions
};

export const gradeOptions = gradeSelectedOptions.map(g => {
  return { ...g, isSelected: false };
});

export const gradeCategory = {
  ...gradeSelectedCategory,
  filterOptions: gradeOptions
};

export const gradeEmptyCategory = {
  ...gradeSelectedCategory,
  filterOptions: gradeOptions
};

export const performanceCatOptions: FilterOptionModel[] = [
  {
    label: "Performance",
    key: FilterType.Performance,
    isSelected: false,
    filterType: FilterType.Performance
  },
  {
    label: "CAT",
    key: FilterType.CAT,
    isSelected: true,
    filterType: FilterType.CAT
  }
];

export const performanceTruthOptions: FilterOptionModel[] = [
  { ...performanceCatOptions[0], isSelected: true }
];
export const performanceFalseCategory: FilterCategoryModel = {
  disabled: false,
  label: "Performance",
  code: FilterType.TechnologyType,
  filterOptions: performanceCatOptions
};

export const performanceTruthCategory: FilterCategoryModel = {
  ...performanceFalseCategory,
  filterOptions: performanceTruthOptions
};

export const performanceEmptyCategory: FilterCategoryModel = {
  ...performanceFalseCategory,
  filterOptions: []
};

export const targetOptions: FilterOptionModel[] = [
  {
    label: "1",
    key: "133",
    isSelected: true,
    filterType: FilterType.Target
  },
  {
    label: "a2",
    key: "212",
    isSelected: false,
    filterType: FilterType.Target
  }
];

export const targetSelectionsCategory: FilterCategoryModel = {
  disabled: false,
  label: "Target",
  code: FilterType.Target,
  filterOptions: targetOptions
};

export const targetCategory: FilterCategoryModel = {
  ...targetSelectionsCategory,
  filterOptions: targetOptions.map(t => {
    return { ...t, isSelected: false };
  })
};

export const targetEmptyCategory: FilterCategoryModel = {
  ...targetSelectionsCategory,
  filterOptions: []
};
// Item Search Models

export const subjects: SubjectModel[] = [
  {
    claimCodes: ["MATH1", "MATH2"],
    interactionTypeCodes: ["ITM1", "ITM2"],
    code: "MATH",
    label: "MATH"
  },
  {
    claimCodes: ["ELA1", "ELA2"],
    interactionTypeCodes: ["ITE1", "ITE2"],
    code: "ELA",
    label: "ELA"
  }
];

export const testNames: TestNameModel[] = [
  {
    code: "1",
    label: "TestName1",
    shortLabel: "TestName1"
  },
  {
    code: "2",
    label: "TestName2",
    shortLabel: "TestName2"
  },
  {
    code: "3",
    label: "TestName3",
    shortLabel: "TestName3"
  },
  {
    code: "4",
    label: "TestName4",
    shortLabel: "TestName4"
  },
  {
    code: "5",
    label: "TestName5",
    shortLabel: "TestName5"
  }
];

export const claims: ClaimModel[] = [
  {
    targetCodes: ["11", "12", "13", "14"],
    code: "MATH1",
    label: "MATH1",
    claimNumber: "1"
  },
  {
    targetCodes: ["21", "22", "23", "24"],
    code: "ELA1",
    label: "ELA1",
    claimNumber: "1"
  }
];

export const targets: TargetModel[] = [
  {
    name: "ELA1",
    nameHash: 21,
    idLabel: "21",
    id: "21"
  },
  {
    name: "MATH1",
    nameHash: 11,
    idLabel: "11",
    id: "11"
  },
  {
    name: "MATH2",
    nameHash: 12,
    idLabel: "12",
    id: "12"
  }
];

export const interactionTypes: InteractionTypeModel[] = [
  {
    code: "ITM1",
    label: "MATH1"
  },
  {
    code: "ITE1",
    label: "ELA1"
  }
];
export const mockSeachAPI: SearchAPIParamsModel = {
  itemId: "item1",
  // tslint:disable-next-line:no-bitwise
  gradeLevels: GradeLevels.Grade3 | GradeLevels.Grade4,
  subjects: ["t1", "t2"],
  claims: ["t1", "t2"],
  interactionTypes: ["t1", "t2"],
  performanceOnly: true,
  catOnly: true,
  targets: ["A", "B"]
};
export const searchModel: ItemsSearchModel = {
  interactionTypes,
  claims,
  subjects,
  targets,
  testNames
};
