import React from "react";

export type SlotConfig = {
    // User-specific key - what to show in this slot
    userSelection: string | undefined,
    // The default visualization to be shown, defined by the admin
    defaultSelection: string | undefined,
    // Allowed options for given slot
    allowedOptions: string[],
    // Display to the end user
    display: boolean,
    filters: Array<string>,
};

export const getNewConfig = (): SlotConfig => ({
    userSelection: undefined,
    defaultSelection: undefined,
    allowedOptions: [],
    display: false,
    filters: [],
});

// Mock, will be a real request to the server, user-specific
const loadSlotConfig = async (slotName: string): Promise<SlotConfig> => {
    const slotMapping = localStorage.getItem(`deferred_embedding_poc_${slotName}`);

    if (!slotMapping)
        return getNewConfig();

    return {...getNewConfig(), ...JSON.parse(slotMapping)};
};

const patchSlotConfig = async (slotName: string, config: SlotConfig, patch: Partial<SlotConfig>): Promise<SlotConfig> => {
    const newConfig = {...config, ...patch};

    localStorage.setItem(`deferred_embedding_poc_${slotName}`, JSON.stringify(newConfig));

    return newConfig;
};

export type PatchType = (config: Partial<SlotConfig>) => void;

export const useSlotMapping = (slotName: string): [loading: boolean, config: SlotConfig | null, patchSlotConfig: PatchType] => {
    const [loading, setLoading] = React.useState(true);
    const [config, setConfig] = React.useState<SlotConfig | null>(null);

    const patch = React.useCallback((partial: Partial<SlotConfig>) => {
        if (!config)
            return;

        patchSlotConfig(slotName, config, partial).then(config => {
            setConfig({...config, ...patch});
        });
    }, [slotName, config]);

    React.useEffect(() => {
        loadSlotConfig(slotName).then(config => {
            setConfig(config);
            setLoading(false);
        });
    }, [slotName]);

    return [
        loading,
        config,
        patch,
    ];
};
