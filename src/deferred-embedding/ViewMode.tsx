import { InsightView } from "@gooddata/sdk-ui-ext";
import { SlotConfig } from "./hooks";
import React from "react";
import {IFilter} from "@gooddata/sdk-model";
import {filterObjRef, isPositiveAttributeFilter} from "@gooddata/sdk-model/esm/execution/filter";
import {objRefToString} from "@gooddata/sdk-model/esm/objRef";

type IInsightViewProps = React.ComponentProps<typeof InsightView>;

type ViewModeProps = Omit<IInsightViewProps, "insight" | "filters"> & {
    slotConfig: SlotConfig,
    filters?: IFilter[],
};

export const ViewMode = ({slotConfig, filters, ...restProps}: ViewModeProps) => {
    let insight = slotConfig.userSelection || slotConfig.defaultSelection;

    if (!insight || !slotConfig.allowedOptions.includes(insight)) {
        insight = slotConfig.allowedOptions[0];
    }

    if (!insight)
        return null;

    const appliedFilters = filters?.filter(filter => {
        return includesFilter(slotConfig.filters, filter);
    }) ?? [];

    return <div style={{width: "100%", flex: 1}}>
        <InsightView insight={insight} filters={appliedFilters} {...restProps} />
    </div>;
};

// This is wrong, both logic-wise and code-wise. Good enough for PoC
// TODO - we should also check if given filter makes sense for given visualization
//  not sure how it would act if I assign an invalid filter - throw or ignore?
const includesFilter = (configFilters: string[], testFilter: IFilter): boolean => {
    if (!isPositiveAttributeFilter(testFilter))
        throw new Error("This PoC only supports positive attribute filters");

    return configFilters.includes(objRefToString(filterObjRef(testFilter)));
};
