import {
  FilterCategoryModel,
  FilterOptionModel,
  FilterType
} from "../Filter/FilterModels";
import {
  FilterSearchModel,
  ItemsSearchModel,
  SearchAPIParamsModel,
  SearchBaseModel,
  SearchFilterStringTypes,
  SearchFilterTypes,
  FilterSearchStringModel,
  TargetModel,
  SearchFilterModelTypes,
  ItemsSearchFilterModel,
  ClaimModel,
  TestNameItemsPoolModel,
  CoreStandardModel,
  ReleaseDateModel
} from "../ItemSearch/ItemSearchModels";
import { ItemCardModel } from "../ItemCard/ItemCardModels";
import { GradeLevels, GradeLevel } from "../GradeLevels/GradeLevels";
import { Filter } from "../Filter/Filter";

// tslint:disable-next-line:no-stateless-class no-unnecessary-class
export class ItemSearch {
  public static filterToSearchApiModel(
    filterModels: FilterCategoryModel[]
  ): SearchAPIParamsModel {
    const gradeLevels = Filter.getSelectedGrade(filterModels);

    const subjects = Filter.getSelectedCodes(FilterType.Subject, filterModels);

    const testNames = Filter.getSelectedCodes(
      FilterType.TestNames,
      filterModels
    );

    const claims = Filter.getSelectedCodes(FilterType.Claim, filterModels);
    const interactionTypes = Filter.getSelectedCodes(
      FilterType.InteractionType,
      filterModels
    );

    const techTypes = Filter.getSelectedCodes(
      FilterType.TechnologyType,
      filterModels
    );

    const calculatorCodes = Filter.getSelectedCodes(
      FilterType.Calculator,
      filterModels
    );

    const catOnly = techTypes
      ? techTypes.some(t => t === FilterType.CAT)
      : undefined;
    const performanceOnly = techTypes
      ? techTypes.some(t => t === FilterType.Performance)
      : undefined;
    const calculator =
      calculatorCodes && calculatorCodes.length > 0
        ? calculatorCodes[0] === "true"
        : undefined;

    const targets = Filter.getSelectedTargets(filterModels);
    const coreStandards = Filter.getSelectedTargets(filterModels);
    const releaseDates = Filter.getSelectedReleaseDates(filterModels);

    return {
      subjects,
      gradeLevels,
      claims,
      interactionTypes,
      targets,
      catOnly,
      performanceOnly,
      calculator,
      testNames,
      coreStandards,
      releaseDates
    };
  }

  /**
   * Takes a `SearchAPIParamsModel` and the filter category that has been updated,
   * and updates the search params model accordingly, returning a copy of it with
   * the updated param added/removed.
   *
   * @param {FilterCategoryModel} category
   * @param {SearchAPIParamsModel} currentModel
   */
  public static updateSearchApiModel(
    category: FilterCategoryModel,
    currentModel: SearchAPIParamsModel
  ): SearchAPIParamsModel {
    const newModel = { ...currentModel };

    switch (category.code) {
      case FilterType.Grade:
        newModel.gradeLevels = Filter.getSelectedGrade([category]);
        if (newModel.gradeLevels == GradeLevels.NA)
          newModel.subjects = undefined;
        newModel.testNames = undefined;
        break;
      case FilterType.Calculator:
        const calculatorCodes = Filter.getSelectedCodes(FilterType.Calculator, [
          category
        ]);
        newModel.calculator =
          calculatorCodes && calculatorCodes.length > 0
            ? calculatorCodes[0] === "true"
            : undefined;
        break;
      case FilterType.TechnologyType:
        const techTypes = Filter.getSelectedCodes(FilterType.TechnologyType, [
          category
        ]);
        newModel.catOnly = techTypes
          ? techTypes.some(t => t === FilterType.CAT)
          : undefined;
        newModel.performanceOnly = techTypes
          ? techTypes.some(t => t === FilterType.Performance)
          : undefined;
        break;
      case FilterType.Claim:
        const claimCodes = Filter.getSelectedCodes(category.code, [category]);
        newModel.claims = claimCodes;
        newModel.coreStandards = undefined;
        newModel.targets = undefined;
        break;
      case FilterType.InteractionType:
        const itCodes = Filter.getSelectedCodes(category.code, [category]);
        newModel.interactionTypes = itCodes;
        break;
      case FilterType.Subject:
        const subjectCodes = Filter.getSelectedCodes(category.code, [category]);
        newModel.subjects = subjectCodes;
        newModel.testNames = undefined;
        break;
      case FilterType.Target:
        const targetCodes = Filter.getSelectedTargets([category]);
        newModel.targets = targetCodes;
        break;
      case FilterType.SearchItemId:
        const newItemID = category.filterOptions[0].key;
        newModel.itemId = newItemID;
        break;
      case FilterType.TestNames:
        const testNameCodes = Filter.getSelectedCodes(category.code, [
          category
        ]);
        newModel.testNames = testNameCodes;
        break;
      case FilterType.CoreStandards:
        const CoreStandardsCodes = Filter.getSelectedCoreStandards([category]);
        newModel.coreStandards = CoreStandardsCodes;
        break;
      case FilterType.ReleaseDate:
        const releaseDates = Filter.getSelectedCodes(category.code, [category]);
        newModel.releaseDates = releaseDates;
        break;
      default:
    }

    return newModel;
  }

  /**
   * Takes a `SearchAPIParamsModel` and modifies it in place, removing the
   * dependent params whose parents are no longer visible to the user.
   *
   * @param {SearchAPIParamsModel} searchParams
   * @param {ItemsSearchModel} model
   */
  public static updateDependentSearchParams(
    searchParams: SearchAPIParamsModel,
    model: ItemsSearchModel
  ) {
    const selectedSubjects = (model.subjects || []).filter(
      s => (searchParams.subjects || []).indexOf(s.code) !== -1
    );

    const visibleClaims = selectedSubjects
      .map(s => s.claimCodes || [])
      .reduce((prev, curr) => prev.concat(curr), []);

    const visibleInteractions = selectedSubjects
      .map(s => s.interactionTypeCodes || [])
      .reduce((prev, curr) => prev.concat(curr), []);

    const visibleClaimModels = visibleClaims.map(c =>
      (model.claims || []).find(cm => cm.code === c)
    );

    const visibleTargets = visibleClaimModels
      .filter(
        c => (c ? (searchParams.claims || []).indexOf(c.code) !== -1 : false)
      )
      .map(c => (c ? c.targetCodes || [] : []))
      .reduce((prev, curr) => prev.concat(curr), []);

    //Filter testnames by selected subject
    const visibleTestNames = (model.testNames || []).filter(
      s => (searchParams.testNames || []).indexOf(s.code) !== -1
    );

    searchParams.claims = searchParams.claims
      ? searchParams.claims.filter(c => visibleClaims.indexOf(c) !== -1)
      : undefined;

    searchParams.interactionTypes = searchParams.interactionTypes
      ? searchParams.interactionTypes.filter(
          i => visibleInteractions.indexOf(i) !== -1
        )
      : undefined;
    searchParams.targets = searchParams.targets
      ? searchParams.targets.filter(t => visibleTargets.indexOf(t) !== -1)
      : undefined;

    if (visibleTestNames && visibleTestNames.length > 0) {
      searchParams.testNames = searchParams.testNames
        ? searchParams.testNames.filter(
            c => visibleTestNames[0].code.indexOf(c) !== -1
          )
        : undefined;
    }
    return searchParams;
  }

  public static searchOptionFilterString(
    options: SearchFilterStringTypes[],
    filterType: FilterType,
    defaultOptionKeys?: string[],
    searchApi?: string[]
  ): FilterOptionModel[] {
    let selectedCodes = searchApi;
    if (searchApi === undefined || searchApi.length < 1) {
      selectedCodes = defaultOptionKeys;
    }
    return options.map(o => {
      return {
        filterType,
        label: o.label,
        key: o.code,
        isSelected: (selectedCodes || []).some(s => s === o.code)
      };
    });
  }

  public static searchOptionToFilterGrade(
    options: GradeLevels[],
    filterType: FilterType,
    defaultOptionKeys?: GradeLevels,
    searchApi?: GradeLevels
  ): FilterOptionModel[] {
    let selectedCodes = searchApi;
    if (searchApi === undefined || searchApi === GradeLevels.NA) {
      selectedCodes = defaultOptionKeys;
    }

    return options.map(o => {
      const gradeString = GradeLevel.gradeLevelToString(o) || "";
      const selected = selectedCodes
        ? GradeLevel.gradeLevelContains(selectedCodes, o)
        : false;

      return {
        filterType,
        label: gradeString,
        key: String(o),
        isSelected: selected
      };
    });
  }

  public static searchOptionToFilterTarget(
    options: TargetModel[],
    filterType: FilterType,
    defaultOptionKeys?: string[],
    searchApi?: string[]
  ): FilterOptionModel[] {
    let selectedCodes = searchApi;
    if (searchApi === undefined || searchApi.length < 1) {
      selectedCodes = defaultOptionKeys;
    }

    return options.map(o => {
      return {
        filterType,
        label: o.idLabel,
        key: o.idLabel,
        isSelected: (selectedCodes || []).some(s => s === o.idLabel)
      };
    });
  }

  public static searchOptionToFilterCoreStandard(
    options: CoreStandardModel[],
    filterType: FilterType,
    defaultOptionKeys?: string[],
    searchApi?: string[]
  ): FilterOptionModel[] {
    let selectedCodes = searchApi;
    if (searchApi === undefined || searchApi.length < 1) {
      selectedCodes = defaultOptionKeys;
    }

    return options.map(o => {
      return {
        filterType,
        label:
          o.commonCoreStandardsId.toLowerCase() == "na"
            ? "Math Practice"
            : o.commonCoreStandardsId,
        key: o.commonCoreStandardsId,
        isSelected: (selectedCodes || []).some(
          s => s === o.commonCoreStandardsId
        )
      };
    });
  }

  public static searchOptionToFilterReleaseDates(
    options: SearchFilterStringTypes[],
    filterType: FilterType,
    defaultOptionKeys?: string[],
    searchApi?: string[]
  ): FilterOptionModel[] {
    let selectedCodes = searchApi;
    if (searchApi === undefined || searchApi.length < 1) {
      selectedCodes = defaultOptionKeys;
    }

    return options.map(o => {
      return {
        filterType,
        label: o.label,
        key: o.code,
        isSelected: (selectedCodes || []).some(s => s === o.code)
      };
    });
  }

  public static searchOptionToFilterClaim(
    options: ClaimModel[],
    filterType: FilterType,
    defaultOptionKeys?: string[],
    searchApi?: string[]
  ): FilterOptionModel[] {
    let selectedCodes = searchApi;
    if (searchApi === undefined || searchApi.length < 1) {
      selectedCodes = defaultOptionKeys;
    }

    return options.map(o => {
      return {
        filterType,
        label: o.label,
        key: o.code,
        isSelected: (selectedCodes || []).some(s => s === o.code)
      };
    });
  }

  public static getFilterOptionModel(
    filter: SearchFilterModelTypes,
    searchApi: SearchAPIParamsModel = {},
    defaultOptionKeys?: string[]
  ): FilterOptionModel[] {
    let options: FilterOptionModel[] = [];
    switch (filter.code) {
      case FilterType.Claim:
        options = this.searchOptionToFilterClaim(
          filter.filterOptions,
          filter.code,
          defaultOptionKeys,
          searchApi.claims
        );
        break;
      case FilterType.InteractionType:
        options = this.searchOptionFilterString(
          filter.filterOptions,
          filter.code,
          defaultOptionKeys,
          searchApi.interactionTypes
        );
        break;
      case FilterType.Subject:
        options = this.searchOptionFilterString(
          filter.filterOptions,
          filter.code,
          defaultOptionKeys,
          searchApi.subjects
        );
        break;
      case FilterType.TestNames:
        options = this.searchOptionFilterString(
          filter.filterOptions,
          filter.code,
          defaultOptionKeys,
          searchApi.testNames
        );
        break;
      case FilterType.Grade:
        let grade: GradeLevels;
        if (defaultOptionKeys !== undefined) {
          grade = GradeLevel.stringToGradeLevel(defaultOptionKeys[0]);
        } else {
          grade = GradeLevels.NA;
        }
        options = this.searchOptionToFilterGrade(
          filter.filterOptions,
          filter.code,
          grade,
          searchApi.gradeLevels
        );
        break;
      case FilterType.Target:
        options = this.searchOptionToFilterTarget(
          filter.filterOptions,
          filter.code,
          defaultOptionKeys,
          searchApi.targets
        );
        break;
      case FilterType.TechnologyType:
        const techTypesCodes = this.getTechnologyTypeCodes(searchApi);
        options = this.searchOptionFilterString(
          filter.filterOptions,
          filter.code,
          defaultOptionKeys,
          techTypesCodes
        );
        break;
      case FilterType.Calculator:
        const flagCodes = this.getFlagCodes(searchApi.calculator);
        options = this.searchOptionFilterString(
          filter.filterOptions,
          filter.code,
          defaultOptionKeys,
          flagCodes
        );
        break;
      case FilterType.CoreStandards:
        options = this.searchOptionToFilterCoreStandard(
          filter.filterOptions,
          filter.code,
          defaultOptionKeys,
          searchApi.coreStandards
        );
        break;
      case FilterType.ReleaseDate:
        options = this.searchOptionToFilterReleaseDates(
          filter.filterOptions,
          filter.code,
          defaultOptionKeys,
          searchApi.releaseDates
        );
        break;
      default:
    }

    return options;
  }

  public static getTechnologyTypeCodes(search: SearchAPIParamsModel): string[] {
    const codes: string[] = [];
    if (search.catOnly !== undefined) {
      codes.push(FilterType.CAT);
    }
    if (search.performanceOnly !== undefined) {
      codes.push(FilterType.Performance);
    }

    return codes;
  }

  public static getFlagCodes(searchFlag?: boolean): string[] {
    const codes: string[] = [];
    if (searchFlag !== undefined) {
      codes.push(String(searchFlag));
    }

    return codes;
  }

  public static filterSearchToCategory(
    filter: SearchFilterModelTypes,
    searchApi: SearchAPIParamsModel = {},
    defaultOptionKeys?: string[],
    showControl: boolean = true
  ): FilterCategoryModel {
    const options = this.getFilterOptionModel(
      filter,
      searchApi,
      defaultOptionKeys
    );

    return {
      ...filter,
      disabled: false,
      filterOptions: options,
      show: showControl
    };
  }

  public static filterItemCards(
    itemCards: ItemCardModel[],
    filter: SearchAPIParamsModel,
    testItemsPool: TestNameItemsPoolModel[]
  ): ItemCardModel[] {
    let results = itemCards;
    //restrict load item until selection of grade and subject
    if (
      filter.gradeLevels == undefined ||
      filter.gradeLevels == GradeLevels.NA ||
      filter.subjects == undefined ||
      (filter.subjects !== undefined && filter.subjects.length <= 0)
    ) {
      return (results = []);
    }

    // item
    if (filter.itemId && filter.itemId !== "") {
      results = results.filter(i =>
        i.itemKey.toString().includes(filter.itemId || "")
      );
    }

    // grade level
    if (filter.gradeLevels && filter.gradeLevels !== GradeLevels.NA) {
      results = results.filter(i =>
        GradeLevel.gradeLevelContains(
          filter.gradeLevels || GradeLevels.NA,
          i.grade
        )
      );
    }

    // subjects
    if (filter.subjects !== undefined && filter.subjects.length > 0) {
      const { subjects } = filter;
      results = results.filter(
        i => subjects.findIndex(s => s === i.subjectCode) !== -1
      );
    }

    // interaction types
    if (filter.interactionTypes && filter.interactionTypes.length > 0) {
      const { interactionTypes } = filter;
      results = results.filter(
        i =>
          interactionTypes.findIndex(it => it === i.interactionTypeCode) !== -1
      );
    }

    // claims
    if (filter.claims && filter.claims.length > 0) {
      const { claims } = filter;
      results = results.filter(
        i => claims.findIndex(c => c === i.claimCode) !== -1
      );
    }

    // performance & cat
    if (filter.performanceOnly === true || filter.catOnly === true) {
      const performanceTask =
        filter.catOnly !== true || filter.performanceOnly === true;
      results = results.filter(i => i.isPerformanceItem === performanceTask);
    }

    // targets
    if (filter.targets && filter.targets.length > 0) {
      const { targets } = filter;
      results = results.filter(
        i => targets.findIndex(t => t === i.targetId) !== -1
      );
    }

    // calculator
    if (filter.calculator !== undefined) {
      results = results.filter(i => i.calculator === filter.calculator);
    }

    //Filter based on testnames
    if (
      filter.testNames !== undefined &&
      filter.testNames.length > 0 &&
      filter.testNames[0] !== "0" &&
      testItemsPool !== undefined &&
      testItemsPool.length > 0
    ) {
      const testName = filter.testNames;
      // var itemsID = Array<number>();
      var itemsID = Array<TestNameItemsPoolModel>();
      // var itemsID = this.state.testItemsPool.filter(x => x.code == testName[0])
      //   .map(y => y.itemKey);
      var itemsID = testItemsPool.filter(x => x.code == testName[0]);
      var testNameKeys = itemsID[0].itemKeys;
      results = results.filter(function(item) {
        return testNameKeys.find(x => x.itemKey == item.itemKey);
      });
    }

    // core Standards
    if (filter.coreStandards && filter.coreStandards.length > 0) {
      const { coreStandards } = filter;
      results = results.filter(
        i => coreStandards.findIndex(t => t === i.commonCoreStandardId) !== -1
      );
    }

    // release dates
    if (
      filter.releaseDates &&
      filter.releaseDates.length > 0 &&
      filter.releaseDates[0] !== "0"
    ) {
      const { releaseDates } = filter;
      results = results.filter(
        i => releaseDates.findIndex(t => t === i.releaseDate) !== -1
      );
    }

    return results;
  }
}
