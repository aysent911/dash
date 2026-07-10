/*
  Warnings:

  - You are about to drop the column `project_id` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `from` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_project_id_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "project_id",
ADD COLUMN     "ack" BOOLEAN DEFAULT false,
ADD COLUMN     "from" UUID NOT NULL,
ADD COLUMN     "to" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_to_fkey" FOREIGN KEY ("to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
