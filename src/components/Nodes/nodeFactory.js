/** @format */

export const nodeFactory = (identifier, settings, dataComposer) => {
    const defaults = {
        draggable: true,
        selectable: true,
    };

    let id = 1;
    const getNodeId = () => `${identifier}_${id++}`;

    return position => {
        const nodeId = getNodeId();
        return {
            ...defaults,
            id: nodeId,
            type: identifier,
            position,
            data: dataComposer(nodeId),
            settingsRenderer: settings.bind(null, { nodeId }),
        };
    };
};
