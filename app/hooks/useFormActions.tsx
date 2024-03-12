import { useState, useCallback } from "react";
import { useSubmit } from "@remix-run/react";
import { ProcessedForm } from "~/types/formTypes";
import { Modal } from "@shopify/polaris";

// Custom hook for managing form archival and recovery functionality.
export const useFormArchival = (initialForms: ProcessedForm[]) => {
  // State to track the current list of forms, initialized with initialForms.
  const [currentForms, setCurrentForms] =
    useState<ProcessedForm[]>(initialForms);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    formId: 0,
    actionType: "",
  });
  const submit = useSubmit(); // Hook provided by Remix for submitting forms programmatically.

  // Function to handle the archival or recovery of a form.
  const handleArchiveOrRecover = useCallback(() => {
    try {
      const formData = new FormData();
      formData.append("actionType", modalContent.actionType);
      formData.append("formId", modalContent.formId.toString());
      submit(formData, { method: "post" }); // Submitting the form data to the server.

      // Updating the list of forms to exclude the archived/recovered form.
      const updatedForms = currentForms.filter(
        (form) => form.id !== modalContent.formId,
      );
      setCurrentForms(updatedForms); // Updating state with the new set of forms.
      setShowModal(false); // Close the modal after the action
      shopify.toast.show(`Form ${modalContent.actionType}d`);
    } catch (error) {
      console.error(`Error ${modalContent.actionType}ing form:`, error);
    }
  }, [modalContent, currentForms, submit]);

  // Function to show the modal and set the content based on the action and formId
  const archiveForm = (formId: number, actionType: "archive" | "recover") => {
    setModalContent({ formId, actionType });
    setShowModal(true);
  };

  // Returning the current state, function for archival from the hook, and the modal component.
  return {
    currentForms,
    archiveForm,
    ModalComponent: () => (
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={`Are you sure you want to ${modalContent.actionType} this form?`}
        primaryAction={{
          content: "Confirm",
          onAction: handleArchiveOrRecover,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowModal(false),
          },
        ]}
      ></Modal>
    ),
  };
};
