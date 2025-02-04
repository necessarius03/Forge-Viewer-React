import React from 'react';
import Viewer from './Viewer';
import DataGrid from './components/DataGrid';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.wrapper = null;
        this.state = {
            camera: null,
            selectedIds: [],
            viewerReady: false
        };
    }

    onInputChange = (ev) => {
        const val = ev.target.value.trim();
        const ids = val.split(',').filter(e => e.length > 0).map(e => parseInt(e)).filter(e => Number.isInteger(e));
        this.setState({ selectedIds: ids });
    }

    onGeometryLoaded = (viewer) => {
        console.log('Geometry loaded, viewer ready');
        this.setState({ viewerReady: true });
    }

    render() {
        const { token, urn } = this.props;
        return (
            <div className="app">
                <div style={{ 
                    position: 'absolute', 
                    left: '0', 
                    bottom: '0', 
                    width: '63%', 
                    height: '80%' }}>
                    <Viewer
                        runtime={{ accessToken: token }}
                        urn={urn}
                        selectedIds={this.state.selectedIds}
                        // onCameraChange={({ viewer, camera }) => this.setState({ camera: camera.getWorldPosition() })}
                        onSelectionChange={({ viewer, ids }) => this.setState({ selectedIds: ids })}
                        onGeometryLoaded={this.onGeometryLoaded}
                        ref={ref => this.wrapper = ref}
                    />
                </div>
                <div style={{ 
                    position: 'absolute',
                    right: '0',
                    bottom: '0',
                    height: '80%',
                    width: '35%' }}>
                    {this.state.viewerReady && this.wrapper && this.wrapper.viewer && (
                        <DataGrid viewer={this.wrapper.viewer} />
                    )}
                </div>
                {/* <div>
                    Camera Position:
                    {this.state.camera && `${this.state.camera.x.toFixed(2)} ${this.state.camera.y.toFixed(2)} ${this.state.camera.z.toFixed(2)}`}
                </div> */}
                <div>
                    Selected IDs:
                    <input type="text" value={this.state.selectedIds.join(',')} onChange={this.onInputChange}></input>
                </div>
                <button onClick={() => this.wrapper && this.wrapper.viewer && this.wrapper.viewer.autocam.goHome()}>Reset View</button>
            </div>
        );
    }
}

export default App;