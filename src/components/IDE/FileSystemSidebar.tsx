'use client'
import React, { useState } from 'react';
import { List, ListItemButton, ListItemText, Collapse, ListItemIcon, CircularProgress } from '@mui/material';
import { Folder, FolderOpen, InsertDriveFile } from '@mui/icons-material';

export interface FileSystemItem {
    name: string;
    path: string;
    content?: string;
    type: 'dir' | 'file';
}

interface FileSystemSidebarProps {
    files: FileSystemItem[];
    width?: string | number;
    height?: string | number;
    onFolderExpand: (item: FileSystemItem) => Promise<void>;
    onFileClick: (item: FileSystemItem) => void;
}

const FileSystemSidebar: React.FC<FileSystemSidebarProps> = ({ files, width = '300px', height = '100vh', onFolderExpand, onFileClick }) => {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [loadingFolders, setLoadingFolders] = useState<Set<string>>(new Set());

    const handleFolderClick = async (item: FileSystemItem) => {
        const newExpandedFolders = new Set(expandedFolders);
        const newLoadingFolders = new Set(loadingFolders);

        if (newExpandedFolders.has(item.path)) {
            newExpandedFolders.delete(item.path);
        } else {
            newExpandedFolders.add(item.path);
            newLoadingFolders.add(item.path);
            setLoadingFolders(newLoadingFolders);
            await onFolderExpand(item);
            newLoadingFolders.delete(item.path);
        }

        setExpandedFolders(newExpandedFolders);
        setLoadingFolders(newLoadingFolders);
    };

    const renderFileSystem = (parentPath: string, level: number = 0) => {
        return files
            .filter(file => (parentPath === '' && !file.path.includes("/")) || (parentPath !== '' && file.path.startsWith(parentPath) && file.path.split('/').length === parentPath.split('/').length + 1))
            .map(file => {
                const isFolder = file.type === 'dir';
                const isExpanded = expandedFolders.has(file.path);
                const isLoading = loadingFolders.has(file.path);
                let leftPadding = level * 20;
                if (leftPadding === 0) {
                    leftPadding = 4;
                }
                return (
                    <React.Fragment key={file.path}>
                        <ListItemButton 
                            onClick={() => isFolder ? handleFolderClick(file) : onFileClick(file)} 
                            sx={{ 
                                paddingLeft: `${leftPadding}px`, borderRadius: "4px",
                                paddingTop: "4px", paddingBottom: "4px"
                            }}
                        >
                            <ListItemIcon>
                                {isFolder ? (isExpanded ? <FolderOpen fontSize="small" sx={{ fontSize: "14px" }} /> : <Folder fontSize="small" sx={{ fontSize: "14px" }} />) : <InsertDriveFile fontSize="small" sx={{ fontSize: "14px" }} />}
                            </ListItemIcon>
                            <ListItemText primary={file.name} sx={{ '& .MuiTypography-root': { fontSize: '12px' } }} />
                            {isLoading && <CircularProgress size={20} />}
                        </ListItemButton>
                        {isFolder && (
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {renderFileSystem(file.path, level + 1)}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                );
            });
    };

    return (
        <div style={{ width, minHeight: height, overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
            <List>
                {renderFileSystem('')}
            </List>
        </div>
    );
};

export default FileSystemSidebar;
