// src/app/api/users/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    //Querying the users table using Prisma
    const user = await prisma.users.findMany(); //Retrieves all users from the 'users' table

    //If no users are found, return a message
    if (user.length === 0) {
      return new Response(JSON.stringify({ message: 'No users found' }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Successfully fetched users', data: user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


