import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const APS_ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY0RE9XMnJoOE9tbjNpdk1NU0xlNGQ2VHEwUV9SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJKODdOUGFDTXc2U2ZMY3ppdkhzdVNTR25NMU5lcXl3b2ptaFFvNVJKbE56VFFQek4iLCJpc3MiOiJodHRwczovL2RldmVsb3Blci5hcGkuYXV0b2Rlc2suY29tIiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20iLCJqdGkiOiJLRnFLTUh2Z28yaE5lbE1uZVN0NWF1dVh0M3cwc1pRSHJyV1VKS1VzSkNOSGo1TGxBN2dxSVM3TkpDUFdWSmIzIiwiZXhwIjoxNzIwNjAxNTE0fQ.YB0eeefMqKdYLQLVQHAc1-Q9fkKh9nVEbhITecfUuSFWXc5oa6TVk2_HaIXnDc9BKZwiRxh2EXZWEMqyD3hJXcDEvvJap__yl_pXzPE5cVqhwpIrbv5umZSVlG1BnNSPf9AG6mxWc-CYhfSTkOxGgg3U3pkBjkC1Qixko4tRZ_0RIYnv092ZcR_8DchKKserPjDCn5Nr6c9p78t1ESwJEJM08M7YUgLqD1z76itJO2s-VfMivM32AtH_iWWuOc31OR4qOqyXa9jbG6QmeegoczgU1e3v39SSsovIa4Q-gzYhe1I0b05nR3Dx4eIehS3aFw5OdSm0TMfdFrCiqltk3Q';
const APS_MODEL_URN = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ajg3bnBhY213NnNmbGN6aXZoc3Vzc2dubTFuZXF5d29qbWhxbzVyamxuenRxcHpuLWJhc2ljLWFwcC8yNC0wNS0yMDE2X0tUX05oYUFuaFZpZW4ucnZ0';

const root = ReactDOM.createRoot(document.getElementById('root'));
if (!APS_ACCESS_TOKEN || !APS_MODEL_URN) {
  root.render(<div>Please specify <code>APS_ACCESS_TOKEN</code> and <code>APS_MODEL_URN</code> in the source code</div>)
} else {
  root.render(<App token={APS_ACCESS_TOKEN} urn={APS_MODEL_URN}/>);
}