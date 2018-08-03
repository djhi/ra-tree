import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { TreeController } from 'ra-tree-core';
import { DragDropContext } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import draggable from './draggable';
import droppable from './droppable';
import DragLayer from './DragLayer';
import DefaultDragPreview from './DragPreview';
import DefaultTreeNode from './TreeNode';
import DefaultTreeNodeContent from './TreeNodeContent';
import DefaultTreeNodeWithChildren from './TreeNodeWithChildren';
import RootDropTarget from './RootDropTarget';

export const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
};

const sanitizeRestProps = ({
    currentSort,
    defaultTitle,
    displayedFilters,
    filterValues,
    hasBulkActions,
    hasCreate,
    hideFilter,
    isLoading,
    getTreeState,
    perPage,
    selectedIds,
    setFilters,
    setPage,
    setPerPage,
    setSelectedIds,
    setSort,
    showFilter,
    ...rest
}) => rest;

export const Tree = ({
    allowDropOnRoot,
    children,
    classes,
    dragPreviewComponent,
    enableDragAndDrop,
    parentSource,
    treeNodeComponent,
    treeNodeWithChildrenComponent,
    treeNodeContentComponent,
    ...props
}) => {
    const Container = enableDragAndDrop
        ? DragDropContext(
              TouchBackend({
                  enableKeyboardEvents: true,
                  enableMouseEvents: true,
                  enableTouchEvents: true,
              })
          )('div')
        : Fragment;

    const TreeNode = enableDragAndDrop
        ? droppable(treeNodeComponent)
        : treeNodeComponent;

    const TreeNodeContent = enableDragAndDrop
        ? draggable(treeNodeContentComponent)
        : treeNodeContentComponent;

    return (
        <TreeController parentSource={parentSource} {...props}>
            {({ getTreeState, tree, ...props }) => (
                <Container>
                    {enableDragAndDrop ? (
                        <DragLayer
                            dragPreviewComponent={dragPreviewComponent}
                        />
                    ) : null}
                    <List
                        classes={{
                            root: classes.root,
                        }}
                        dense
                        disablePadding
                    >
                        {enableDragAndDrop && allowDropOnRoot ? (
                            <RootDropTarget parentSource={parentSource} />
                        ) : null}
                        {tree.map(node => (
                            <TreeNode
                                key={`TreeNode_${node.id}`}
                                classes={{
                                    ...classes,
                                    root: classes.node || undefined,
                                }}
                                getTreeState={getTreeState}
                                node={node}
                                treeNodeComponent={TreeNode}
                                treeNodeWithChildrenComponent={
                                    treeNodeWithChildrenComponent
                                }
                                treeNodeContentComponent={TreeNodeContent}
                                {...sanitizeRestProps(props)}
                            >
                                {children}
                            </TreeNode>
                        ))}
                    </List>
                </Container>
            )}
        </TreeController>
    );
};

Tree.propTypes = {
    allowDropOnRoot: PropTypes.bool,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node,
    classes: PropTypes.object,
    enableDragAndDrop: PropTypes.bool,
    getTreeFromArray: PropTypes.func,
    parentSource: PropTypes.string,
    resource: PropTypes.string.isRequired,
    dragPreviewComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
    treeNodeComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    treeNodeContentComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
    treeNodeWithChildrenComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
};

Tree.defaultProps = {
    classes: {},
    parentSource: 'parent_id',
    dragPreviewComponent: DefaultDragPreview,
    treeNodeComponent: DefaultTreeNode,
    treeNodeContentComponent: DefaultTreeNodeContent,
    treeNodeWithChildrenComponent: DefaultTreeNodeWithChildren,
};

export default withStyles(styles)(Tree);
