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
import { getAllForms } from "../../api";

interface AddTemplateType {
  formName: string;
}

// Logic to Get All Templates
export const getAllTemplates = createAsyncThunk(
  "formBuilderEntity/getAllTemplates",
  async (userId: number, thunkAPI) => {
    try {
      // Open the Circular Progress
      thunkAPI.dispatch(openCircularProgress());

      // Fetch templates from the API using getAllForms
      const templates = await getAllForms(userId);

      return templates; // Return fetched templates
    } catch (error) {
      console.error("Error in getAllTemplates thunk:", error);
      return thunkAPI.rejectWithValue("Failed to fetch templates");
    } finally {
      // Close the Circular Progress
      thunkAPI.dispatch(closeCircularProgress());
    }
  }
);

// Logic to get Single Template
export const getSingleTemplate = createAsyncThunk(
  "formBuilderEntity/getSingleTemplate",
  async (templateId: string, thunkAPI) => {
    try {
      // Open the Circular Progress
      thunkAPI.dispatch(openCircularProgress());

      // Fetch the single template from the API
      const response = await getAllForms(templateId);

      return response.form_content; // Return the single template data
    } catch (error) {
      console.error("Error fetching single template:", error);
      return thunkAPI.rejectWithValue("Failed to fetch the template");
    } finally {
      // Close the Circular Progress
      thunkAPI.dispatch(closeCircularProgress());
    }
  }
);

// Logic to Add Template
export const addTemplate = createAsyncThunk(
  "formBuilderEntity/addTemplate",
  async (data: AddTemplateType, thunkAPI) => {
    return await new Promise<TemplateType>((resolve, reject) => {
      const currentDateTime = moment().unix() * 1000;

      const allTemplates: TemplateType[] = JSON.parse(
        getFromLocalStorage("templates")
      );
      // Create new Template
      const template: TemplateType = {
        id: generateID(),
        formName: data.formName,
        createdAt: currentDateTime,
        creator: "Test User",
        formLayoutComponents: [],
        lastPublishedAt: 0,
        publishHistory: [],
        publishStatus: "draft",
        updatedAt: 0,
      };
      allTemplates.push(template);
      setTimeout(() => {
        saveToLocalStorage("templates", JSON.stringify(allTemplates));
        resolve(template);
      }, 1000);
    });
  }
);

// Logic to delete a template
export const deleteTemplate = createAsyncThunk(
  "formBuilderEntity/deleteTemplate",
  async (data: string, thunkAPI) => {
    // Open the Circular Progress
    thunkAPI.dispatch(openCircularProgress());
    return await new Promise<number>((resolve, reject) => {
      const allTemplates: TemplateType[] = JSON.parse(
        getFromLocalStorage("templates")
      );
      const deleteIndex = allTemplates.findIndex((t) => t.id === data);
      allTemplates.splice(deleteIndex, 1);
      setTimeout(() => {
        // Close the Circular Progress
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
    return await new Promise<TemplateType>((resolve, reject) => {
      const allTemplates: TemplateType[] = JSON.parse(
        getFromLocalStorage("templates")
      );

      let templateIndex = allTemplates.findIndex((t) => t.id === data.id);
      allTemplates[templateIndex] = data;
      setTimeout(() => {
        thunkAPI.dispatch(closeCircularProgress());
        saveToLocalStorage("templates", JSON.stringify(allTemplates));
        resolve(data);
      }, 1000);
    });
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
