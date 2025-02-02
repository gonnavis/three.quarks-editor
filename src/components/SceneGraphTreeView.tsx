import React from "react";
import {AppContext} from "./ApplicationContext";
import {Object3D, Scene} from "three";
import {ParticleEmitter} from "three.quarks";
import './SceneGraphView.scss';
import {Item, Menu, MenuProvider, Separator, Submenu} from "react-contexify";
import {MenuItemEventHandler} from "react-contexify/lib/types";
import 'react-contexify/dist/ReactContexify.min.css';
import {TreeView} from "@mui/lab";
import {Box, styled, SvgIconProps} from "@mui/material";
import TreeItem, { TreeItemProps, TreeItemClassKey } from "@mui/lab/TreeItem";
import {Typography} from "@mui/material";
import {CodeExporter} from "../util/CodeExporter";
import {ScrollDialog} from "./ScrollDialog";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CollectionsIcon from '@mui/icons-material/Collections';
import CodeIcon from '@mui/icons-material/Code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface SceneGraphViewMaterialProps {
    context: AppContext;
    scene: Scene;
}


declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
};
/*
const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        labelText,
        ...other
    } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Box sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        <Typography variant="body2">
                            {labelText}
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            {...other}
        />
    );
}*/

export const SceneGraphTreeView: React.FC<SceneGraphViewMaterialProps> = (props) => {
    const [selected, setSelected] = React.useState<string>("");
    const [expanded, setExpanded] = React.useState<string[]>(['1']);

    const [code, setCode] = React.useState<string>('');

    const countIndex = (index: number, object3d: Object3D): [Object3D | null, number] => {
        if (index === 0)
            return [object3d, 0];
        index --;
        for (const child of object3d.children) {
            const [res, newIndex] = countIndex(index, child);
            if (res)
                return [res, newIndex];
            index = newIndex;
        }
        return [null, index];
    }
    const handleSelect = (event: React.ChangeEvent<any>, nodeIds: string) => {
        if (nodeIds.length > 0) {
            const index = parseInt(nodeIds);
            const [object3d, ] = countIndex(index, props.scene);
            if (object3d) {
                props.context.actions.select(object3d);
            }
        }
        setSelected(nodeIds);
    };
    const handleToggle = (event: React.ChangeEvent<any>, nodeIds: string[]) => {
        //console.log(event.target);
        if ((event.target as HTMLElement).tagName === 'svg') {
            setExpanded(nodeIds);
        }
    };

    const getObjectName = (object3d: Object3D) => {
        let type = 'object';
        if (object3d instanceof ParticleEmitter) {
            type = 'ParticleSystem';
        } else {
            type =  object3d.type;
        }
        let name = 'unnamed';
        if (object3d.name) {
            name = object3d.name;
        }
        return `[${type}] ${name}`;
    };

    const renderObject = (context: AppContext, object3d: THREE.Object3D, index: number): [React.ReactNode, number] => {
        const items = [];
        const originIndex = index;
        index ++;
        for (const child of object3d.children) {
            const result = renderObject(context, child, index);
            items.push(result[0]);
            index = result[1];
        }
        //selected={context.selection.indexOf(object3d) !== -1}
        if (originIndex !== 0) {
            let icon;
            switch (object3d.type) {
                case "BatchedParticleRenderer":
                    icon = <CodeIcon/>;
                    break;
                case "ParticleSystemBatch":
                    icon = <CodeIcon/>;
                    break;
                case "ParticleEmitter":
                    icon = <CodeIcon/>;
                    break;
                case "AmbientLight":
                    icon = <LightbulbIcon/>;
                    break;
                case "Group":
                    icon = <CollectionsIcon/>;
                    break;
                default:
                    icon = <CodeIcon/>;
                    break;
            }

            return [<TreeItem key={object3d.uuid} nodeId={originIndex + ""}
                              label={<MenuProvider id="scene-graph-menu" data={{object3d: object3d}}>{getObjectName(object3d) + " " + originIndex}</MenuProvider>}>
                {items}
            </TreeItem>, index];
        } else {
            return [<React.Fragment>{items}</React.Fragment>, index];
        }
    }

    const onContextMenuClick = ({event, props}: MenuItemEventHandler) => console.log(event,props);

    const onContextMenuAddParticleSystem = ({event, props: contextProps}: MenuItemEventHandler) => {
        if ((contextProps as any).object3d) {
            props.context.actions.addObject3d('particle', (contextProps! as any).object3d);
        }
    };
    const onContextMenuRemove = ({event, props: contextProps}: MenuItemEventHandler) => {
        if ((contextProps as any).object3d) {
            props.context.actions.removeObject3d((contextProps! as any).object3d);
        }
    };

    const onContextMenuDuplicate = ({event, props: contextProps}: MenuItemEventHandler) => {
        if ((contextProps as any).object3d) {
            props.context.actions.duplicateObject3d((contextProps! as any).object3d);
        }
    };

    const onContextMenuExport = ({event, props: contextProps}: MenuItemEventHandler) => {
        console.log(contextProps);
        if ((contextProps! as any).object3d) {
            const a = document.createElement("a");
            const json = (contextProps! as any).object3d.toJSON();
            //json.images.forEach((image: any) => image.url = "http://localhost:3000/textures/texture1.png");
            const file = new Blob([JSON.stringify(json)], {type: "application/json"});
            a.href = URL.createObjectURL(file);
            a.download = "scene.json";
            a.click();
        }
    };

    const onContextMenuCopyCode = ({event, props: contextProps}: MenuItemEventHandler) => {
        if ((contextProps! as any).object3d) {
            setCode(CodeExporter.exportCode((contextProps! as any).object3d));
        }
    }

    const renderScene = (context: AppContext, scene: THREE.Scene) => {
        return <TreeView
            sx={{height: 240,
                flexGrow: 1}}
            selected={selected}
            expanded={expanded}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            multiSelect={false}
        >
            {renderObject(context, scene, 0)[0]}
        </TreeView>;
    }

    return <Box sx={{height: 270, flexGrow: 1, overflow: 'auto' }}>
        <Typography sx={{
            fontSize: theme => theme.typography.pxToRem(15),
            fontWeight: theme =>theme.typography.fontWeightRegular}}> Scene Graph </Typography>
        {renderScene(props.context, props.scene)}
        <Menu id="scene-graph-menu">
            <Submenu label="Add">
                <Item onClick={onContextMenuAddParticleSystem}>Particle System</Item>
                <Item onClick={onContextMenuClick}>Ball</Item>
            </Submenu>
            <Separator />
            <Item onClick={onContextMenuDuplicate}>Duplicate</Item>
            <Item onClick={onContextMenuRemove}>Remove</Item>
            <Separator />
            <Item onClick={onContextMenuExport}>Export</Item>
            <Item onClick={onContextMenuCopyCode}>Copy JS Code</Item>
        </Menu>
        <ScrollDialog content={code} open={code !== ''} handleClose={()=>{setCode('')}} />
    </Box>;
}
