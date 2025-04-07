import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("🌱 Starting the seed process...");

  try {
    // Permissions
    const permissions = [
      "create-users",
      "view-users",
      "update-users",
      "delete-users",
      "create-roles",
      "view-roles",
      "update-roles",
      "delete-roles",
      "assign-roles",
      "create-permissions",
      "view-permissions",
      "update-permissions",
      "delete-permissions",
      "assign-permissions",
      "create-busCompany",
      "view-busCompany",
      "update-busCompany",
      "delete-busCompany",
    ];
    console.log("🔑 Seeding permissions...");
    for (const permission of permissions) {
      await prisma.permission.upsert({
        where: { name: permission },
        update: {},
        create: { name: permission },
      });
    }
    console.log("✅ Permissions seeded.");

    // Roles
    const roles = ["Admin", "Editor", "Viewer"];
    console.log("🔑 Seeding roles...");
    for (const role of roles) {
      await prisma.role.upsert({
        where: { name: role },
        update: {},
        create: { name: role },
      });
    }
    console.log("✅ Roles seeded.");

    // Assign Permissions to Admin Role
    console.log("🔗 Assigning permissions to Admin role...");
    const adminRole = await prisma.role.findUnique({
      where: { name: "Admin" },
    });
    if (!adminRole) {
      throw new Error("Admin role not found");
    }

    const allPermissions = await prisma.permission.findMany();
    for (const permission of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole["id"],
            permissionId: permission["id"],
          },
        },
        update: {},
        create: { roleId: adminRole["id"], permissionId: permission.id },
      });
    }
    console.log("✅ Admin role permissions assigned.");

    // Create a Super Admin User
    console.log("👤 Creating Super Admin user...");
    const superAdminPassword = "password123"; // Replace with a secure password
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

    const superAdmin = await prisma.user.upsert({
      where: { email: "superadmin@example.com" },
      update: {},
      create: {
        name: "Super Admin",
        email: "superadmin@example.com",
        password: hashedPassword,
        emailVerified: true,
      },
    });
    console.log("✅ Super Admin user created.");

    // Assign Admin Role to Super Admin User
    console.log("🔗 Assigning Admin role to Super Admin...");
    await prisma.userRole.upsert({
      where: {
        userId_roleId: { userId: superAdmin["id"], roleId: adminRole["id"] },
      },
      update: {},
      create: { userId: superAdmin["id"], roleId: adminRole["id"] },
    });
    console.log("✅ Admin role assigned to Super Admin.");

    console.log("🌱 Seed process completed!");
  } catch (error) {
    console.error("❌ Error during seed process:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seed function
main();
