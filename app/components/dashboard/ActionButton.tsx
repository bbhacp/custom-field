// Import React and specific components from Shopify Polaris for UI rendering.
import React from 'react';
import { Button } from '@shopify/polaris';

// Define TypeScript interface to type-check our props for the ActionButton component.
interface ActionButtonProps {
  label: string; // Text to be displayed inside the button.
  onClick: () => void; // Function to be called when the button is clicked.
}

// Define the ActionButton component with props following the ActionButtonProps interface.
// React.memo is used to optimize performance by memoizing the component, preventing unnecessary re-renders.
const ActionButton: React.FC<ActionButtonProps> = React.memo(({ label, onClick }) => (
  // Button component from Polaris with passed onClick handler and label.
  // This button will display the text provided in 'label' and execute the 'onClick' function when clicked.
  <Button onClick={onClick}>{label}</Button>
));

// Export the ActionButton for use in other parts of the application.
export default ActionButton;
