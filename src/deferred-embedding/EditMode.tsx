import React from "react";
import { SlotConfig, PatchType, getNewConfig } from "./hooks";
import * as cat from "../md/full";
import {IFilter} from "@gooddata/sdk-model";
import {filterObjRef} from "@gooddata/sdk-model/esm/execution/filter";
import {objRefToString} from "@gooddata/sdk-model/esm/objRef";

const insightsMap = cat.Insights;
const insightsList = Object.keys(insightsMap) as Array<keyof typeof insightsMap>;

export const EditMode = ({config, patch, filters}: {config: SlotConfig, patch: PatchType, filters: IFilter[]}) => {
    const completeConfig = config || getNewConfig();

    const setAllowed = React.useCallback(e => {
        const opts = Array.from(e.target.selectedOptions, (o: HTMLOptionElement) => o.value);
        const thePatch: Partial<SlotConfig> = {allowedOptions: opts};

        if (!config.defaultSelection || !opts.includes(config.defaultSelection)) {
            thePatch.defaultSelection = opts[0];
        }

        if (!config.userSelection || !opts.includes(config.userSelection)) {
            thePatch.userSelection = opts[0];
        }

        patch(thePatch);
    }, [patch, config]);

    const setDefault = React.useCallback(({target: {value}}) => {
        patch({defaultSelection: value, userSelection: value})
    }, [patch]);

    const setFilter = React.useCallback(({target: {value}}) => {
        patch({filters: arrayToggle(config.filters, value)});
    }, [patch, config.filters]);

    return <div>
        <div>
            Allowed insights:<br />
            <select multiple style={styles.multiselect} value={completeConfig.allowedOptions} onChange={setAllowed}>
                {insightsList.map(insightKey => <option key={insightKey} value={insightsMap[insightKey]}>{insightKey}</option>)}
            </select>
        </div>
        <div>
            Default insight:<br />
            <select value={completeConfig.defaultSelection} onChange={setDefault}>
                <option value={undefined}>Select the insight</option>
                {completeConfig.allowedOptions.map(key => <option key={key} value={key}>{Object.entries(insightsMap).find(entry => entry[1] === key)?.[0] ?? key}</option>)}
            </select>
        </div>
        <div>
            Include filters:<br />
            {filters.map(filter => {
                const id = objRefToString(filterObjRef(filter)!);
                return <div key={id}>
                    <label><input type="checkbox" value={id} onChange={setFilter} checked={completeConfig.filters.includes(id)} />&nbsp;{id}</label>
                </div>;
            })}
        </div>
    </div>
};

const arrayToggle = <T extends any>(arr: T[], item: T): T[] => {
    const ind = arr.indexOf(item);
    if (ind !== -1) {
        return [...arr.slice(0, ind), ...arr.slice(ind + 1)];
    }

    return [...arr, item];
};

const styles: {[name: string]: React.CSSProperties} = {
    multiselect: {
        width: 300,
        height: 300,
    }
};
