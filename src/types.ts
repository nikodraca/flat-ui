import { TwStyle } from 'twin.macro';

export type Range = [number, number];

export type FilterMap<T> = Record<string, T>;
export type FilterValue = string | number | Range | CategoryValue[];
export type FilterMethod = 'text' | 'between';

export interface Filter<T> {
  id: string;
  value: T;
}

export interface CategoryValue {
  value: string;
  count: number;
  color: string | TwStyle;
}
