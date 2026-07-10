-- CreateTable
CREATE TABLE "settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "parameter" VARCHAR(40) NOT NULL,
    "value" VARCHAR(40) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camera_triggers" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(15) NOT NULL,
    "name" VARCHAR(63) NOT NULL,

    CONSTRAINT "camera_triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camera_devices" (
    "id" VARCHAR(15) NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "project_id" UUID NOT NULL,

    CONSTRAINT "camera_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camera_events" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "trigger_id" SMALLINT NOT NULL,
    "device_id" VARCHAR(15) NOT NULL,
    "local_link" VARCHAR(100) NOT NULL,

    CONSTRAINT "camera_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "camera_devices" ADD CONSTRAINT "camera_devices_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "camera_events" ADD CONSTRAINT "camera_events_trigger_id_fkey" FOREIGN KEY ("trigger_id") REFERENCES "camera_triggers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "camera_events" ADD CONSTRAINT "camera_events_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "camera_devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
