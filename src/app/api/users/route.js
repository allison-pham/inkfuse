import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
  limits: { fileSize: 1024 * 1024 } // 1MB
}).single('avatar');

export async function GET() {
  try {
    const user = await prisma.users.findMany();

    if (user.length === 0) {
      return new Response(JSON.stringify({ message: 'No users found' }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Successfully fetched users', data: user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    upload(request, null, async function (err) {
      if (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
      }

      const { email, password, avatarUrl } = request.body;

      if (!email.includes('@') || password.length < 5) {
        return new Response(JSON.stringify({ error: 'Invalid username or password' }), { status: 400 });
      }

      let avatarPath = null;

      if (request.file) {
        avatarPath = request.file.path;
      } else if (avatarUrl) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(avatarUrl).toLowerCase());

        if (!extname) {
          return new Response(JSON.stringify({ error: 'Only .png, .jpg and .jpeg format allowed!' }), { status: 400 });
        }

        avatarPath = avatarUrl;
      }

      const user = await prisma.users.create({
        data: {
          email,
          password,
          avatar: avatarPath
        }
      });

      return new Response(JSON.stringify({ message: 'User created successfully', data: user }), { status: 201 });
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
