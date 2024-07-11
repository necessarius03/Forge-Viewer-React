import React, { useEffect, useState} from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const DATAGRID_CONFIG = {
   columns: [
      { headerName: 'ID', field: 'id' },
      { headerName: 'Name', field: 'name', width: 150 },
      { headerName: 'Volume', field: 'volume' },
      { headerName: 'Level', field: 'level' },
   ],
   groupBy: 'level',
   onRowClick: (row, viewer) => {
      viewer.isolate([row.id]);
      viewer.fitToView([row.id]);
   }
};

const DataGridPanel = ({viewer}) => {
   const [rowData, setRowData] = useState([]);

   useEffect(() => {
      const handleDataEvent = (event) => {
         setRowData(event.detail);
      };

      document.addEventListener('datagrid-data', handleDataEvent);

      return () => {
         document.removeEventListener('datagrid-data', handleDataEvent);
      };
   }, []);

   return (
      <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
         <AgGridReact
            columnDefs={DATAGRID_CONFIG.columns}
            rowData={rowData}
            groupDefaultExpanded={-1}
            autoGroupColumnDef={{
               headerName: 'Group',
               field: DATAGRID_CONFIG.groupBy,
               cellRendererParams: { suppressCount: true }
            }}
            pagination={true}
            paginationPageSize={10}
            onRowClicked={(event) => DATAGRID_CONFIG.onRowClick(event.data, viewer)}
         />
      </div>
   );
}

export default DataGridPanel;