import React, { FunctionComponent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAllTemplates } from "../redux/entities/formBuilderEntity";
import { useNavigate } from "react-router-dom";
import NewFormDialogComponent from "../components/FormTemplates/NewFormDialogComponent";
import FormLayoutComponent from "../components/FormTemplates/FormLayoutComponent";
import { getAllForms } from "../api";
interface TemplatesPageProps { }

const TemplatesPage: FunctionComponent<TemplatesPageProps> = () => {
  const templates = useAppSelector(
    (state) => state.entities.formBuilder.allTemplates
  );
  const dispatch = useAppDispatch();

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getAllTemplates());
  }, []);

  useEffect(() => {
    (async () => {
      const response = await getAllForms();
      console.log(response);
    })();
  }, []);

  const newFormLayout = {
    border: "1px dashed",
    width: "150px",
    height: "150px",
    fontSize: "2.7rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: "9px",
  };

  return (
    <>
      <div className="d-flex mt-5 flex-column align-items-center justify-content-center">
        <h3>All Quiz Templates</h3>
        <div className="form-templates row mt-3">
          <FormLayoutComponent
            createdFormLayout={false}
            setOpenDialog={setOpenDialog}
          />
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",

          }}>

            {templates.filter((form) => form.form_slug == null).map((template) => (
              <FormLayoutComponent
                key={template.id}
                template={template}
                createdFormLayout={true}
              />
            ))}
          </div>
        </div>
      </div>
      <NewFormDialogComponent
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  );
};

export default TemplatesPage;
