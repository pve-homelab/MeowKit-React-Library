import clsx from 'clsx';
import { useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { Icon, type IconName } from '../icon';
import styles from './styles.module.css';

export interface FileExplorerNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileExplorerNode[];
}

export interface FileExplorerTreeProps {
  nodes: FileExplorerNode[];
  selectedId?: string;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onSelect?: (id: string) => void;
  onExpandedChange?: (ids: string[]) => void;
}

function iconName(type: FileExplorerNode['type']): IconName {
  switch (type) {
    case 'file':
      return 'file';
    case 'folder':
      return 'folder';
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

function addId(ids: string[], id: string) {
  return ids.includes(id) ? ids : [...ids, id];
}

function removeId(ids: string[], id: string) {
  return ids.filter((item) => item !== id);
}

export function InternalFileExplorerTree({
  nodes,
  selectedId,
  expandedIds,
  defaultExpandedIds,
  onSelect,
  onExpandedChange,
}: FileExplorerTreeProps) {
  const isExpandedControlled = expandedIds !== undefined;
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState(defaultExpandedIds ?? []);
  const currentExpandedIds = isExpandedControlled ? expandedIds : uncontrolledExpandedIds;

  function commitExpanded(next: string[]) {
    if (!isExpandedControlled) {
      setUncontrolledExpandedIds(next);
    }
    onExpandedChange?.(next);
  }

  function expand(id: string) {
    if (currentExpandedIds.includes(id)) {
      return;
    }
    commitExpanded(addId(currentExpandedIds, id));
  }

  function collapse(id: string) {
    if (!currentExpandedIds.includes(id)) {
      return;
    }
    commitExpanded(removeId(currentExpandedIds, id));
  }

  function toggle(id: string) {
    commitExpanded(
      currentExpandedIds.includes(id)
        ? removeId(currentExpandedIds, id)
        : addId(currentExpandedIds, id),
    );
  }

  function handleClick(event: MouseEvent, node: FileExplorerNode) {
    event.stopPropagation();
    onSelect?.(node.id);
    if (node.type === 'folder') {
      toggle(node.id);
    }
  }

  function handleKeyDown(event: KeyboardEvent, node: FileExplorerNode) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect?.(node.id);
        return;
      case 'ArrowRight':
        if (node.type === 'folder') {
          event.preventDefault();
          expand(node.id);
        }
        return;
      case 'ArrowLeft':
        if (node.type === 'folder') {
          event.preventDefault();
          collapse(node.id);
        }
        return;
      default:
        return;
    }
  }

  function renderNode(node: FileExplorerNode, level: number) {
    const expanded = node.type === 'folder' && currentExpandedIds.includes(node.id);
    const selected = selectedId === node.id;
    const children = node.children ?? [];

    return (
      <div
        key={node.id}
        role="treeitem"
        aria-label={node.name}
        aria-selected={selected}
        aria-expanded={node.type === 'folder' ? expanded : undefined}
        aria-level={level}
        tabIndex={0}
        className={clsx(styles.item, selected && styles.selected)}
        style={{ '--mk-tree-level': level } as CSSProperties}
        onClick={(event) => handleClick(event, node)}
        onKeyDown={(event) => handleKeyDown(event, node)}
      >
        <span className={styles.row}>
          <span className={styles.chevron}>
            {node.type === 'folder' ? (
              <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size="sm" />
            ) : null}
          </span>
          <Icon name={iconName(node.type)} size="sm" />
          <span className={styles.name}>{node.name}</span>
        </span>
        {expanded && children.length > 0 ? (
          <div role="group" className={styles.group}>
            {children.map((child) => renderNode(child, level + 1))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div role="tree" className={styles.root}>
      {nodes.map((node) => renderNode(node, 1))}
    </div>
  );
}
