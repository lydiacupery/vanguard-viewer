-- CreateTable
CREATE TABLE "TargetCategoryAllocation" (
    "id" TEXT NOT NULL,
    "allocation" DECIMAL(65,30) NOT NULL,
    "categoryID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "TargetCategoryAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TargetCategoryAllocation_categoryID_userID_key" ON "TargetCategoryAllocation"("categoryID", "userID");

-- AddForeignKey
ALTER TABLE "TargetCategoryAllocation" ADD CONSTRAINT "TargetCategoryAllocation_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TargetCategoryAllocation" ADD CONSTRAINT "TargetCategoryAllocation_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
