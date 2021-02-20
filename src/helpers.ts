import { CSSProperties, Nullable } from './types';

const createDiv = (height: number): HTMLDivElement => {
  const div = document.createElement('div');
  div.style.top = '0';
  div.style.right = '0';
  div.style.width = '5px';
  div.style.position = 'absolute';
  div.style.cursor = 'col-resize';
  div.style.userSelect = 'none';
  div.style.height = height + 'px';
  return div;
};

const paddingDiff = (col: HTMLTableRowElement): number => {
  if (getStyleVal(col, 'box-sizing') === 'border-box') return 0;
  let padLeft = getStyleVal(col, 'padding-left');
  let padRight = getStyleVal(col, 'padding-right');
  return parseInt(padLeft) + parseInt(padRight);
};

const getStyleVal = (elm: HTMLTableRowElement, css: CSSProperties): string =>
  window.getComputedStyle(elm, null).getPropertyValue(css);

const setListeners = (div: HTMLDivElement): void => {
  let pageX: Nullable<number>,
    curCol: Nullable<HTMLTableRowElement>,
    nxtCol: Nullable<HTMLTableRowElement>,
    curColWidth: Nullable<number>,
    nxtColWidth: Nullable<number>;

  div.addEventListener('mousedown', e => {
    curCol = (e.target as HTMLDivElement).parentElement as HTMLTableRowElement;
    if (!curCol) return;
    nxtCol = curCol.nextElementSibling as HTMLTableRowElement;
    pageX = e.pageX;
    let padding = paddingDiff(curCol);
    curColWidth = curCol.offsetWidth - padding;
    if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
  });

  div.addEventListener('mouseover', e => {
    if (!e.target) return;
    (e.target as HTMLDivElement).style.borderRight = '2px solid red';
  });

  div.addEventListener('mouseout', e => {
    if (!e.target) return;
    (e.target as HTMLDivElement).style.borderRight = '';
  });

  document.addEventListener('mousemove', e => {
    if (!curCol || !pageX || !nxtColWidth || !curColWidth) return;

    const diffX = e.pageX - pageX;
    if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + 'px';
    curCol.style.width = curColWidth + diffX + 'px';
  });

  document.addEventListener('mouseup', () => {
    curCol = null;
    nxtCol = null;
    pageX = null;
    nxtColWidth = null;
    curColWidth = null;
  });
};

export const resizableColumns = (table: HTMLTableElement): void => {
  const cols = table.getElementsByTagName('tr')[3]?.children;
  if (!cols) return;
  table.style.overflow = 'hidden';
  const tableHeight = table.offsetHeight;
  for (let i = 0; i < cols.length; i++) {
    const div = createDiv(tableHeight);
    cols[i].appendChild(div);
    (cols[i] as HTMLTableColElement).style.position = 'relative';
    setListeners(div);
  }
};

const createRowResizer = (width: number): HTMLDivElement => {
  const div = document.createElement('div');
  div.style.bottom = '0';
  div.style.left = '0';
  div.style.height = '5px';
  div.style.position = 'absolute';
  div.style.cursor = 'row-resize';
  div.style.userSelect = 'none';
  div.style.width = width + 'px';
  return div;
};

const paddingRowDiff = (row: HTMLTableRowElement): number => {
  if (getStyleVal(row, 'box-sizing') === 'border-box') {
    return 0;
  }

  let padTop = getStyleVal(row, 'padding-top');
  let padBottom = getStyleVal(row, 'padding-bottom');
  return parseInt(padTop) + parseInt(padBottom);
};

const setRowListeners = (div: HTMLDivElement): void => {
  let pageY: Nullable<number>,
    curRow: Nullable<HTMLTableRowElement>,
    nxtRow: Nullable<HTMLTableRowElement>,
    curRowHeight: Nullable<number>,
    nxtRowHeight: Nullable<number>;

  div.addEventListener('mousedown', e => {
    curRow = (e.target as HTMLDivElement).closest('tr');
    if (!curRow) return;
    nxtRow = curRow.nextElementSibling as HTMLTableRowElement;
    pageY = e.pageY;
    let padding = paddingRowDiff(curRow);
    curRowHeight = curRow.offsetHeight - padding;
    if (nxtRow) nxtRowHeight = nxtRow.offsetHeight - padding;
  });

  div.addEventListener('mouseover', e => {
    (e.target as HTMLDivElement).style.borderBottom = '2px solid red';
  });

  div.addEventListener('mouseout', e => {
    (e.target as HTMLDivElement).style.borderBottom = '';
  });

  document.addEventListener('mousemove', e => {
    if (!curRow || !pageY || !nxtRowHeight || !curRowHeight) return;
    const diffY = e.pageY - pageY;
    if (nxtRow) nxtRow.style.height = nxtRowHeight - diffY + 'px';
    curRow.style.height = curRowHeight + diffY + 'px';
  });

  document.addEventListener('mouseup', () => {
    curRow = null;
    nxtRow = null;
    pageY = null;
    nxtRowHeight = null;
    curRowHeight = null;
  });
};

export const resizableRows = (table: HTMLTableElement): void => {
  const rows = table.getElementsByTagName('tr');
  if (!rows.length) return;
  const offsetWidth = rows[0].offsetWidth;
  for (let i = 0; i < rows.length; i++) {
    const div = createRowResizer(offsetWidth);
    const td = rows[i].querySelector('td:first-child') as HTMLTableColElement;
    td.style.position = 'relative';
    td.appendChild(div);
    setRowListeners(div);
  }
};
