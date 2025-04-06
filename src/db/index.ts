import {PrismaClient} from '@prisma/client';

export const db = new PrismaClient();

//create
db.snippet.create({
    data: {
        title: "title",
        code :"const abc = ()=>{}"
    }
})

