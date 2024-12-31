

  
  
export async function POST(request) {
    try{
        const {email, password} = await request.json;

        if (!email.includes('@') || password.length < 5) {
            return res.status(400).send({ error: 'Invalid username or password' });
        }
        
        console.log({email, password}); 
    }

    catch(e) {
        console.log({e});
    }
  }