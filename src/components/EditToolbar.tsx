import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridToolbarContainer,
  GridToolbar,
} from "@mui/x-data-grid";

import { useState } from "react";
import { Axios } from "../utils/axiosInstance";
import { Delete } from "@mui/icons-material";
import { Box } from "@mui/material";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  handleAllDelete: any;
  showQuickFilter: any;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel, handleAllDelete, showQuickFilter } = props;
  const [userData] = useState<any>({
    name: "",
    age: "",
  });

  const handleClick = async () => {
    const response = await Axios.post("/api/traders", userData);
    const { _id: id, name, age } = response.data;

    setRows((oldRows) => [{ id, name, age, isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          등록하기
        </Button>
        <Button
          color="primary"
          startIcon={<Delete />}
          onClick={handleAllDelete}
        >
          삭제하기
        </Button>
        <GridToolbar
          showQuickFilter={showQuickFilter}
          sx={{ width: "100%", flex: 1 }}
        />
      </Box>
    </GridToolbarContainer>
  );
};

export default EditToolbar;
