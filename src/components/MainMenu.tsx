import * as React from "react";
import {Dropdown, Grid, Icon, Image, Input, Menu} from "semantic-ui-react";

interface MainMenuProps {
    onSaveAs: ()=>void;
    onImport: (files: FileList)=>void;
    onOpenDemo: (demoIndex: number)=>void;
}

export class MainMenu extends React.PureComponent<MainMenuProps> {
    private fileRef: React.RefObject<HTMLInputElement>;

    constructor(props: Readonly<MainMenuProps>) {
        super(props);
        this.fileRef = React.createRef();
    }

    openFileDialog = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (this.fileRef.current)
            this.fileRef.current.click();
    };

    importFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            this.props.onImport(e.target.files);
    };

    openDemo = (demoIndex: number) => {
        this.props.onOpenDemo(demoIndex);
    };

    render() {
        return (
            <Menu inverted size="tiny">
                <Menu.Item as='a' header>
                    <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
                    Three.Quarks
                </Menu.Item>

                <Dropdown item simple text='File'>
                    <Dropdown.Menu>
                        <Dropdown.Item text='New' />
                        <Dropdown.Item text='Open...' description='ctrl + o' onClick={this.openFileDialog}/>
                        <Dropdown.Item text='Save as...' description='ctrl + s' onClick={this.props.onSaveAs} />
                        <Dropdown.Item text='Rename' description='ctrl + r' />
                        <Dropdown.Item text='Make a copy' />
                        <Dropdown.Item icon='folder' text='Move to folder' />
                        <Dropdown.Item icon='trash' text='Move to trash' />
                        <Dropdown.Item text='Download As...' />
                        <Dropdown.Divider />
                    </Dropdown.Menu>
                </Dropdown>

                <input ref={this.fileRef} type="file" id="fileElem" multiple accept="application/json" style={{display: "none"}}
                       onChange={this.importFile} />

                <Dropdown item simple text='Demo'>
                    <Dropdown.Menu>
                        <Dropdown.Item text='Demo 1' onClick={() => this.openDemo(0)}/>
                        <Dropdown.Item text='Demo 2' onClick={() => this.openDemo(1)}/>
                        <Dropdown.Item text='Demo 3' onClick={() => this.openDemo(2)}/>
                        <Dropdown.Item text='Demo 4' onClick={() => this.openDemo(3)}/>
                        <Dropdown.Item text='Demo 5' onClick={() => this.openDemo(4)}/>
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown item simple text='Edit'>
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            <Input placeholder='Search...' />
                        </Dropdown.Item>

                        <Dropdown item simple text='Home'>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    name='search'>
                                    Search
                                </Dropdown.Item>
                                <Dropdown.Item name='add'>
                                    Add
                                </Dropdown.Item>
                                <Dropdown.Item name='about'>
                                    Remove
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown.Item name='browse'>
                            <Icon name='grid layout' />
                            Browse
                        </Dropdown.Item>
                        <Dropdown.Item
                            name='messages'
                        >
                            Messages
                        </Dropdown.Item>

                        <Dropdown item simple text='More'>
                            <Dropdown.Menu>
                                <Dropdown.Item icon='edit' text='Edit Profile' />
                                <Dropdown.Item icon='globe' text='Choose Language' />
                                <Dropdown.Item icon='settings' text='Account Settings' />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown item simple text='Tools'>
                    <Dropdown.Menu>
                        <Dropdown.Item>List Item</Dropdown.Item>
                        <Dropdown.Item>List Item</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Header>Header Item</Dropdown.Header>
                        <Dropdown item simple text='Dropdown'>
                            <Dropdown.Menu>
                                <Dropdown.Item>List Item</Dropdown.Item>
                                <Dropdown.Item>List Item</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown.Item>List Item</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Menu.Item as='a'>About</Menu.Item>
            </Menu>);
    }
}