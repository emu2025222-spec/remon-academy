import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { env } from "../config/env";
import { User } from "../models/User";
import { Admin } from "../models/Admin";
import { hashPassword } from "../services/auth.service";

async function createAdmin() {
  try {
    await connectDB();

    const existingUser = await User.findOne({
      email: env.seedAdminEmail.toLowerCase(),
    });

    if (existingUser) {
      if (existingUser.role === "ADMIN") {
        console.log("\n[ADMIN] Admin account already exists.");
        console.log(`[ADMIN] Email: ${env.seedAdminEmail}`);
      } else {
        console.log(
          `\n[ADMIN] ${env.seedAdminEmail} already exists as ${existingUser.role}.`
        );
      }

      await mongoose.connection.close();
      process.exit(0);
    }

    const passwordHash = await hashPassword(env.seedAdminPassword);

    const adminUser = await User.create({
      email: env.seedAdminEmail.toLowerCase(),
      passwordHash,
      role: "ADMIN",
    });

    await Admin.create({
      user: adminUser._id,
      fullName: "Md. Remon Hossain",
      phone: "+8801700000001",
    });

    console.log("\n========================================");
    console.log("       ADMIN CREATED SUCCESSFULLY");
    console.log("========================================");
    console.log(`Email:    ${env.seedAdminEmail}`);
    console.log(`Password: ${env.seedAdminPassword}`);
    console.log("========================================\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("[ADMIN] Failed to create admin:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();