# Backend for Form Generators App

------------

You can stores and manage:

- Recursive menu
- Forms linked by any item of the menu
- Users

### Tech

------------

- Sequelize ORM 
- TypeScript
- Passport
- Commander
- Express
- Node

### Setup Guide

------------

** Requires a NPM and NodeJS installed in your local machine

** Also requires any database server installed

1. Open your prefered editor
2. Clone this repository and cd to forms/backend
3. run the **npm install**
4. make a **config.json** in that folder and reads the README.txt

### Usage Guide

------------

`npm run db help` Display the command line for database actions (restart, admin, add-input, remove-input)

`npm run start:dev` Run server and listen for any changes 

`npm run start:prod` Run server

** Is your responsability set the NODE_ENV in "production", "development" or "test" mode. Thats not handled by the scripts

### Routes

------------


:airplane: `POST` **/login**  (PUBLIC)

> Get the access token

**BODY STRUCTURE:**

    interface UserData{
        username: string,
        password: string
    }

------------
:airplane: `POST` **/user** (PUBLIC)

> Create new user and get the access token

**BODY STRUCTURE:**

    interface UserData{
        username: string,
        password: string
    }
------------
:airplane: `GET` **/user** 
** Requires the Authorization Header
> Get info of the user

------------
:airplane: `PUT` **/user** 
** Requires the Authorization Header
> Updates the user

**BODY STRUCTURE:**

    interface UserData{
        username: string,
        password: string
    }

------------
:airplane: `DELETE` **/user** 
** Requires the Authorization Header
> Deletes the user

------------
:airplane: `POST` **/form** :secret: Requires Admin Account
** Requires the Authorization Header
> Creates a new form

**BODY STRUCTURE:**

    interface FormData{
        name: string,
        description: string,
        sections: SectionData[],
        createdAt?: string,
        updatedAt?:string
    }
    
    interface SectionData{
        name: string,
        fieldsId?: number[],
        fields?: FieldData[]
    }
    
    interface FieldData{
        question: string,
        type: string,
        options?: JSON
    }

------------
:airplane: `GET` **/form** 

** Requires the Authorization Header

> Get info of form

**BODY STRUCTURE:**

    interface FormTarget{
        id?:number,
        menuId?:number
    }

------------
:airplane: `DELETE` **/form** :secret: Requires Admin Account

** Requires the Authorization Header

> Delete a form

**URL QUERY STRUCTURE:**

* id: number

------------
:airplane: `POST` **/menu** :secret: Requires Admin Account

** Requires the Authorization Header

> Create a new menu

**BODY STRUCTURE:**

    interface MenuData {
        formId?: number,
        parentId?:number,
        name: string
    }

------------
:airplane: `GET` **/menu** 

** Requires the Authorization Header

> Get tree structured for a target menu or all menus

**URL QUERY STRUCTURE:**

* id?: number

------------
:airplane: `DELETE` **/menu**  :secret: Requires Admin Account

** Requires the Authorization Header

> Delete a menu

**URL QUERY STRUCTURE:**

* id: number

------------
:airplane: `POST` **/result** 

** Requires the Authorization Header

> Create a new result

**BODY STRUCTURE:**

    interface ResultData {
        id?:string,
        name: string,
        result: JSON,
        userId: number,
        formId: number
    }
    

------------
:airplane: `GET` **/result** :secret: Requires Admin Account

** Requires the Authorization Header

> Get results by id, form id, or by default user id

**BODY STRUCTURE:**

    interface ResultTarget {
        id?:number,
        formId?:number,
        userId?:number
    }
    

------------
:airplane: `DELETE` **/result** :secret: Requires Admin Account

** Requires the Authorization Header

> Delete a result

**URL QUERY STRUCTURE:**

* id?: number
* formId?: number
* userId?: number

@mdjfs
@blue01H