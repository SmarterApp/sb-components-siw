import {
  ItemTableProps,
  ItemTableContainerProps,
  ItemCardModel
} from "@src/index";
import { aboutItemMockModel } from "@mocks/AboutItem/mocks";
import { itemCardList, sortableItemCards } from "@mocks/index";
import { ItemColumnHeadersConfig, itemColumnsName_NonInterim } from "@src/SearchResultContainer/SearchResultModels";


export const itemTableProps: ItemTableContainerProps = {
  isInterimSite: false,
  isLinkTable: false,
  onRowSelection: () => {
    return;
  },
  onItemSelection: () => {
    return;
  },
  onCountNumberOfItemSelection: () => {
    return;
  },
  itemCards: itemCardList,
  item: {
    kind: "none"
  },

  numberOfSelectedItem: 0,
  getSelectedItemCount: () => {
    return 0;
  },
  showErrorModalOnPrintItemsCountExceeded: () => {
    return;
  },
  associatedItems: [],
  countNumberOfItemsAfterSelection: () => {
    return 0;
  },
  testCodeToLabelMap: { "Test-Name-1": "Test 1", "Test-Name-2": "Test 2" },
  itemColumnHeaderConfig: []
};

export const itemTableSortProps: ItemTableContainerProps = {
  ...itemTableProps,
  item: {
    kind: "none"
  },
  itemCards: sortableItemCards
};

export const tabClassNames = [ 
  "item",
  "stimulus",
  "subject",
  "grade",
  "claim",
  "Target",
  "standard",
  "item-type",
  "answerkeys"
];

export const itemTableSelectProps: ItemTableContainerProps = {
  ...itemTableProps,
  item: {
    kind: "success",
    content: aboutItemMockModel
  }
};

export function getColumnsHeaderConfig_mock() {
  
  const headerModel: ItemColumnHeadersConfig[] = [];
  let i = 0;
  const itemsHeaderName = itemColumnsName_NonInterim;
  itemsHeaderName.forEach(element => {
    let column: ItemColumnHeadersConfig = {
      headerName: element,
      columnIndex: ++i,
      isHidden: false,
      isSortable: true
    };
    headerModel.push(column);
  });
  return headerModel;
};