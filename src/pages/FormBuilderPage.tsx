import React, { FunctionComponent, useEffect, useState, useRef } from "react";
import FormBuilder from "../components/FormBuilder/FormBuilder";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSingleTemplate,
  setSelectedTemplateNull,
} from "../redux/entities/formBuilderEntity";
import useModalStrip from "../global-hooks/useModalStrip";
import { getAllForms } from "../api";

interface FormBuilderPageProps {}

const FormBuilderPage: FunctionComponent<FormBuilderPageProps> = () => {
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<any>(null);
  // const template = useAppSelector(
  //   (state) => state.entities.formBuilder.selectedTemplate
  // );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showModalStrip } = useModalStrip();
  const { formId } = useParams();

  // Ref to check if the template was already fetched
  const hasFetched = useRef(false);

  // useEffect(() => {
  //   if (!formId || hasFetched.current) return; // Avoid multiple API calls

  //   hasFetched.current = true; // Mark as fetched

  //   (async () => {
  //     try {
  //       setLoading(true);
  //       const template = await dispatch(getSingleTemplate(formId)).unwrap();
  //       if (!template) throw new Error("Not found");
  //     } catch (ex) {
  //       showModalStrip("danger", "The form id is not correct", 5000);
  //       navigate("/");
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();

  //   return () => {
  //     hasFetched.current = false; // Reset for future renders if needed
  //     dispatch(setSelectedTemplateNull());
  //   };
  // }, [dispatch, formId, navigate, showModalStrip]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getAllForms(formId);
        setTemplate(response);
      } catch (ex) {
        showModalStrip("danger", "The form id is not correct", 5000);
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const defaultForm = {
    id: "0",
    formName: "",
    createdAt: 0,
    creator: "",
    formLayoutComponents: [],
    lastPublishedAt: 0,
    publishHistory: [],
    publishStatus: "draft",
    updatedAt: 0,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("temoplate", template);
  return (
    <>
      {template ? (
        <FormBuilder
          template={template.form_content}
          id={formId}
          fullForm={template}
        />
      ) : (
        <FormBuilder template={defaultForm} />
      )}
    </>
  );
};

export default FormBuilderPage;
