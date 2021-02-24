import * as React from "react";
import {
  getResourceContent,
  ItemCard,
  ItemTableRow,
  ToolTip,
  ItemCardViewer,
  ItemCardModel,
  itemIdEqual,
  AboutItemModel,
  Resource,
  HeaderSortModel,
  SortColumnModel,
  ColumnGroup
} from "@src/index";
import { TestCodeToLabel } from "@src/ItemSearch/ItemSearchModels";

export interface ItemTableProps {
  cardRows: ItemCardModel[];
  onRowExpand: (item: ItemCardModel) => void;
  onRowSelect: (item: ItemCardModel) => void;
  sort: HeaderSortModel[];
  columns: ColumnGroup[];
  expandedRow?: ItemCardModel;
  item?: Resource<AboutItemModel>;
  isLinkTable: boolean;
  isItemSelected: boolean;
  numberOfSelectedItem: number;
  getSelectedItemCount: () => number;
  showErrorModalOnPrintItemsCountExceeded: () => void;
  associatedItems: any[];
  countNumberOfItemsAfterSelection: (
    currentItems: ItemCardModel[],
    selectedItemsCount: number
  ) => number;
  isInterimSite: boolean;
  testCodeToLabelMap: TestCodeToLabel;
}
/**
 * Renders the table populated from an array of ItemCardModels. Also renders an instance of the ItemCardViewer,
 * inserting a responsive sub-table with an iframe that displays the Item Card.
 * @class ItemTable
 * @extends {React.Component<ItemTableProps, {}>}
 */
export class ItemTable extends React.Component<ItemTableProps, {}> {
  constructor(props: ItemTableProps) {
    super(props);
  }

  renderAllRows(): JSX.Element[] {
    const { cardRows } = this.props;
    let rows: JSX.Element[] = [];
    cardRows.forEach(item => {
      rows = rows.concat(this.renderRow(item));
    });

    return rows;
  }

  renderExpandedRow(item: Resource<AboutItemModel>): JSX.Element | undefined {
    let result: JSX.Element | undefined;
    const itemContent = getResourceContent(item);
    if (itemContent) {
      result = (
        <tr key="item-card-viewer">
          <td colSpan={7}>
            <ItemCardViewer item={itemContent} />
          </td>
        </tr>
      );
    }

    return result;
  }

  renderRow(rowData: ItemCardModel): JSX.Element[] {
    const {
      expandedRow,
      columns,
      item,
      isLinkTable,
      onRowExpand,
      onRowSelect
    } = this.props;
    const rows: JSX.Element[] = [];
    const isExpanded =
      expandedRow && itemIdEqual(expandedRow, rowData) ? true : false;

    rows.push(
      <ItemTableRow
        key={`${rowData.bankKey}-${rowData.itemKey}`}
        rowData={rowData}
        hasControls={!isLinkTable}
        columns={columns}
        isExpanded={isExpanded}
        onRowExpand={onRowExpand}
        onRowSelect={onRowSelect}
        isItemSelected={this.props.isItemSelected}
        numberOfSelectedItem={this.props.numberOfSelectedItem}
        getSelectedItemCount={this.props.getSelectedItemCount}
        showErrorModalOnPrintItemsCountExceeded={
          this.props.showErrorModalOnPrintItemsCountExceeded
        }
        associatedItems={this.props.associatedItems}
        countNumberOfItemsAfterSelection={
          this.props.countNumberOfItemsAfterSelection
        }
        isInterimSite={this.props.isInterimSite}
        testCodeToLabelMap={this.props.testCodeToLabelMap}
      />
    );

    if (isExpanded && item) {
      const expandContent = this.renderExpandedRow(item);
      if (expandContent) {
        rows.push(expandContent);
      }
    }

    return rows;
  }

  render() {
    const { cardRows } = this.props;
    let content = <div>No Items.</div>;
    if (cardRows) {
      content = <tbody>{this.renderAllRows()}</tbody>;
    }

    return content;
  }
}
