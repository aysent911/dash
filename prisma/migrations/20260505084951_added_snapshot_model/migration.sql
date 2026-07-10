-- AlterTable
ALTER TABLE "camera_events" ALTER COLUMN "local_link" DROP NOT NULL;

-- CreateTable
CREATE TABLE "snapshots" (
    "id" SERIAL NOT NULL,
    "link" VARCHAR(100),
    "mime_type" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL,
    "image" BYTEA NOT NULL,

    CONSTRAINT "snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "snapshots_link_key" ON "snapshots"("link");
