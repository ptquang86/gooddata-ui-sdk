// (C) 2019-2020 GoodData Corporation
import { ReactWrapper } from "enzyme";
// TODO: RAIL-2760: Migrate to sdk-ui-kit
import { DropdownBody, DropdownButton } from "@gooddata/goodstrap/lib/Dropdown/Dropdown";

import { REPEAT_EXECUTE_ON, REPEAT_FREQUENCIES, REPEAT_TYPES } from "../../../constants";

export const REPEAT_EXECUTE_ON_INDEX = {
    [REPEAT_EXECUTE_ON.DAY_OF_MONTH]: 1,
    [REPEAT_EXECUTE_ON.DAY_OF_WEEK]: 2,
};

export const REPEAT_FREQUENCY_INDEX = {
    [REPEAT_FREQUENCIES.DAY]: 1,
    [REPEAT_FREQUENCIES.WEEK]: 2,
    [REPEAT_FREQUENCIES.MONTH]: 3,
};

export const REPEAT_TYPE_INDEX = {
    [REPEAT_TYPES.DAILY]: 1,
    [REPEAT_TYPES.WEEKLY]: 2,
    [REPEAT_TYPES.MONTHLY]: 3,
    [REPEAT_TYPES.CUSTOM]: 4,
};

export const TEXT_INDEX: string[] = ["zero", "first", "second", "third", "fourth", "last"];

export function getDropdownTitle(wrapper: ReactWrapper): string {
    const dropdown = wrapper.find(DropdownButton);
    return dropdown.find(".gd-button-text").text();
}

export function openDropdown(wrapper: ReactWrapper) {
    const dropdown = wrapper.find(DropdownButton);
    dropdown.simulate("click");
}

export function selectDropdownItem(wrapper: ReactWrapper, index: number) {
    const dropdownItem = wrapper.find(DropdownBody).find(".fixedDataTableRowLayout_rowWrapper").at(index);
    dropdownItem.find(".gd-list-item span").simulate("click");
}
