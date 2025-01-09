
import connectDB from '../../../../lib/mongo';
import User from '../../../../Model/user';
import secretKey from '../../../../lib/token'
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';


export async function POST(request) {
    try{
        await connectDB()
        //waits for users request 
        const {name, username, email, password} = await request.json()
        //waits for password to be hashed before passing it into a new model
        const new_pass = await hash(password);
        const newUser = new User({name, username, email, password: new_pass})
        //waits for the model newUser to be saved to the document 
        await newUser.save()
        await cookie(newUser.username)

        return new Response(JSON.stringify({ text: newUser }), { status: 200 });
    }

    catch(e) {
        console.log({e});
        return new Response(JSON.stringify({error: e.message}), {status: 404});
    }
}

//hashes password
export async function hash(password_unhashed) {
    const hashed_passwrd = await bcrypt.hash(password_unhashed, 10);
    return hashed_passwrd;
}


export async function cookie(username) {
    //create a jwt token
    //claim is the user 
    const token = await new SignJWT({
        username: username
    })
    .setProtectedHeader({alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secretKey())



    //create cookie to send jwt token 
    const cookieStore = await cookies()

    cookieStore.set(
        "token", 
        token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/'
      });

    
    return new Response("Registration finished", {status: 200});


}

