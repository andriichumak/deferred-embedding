import React from "react";
import {PatchType, SlotConfig} from "./hooks";
import * as cat from "../md/full";

type SlotHeaderProps = {
    canEdit: boolean,
    mode: "edit" | "view",
    setMode: (m: "edit" | "view") => void,
    config: SlotConfig,
    patch: PatchType,
};

const rInsightMap = Object.fromEntries(
    Object.entries(cat.Insights).map(([key, value]) => ([value, key]))
);

export const SlotHeader: React.FC<SlotHeaderProps> = ({
    canEdit= false,
    mode= "view",
    setMode,
    config,
    patch
}) => {
    const button = mode === "edit"
        ? <button type="button" onClick={() => setMode("view")} style={styles.button}>&lt; Back</button>
        : (canEdit
            ? <button type="button" onClick={() => setMode("edit")} style={styles.button}>Configure</button>
            : null
        );
    const selector = config.allowedOptions.length && mode !== "edit"
        ? <select value={config.userSelection} onChange={({target: {value}}) => patch({userSelection: value})}>
            {config.allowedOptions.map(option =>
                <option key={option} value={option}>{rInsightMap[option]}</option>)}
        </select>
        : null;

    return <div style={styles.slotHeader}>
        {selector}
        {button}
    </div>;
}

const styles: {[name: string]: React.CSSProperties} = {
    slotHeader: {
        padding: 5,
        display: "flex",
        width: "100%",
        boxSizing: "border-box",
    },
    button: {
        margin: "0 5px",
    },
};
