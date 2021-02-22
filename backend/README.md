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


:fa-plane: `POST` **/login**  (PUBLIC)

> Get the access token

**BODY STRUCTURE:**

    interface UserData{
        username: string,
        password: string
    }

------------
:fa-plane: `POST` **/user** (PUBLIC)

> Create new user and get the access token

**BODY STRUCTURE:**

    interface UserData{
        username: string,
        password: string
    }
------------
:fa-plane: `GET` **/user** 
** Requires the Authorization Header
> Get info of the user

------------
:fa-plane: `PUT` **/user** 
** Requires the Authorization Header
> Updates the user

**BODY STRUCTURE:**

    interface UserData{
        username: string,
        password: string
    }

------------
:fa-plane: `DELETE` **/user** 
** Requires the Authorization Header
> Deletes the user

------------
:fa-plane: `POST` **/form** :fa-warning: Requires Admin Account
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
:fa-plane: `GET` **/form** 
** Requires the Authorization Header
> Get info of form

**BODY STRUCTURE:**

    interface FormTarget{
        id?:number,
        menuId?:number
    }

------------
:fa-plane: `DELETE` **/form** :fa-warning: Requires Admin Account
** Requires the Authorization Header
> Delete a form

**URL QUERY STRUCTURE:**

* id: number

------------
:fa-plane: `POST` **/menu** :fa-warning: Requires Admin Account
** Requires the Authorization Header
> Create a new menu

**BODY STRUCTURE:**

    interface MenuData {
        formId?: number,
        parentId?:number,
        name: string
    }

------------
:fa-plane: `GET` **/menu** 
** Requires the Authorization Header
> Get tree structured for a target menu or all menus

**URL QUERY STRUCTURE:**

* id?: number

------------
:fa-plane: `DELETE` **/menu**  :fa-warning: Requires Admin Account
** Requires the Authorization Header
> Delete a menu

**URL QUERY STRUCTURE:**

* id: number

------------
:fa-plane: `POST` **/result** 
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
:fa-plane: `GET` **/result** :fa-warning: Requires Admin Account
** Requires the Authorization Header
> Get results by id, form id, or by default user id

**BODY STRUCTURE:**

    interface ResultTarget {
        id?:number,
        formId?:number,
        userId?:number
    }
    

------------
:fa-plane: `DELETE` **/result** :fa-warning: Requires Admin Account
** Requires the Authorization Header
> Delete a result

**URL QUERY STRUCTURE:**

* id?: number
* formId?: number
* userId?: number

