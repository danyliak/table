export type CSSProperties =
  | 'box-sizing'
  | 'padding-left'
  | 'padding-right'
  | 'padding-top'
  | 'padding-bottom';

export type Nullable<T> = T | null;

export type ParsedCell = Nullable<string | number>;

export type ParsedRowInfo = ParsedCell[];

export type ParsedData = ParsedRowInfo[];