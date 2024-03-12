// src/components/FormBuilderComponent.tsx
import React, { CSSProperties } from "react";
import { TextField, Button, Banner, Grid } from "@shopify/polaris";
import { FormFieldConfiguration } from "~/types/formTypes";

const styles: { [key: string]: CSSProperties } = {
  selectedFieldArea: {
    border: "1.5px solid rgb(101, 101, 101)",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    minHeight: "70px",
    backgroundColor: "white",
  },
  mainArea: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    height: "100%",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  field: {
    display: "flex",
    alignItems: "center",

    justifyContent: "center",
    marginBottom: "5px",
    padding: "15px",
    cursor: "grab",
    borderRadius: "8px",
    backgroundColor: "#e8e8e8",
    border: "1px solid #c1c1c1",
  },
  formSubmission: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  heading: {
    fontSize: "1.25rem",
    marginBottom: "16px",
  },
  paragraph: {
    fontSize: "1rem",
    marginBottom: "16px",
    color: "#666",
    lineHeight: "1.5",
  },
  flexContainer: {
    display: "flex", // Make this a flex container
    flexDirection: "column", // Stack children vertically
    height: "100%", // Take full height of its parent
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "10px",
    border: "0.5px solid #bfbfbf",
  },
};

interface FormBuilderProps {
  fields: {
    mainFields: FormFieldConfiguration;
    selectedFields: FormFieldConfiguration;
  };
  formName: string;
  setFormName: React.Dispatch<React.SetStateAction<string>>;
  handleDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    keyName: string,
  ) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDropToMain: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDropToSelectedField: (
    event: React.DragEvent<HTMLDivElement>,
    position: number,
  ) => void;
  handleUpdateCustomFieldName: (keyName: string, newName: string) => void;
  limitReachedFields: Record<string, boolean>;
  handleSave: () => void;
  errorMessage: string;
  isUpdating: any;
}

export const FormBuilderComponent: React.FC<FormBuilderProps> = ({
  fields,
  formName,
  setFormName,
  handleDragStart,
  handleDragOver,
  handleDropToMain,
  handleDropToSelectedField,
  handleUpdateCustomFieldName,
  limitReachedFields,
  handleSave,
  errorMessage,
  isUpdating,
}) => {

  return (
    <Grid>
      <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3, lg: 4, xl: 4 }}>
        <div style={styles.flexContainer}>
          <h3 style={styles.heading}>Main Area</h3>
          <p style={styles.paragraph}>
            Use these Shopify fields to allow users to add additional
            information for customers
          </p>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDropToMain}
            style={styles.mainArea}
          >
            {Object.values(fields.mainFields).map((field) => (
              <div
                key={field.keyName}
                style={styles.field}
                draggable
                onDragStart={(e) => handleDragStart(e, field.keyName)}
              >
                {field.category === "custom" ? (
                  <div>
                    <TextField
                      value={field.customLabel || ""}
                      onChange={(newValue) =>
                        handleUpdateCustomFieldName(field.keyName, newValue)
                      }
                      label={field.name}
                      type="text"
                      autoComplete="off"
                    />
                    {limitReachedFields[field.keyName] && (
                      <Banner>Limit of 20 characters reached.</Banner>
                    )}
                  </div>
                ) : field.category === "reusable" ? (
                  `${field.customLabel} [${field.name}]`
                ) : (
                  field.name
                )}
              </div>
            ))}
          </div>
        </div>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3, lg: 5, xl: 6 }}>
        <div style={styles.flexContainer}>
          <h3 style={styles.heading}>Selected Field Area</h3>
          {Array.from({ length: 8 }, (_, index) => index + 1).map(
            (position) => (
              <div
                key={position}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropToSelectedField(e, position)}
                style={styles.selectedFieldArea}
              >
                {Object.values(fields.selectedFields)
                  .filter(
                    (field) =>
                      field.location === "selectedField" &&
                      field.position === position,
                  )
                  .map((field) => (
                    <div
                      key={field.keyName}
                      style={styles.field}
                      draggable
                      onDragStart={(e) => handleDragStart(e, field.keyName)}
                    >
                      {field.category === "custom"
                        ? `${field.customLabel} [${field.name}]`
                        : field.category === "reusable"
                          ? `${field.customLabel} [${field.name}]`
                          : field.name}
                    </div>
                  ))}
              </div>
            ),
          )}
        </div>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 3, xl: 2 }}>
        <div style={styles.flexContainer}>
          <div style={styles.formSubmission}>
            <TextField
              label="Form Name"
              value={formName}
              onChange={(newValue) => setFormName(newValue)}
              placeholder="Enter form name"
              autoComplete="off"
            />
            <Button onClick={handleSave} loading={isUpdating}>
              Save Form
            </Button>
            {errorMessage && <Banner>{errorMessage}</Banner>}
          </div>
        </div>
      </Grid.Cell>
    </Grid>
  );
};
