import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import {
    crudUpdate as crudUpdateAction,
    startUndoable as startUndoableAction,
} from 'ra-core';

import { DROP_TARGET_TYPE } from './constants';

const dragSourceSpecs = {
    beginDrag(props) {
        return props.node;
    },
    endDrag(
        { basePath, crudUpdate, node, parentSource, resource, startUndoable },
        monitor
    ) {
        if (!monitor.didDrop()) {
            return;
        }

        const droppedOnNode = monitor.getDropResult();
        if (
            typeof droppedOnNode.id === 'undefined' ||
            droppedOnNode.id === node.record[parentSource]
        ) {
            return;
        }

        startUndoable(
            crudUpdate(
                resource,
                node.record.id,
                { ...node.record, [parentSource]: droppedOnNode.id },
                node.record,
                basePath,
                false
            )
        );
    },
};

const dragSourceConnect = (connect, monitor) => ({
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
});

export default compose(
    connect(
        undefined,
        { crudUpdate: crudUpdateAction, startUndoable: startUndoableAction }
    ),
    DragSource(DROP_TARGET_TYPE, dragSourceSpecs, dragSourceConnect)
);
