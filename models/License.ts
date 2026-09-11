import mongoose, { Schema, Document } from "mongoose";

export interface ILicense extends Document {
  key: string;
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  deviceId?: string;
  isActivated: boolean;
  activatedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LicenseSchema = new Schema<ILicense>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: {
      type: String,
      default: null,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    activatedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null, // null = ไม่มีวันหมดอายุ (lifetime license)
    },
  },
  {
    timestamps: true,
  }
);

// Index สำหรับการค้นหาที่เร็วขึ้น
LicenseSchema.index({ key: 1 });
LicenseSchema.index({ userId: 1 });
LicenseSchema.index({ deviceId: 1 });

export default mongoose.models.License || mongoose.model<ILicense>("License", LicenseSchema);
