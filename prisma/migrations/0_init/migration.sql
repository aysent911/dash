-- CreateTable
CREATE TABLE "alarms" (
    "id" SERIAL NOT NULL,
    "dev_eui" VARCHAR(20) NOT NULL,
    "start_value" VARCHAR(20),
    "end_value" VARCHAR(20),
    "type" VARCHAR(15) NOT NULL,
    "enable" BOOLEAN,

    CONSTRAINT "alarms_pkey" PRIMARY KEY ("dev_eui","type")
);

-- CreateTable
CREATE TABLE "blacklist" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR
);

-- CreateTable
CREATE TABLE "devices" (
    "eui" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50),
    "gateway" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(10) DEFAULT 'CLOSE',
    "update_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "project_id" UUID,
    "type" VARCHAR(15),
    "bat_mv" SMALLINT,
    "firmware_version" VARCHAR(15),
    "frequency_band" VARCHAR(15),
    "sensor_model" VARCHAR(15),
    "sub_band" VARCHAR(15),
    "id" VARCHAR(25),
    "brand" VARCHAR(20),

    CONSTRAINT "devices_pkey" PRIMARY KEY ("eui")
);

-- CreateTable
CREATE TABLE "door_devices" (
    "eui" VARCHAR(20) NOT NULL,
    "id" VARCHAR(25),
    "alarm" BOOLEAN DEFAULT false,
    "open_status" VARCHAR(10),
    "open_times" SMALLINT,
    "last_open_duration" INTEGER,
    "update_at" TIMESTAMPTZ(6),

    CONSTRAINT "door_devices_pkey" PRIMARY KEY ("eui")
);

-- CreateTable
CREATE TABLE "gateways" (
    "eui" VARCHAR(20) NOT NULL,
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_at" VARCHAR(30),
    "last_status_at" VARCHAR(30),
    "last_uplink_at" VARCHAR(30),
    "remote_address" VARCHAR(32),
    "tower" VARCHAR(20),

    CONSTRAINT "gateways_pkey" PRIMARY KEY ("eui")
);

-- CreateTable
CREATE TABLE "humidity_temperature_devices" (
    "eui" VARCHAR(20) NOT NULL,
    "humidity" REAL,
    "temperature_c" REAL,
    "temperature_ext" REAL,
    "update_at" TIMESTAMPTZ(6),
    "id" VARCHAR(20),

    CONSTRAINT "temperatures_pkey" PRIMARY KEY ("eui")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "dev_eui" VARCHAR(20) NOT NULL,
    "gate_eui" VARCHAR(20) NOT NULL,
    "trigger_event" VARCHAR(10) NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mqtt_endpoints" (
    "id" SERIAL NOT NULL,
    "host" VARCHAR(100) NOT NULL,
    "user_name" VARCHAR(50) NOT NULL,
    "key" VARCHAR(100),

    CONSTRAINT "mqtt_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "power_devices" (
    "eui" VARCHAR(20) NOT NULL,
    "id" VARCHAR(25),
    "current1_a" REAL,
    "current2_a" REAL,
    "current3_a" REAL,
    "current4_a" REAL,
    "update_at" TIMESTAMPTZ(6),
    "consumption" REAL,
    "exti_level" VARCHAR(10),
    "exti_trigger" BOOLEAN DEFAULT false,

    CONSTRAINT "power_devices_pkey" PRIMARY KEY ("eui")
);

-- CreateTable
CREATE TABLE "project_members" (
    "project_id" UUID NOT NULL,
    "user_email" VARCHAR(63) NOT NULL,
    "privilege" SMALLINT NOT NULL,
    "active" BOOLEAN DEFAULT false,

    CONSTRAINT "project_users_pkey" PRIMARY KEY ("project_id","user_email")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50),
    "push_key" VARCHAR(63),
    "owner" VARCHAR(63) NOT NULL,
    "org_id" SMALLINT,
    "mqtt_server_host" VARCHAR(100),
    "mqtt_user_name" VARCHAR(50),
    "mqtt_api_key" VARCHAR(100),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(63) NOT NULL,
    "user_key" VARCHAR(63),
    "passhash" VARCHAR(40),
    "verified" BOOLEAN DEFAULT false,
    "token" VARCHAR(40),
    "first_name" VARCHAR(20),
    "second_name" VARCHAR(20),
    "role" SMALLINT DEFAULT 2,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_device_id" ON "devices"("id");

-- CreateIndex
CREATE UNIQUE INDEX "door_devices_id_key" ON "door_devices"("id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_gateway_id" ON "gateways"("id");

-- CreateIndex
CREATE UNIQUE INDEX "power_devices_id_key" ON "power_devices"("id");

-- CreateIndex
CREATE UNIQUE INDEX "name_unique" ON "projects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_gateway_fkey" FOREIGN KEY ("gateway") REFERENCES "gateways"("eui") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "project_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "door_devices" ADD CONSTRAINT "door_devices_eui_fkey" FOREIGN KEY ("eui") REFERENCES "devices"("eui") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "door_devices" ADD CONSTRAINT "door_devices_id_fkey" FOREIGN KEY ("id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humidity_temperature_devices" ADD CONSTRAINT "humidity_temperature_devices_id_fkey" FOREIGN KEY ("id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humidity_temperature_devices" ADD CONSTRAINT "temperatures_dev_eui_fkey" FOREIGN KEY ("eui") REFERENCES "devices"("eui") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_dev_eui_fkey" FOREIGN KEY ("dev_eui") REFERENCES "devices"("eui") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_gate_eui_fkey" FOREIGN KEY ("gate_eui") REFERENCES "gateways"("eui") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "power_devices" ADD CONSTRAINT "power_devices_eui_fkey" FOREIGN KEY ("eui") REFERENCES "devices"("eui") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "power_devices" ADD CONSTRAINT "power_devices_id_fkey" FOREIGN KEY ("id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_users_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_users_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

