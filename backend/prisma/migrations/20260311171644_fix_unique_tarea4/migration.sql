/*
  Warnings:

  - A unique constraint covering the columns `[sesionId,pregunta]` on the table `RespuestaTarea4` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RespuestaTarea4_sesionId_pregunta_key" ON "RespuestaTarea4"("sesionId", "pregunta");
