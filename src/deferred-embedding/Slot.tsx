import React, {ReactElement} from "react";
import { IFilter } from "@gooddata/sdk-model";
import { useSlotMapping } from "./hooks";
import { ViewMode } from "./ViewMode";
import { EditMode } from "./EditMode";
import { SlotHeader } from "./SlotHeader";
import { useUserRole } from "../contexts/UserRole";
import type { InsightView } from "@gooddata/sdk-ui-ext";

type IInsightViewProps = React.ComponentProps<typeof InsightView>;

type SlotProps = Omit<IInsightViewProps, "insight" | "filters"> & {
    name: string,
    filters?: IFilter[],
};

export const Slot = ({name, filters = [], ...restProps}: SlotProps) => {
    const [loading, config, patch] = useSlotMapping(name);
    const [mode, setMode] = React.useState<"edit" | "view">("view");
    const {role} = useUserRole();
    const canEdit = role === "admin";

    let contents: null | ReactElement = null;

    if (loading || !config) {
        // Show nothing to end user, show loading to admin
        contents = role === "viewer" ? null : <div>Loading...</div>;
    }

    else if (role === "admin") {
        // Show UI with an option to edit the insight config
        if (mode === "view") {
            if (!config.allowedOptions.length) {
                // View mode with no configuration - show button in the middle of the screen
                contents = <SlotHeader {...{config, mode, setMode, canEdit, patch}} />;
            } else {
                // View mode with the configuration - show a normal view mode
                contents = <>
                    <SlotHeader {...{config, mode, setMode, canEdit, patch}} />
                    <ViewMode slotConfig={config} filters={filters} {...restProps} />
                </>;
            }
        } else {
            // Edit mode
            contents = <>
                <SlotHeader {...{config, mode, setMode, canEdit, patch}} />
                <EditMode config={config} filters={filters} patch={patch} />
            </>
        }
    }

    // This leaves us with viewer role...
    else {
        // Mode can only be "view", so no need to cover "edit" branch
        if (!config.defaultSelection && !config.userSelection) {
            // Empty view, hide the item from the end user
            contents = null;
        } else {
            // Show the view mode
            contents = <>
                <SlotHeader {...{config, mode, setMode, canEdit, patch}} />
                <ViewMode slotConfig={config} filters={filters} {...restProps} />
            </>
        }
    }

    return <div style={styles.wrapper}>
        {contents}
    </div>;
};

const styles: {[key: string]: React.CSSProperties} = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
    },
};
