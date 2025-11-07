import { db } from "@/lib/db";
import { AuditLogAction } from "@prisma/client";

interface CreateAuditLogParams {
  serverId: string;
  userId: string;
  action: AuditLogAction;
  targetId?: string;
  changes?: any;
  reason?: string;
}

export async function createAuditLog({
  serverId,
  userId,
  action,
  targetId,
  changes,
  reason,
}: CreateAuditLogParams) {
  try {
    await db.auditLog.create({
      data: {
        serverId,
        userId,
        action,
        targetId,
        // Use undefined instead of null for Prisma Json type
        changes: changes ? JSON.stringify(changes) : undefined,
        reason,
      },
    });
  } catch (error) {
    console.error("[AUDIT_LOG_CREATE]", error);
  }
}


