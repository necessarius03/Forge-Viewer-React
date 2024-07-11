import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import * as XLSX from 'xlsx';

const { Autodesk } = window;

const DataGrid = ({ viewer }) => {
    const [rowData, setRowData] = useState([]);

    const columnDefs = [
        { headerName: 'ID', field: 'id', filter: 'agNumberColumnFilter' },
        { headerName: 'Name', field: 'name', filter: 'agNumberColumnFilter' },
        { headerName: 'Volume', field: 'volume', filter: 'agNumberColumnFilter' },
        { headerName: 'Area', field: 'area', filter: 'agNumberColumnFilter'},
        { headerName: 'Level', field: 'level', filter: 'agNumberColumnFilter'}
    ];
    
    const defaultColumnDefs = {
        flex: 1,
        minWidth: 100,
        filter: true,
        floatingFilter: true,
        sortable: true,
        // resizable: true,
    }

    const updateGridData = useCallback(() => {
        console.log('Updating grid data...');
        if (!viewer || !viewer.model) {
            console.log('Viewer or model not ready');
            return;
        }

        const instanceTree = viewer.model.getInstanceTree();
        if (!instanceTree) {
            console.log('Instance tree not available');
            return;
        }

        const allDbIds = [];
        instanceTree.enumNodeChildren(instanceTree.getRootId(), (dbId) => {
            allDbIds.push(dbId);
        }, true);

        console.log(`Found ${allDbIds.length} dbIds`);

        viewer.model.getBulkProperties(allDbIds, ['Volume', 'Area', 'Level'], (result) => {
            console.log(`Received bulk properties for ${result.length} elements`);
            const newRowData = result.map((props) => ({
                id: props.dbId,
                name: instanceTree.getNodeName(props.dbId) || 'N/A',
                volume: props.properties.find(p => p.displayName === 'Volume')?.displayValue || 'N/A',
                area: props.properties.find(p => p.displayName === 'Area')?.displayValue || 'N/A',
                level: props.properties.find(p => p.displayName === 'Level')?.displayValue || 'N/A'
            }));
            console.log('New row data:', newRowData);
            setRowData(newRowData);
        }, (error) => {
            console.error('Error getting bulk properties:', error);
        });
    }, [viewer]);

    useEffect(() => {
        console.log('DataGrid useEffect triggered');
        if (viewer && viewer.model) {
            const onModelLoaded = () => {
                console.log('Model loaded, updating grid data');
                updateGridData();
            };
            viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onModelLoaded);
            
            // Initial update in case the model is already loaded
            if (viewer.model.getInstanceTree()) {
                updateGridData();
            }

            return () => {
                viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onModelLoaded);
            };
        }
    }, [viewer, updateGridData]);

    console.log('Rendering DataGrid, rowData length:', rowData.length);

    const exportToExcel = () => {
        if (rowData.length === 0) { 
            alert('No data to export');
            return;
        }

        const ws = XLSX.utils.json_to_sheet(rowData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Model Data');

        XLSX.writeFile(wb, 'model_data.xlsx');
    };

    return (
        <div>
            <button onClick={exportToExcel} style={{marginBottom: '10px'}}>Export</button>
            <div className="ag-theme-alpine" style={{ height: 760, width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    defaultColDef={defaultColumnDefs}
                    onGridReady={params => {
                        params.api.sizeColumnsToFit();
                    }}
                />
            </div>
        </div>
        
    );
};

export default DataGrid;