import React, {
  ChangeEventHandler,
  FormEventHandler,
  FunctionComponent,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useAppDispatch } from "../../redux/hooks";
import { addTemplate } from "../../redux/entities/formBuilderEntity";
import { useNavigate } from "react-router-dom";
import useModalStrip from "../../global-hooks/useModalStrip";
import { TemplateType } from "../../types/FormTemplateTypes";

interface NewFormDialogComponentProps {
  openDialog: boolean;
  setOpenDialog: (arg: boolean) => void;
}

interface NewFormDataType {
  formName: string;
  is_quiz: boolean;
}

const textboxStyle = {
  minWidth: "100%",
  maxWidth: "100%",
  marginTop: "20px",
};

const NewFormDialogComponent: FunctionComponent<NewFormDialogComponentProps> = (
  props
) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showModalStrip } = useModalStrip();

  const [creatingForm, setCreatingForm] = useState<boolean>(false);

  const [newFormData, setNewFormData] = useState<NewFormDataType>({
    formName: "",
    is_quiz: false,
  });

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (newFormData.formName === "") {
      showModalStrip("danger", "Form name cannot be empty", 5000);
      return;
    }
    setCreatingForm(true);
    try {
      const template: TemplateType = await dispatch(
        addTemplate(newFormData)
      ).unwrap();
      navigate(`/formbuilder/${template.id}`);
    } catch (ex) {
      showModalStrip("danger", "Error occurred while creating a new form", 5000);
    } finally {
      setCreatingForm(false);
    }
  };

  return (
    <Dialog
      open={props.openDialog}
      fullWidth
      maxWidth="lg"
      onClose={() => {
        props.setOpenDialog(false);
      }}
    >
      <DialogTitle>
        <div className="d-flex align-items-center justify-content-between">
          <span style={{ padding: "9px", cursor: "pointer" }}>
            <i className="fas fa-arrow-left"></i>
          </span>
          <span
            style={{ padding: "9px", cursor: "pointer" }}
            onClick={() => props.setOpenDialog(false)}
          >
            <i className="fas fa-times"></i>
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="p-30" style={{ minHeight: "500px" }}>
          <div
            className=""
            style={{
              maxWidth: "360px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <h4>Enter the following details:</h4>
            <form onSubmit={handleFormSubmit} style={{ minWidth: "100%" }}>
              <div>
                <TextField
                  label="Form Name"
                  name="formName"
                  value={newFormData.formName}
                  onChange={handleInputChange}
                  style={textboxStyle}
                />
              </div>
              <div style={{ marginTop: "20px" }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isQuiz"
                      checked={newFormData.isQuiz}
                      onChange={handleInputChange}
                    />
                  }
                  label="Is this a quiz?"
                />
              </div>
              <button
                className="btn btn-light btn-shadow m-t-20 m-r-10"
                type="submit"
                disabled={creatingForm}
              >
                {creatingForm ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading
                  </>
                ) : (
                  "Create Form"
                )}
              </button>
              <input
                type="button"
                className="btn btn-light btn-shadow m-t-20 m-l-0"
                value="Cancel"
                disabled={creatingForm}
                onClick={() => props.setOpenDialog(false)}
              />
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewFormDialogComponent;
