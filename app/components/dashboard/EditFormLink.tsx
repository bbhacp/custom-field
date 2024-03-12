// Import React for component creation, RemixLink for internal navigation, and Button from Shopify Polaris for UI elements.
import React from 'react';
import { Link as RemixLink } from '@remix-run/react';
import { Button } from '@shopify/polaris';

// Define TypeScript interface to type-check the props for the EditFormLink component.
interface EditFormLinkProps {
  formId: number; // Unique identifier for the form this link is associated with.
  state?: any;
}

// Define the EditFormLink component with props following the EditFormLinkProps interface.
// This component renders a link wrapped around a Shopify Polaris button.
const EditFormLink: React.FC<EditFormLinkProps> = ({ formId, state }) => (
  // RemixLink is used to navigate within the Remix app framework, using the 'to' prop to set the URL.
  // The URL is constructed dynamically based on the formId passed to the component.
  <RemixLink to={`/app/${formId}`} state={state}>
    <Button>Edit</Button> {/* Shopify Polaris Button is used for UI consistency and styled interaction. */}
  </RemixLink>
);

// Export the EditFormLink component for use in other parts of the application.
export default EditFormLink;
