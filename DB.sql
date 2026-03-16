CREATE TYPE "transport_type_enum" AS ENUM (
	'car',
	'bike',
	'bus',
	'metro'
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" UUID NOT NULL,
	"name" TEXT NOT NULL,
	"email" VARCHAR(255) NOT NULL UNIQUE,
	"phone" VARCHAR(15) NOT NULL UNIQUE,
	"rating" DECIMAL(3,2),
	"total_rides" INTEGER NOT NULL DEFAULT 0,
	"status" VARCHAR(20) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "bookings" (
	"id" UUID NOT NULL,
	"user_id" UUID NOT NULL,
	"driver_id" UUID NOT NULL,
	"payment_id" UUID,
	"pickup_location" VARCHAR(255) NOT NULL,
	"drop_location" VARCHAR(255) NOT NULL,
	"pickup_lat" DECIMAL(10,7) NOT NULL,
	"pickup_lng" DECIMAL(10,7) NOT NULL,
	"drop_lat" DECIMAL(10,7) NOT NULL,
	"drop_lng" DECIMAL(10,7) NOT NULL,
	"distance_km" DECIMAL(8,2),
	"estimated_time" INTERVAL,
	"price_estimated" DECIMAL(10,2),
	"final_price" DECIMAL(10,2),
	"discounted_value" DECIMAL(10,2),
	"status" VARCHAR(50) DEFAULT 'pending',
	"payment_status" VARCHAR(50) DEFAULT 'unpaid',
	"payment_method" VARCHAR(50),
	"otp" VARCHAR(10),
	"ride_start_time" TIMESTAMP,
	"ride_end_time" TIMESTAMP,
	"booking_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "booking_routes" (
	"id" UUID NOT NULL,
	"booking_id" UUID NOT NULL,
	"driver_id" UUID NOT NULL,
	"step_number" INTEGER NOT NULL,
	"transport_type" transport_type_enum NOT NULL,
	"provider" TEXT,
	"start_location" TEXT NOT NULL,
	"end_location" TEXT NOT NULL,
	"estimated_time" INTEGER,
	"cost" DECIMAL(10,2),
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "transport_modes" (
	"id" UUID NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "pricing_rules" (
	"id" UUID NOT NULL,
	"vehicle_type" VARCHAR(50) NOT NULL,
	"base_fare" DECIMAL(10,2) NOT NULL,
	"per_km" DECIMAL(10,2) NOT NULL,
	"surge" DECIMAL(5,2) DEFAULT 1.00,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "ride_tracking" (
	"id" UUID NOT NULL,
	"booking_id" UUID NOT NULL,
	"lat" DECIMAL(10,8) NOT NULL,
	"lng" DECIMAL(11,8) NOT NULL,
	"timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "drivers" (
	"id" UUID NOT NULL,
	"name" TEXT NOT NULL,
	"vehicle_type" VARCHAR(50) NOT NULL,
	"vehicle_number" VARCHAR(20),
	"rating" DECIMAL(3,2),
	"phone" VARCHAR(15) NOT NULL UNIQUE,
	"status" VARCHAR(20) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "provider_location" (
	"id" UUID NOT NULL,
	"driver_id" UUID NOT NULL,
	"lat" DECIMAL(10,7) NOT NULL,
	"lng" DECIMAL(10,7) NOT NULL,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "payments" (
	"id" UUID NOT NULL,
	"booking_id" UUID NOT NULL,
	"user_id" UUID NOT NULL,
	"amount" DECIMAL(10,2) NOT NULL,
	"method" VARCHAR(50) NOT NULL,
	"transaction_id" VARCHAR(100),
	"payment_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
	"paid_at" TIMESTAMP,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "ratings" (
	"id" UUID NOT NULL,
	"booking_id" UUID NOT NULL,
	"user_id" UUID NOT NULL,
	"provider_id" UUID,
	"rating" INTEGER NOT NULL CHECK("[object Object]" BETWEEN 1 AND 5),
	"review" TEXT,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" UUID NOT NULL,
	"vehicle_type" VARCHAR(50) NOT NULL,
	"vehicle_number" VARCHAR(20) NOT NULL UNIQUE,
	"document_id" UUID,
	"driver_id" UUID NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "documents" (
	"id" UUID NOT NULL,
	"vehicle_id" UUID NOT NULL,
	"vehicle_foc" VARCHAR(100),
	"driver_id" UUID NOT NULL,
	"aadhar_card" VARCHAR(20),
	"dl" VARCHAR(50),
	"dl_number" VARCHAR(20),
	"safety_number" VARCHAR(20) NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "favorite_locations" (
	"id" UUID NOT NULL,
	"label" VARCHAR(100) NOT NULL,
	"location" VARCHAR(255) NOT NULL,
	"lat" DECIMAL(10,7) NOT NULL,
	"lng" DECIMAL(10,7) NOT NULL,
	"user_id" UUID NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);



ALTER TABLE "provider_location"
ADD FOREIGN KEY("driver_id") REFERENCES "drivers"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking_routes"
ADD FOREIGN KEY("driver_id") REFERENCES "drivers"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "ride_tracking"
ADD FOREIGN KEY("booking_id") REFERENCES "bookings"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "ratings"
ADD FOREIGN KEY("booking_id") REFERENCES "bookings"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "ratings"
ADD FOREIGN KEY("user_id") REFERENCES "users"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "ratings"
ADD FOREIGN KEY("provider_id") REFERENCES "drivers"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "documents"
ADD FOREIGN KEY("vehicle_id") REFERENCES "vehicles"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;