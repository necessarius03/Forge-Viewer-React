import React from "react";
import PropTypes from 'prop-types';

const { Autodesk } = window;

const runtime = {
   option: null,
   ready: null,
};

function initializeViewerRuntime(options) {
    if (!runtime.ready) {
        runtime.options = { ...options };
        runtime.ready = new Promise((resolve) => Autodesk.Viewing.Initializer(runtime.options, resolve));
    } else {
        if (['accessToken', 'getAccessToken', 'env', 'api', 'language'].some(prop => options[prop] !== runtime.options[prop])) {
            return Promise.reject('Cannot initialize another viewer runtime with different settings.')
        }
    }
    return runtime.ready;
}

class Viewer extends React.Component {
    constructor(props) {
        super(props);
        /** @type {HTMLDivElement} */
        this.container = null;
        /** @type {Autodesk.Viewing.GuiViewer3D} */
        this.viewer = null;
    }

    componentDidMount() {
        initializeViewerRuntime(this.props.runtime || {})
            .then(_ => {
                this.viewer = new Autodesk.Viewing.GuiViewer3D(this.container);
                this.viewer.start();
                this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onViewerCameraChange);
                this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onViewerSelectionChange);
                this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.onGeometryLoaded);
                this.updateViewerState({});
            })
            .catch(err => console.error('Error initializing viewer:', err));
    }

    componentWillUnmount() {
        if (this.viewer) {
            this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onViewerCameraChange);
            this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onViewerSelectionChange);
            this.viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.onGeometryLoaded);
            this.viewer.finish();
            this.viewer = null;
        }
    } 

    onGeometryLoaded = (event) => {
        console.log('Geometry loaded', event);
        if (this.props.onGeometryLoaded) {
            this.props.onGeometryLoaded(this.viewer);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.viewer) {
            this.updateViewerState(prevProps);
        }
    }

    updateViewerState(prevProps) {
        if (this.props.urn && this.props.urn !== prevProps.urn) {
           Autodesk.Viewing.Document.load(
               'urn:' + this.props.urn,
               (doc) => {
                   const viewables = doc.getRoot().getDefaultGeometry();
                   if (viewables) {
                       this.viewer.loadDocumentNode(doc, viewables);
                   } else {
                       console.error('Document contains no viewables.');
                   }
               },
               (code, message, errors) => {
                   console.error('Failed to load document.', code, message, errors);
                   // Thông báo lỗi cho người dùng
                   if (this.container) {
                       this.container.innerHTML = `<p>Error loading model: ${message}</p>`;
                   }
               }
           );
       } else if (!this.props.urn && this.viewer.model) {
           this.viewer.unloadModel(this.viewer.model);
       } 

        const selectedIds = this.viewer.getSelection();
        if (JSON.stringify(this.props.selectedIds || []) !== JSON.stringify(selectedIds)) {
            this.viewer.select(this.props.selectedIds);
        }
    }

    onViewerCameraChange = () => {
        if (this.props.onCameraChange) {
            this.props.onCameraChange({ viewer: this.viewer, camera: this.viewer.getCamera() });
        }
    }

    onViewerSelectionChange = () => {
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange({ viewer: this.viewer, ids: this.viewer.getSelection() });
        }
    }

    render() {
        return <div ref={ref => this.container = ref}></div>;
    }
}

Viewer.propTypes = {

    runtime: PropTypes.object,

    urn: PropTypes.string,

    selectedIds: PropTypes.arrayOf(PropTypes.number),

    onCameraChange: PropTypes.func,

    onSelectionChange: PropTypes.func,

    onGeometryLoaded: PropTypes.func,
};

export default Viewer;