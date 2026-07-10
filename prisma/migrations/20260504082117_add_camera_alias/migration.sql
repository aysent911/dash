/*
  Warnings:

  - A unique constraint covering the columns `[alias]` on the table `camera_devices` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "camera_devices" ADD COLUMN     "alias" VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "camera_devices_alias_key" ON "camera_devices"("alias");
