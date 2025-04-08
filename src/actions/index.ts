'use server'

import { db } from "@/db";
import { redirect } from "next/navigation";
import {revalidatePath} from 'next/cache';

export async function editSnippet(id:number, code:string){
    await db.snippet.update({
        where:{id},
        data: {code}
    });

    revalidatePath(`/snippets/${id}`);
    redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id:number){
    await db.snippet.delete({
        where: {
            id
        }
    })

    revalidatePath('/');
    redirect(`/`);
}


export async function createSnippet(formState:{message:string}, formData:FormData){
    //check the users inputs and make sure they're valid
    const title = formData.get('title');
    const code = formData.get('code');

    try{
        //validation
        if(typeof title !=='string' || title.length < 3)
        {
            return {
                message: 'Title must be longer'
            }
        }
        if(typeof code !=='string' || code.length < 10)
        {
            return {
                message: 'Code must be longer'
            }
        }

        //check a new record in the database
        await db.snippet.create({
            data:{
                title,
                code
            }
        });
       
    }catch(err:unknown){
        if (err instanceof Error) {
            return {
                message: err.message,
            };
        } else {
            return {
                message: 'Something went wrong...',
            };
        }
    }
    
    //redirect user back to the root route
    revalidatePath('/');
    redirect('/');

  }
  