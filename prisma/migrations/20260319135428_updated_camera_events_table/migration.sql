/*
  Warnings:

  - You are about to drop the column `timestamp` on the `camera_events` table. All the data in the column will be lost.
  - Added the required column `created_at` to the `camera_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detail` to the `camera_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "camera_events" DROP COLUMN "timestamp",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "detail" VARCHAR(200) NOT NULL;
