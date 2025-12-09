const { Schema, model } = require('mongoose')

const sessionSchema = new Schema({
  sessionId: { type: String, required: true, index: true, unique: true },
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  refreshTokenHash: { type: String, required: true },
  ip: String,
  userAgent: String,
  deviceName: String,
  createdAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now },
  expiresAt: Date,
  revoked: { type: Boolean, default: false },
  revokedAt: Date
})

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL

module.exports = model('Session', sessionSchema)