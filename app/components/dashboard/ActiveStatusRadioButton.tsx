// Import React and RadioButton component from Shopify Polaris for UI rendering.
import React from 'react';
import { RadioButton } from '@shopify/polaris';

// Define TypeScript interface to type-check our props for the ActiveStatusRadioButton component.
interface ActiveStatusRadioButtonProps {
  formId: number; // Unique identifier for the form associated with this radio button.
  isSelected: boolean; // Boolean indicating whether this radio button is selected.
  onSelect: (formId: number) => void; // Function to be called when the radio button is selected, passing the formId.
}

// Define the ActiveStatusRadioButton component with props following the ActiveStatusRadioButtonProps interface.
const ActiveStatusRadioButton: React.FC<ActiveStatusRadioButtonProps> = ({ formId, isSelected, onSelect }) => (
  // RadioButton component from Polaris with controlled checked state and custom onChange handler.
  // When the radio button is clicked, the onSelect function is called with the formId.
  // 'label' is undefined because we might not need to display text next to the radio button itself.
  // 'aria-label' provides an accessible name for screen readers, improving accessibility.
  <RadioButton
    checked={isSelected}
    onChange={() => onSelect(formId)}
    label={undefined} // Not displaying a visible label next to the radio button.
    aria-label={`Select form ${formId}`} // Provides accessibility information.
  />
);

// Export the ActiveStatusRadioButton for use in other parts of the application.
export default ActiveStatusRadioButton;
