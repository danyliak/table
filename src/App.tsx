import {
  useMemo,
  useState,
  useCallback,
  FC,
  Fragment,
  useRef,
  ChangeEvent,
  ReactElement,
} from 'react';
import XLSX from 'xlsx';
import classNames from 'classnames';

import { resizableColumns, resizableRows } from './helpers';
import { ParsedData, ParsedRowInfo, ParsedCell } from './types';
import './App.sass';

const App: FC = () => {
  const [tableData, setTableData] = useState<ParsedData>([]);
  const [maxCols, setMaxCols] = useState<number>(0);
  const tableRef = useRef<HTMLTableElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target || !e.target.files) return;
      const file = e.target.files[0];
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = e => {
        if (!e.target) return;
        const bStr = e.target.result;
        const wb = XLSX.read(bStr, { type: rABS ? 'binary' : 'array' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json<ParsedRowInfo>(ws, { header: 1 });

        setTableData(data);
        setMaxCols(Math.max(...data.map(row => row.length)));

        if (tableRef.current) {
          resizableColumns(tableRef.current);
          resizableRows(tableRef.current);
        }
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    },
    [setTableData, tableRef],
  );

  const renderTd = useMemo(
    () => (row: ParsedRowInfo, td: ParsedCell, rowIndex: number): ReactElement => {
      if (rowIndex === 0)
        return (
          <td colSpan={maxCols} className="table-title">
            {td}
          </td>
        );

      if (row.length === 2 && td)
        return (
          <td colSpan={maxCols - 1} className="sub-header">
            {td}
          </td>
        );

      const isNotANumber = typeof td === 'number' && isNaN(td);

      return (
        <td className={classNames({ 'text-right': !isNotANumber })}>
          {td === 0
            ? '-'
            : isNotANumber
            ? td
            : (td as number)?.toLocaleString('us-US', { style: 'currency', currency: 'USD' })}
        </td>
      );
    },
    [maxCols],
  );

  return (
    <>
      <div className="text-align">
        <label className="upload-label">
          <input type="file" onChange={handleChange} />
          <span>choose a file</span>
        </label>
      </div>
      <div className="table-wrapper">
        <table ref={tableRef}>
          <tbody>
            {tableData.map((row, rowIndex) => {
              const isHeader = row.length === maxCols && !tableData[rowIndex + 1]?.length;
              return (
                <tr
                  key={rowIndex}
                  className={classNames({
                    'empty-row': !row.length,
                    'bold-text': isHeader,
                    summary: rowIndex !== 3 && isHeader,
                    header: rowIndex === 3 && isHeader,
                  })}
                >
                  {row.length ? (
                    row.map((td, tdIndex) => (
                      <Fragment key={tdIndex}>{renderTd(row, td, rowIndex)}</Fragment>
                    ))
                  ) : (
                    <td colSpan={maxCols} />
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default App;
