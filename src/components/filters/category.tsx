import { useState } from 'react';
import { useCombobox, useMultipleSelection } from 'downshift';
import tw from 'twin.macro';
import { format } from 'd3';

import { CategoryValue } from '../../types';
import { CloseIcon } from '../icons';

interface CategoryFilterProps {
  value?: CategoryValue;
  possibleValues?: CategoryValue[];
  filteredData: any[];
  onChange: (value: any) => void;
}

const formatNumber = format(',');

export function CategoryFilter(props: CategoryFilterProps) {
  const [inputValue, setInputValue] = useState('');

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection<CategoryValue>({
    onStateChange: ({ selectedItems }) => {
      props.onChange(selectedItems);
    },
  });

  const getFilteredItems = (items: CategoryValue[]) =>
    items.filter((item) => {
      return (
        selectedItems.indexOf(item) < 0 &&
        item.value.toLowerCase().startsWith(inputValue.toLowerCase())
      );
    });

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    inputValue,
    items: getFilteredItems(props.possibleValues || []),
    onStateChange: ({ inputValue: stateInputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(stateInputValue || '');
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue('');
            addSelectedItem(selectedItem);
          }

          break;
        default:
          break;
      }
    },
  });

  return (
    <div tw="w-full h-full -m-2 -mt-2" style={{ height: `calc(100% + 1rem)` }}>
      <div tw="h-full w-full">
        <div css={[tw`flex overflow-x-scroll`]}>
          {selectedItems.map((selectedItem, index) => (
            <span
              css={[
                selectedItem.color,
                tw`p-2 flex rounded-full px-4 py-1 mx-2 border-2 whitespace-nowrap cursor-pointer items-center`,
                highlightedIndex === index
                  ? tw`border-indigo-500`
                  : tw`border-white`,
              ]}
              key={`selected-item-${index}`}
              {...getSelectedItemProps({ selectedItem, index })}
            >
              {selectedItem.value}
              <span
                onClick={() => removeSelectedItem(selectedItem)}
                style={{ marginLeft: '5px' }}
              >
                <CloseIcon />
              </span>
            </span>
          ))}
        </div>

        <div {...getComboboxProps()}>
          <input
            css={[
              props?.value ? tw`text-indigo-500` : tw`text-gray-400`,
              tw`h-full w-full px-3 py-3 placeholder-gray-400 border-none bg-white outline-none focus:outline-none w-full overflow-ellipsis`,
            ]}
            placeholder={`Filter ${formatNumber(
              props.filteredData.length
            )} records`}
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
          />
        </div>
      </div>{' '}
      <ul
        {...getMenuProps()}
        tw="absolute min-w-full space-y-1 py-2 bg-white shadow-md z-10"
        className="fade-up-sm-in"
        style={{ marginTop: 1 }}
      >
        {isOpen &&
          getFilteredItems(props.possibleValues || []).map(
            (item: CategoryValue, index: number) => (
              <li
                css={[
                  item.color,
                  tw`p-2 inline-block rounded-full px-4 py-1 mx-2 border-2 whitespace-nowrap cursor-pointer`,
                  highlightedIndex === index
                    ? tw`border-indigo-500`
                    : tw`border-white`,
                ]}
                key={`${item}${index}`}
                {...getItemProps({ item, index, key: item.value })}
              >
                <span tw="overflow-ellipsis max-w-7xl">
                  {item.value} ({item.count.toLocaleString()})
                </span>
              </li>
            )
          )}
      </ul>
    </div>
  );
}
