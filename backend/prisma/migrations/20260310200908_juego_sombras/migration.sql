/*
  Warnings:

  - You are about to drop the `Chapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Choice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Novel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReadingSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scene` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_novelId_fkey";

-- DropForeignKey
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_sceneId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingSession" DROP CONSTRAINT "ReadingSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "Scene" DROP CONSTRAINT "Scene_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "UserResponse" DROP CONSTRAINT "UserResponse_choiceId_fkey";

-- DropForeignKey
ALTER TABLE "UserResponse" DROP CONSTRAINT "UserResponse_sessionId_fkey";

-- DropTable
DROP TABLE "Chapter";

-- DropTable
DROP TABLE "Choice";

-- DropTable
DROP TABLE "Novel";

-- DropTable
DROP TABLE "ReadingSession";

-- DropTable
DROP TABLE "Scene";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserResponse";

-- CreateTable
CREATE TABLE "SesionJuego" (
    "id" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SesionJuego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RespuestaTarea1" (
    "id" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "pregunta" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "nivel" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RespuestaTarea1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionTarea2" (
    "id" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "personajeId" INTEGER NOT NULL,
    "personajeNombre" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionTarea2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JustificacionTarea3" (
    "id" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "personajeId" INTEGER NOT NULL,
    "personajeNombre" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JustificacionTarea3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RespuestaTarea4" (
    "id" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "pregunta" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "nivel" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RespuestaTarea4_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resultado" (
    "id" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "totalCielo" INTEGER NOT NULL,
    "totalInfierno" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resultado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resultado_sesionId_key" ON "Resultado"("sesionId");

-- AddForeignKey
ALTER TABLE "RespuestaTarea1" ADD CONSTRAINT "RespuestaTarea1_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "SesionJuego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionTarea2" ADD CONSTRAINT "DecisionTarea2_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "SesionJuego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JustificacionTarea3" ADD CONSTRAINT "JustificacionTarea3_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "SesionJuego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespuestaTarea4" ADD CONSTRAINT "RespuestaTarea4_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "SesionJuego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resultado" ADD CONSTRAINT "Resultado_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "SesionJuego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
