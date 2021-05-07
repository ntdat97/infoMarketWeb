-- AddForeignKey
ALTER TABLE "ProjectPaymentMethod" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
