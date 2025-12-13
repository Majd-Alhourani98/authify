const crypto = require('crypto');

const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const argon2 = require('argon2');
const getExpiryTimestamp = require('../utils/getExpiryTimestamp');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name must be less than 50 characters'],
    },

    username: String,

    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (value) {
          return value === this.password;
        },

        message: 'Passwords do not match',
      },
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    emailVerificationOTP: String,
    emailVerificationOTPExpires: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.password;
    delete ret.passwordConfirm;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationTokenExpires;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.emailVerificationOTP;
    delete ret.emailVerificationOTPExpires;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (!this.password) return;

  this.password = await argon2.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre('save', async function () {
  if (!this.username) {
    const base = this.name.replace(/\s+/g, '-').toLowerCase();
    let username = base;

    while (await mongoose.models.User.findOne({ username }).lean()) {
      username = `${base}_${nanoid(5)}`.toLowerCase();
    }

    this.username = username;
  }
});

userSchema.methods.generateEmailVerificationToken = function (length = 32, expiryDurationMs = 10 * 60 * 1000) {
  const token = crypto.randomBytes(length).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationTokenExpires = getExpiryTimestamp(expiryDurationMs);

  return token;
};

userSchema.methods.generateEmailVerificationOTP = function (length = 6, expiryDurationMs = 10 * 60 * 1000) {
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10);
  }

  this.emailVerificationOTP = crypto.createHash('sha256').update(otp).digest('hex');
  this.emailVerificationOTPExpires = getExpiryTimestamp(expiryDurationMs);

  return otp;
};

userSchema.methods.applyVerificationMethod = function (method = 'otp') {
  if (method === 'link') {
    return {
      token: this.generateEmailVerificationToken(),
      message: 'Signup successful! A verification link has been sent to your email.',
    };
  }

  return {
    otp: this.generateEmailVerificationOTP(),
    message: 'Signup successful! An OTP has been sent to your email.',
  };
};

userSchema.methods.rollbackEmailVerification = async function () {
  this.emailVerificationOTP = undefined;
  this.emailVerificationOTPExpires = undefined;
  this.emailVerificationToken = undefined;
  this.emailVerificationTokenExpires = undefined;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
