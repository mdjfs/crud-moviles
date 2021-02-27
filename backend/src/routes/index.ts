import passport from "passport";
import express, { Request } from "express";

import User from "../controllers/user";
import Form from "../helpers/form";
import Menu from "../helpers/menu";
import Result, { ResultTarget } from "../helpers/result";

const router = express.Router();

const auth = passport.authenticate('jwt', {session: false});

interface UserRequest extends Request{
    user: {
        id: number,
        username: string,
        role: string,
        createdAt: string,
        updatedAt: string
    }
}

function queryParseNumber(request: Request, key: string){
    let param: number = parseInt(request.query[key] as string);
    return isNaN(param) ? null : param;
}

router.post('/login', async (req, res) => { 
    try{
        const token = await User.login(req.body);
        res.status(200).send(token);
    }catch(e){
        res.status(500).send(e.message);
    }
})

router.get('/user/all', auth, async (req: UserRequest, res) => {
    try{
        if(req.user.role == "admin"){
            const users = await User.getAll();
            res.status(200).send(users);
        }else{
            res.sendStatus(403);
        }
    }catch(e){
        res.status(500).send(e.message);
    }
})

router.post('/user', async (req, res) => {
    try{
        const token = await User.register(req.body);
        res.status(200).send(token);
    }catch(e){
        res.status(500).send(e.message);
    }
});

router.get('/user', auth, async (req: UserRequest, res) => {
    try{
        const user = await User.read({ id: req.user.id })
        res.status(200).send(user);
    }catch(e){
        res.status(500).send(e.message);   
    }
})

router.put('/user', auth, async (req: UserRequest, res) => {
    try{
        await User.update(req.body, {id: req.user.id});
        res.sendStatus(200);
    }catch(e){
        res.status(500).send(e.message);
    }
})

router.delete('/user', auth, async (req: UserRequest, res) => {
    try{
        await User.del({ id: req.user.id });
        res.sendStatus(200);
    }catch(e){
        res.status(500).send(e.message);
    }
})


router.get('/form', auth, async (req: UserRequest, res) => {
    try{
        const forms = await Form.getAll();
        res.status(200).send(forms);
    }catch(e){
        res.status(500).send(e.message);
    }
});

router.put('/form', auth, async (req: UserRequest, res) => {
    try{
        const form = await Form.read(req.body)
        res.status(200).send(form);
    }catch(e){
        res.status(500).send(e.message);
    }
});

router.post('/form', auth, async (req: UserRequest, res) => {
    try{
        if(req.user.role == "admin"){      
            console.log(req.body);
            const id = await Form.create(req.body);
            res.status(200).send({id: id});
        }else{
            res.sendStatus(403);
        }
    }catch(e){
        res.status(500).send(e.message);
    }
});

router.delete('/form', auth, async (req: UserRequest, res) => {
    try{
        const id = queryParseNumber(req, "id");
        if(req.user.role == "admin"){      
            await Form.del({ id: id });
            res.sendStatus(200);
        }else{
            res.sendStatus(403);
        }
    }catch(e){
        res.status(500).send(e.message);
    }
});


router.get('/menu', auth, async (req: UserRequest, res) => {
    try{
        const limit = queryParseNumber(req, "limit");
        const id = queryParseNumber(req, "id");
        const menu = await Menu.read(id, limit);
        res.status(200).send(menu);
    }catch(e){
        res.status(500).send(e.message);
    }
});

router.post('/menu', auth, async (req: UserRequest, res) => {
    try{
        if(req.user.role == "admin"){      
            await Menu.create(req.body);
            res.sendStatus(200);
        }else{
            res.sendStatus(403);
        }
    }catch(e){
        res.status(500).send(e.message);
    }
});

router.put('/menu', auth, async (req: UserRequest, res) => {
    try{
        const id = queryParseNumber(req, "id");
        if(req.user.role == "admin"){      
            await Menu.update(id, req.body);
            res.sendStatus(200);
        }else{
            res.sendStatus(403);
        }
    }catch(e){
        res.status(500).send(e.message);
    }
});

router.delete('/menu', auth, async (req: UserRequest, res) => {
    try{
        const id = queryParseNumber(req, "id");
        if(req.user.role == "admin"){      
            await Menu.del(id);
            res.sendStatus(200);
        }else{
            res.sendStatus(403);
        }
    }catch(e){
        res.status(500).send(e.message);
    }
});


router.put('/result', auth, async (req: UserRequest, res) => {
    try{
        if(req.user.role == "admin"){      
            const result = await Result.read(req.body);
            res.status(200).send(result);
        }else{
            res.sendStatus(403);
        }
    }catch(e){
        res.status(500).send(e.message);
    }
});

router.post('/result', auth, async (req: UserRequest, res) => {
    try{
        await Result.create({...req.body, userId: req.user.id});
        res.sendStatus(200);
    }catch(e){
        res.status(500).send(e.message);
    }
});

router.delete('/result', auth, async (req: UserRequest, res) => {
    try{
        if(req.user.role == "admin"){   
            const json: ResultTarget = {};
            const parseAndPut = (names: string[]) => {
                for(const name of names){
                    const param = queryParseNumber(req, name);
                    if(param) json[name] = param;
                }
            }
            parseAndPut(["id", "userId", "formId"]);
            await Result.del(json);
            res.sendStatus(200);
        }else{
            res.sendStatus(403);
        }
    }catch(e){
        res.status(500).send(e.message);
    }
});

export default router;