import React from "react";

class DataGridExtension extends Autodesk.Viewing.Extension {
   load() {
      console.log('DataGridExtension Loaded');
      this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.onGeometryloaded);
      return true;
   }

   unload() {
      console.log('DataGridExtension Unloaded');
      this.viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.onGeometryloaded);
      return true;
   }

   onGeometryloaded() {
      this.extractData();
   }

   extractData() {
      const viewer = this.viewer;
      const tree = viewer.model.getInstanceTree();
      const data = [];

      const dbIds = tree.getRootId();
      tree.enumNodeFragments(dbIds, (fragId) => {
         const mass = viewer.getProperties(fragId, (props) => {
            const volumeProp = props.properties.find(p => p.displayName === 'Volume');
            const leveProp = props.properties.find(p => p.displayName === 'Level' && p.displayCategory === 'Constrains');
            if (volumeProp && leveProp) {
               data.push({
                  id: fragId,
                  name: props.name,
                  volume: volumeProp.displayValue,
                  level: leveProp.displayValue,
               });
            }
         });
      });
      this.showDataGrid(data);
   }
   showDataGrid(data){
      const event = new CustomEvent('datagrid-data', {detail: data});
      document.dispatchEvent(event);
   }
}

Autodesk.Viewing.theExtensionManager.registerExtension('DataGridExtension', DataGridExtension);