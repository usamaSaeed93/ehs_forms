import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TemplateType } from "../../types/FormTemplateTypes";
import { getFromLocalStorage, saveToLocalStorage } from "../common";
import DemoFormLayouts from "../../utils/demoFormLayouts";
import {
  closeCircularProgress,
  openCircularProgress,
} from "../uireducers/progress";
import { generateID } from "../../utils/common";
import moment from "moment";
import _ from "lodash";
import { deleteForm, getAllForms, saveForm, updateForm } from "../../api";

interface AddTemplateType {
  formName: string;
}

// Logic to Get All Templates
export const getAllTemplates = createAsyncThunk(
  "formBuilderEntity/getAllTemplates",
  async (data, thunkAPI) => {
    // Open the Circular Progress
    thunkAPI.dispatch(openCircularProgress());

    try {
      // Check if templates exist in localStorage
      let templatesInStorage = JSON.parse(getFromLocalStorage("templates"));

      // If templates are not in localStorage, initialize and save them
      if (!templatesInStorage) {
        templatesInStorage = DemoFormLayouts;
        saveToLocalStorage("templates", JSON.stringify(templatesInStorage));
      }

      // Fetch forms from the API using `getAllForms` if templates exist or were just created
      const forms = await getAllForms(); // Pass any necessary parameters

      return forms; // Return both templates and forms
    } catch (error) {
      console.error("Error in getAllTemplates thunk:", error);
      return thunkAPI.rejectWithValue("Failed to fetch templates and forms");
    } finally {
      thunkAPI.dispatch(closeCircularProgress());
    }
  }
);

// Logic to get Single Template
// export const getSingleTemplate = createAsyncThunk(
//   "formBuilderEntity/getSingleTemplate",
//   async (templateId: string, thunkAPI) => {
//     try {
//       // Open the Circular Progress
//       thunkAPI.dispatch(openCircularProgress());

//       // Fetch the single template from the API
//       const response = await getAllForms(templateId);

//       return response.form_content; // Return the single template data
//     } catch (error) {
//       console.error("Error fetching single template:", error);
//       return thunkAPI.rejectWithValue("Failed to fetch the template");
//     } finally {
//       // Close the Circular Progress
//       thunkAPI.dispatch(closeCircularProgress());
//     }
//   }
// );

export const getSingleTemplate = createAsyncThunk(
  "formBuilderEntity/getSingleTemplate",
  async (data: string, thunkAPI) => {
    // Open the Circular Progress
    thunkAPI.dispatch(openCircularProgress());
    return await new Promise<TemplateType>((resolve, reject) => {
      const allTemplates: TemplateType[] = JSON.parse(
        getFromLocalStorage("templates")
      );
      const singleTemplate = allTemplates.filter((t) => t.id === data)[0];
      setTimeout(() => {
        // Close the Circular Progress
        thunkAPI.dispatch(closeCircularProgress());
        resolve(singleTemplate);
      }, 1000);
    });
  }
);

// Logic to Add Template
export const addTemplate = createAsyncThunk(
  "formBuilderEntity/addTemplate",
  async (data: AddTemplateType, thunkAPI) => {
    const currentDateTime = moment().unix() * 1000;

    // Fetch all templates from the backend or local storage
    const allTemplates = await getAllForms();

    // Save the form and get the returned form object
    const form = await saveForm({
      name: data.formName,
      is_quiz: data.is_quiz
    });

    // Generate a new ID for the form and update its ID
    const newId = form.id;

    // Create a new template object
    const template: TemplateType = {
      id: newId,
      formName: data.formName,
      createdAt: currentDateTime,
      creator: "Test User",
      formLayoutComponents: [],
      lastPublishedAt: 0,
      publishHistory: [],
      publishStatus: "draft",
      updatedAt: 0,
    };

    // Add the new template to the list of templates
    allTemplates.push(template);

    // Save the updated templates to local storage after a delay
    return await new Promise<TemplateType>((resolve, reject) => {
      setTimeout(() => {
        saveToLocalStorage("templates", JSON.stringify(allTemplates));
        resolve(template);
      }, 1000);
    });
  }
);


export const deleteTemplate = createAsyncThunk(
  "formBuilderEntity/deleteTemplate",
  async (data: string, thunkAPI) => {
    thunkAPI.dispatch(openCircularProgress());
    return await new Promise<number>((resolve, reject) => {
      const allTemplates: TemplateType[] = JSON.parse(
        getFromLocalStorage("templates")
      );
      const deleteIndex = allTemplates.findIndex((t) => t.id === data);
      deleteForm(data);
      allTemplates.splice(deleteIndex, 1);
      setTimeout(() => {
        thunkAPI.dispatch(closeCircularProgress());
        saveToLocalStorage("templates", JSON.stringify(allTemplates));
        resolve(deleteIndex);
      }, 600);
    });
  }
);

// Logic to save template
export const saveTemplate = createAsyncThunk(
  "formBuilderEntity/saveTemplate",
  async (data: TemplateType, thunkAPI) => {
    // Open the Circular Progress
    thunkAPI.dispatch(openCircularProgress());

    try {
      const response = await saveForm({
        name: data.formName,
        form_data: data,
      });

      // Update template in local storage and close progress after a delay
      const allTemplates = JSON.parse(
        localStorage.getItem("templates") || "[]"
      );
      const templateIndex = allTemplates.findIndex(
        (t: TemplateType) => t.id === data.id
      );

      if (templateIndex !== -1) {
        allTemplates[templateIndex] = data;
      } else {
        allTemplates.push(data);
      }

      setTimeout(() => {
        thunkAPI.dispatch(closeCircularProgress());
        localStorage.setItem("templates", JSON.stringify(allTemplates));
      }, 1000);

      return response;
    } catch (error) {
      thunkAPI.dispatch(closeCircularProgress());
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateTemplate = createAsyncThunk(
  "formBuilderEntity/saveTemplate",
  async (
    { data, formId }: { data: TemplateType; formId: string },
    thunkAPI
  ) => {
    // Open the Circular Progress
    thunkAPI.dispatch(openCircularProgress());

    try {
      // Update the form in the backend
      const response = await updateForm({
        id: formId,
        form_data: data,
      });

      // Fetch all templates from local storage
      const allTemplates = JSON.parse(
        localStorage.getItem("templates") || "[]"
      );

      // Find the index of the template to update
      const templateIndex = allTemplates.findIndex(
        (t: TemplateType) => t.id === data.id
      );

      // Update or add the template in the array
      if (templateIndex !== -1) {
        allTemplates[templateIndex] = data;
      } else {
        allTemplates.push(data);
      }

      // Save updated templates to local storage and close progress
      setTimeout(() => {
        localStorage.setItem("templates", JSON.stringify(allTemplates));
        thunkAPI.dispatch(closeCircularProgress());
      }, 1000);

      return response;
    } catch (error) {
      thunkAPI.dispatch(closeCircularProgress());
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const slice = createSlice({
  name: "formBuilderEntity",
  initialState: {
    allTemplates: [] as TemplateType[],
    selectedTemplate: null as TemplateType | null,
  },
  reducers: {
    setSelectedTemplateNull: (state) => {
      state.selectedTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllTemplates.fulfilled, (state, action) => {
      state.allTemplates = action.payload;
    });
    builder.addCase(getSingleTemplate.fulfilled, (state, action) => {
      state.selectedTemplate = action.payload;
    });
    builder.addCase(
      addTemplate.fulfilled,
      (state, action: PayloadAction<TemplateType>) => {
        const updatedState = _.cloneDeep(state.allTemplates);
        updatedState.push(action.payload);
        state.allTemplates = updatedState;
      }
    );
    builder.addCase(saveTemplate.fulfilled, (state, action) => {
      const newStateTemplates = state.allTemplates.slice();
      const newTemplateId = newStateTemplates.findIndex(
        (t) => t.id === action.payload.id
      );
      newStateTemplates[newTemplateId] = action.payload;
      state.allTemplates = newStateTemplates;
    });
    builder.addCase(deleteTemplate.fulfilled, (state, action) => {
      const newStateTemplates = state.allTemplates.slice();
      newStateTemplates.splice(action.payload, 1);
      state.allTemplates = newStateTemplates;
    });
  },
});

export const { setSelectedTemplateNull } = slice.actions;

export default slice.reducer;
