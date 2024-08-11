-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "Catagory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Catagory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Catagory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
