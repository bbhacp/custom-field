import React, { useCallback, useState } from "react";
import { FieldLocation, FormFieldConfiguration } from "~/types/formTypes"; // Importing necessary types.

// Custom hook for managing drag-and-drop functionality in form fields.
export const useDragAndDropField = (initialState: {
  mainFields: FormFieldConfiguration;
  selectedFields: FormFieldConfiguration;
}) => {
  // State to keep track of both main and selected form fields.
  const [fields, setFields] = useState(initialState);

  // Callback function to handle the drag start event.
  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, keyName: string) => {
      // Sets the data type and the value of the dragged element.
      event.dataTransfer.setData("text/plain", keyName);
    },
    [],
  );

  // Callback function to handle the drag over event.
  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      // Prevents the default action to allow for dropping.
      event.preventDefault();
    },
    [],
  );

  // Callback function to handle dropping a field back to the main fields area.
  const handleDropToMain = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const keyName = event.dataTransfer.getData("text/plain");

      // Move field only if it exists in selected fields and is not a static field.
      if (fields.selectedFields[keyName]?.category !== "static" && !fields.mainFields[keyName]) {
        const field = {
          ...fields.selectedFields[keyName],
          location: "main" as FieldLocation,
          position: null,
        };
        setFields((prev) => ({
          ...prev,
          mainFields: { ...prev.mainFields, [keyName]: field },
          selectedFields: Object.fromEntries(
            Object.entries(prev.selectedFields).filter(([k]) => k !== keyName),
          ),
        }));
      }
    },
    [fields],
  );

  // Callback function for handling the event where a field is dropped into the selected fields area.
  const handleDropToSelectedField = useCallback(
    (event: React.DragEvent<HTMLDivElement>, newPosition: number) => {
      event.preventDefault();
      const keyName = event.dataTransfer.getData("text/plain");
      const existingField =
        fields.selectedFields[keyName] || fields.mainFields[keyName];
      const fieldInNewPosition = Object.values(fields.selectedFields).find(
        (field) => field.position === newPosition,
      );

      if (
        !(
          fieldInNewPosition &&
          fieldInNewPosition.category === "static" &&
          existingField === fields.mainFields[keyName]
        )
      ) {
        const newFields = {
          selectedFields: { ...fields.selectedFields },
          mainFields: { ...fields.mainFields },
        };
        if (existingField) {
          newFields.selectedFields[keyName] = {
            ...existingField,
            location: "selectedField",
            position: newPosition,
          };
          if (existingField === fields.mainFields[keyName]) {
            delete newFields.mainFields[keyName];
          }
          if (fieldInNewPosition && fieldInNewPosition.keyName !== keyName) {
            const originalPosition = existingField.position;
            newFields.selectedFields[fieldInNewPosition.keyName] = {
              ...fieldInNewPosition,
              position: originalPosition,
            };
            if (!fields.selectedFields[keyName]) {
              newFields.mainFields[fieldInNewPosition.keyName] = {
                ...fieldInNewPosition,
                location: "main",
                position: null,
              };
              delete newFields.selectedFields[fieldInNewPosition.keyName];
            }
          }
          setFields(newFields);
        }
      }
    },
    [fields],
  );

  // Callback to update the name of a field, limiting it to 20 characters.
  const updateField = useCallback((keyName: string, newValue: string) => {
    setFields((prev) => {
        // Clone previous state to avoid direct mutation
        const newFields = { ...prev };

        if (newFields.mainFields[keyName]) {
            // Update customLabel for mainFields
            newFields.mainFields[keyName] = { ...newFields.mainFields[keyName], customLabel: newValue.slice(0, 20) };
        }

        return newFields;
    });
}, []);

  // Returning state and handler functions for use in components.
  return {
    fields,
    handleDragStart,
    handleDragOver,
    handleDropToMain,
    handleDropToSelectedField,
    updateField,
  };
};
