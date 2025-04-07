import {db} from '@/db';
import {notFound} from 'next/navigation';

interface SnippetShowPageProps{
    params: Promise<{
        id:string
    }>
}

export default async function SnippetShowPage(props:SnippetShowPageProps){

    //artificial wait of 2sec
    await new Promise( r =>{
        setTimeout(r, 2000);
    })

    const {id} = await props.params;
    const snippet = await db.snippet.findFirst({
        where: {
            id: parseInt(id)
        }
    })

    if(!snippet){
        return notFound();
    }

    return (
    <div>
        <div className="flex m-4 justify-between items-center">
            <h1 className="text-xl font-bold">{snippet.title}</h1>
            <div className="flex gap-4">
                <button className="p-2 border rounded">Edit</button>
                <button className="p-2 border rounded">Delete</button>
            </div>
        </div>
        <pre className="p-3 border rounded bg-gray-200 border-gray-200">
            <code>
                {snippet.code}
            </code>
        </pre>
    </div>
    );
}