-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "initials" CHAR(2) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" TEXT[],
    "status" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "fantasy_name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "phone" JSONB NOT NULL,
    "zip_code" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "photos" JSONB NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temporaries" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "temporaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temporaries" ADD CONSTRAINT "temporaries_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
