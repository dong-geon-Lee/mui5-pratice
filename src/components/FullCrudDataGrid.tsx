import { useState, useEffect } from "react";
import { Axios } from "../utils/axiosInstance";
import EditToolbar from "./EditToolbar";

import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
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
  GridToolbar,
} from "@mui/x-data-grid";

const FullCrudDataGrid = () => {
  const [rows, setRows] = useState<any>([]);
  const [rowModesModel, setRowModesModel] = useState<any>({});

  const [rowSelectionModel, setRowSelectionModel] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = false;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    console.log(rowSelectionModel);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    // 선택된 행의 ID 목록
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  // const handleDeleteClick = (id: GridRowId | any) => () => {
  //   const handleDelete = async () => {
  //     try {
  //       await Axios.delete(`api/traders/${id}`);
  //     } catch (error) {
  //       console.error("Error deleting data:", error);
  //     }
  //   };

  //   handleDelete();
  //   setRows(rows.filter((row: any) => row.id !== id));
  // };

  const handleAllDelete = async () => {
    const selectedIds = Object.keys(selectedRows);

    if (selectedIds.length === 0) {
      alert("선택된 행이 없습니다.");
      return;
    }

    if (selectedIds.length === 1) {
      try {
        await Axios.delete(`api/traders/${selectedIds[0]}`);
        const response = await Axios.get("api/traders");
        const newData = response.data.map((x: any) => {
          const { _id: id, ...data } = x;
          return { id, ...data };
        });

        setRows(newData);
      } catch (error) {
        console.log(error);
      }

      return;
    }

    Promise.all(
      selectedRows?.map(async (id: any) => {
        try {
          await Axios.delete(`api/traders/${id}`);
        } catch (error) {
          console.error("Error deleting data:", error);
        }
      })
    )
      .then(() => {
        setRows((prevRows: any) =>
          prevRows.filter((row: any) => !selectedRows.includes(row.id))
        );
        setSelectedRows([]);
      })
      .catch((error: any) => {
        console.log("Error", error);
      });
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
          // <GridActionsCellItem
          //   icon={<DeleteIcon />}
          //   label="Delete"
          //   onClick={handleDeleteClick(params.id)}
          //   color="inherit"
          // />,
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

    ".css-1knaqv7-MuiButtonBase-root-MuiButton-root + button": {
      display: "none",
    },

    ".css-v4u5dn-MuiInputBase-root-MuiInput-root": {
      marginLeft: "auto",
      width: "100%",
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
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (rows.length > 0) {
      setRowSelectionModel([rows[0].id]);
      setSelectedRows({ [rows[0].id]: true });
    } else {
      setRowSelectionModel([]);
      setSelectedRows([]);
    }
  }, [rows]);

  console.log(selectedRows, rowSelectionModel);

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
        disableColumnFilter
        disableColumnSelector
        // slots={{
        //   toolbar: () => (
        //     <div style={{ width: "100%" }}>
        //       <GridToolbar />
        //     </div>
        //   ),
        // }}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: {
            setRows,
            setRowModesModel,
            handleAllDelete,
            handleEditClick,
            showQuickFilter: true,
          },
        }}
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setSelectedRows(newRowSelectionModel);
          setRowSelectionModel(newRowSelectionModel);
        }}
        hideFooterPagination
      />
    </Box>
  );
};

export default FullCrudDataGrid;
