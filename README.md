# Section 2 - Changing Data with Mutations

## test urls:

[create snippet](http://localhost:3000/snippets/new)   
[view snippets](http://localhost:3000)  
[edit snippet](http://localhost:3000/snippets/1/edit)  

---

## 18. App overview

<img
src='exercise_files/18-changing-data-with-mutations.png'
alt='18-changing-data-with-mutations.png'
width=600
/>

- Goal - list, create, view, delete snippets
- note: app router is newer (nextjs13) than pages router

```sh
npx create-next-app@latest
```

```sh
√ What is your project named? ... nextjs-stephen-grider-complete-developers-guide-snippets
√ Would you like to use TypeScript? ...  Yes
√ Would you like to use ESLint? ... Yes
√ Would you like to use Tailwind CSS? ...  Yes
√ Would you like your code inside a `src/` directory? ...  Yes
√ Would you like to use App Router? (recommended) ... Yes
√ Would you like to use Turbopack for `next dev`? ... No
√ Would you like to customize the import alias (`@/*` by default)? ... No
```

## 19. Project setup

- using sqlite Database

<img
src='exercise_files/19-project-setup.png'
alt='19-project-setup.png'
width=600
/>

### install prisma

- using prisma to access database

```sh
npm install prisma
```

### setup prisma

- setup prisma to use sqlite

```sh
npx prisma init --datasource-provider sqlite
```

- this creates `prisma/schema.prisma`
- update the schema.prisma file by creating the `model Snippet`

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Snippet {
  id Int @id @default(autoincrement())
  title String
  code String
}
```

### tell db to use model

```sh
npx prisma migrate dev
```

- this creates the db file
- enter a name for migration `add snippets`
- this adds code to project to add, change, view snippets

### creating records

<img
src='exercise_files/21-creating-records.png'
alt='21-creating-records.png'
width=600
/>

## 20. create page

- src/app/snippets/new/page.tsx

## 21. creating a prisma client within nextjs

```ts
//src/db/index.ts

import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

//create a snippet
db.snippet.create({
  data: {
    title: "title",
    code: "const abc = ()=>{}",
  },
});
```

## 22. adding a creation form

- the default behavior of a form is to send this to the url with names of form as keys

```tsx
//src/app/snippets/new/page.tsx

export default function SnippetCreatePage() {
  return (
    <form>
      <h3 className="font-bold m-3">Create a Snippet</h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <label className="w-12" htmlFor="title">
            Title
          </label>
          <input
            name="title"
            className="border rounded p-2 w-full"
            id="title"
          />
        </div>

        <div className="flex gap-4">
          <label className="w-12" htmlFor="code">
            Code
          </label>
          <textarea
            name="code"
            className="border rounded p-2 w-full"
            id="code"
          />
        </div>

        <button type="submit" className="rounded p-2 bg-blue-200">
          Create
        </button>
      </div>
    </form>
  );
}
```

---

### Section 03 - streaming content with react server components

## 23. intrducing server actions in nextjs

- Define a server action
- this is a function that will be called when the form is submitted
- way to change data in next app
- close integration with HTML forms
- server actions are function that will be called with the values a user entered into a form

## server action

### create server action

- TODO: create server action to change some code in app.
- define `use server` at top of function
- the server action function receives a formData prop of type FormData
- get data off form, eg. `title` is of type `FormDataEntryValue` which is type for what typescript assumes can be a file or string
- we can use `redirect('/')` from 'next/navigation';

```ts
import { db } from "@/db";
import { redirect } from "next/navigation";

async function createSnippet(formData: FormData) {
  //this needs to be a server action!
  "use server";

  //check the users inputs and make sure they're valid
  const title = formData.get("title") as string;
  const code = formData.get("code") as string;

  //check a new record in the database
  const snippet = await db.snippet.create({
    data: {
      title,
      code,
    },
  });

  //redirect user back to the root route
  redirect("/");
}

export default function SnippetCreatePage() {
  return <form action={createSnippet}>//...</form>;
}
```

## 25. server components vs client components

## server vs client component

### client component

- client component -> can use hooks
- to define a client component
- cannot import server components directly
- use when you need to use hooks
- use when you need to use event handlers

```jsx
"use client";
```

### server component

- server component -> cant use hooks
- server component -> cant assign event handlers (eg. no onClick)

  - use as much as possible
  - by default everything is server components
  - can use async await syntax directly in body of component

## 26. fetching data with server components

- fetching data

<img
src='exercise_files/25-fetching-data.png'
alt='25-fetching-data.png'
width=600
/>

- from server component, have direct access to db (unless using 3rd party api)
  - just import prisma client to access db

```tsx
//app/page.tsx

import { db } from "@/db";

export default async function Home() {
  const snippets = await db.snippet.findMany();
  const renderedSnippets = snippets.map((snippet) => {
    return <div key={snippet.id}>{snippet.title}</div>;
  });

  return <div>{renderedSnippets}</div>;
}
```

## 27. adding dynamic paths

- ability to view a snippet

<img
src='exercise_files/27-adding-dynamic-paths.png'
alt='27-adding-dynamic-paths.png'
width=600
/>

- use id from url to show dynamic content
- http://localhost:3000/snippets/1

<img
src='exercise_files/27-dynamic-pages.png'
alt='27-dynamic-pages.png'
width=600
/>

## 28. async dynamic params in nextjs 15

- in nextjs 15 - we must await params or searchParams before accessing

```ts
const { id } = await props.params;

const snippet = await db.snippet.findFirst({
  where: { id: parseInt(id) },
});
```

- update the Interface and wrap the params in a Promise:

```ts
interface SnippetShowPageProps {
  params: Promise<{
    id: string;
  }>;
}
```

## 29. fetching particular records

- to pull a particular record from database, use `db.snippet.findFirst()`
- if data doesnt exist use `import {notFound} from 'next/navigation';`
  - this redirects to not found page

```tsx
//app/snippets/[id].tsx
import { db } from "@/db";
import { notFound } from "next/navigation";

interface SnippetShowPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SnippetShowPage(props: SnippetShowPageProps) {
  const { id } = await props.params;
  const snippet = await db.snippet.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  if (!snippet) {
    return notFound();
  }

  return <div>{snippet.title}</div>;
}
```

## 30. custom not found page

### special app/ folder files

- page.tsx
- layout.tsx
- not-found.tsx
- loading.tsx
- error.tsx
- route.tsx

<img
src='exercise_files/30-app-folder-special-file-names.png'
alt='30-app-folder-special-file-names.png'
width=600
/>

### notfound
- call `notFound()`
- tries to find closest `/not-found.tsx` or in the closest parent
 
```tsx
//app/snippets/[id]/page.tsx
export default async function SnippetShowPage(props:SnippetShowPageProps){
    const {id} = await props.params;
    const snippet = await db.snippet.findFirst({
        where: {
            id: parseInt(id)
        }
    })

    if(!snippet){
        return notFound();
    }

    return <div>{snippet.title}</div>
}
```

```tsx
//app/snippets/[id]/not-found.tsx
export default function SnippetNotFound() {
  return (
    <div>
		<h1 className="text-xl bold">
			Sorry, but we couldnt find that particular snippet
		</h1>
    </div>
  );
}
```

## 31. Automatic Loading Spinnners
- app/loading.tsx
- displayed whenever server component is fetching some data
- test by making sure an item exists in db (or create one http://localhost:3000/snippets/create) 
- then visit http://localhost:3000/snippets/1

```tsx
//app/snippets/[id]/loading.tsx
export default function SnippetLoadingPage(){
    return <div>loading...</div>
}
```

## 32. view snippets list
- add links to go to view snippet page
- add links to go to create snippet page

<img
src='exercise_files/32-list-snippet.png'
alt='32-list-snippet.png'
width=600
/>

- import Link `import Link from "next/link";`

```tsx
//app/page.tsx
import Link from "next/link";
import { db } from "@/db";

export default async function Home() {
  const snippets = await db.snippet.findMany();
  const renderedSnippets = snippets.map((snippet)=>{
    return (
      <Link href={`/snippets/${snippet.id}`} key={snippet.id} className="flex justify-between items-center p-2 border rounded">
        <div>{snippet.title}</div>
        <div>view</div>
      </Link>
    )
  });

  return (
    <div>
      <div className="flex m-2 justify-between items-center">
        <h1 className="text-xl font-bold">Snippets</h1>
        <Link href="/snippets/new" className="border p-2 rounded">new</Link>
      </div>
      <div className="flex flex-col gap-2">
      {renderedSnippets}  
      </div>
    </div>
  )
}
```

## 33. styling the show page (snippet detail page)
- `app/snippets/[id]/page.tsx`

- show title, edit button, delete button

<img
src='exercise_files/33-view-detail-page.png'
alt='33-view-detail-page.png'
width=600
/>

```tsx
//app/snippets/[id]/page.tsx
//...

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
```

## 34. linking to the edit page

<img
src='exercise_files/34-edit-snippet.png'
alt='34-edit-snippet.png'
width=600
/>

- `app/snippets/[id]/edit/page.tsx`
- TODO: accessing the wildcard from the url
- you receive this wildcard as a prop
- TODO: hook up edit button to take you to edit page -> http://localhost:3000/snippets/1/edit

```tsx
import Link from 'next/link';
//...

<Link href={`/snippets/${snippet.id}/edit`} className="p-2 border rounded">Edit</Link>
```