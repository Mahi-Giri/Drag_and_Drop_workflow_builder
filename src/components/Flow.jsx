/** @format */

import { useCallback, useRef } from 'react';

import ReactFlow, { Controls, applyNodeChanges, useReactFlow, addEdge } from 'reactflow';
import { useEdgeStore, useNodeStore } from '@/hooks/useStore';
import { DATA_TRANSFER_MIME_TYPE } from '@/constants/utils';
import MessageNode, { messageNodeFactory, MESSAGE_NODE_IDENTIFIER } from '@/components/Nodes/MessageNode';
import SelectNode, { selectNodeFactory, SELECT_NODE_IDENTIFIER } from '@/components/Nodes/SelectNode';

const flowViewSettings = {
    snapGrid: [20, 20],
    defaultViewport: { x: 0, y: 0, zoom: 1.5 },
    attributionPosition: 'bottom-left',
    fitView: true,
    snapToGrid: true,
};

const nodeTypes = {
    [MESSAGE_NODE_IDENTIFIER]: MessageNode,
    [SELECT_NODE_IDENTIFIER]: SelectNode,
};

const nodeCreator = {
    [MESSAGE_NODE_IDENTIFIER]: messageNodeFactory,
    [SELECT_NODE_IDENTIFIER]: selectNodeFactory,
};

export default function Flow() {
    const reactFlowWrapper = useRef(null);
    const reactFlowInstance = useReactFlow();

    const nodesFromStore = useNodeStore(state => state.nodes);
    const addNode = useNodeStore(state => state.addNode);
    const setNodes = useNodeStore(state => state.setNodes);
    const setSelectedNode = useNodeStore(state => state.setSelectedNode);

    const edgesFromStore = useEdgeStore(state => state.edges);
    const setEdges = useEdgeStore(state => state.setEdges);

    const onNodesChange = useCallback(
        changes => {
            const updates = applyNodeChanges(changes, nodesFromStore);
            setNodes(updates);
        },
        [nodesFromStore, setNodes],
    );

    const onEdgesChange = useCallback(
        changes => {
            const updates = applyNodeChanges(changes, edgesFromStore);
            setEdges(updates);
        },
        [edgesFromStore, setEdges],
    );

    const onDragOver = useCallback(event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }, []);

    const onDrop = useCallback(
        event => {
            event.preventDefault();

            const nodeType = event.dataTransfer.getData(DATA_TRANSFER_MIME_TYPE);
            if (typeof nodeType === 'undefined' || !nodeType) {
                return;
            }

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const newNode = nodeCreator[nodeType](position);
            addNode(newNode);
        },
        [reactFlowInstance, addNode],
    );

    const onSelectionChange = useCallback(
        ({ nodes }) => {
            if (nodes.length) {
                setSelectedNode(nodes[0]);
            }
        },
        [setSelectedNode],
    );

    const onConnect = useCallback(
        params => {
            setEdges(addEdge(params, edgesFromStore));
        },
        [setEdges, edgesFromStore],
    );

    const onNodesDelete = useCallback(() => {
        setSelectedNode(null);
    }, [setSelectedNode]);

    return (
        <ReactFlow
            ref={reactFlowWrapper}
            nodeTypes={nodeTypes}
            nodes={nodesFromStore}
            edges={edgesFromStore}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onEdgesChange={onEdgesChange}
            onNodesChange={onNodesChange}
            onNodesDelete={onNodesDelete}
            onSelectionChange={onSelectionChange}
            selectNodesOnDrag={false}
            {...flowViewSettings}
        >
            <Controls />
        </ReactFlow>
    );
}
