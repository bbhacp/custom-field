import { useCallback, useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Page, Button, Collapsible, Card } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import db from "~/db.server";

type Store = {
  id: number;
  name: string;
  createdAt: Date;
};

type StoreActionData = {
  error?: boolean;
  message?: string;
  store?: Store;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  if (!session || !session.shop) {
    return json(
      {
        error: true,
        message:
          "You must be logged in and provide a shop name to perform this action.",
      },
      { status: session ? 400 : 401 },
    );
  }

  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "createStore") {
    const existingStore = await db.store.findUnique({
      where: { name: session.shop },
    });

    if (existingStore) {
      return json(
        { error: true, message: "Store already exists." },
        { status: 200 },
      );
    }

    // Default to 'free' tier if not specified, adjust as needed for your application's logic
    const subscriptionTier = "free";

    const newStore = await db.store.create({
      data: {
        name: session.shop,
        subscriptionTier, // Setting the default subscription tier for the new store
      },
    });

    return json(
      { message: "Store created successfully.", store: newStore },
      { status: 201 },
    );
  } else {
    return json(
      { error: true, message: "Invalid action type" },
      { status: 400 },
    );
  }
};

export default function Index() {
  const actionData = useActionData<StoreActionData>();
  const submit = useSubmit();
  const nav = useNavigation(); // Use navigation to determine form submission state
  const navigate = useNavigate();

  const [actionType, setActionType] = useState("");
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  useEffect(() => {
    if (actionData?.message) {
      shopify.toast.show(actionData.message || "Store Created");
    }
  }, [actionData, actionType]);

  // Handlers for each button click
  const handleCreateStore = () => {
    setActionType("createStore");
    const formData = new FormData();
    formData.append("actionType", "createStore");
    submit(formData, { method: "post" });
  };

  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState(false);
  const handleToggle = useCallback(() => setOpen(!open), [open]);
  const handleContactToggle = useCallback(
    () => setContact(!contact),
    [contact],
  );

  return (
    <Page
      fullWidth
      title="Home Page"
      secondaryActions={[
        {
          content: "View Dashboard",
          accessibilityLabel: "Secondary action label",
          onAction: () => navigate("/app/additional"),
        },
      ]}
    >
      <div style={{ padding: "5px" }}>
        <Card>
          <span>
            {"How to install the app?   "}
            {open ? (
              <Button
                onClick={handleToggle}
                ariaExpanded={open}
                ariaControls="basic-collapsible"
              >
                ↑
              </Button>
            ) : (
              <Button
                onClick={handleToggle}
                ariaExpanded={open}
                ariaControls="basic-collapsible"
              >
                ↓
              </Button>
            )}
          </span>
          <Collapsible
            open={open}
            id="basic-collapsible"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          >
            <>
              <p>
                Your mailing list lets you contact customers or visitors who
                have shown an interest in your store. Reach out to them with
                exclusive offers or updates about your products.
              </p>
              <Link to="#">Test link</Link>
            </>
          </Collapsible>
        </Card>
      </div>
      <div style={{ padding: "5px" }}>
        <Card>
          <h1>Enable Store Forms</h1>

          <div style={{ margin: "20px" }}>
            <Button
              onClick={handleCreateStore}
              loading={isLoading && actionType === "createStore"}
            >
              Activate
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ padding: "5px" }}>
        <Card>
          <span>
            <p>Have a problem? No worries, just one form away!</p>
            {contact ? (
              <Button
                onClick={handleContactToggle}
                ariaExpanded={contact}
                ariaControls="basic-collapsible"
              >
                ↑
              </Button>
            ) : (
              <Button
                onClick={handleContactToggle}
                ariaExpanded={contact}
                ariaControls="basic-collapsible"
              >
                ↓
              </Button>
            )}
          </span>
          <Collapsible
            open={contact}
            id="basic-collapsible"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          ></Collapsible>
        </Card>
      </div>
    </Page>
  );
}
