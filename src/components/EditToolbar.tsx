import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";

import { useState } from "react";
import { Axios } from "../utils/axiosInstance";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel } = props;
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
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        등록하기
      </Button>
    </GridToolbarContainer>
  );
};

export default EditToolbar;
