import { useState } from 'react';
import { useSubmit } from '@remix-run/react';

// Interface defining the structure of the return type for useFormSelection hook.
interface UseFormSelectionReturnType {
  selectedFormId: number | null; // Currently selected form ID or null if no form is selected.
  selectForm: (formId: number) => void; // Function to update the selected form ID.
}

// Custom hook for handling form selection within the application.
export const useFormSelection = (initialFormId: number | null): UseFormSelectionReturnType => {
  // State hook to keep track of the currently selected form ID.
  const [selectedFormId, setSelectedFormId] = useState<number | null>(initialFormId);
  const submit = useSubmit(); // Hook provided by Remix for programmatically submitting forms.

  // Function to set the selected form ID and submit this change to the server.
  const selectForm = (formId: number) => {
    setSelectedFormId(formId); // Update the local state with the new selected form ID.

    // Prepare form data for submission.
    const formData = new FormData();
    formData.append("actionType", "select"); // Specify the action type for form selection.
    formData.append("selectedFormId", formId.toString()); // Include the selected form ID in the form data.

    // Submit the form data to the server for processing.
    submit(formData, { method: "post" });
  };

  // Return the current state and the function to update it from the hook.
  return { selectedFormId, selectForm };
};
