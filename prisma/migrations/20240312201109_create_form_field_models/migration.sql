-- CreateTable
CREATE TABLE "Store" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "selectedFormId" INTEGER,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'free',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Store_selectedFormId_fkey" FOREIGN KEY ("selectedFormId") REFERENCES "Form" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Store_subscriptionTier_fkey" FOREIGN KEY ("subscriptionTier") REFERENCES "SubscriptionPlan" ("tier") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "tier" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Form_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormFieldRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "formId" INTEGER NOT NULL,
    "fieldTemplateKeyName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FormFieldRelation_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormFieldRelation_fieldTemplateKeyName_fkey" FOREIGN KEY ("fieldTemplateKeyName") REFERENCES "FieldTemplate" ("keyName") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FieldTemplate" (
    "keyName" TEXT NOT NULL PRIMARY KEY,
    "fieldName" TEXT NOT NULL,
    "customLabel" TEXT,
    "fieldType" TEXT NOT NULL,
    "options" TEXT,
    "category" TEXT NOT NULL,
    "position" INTEGER,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'free',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FieldTemplate_subscriptionTier_fkey" FOREIGN KEY ("subscriptionTier") REFERENCES "SubscriptionPlan" ("tier") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_selectedFormId_key" ON "Store"("selectedFormId");

-- CreateIndex
CREATE UNIQUE INDEX "FormFieldRelation_formId_position_key" ON "FormFieldRelation"("formId", "position");
