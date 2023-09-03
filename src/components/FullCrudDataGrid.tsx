import { useState, useEffect } from "react";
import { Axios } from "../utils/axiosInstance";
import EditToolbar from "./EditToolbar";

import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

const FullCrudDataGrid = () => {
  const [rows, setRows] = useState<any>([]);
  const [rowModesModel, setRowModesModel] = useState<any>({});

  const [rowSelectionModel, setRowSelectionModel] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId | any) => () => {
    const handleDelete = async () => {
      await Axios.delete(`api/traders/${id}`);
    };

    handleDelete();
    setRows(rows.filter((row: any) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row: any) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row: any) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    await Axios.put(`api/traders/${newRow.id}`, newRow);

    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row: any) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 180, editable: true },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "joinDate",
      headerName: "Join date",
      type: "date",
      width: 180,
      editable: true,
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: "role",
      headerName: "Department",
      width: 220,
      editable: true,
      type: "singleSelect",
      valueOptions: ["개발자", "의사", "학생", "매니저"],
      valueGetter: (params) => params.value || "",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(params.id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(params.id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(params.id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(params.id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const sxStyles = {
    height: 500,
    width: "60%",
    "& .actions": {
      color: "text.secondary",
    },
    "& .textPrimary": {
      color: "text.primary",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await Axios.get("api/traders");
      const newData = response.data.map((x: any) => {
        const { _id: id, ...data } = x;
        return { id, ...data };
      });

      setRows(newData);
      return response.data;
    };

    fetchData();
  }, []);

  useEffect(() => {
    setRowSelectionModel(rows[0]?.id);
    setSelectedRows(rows[0]);
  }, [rows[0]]);

  console.log(selectedRows);

  return (
    <Box sx={sxStyles}>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{ toolbar: { setRows, setRowModesModel } }}
        checkboxSelection={false}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          const selectedIDs = new Set(newRowSelectionModel);
          const [selectedRowData] = rows.filter((r: any) =>
            selectedIDs.has(r.id)
          );
          setRowSelectionModel(selectedRowData.id);
          setSelectedRows(selectedRowData);
        }}
      />
    </Box>
  );
};

export default FullCrudDataGrid;
