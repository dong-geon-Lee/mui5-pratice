import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";

import { randomId } from "@mui/x-data-grid-generator";
import { useState } from "react";
import { Axios } from "../utils/axiosInstance";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  rows: [];
  rowModesModel: any;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel, rows, rowModesModel } = props;
  const [userData, setUserData] = useState<any>({
    name: "",
    age: "",
  });

  // const [addButtonStatus, setAddButtonStatus] = useState(false);

  // const createRequest = async () => {
  //   const response = await Axios.post("/api/traders", userData);
  //   console.log(response.data);
  // };

  // console.log(rows, rowModesModel);

  // if (rowModesModel && addButtonStatus) {
  //   console.log("생성 클릭반응!");
  //   createRequest();
  //   setAddButtonStatus(false);
  // }
  console.log(userData);

  const handleClick = async () => {
    const response = await Axios.post("/api/traders", userData);
    console.log(response.data);

    const { _id: id, name, age } = response.data;

    setRows((oldRows) => [...oldRows, { id, name, age, isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
};

export default EditToolbar;
