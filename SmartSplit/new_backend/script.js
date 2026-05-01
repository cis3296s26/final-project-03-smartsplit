import {createRequire} from 'module';
const require = createRequire(import.meta.url)

require('dotenv').config();
import {PrismaClient} from "./generated/prisma/client.js"
import {PrismaPg} from "@prisma/adapter-pg"



import cors from 'cors'
import express from 'express'

const app = express()

app.use(cors());

const port = 5001 
app.use(express.json());

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({adapter});

app.get("/", (req,res) => {
    res.send('Hello world');
})
// Gets payments using householdKey
app.get("/household/payments", async (req, res) =>  {
    const key = req.query.key;
    console.log("queried payments");
    try {
    const result = await prisma.household.findUnique( {
        where: {key: key},
        include: {
            payments: true,
        }
    });
        console.log(result);
        return res.json(result.payments);
    } catch(error) {
        console.error(error);
        return res.status(500).send("Could not query for payments");
    }
});
// Gets expenses using householdKey
app.get("/household/expenses", async (req, res) => {
    const key = req.query.key;
    console.log("queried expesnes");
    try {
        const result = await prisma.household.findUnique( {
            where: {key: key},
            include : {
                expenses: true
            }
        });
        console.log(result);
        return res.json(result.expenses);
    } catch(error) {
        console.error(error);
        return res.status(500).send("Could not query for expenses");
    }
});

app.get("/household/roommates", async (req,res) => {
    const key = req.query.key;
    console.log("queried roommates");
    try {
        const result = await prisma.household.findUnique( {
            where: {key: key},
            include: {
                roommates: true,
            }
        });
        console.log(result)
        return res.json(result.roommates);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Could not query for roommates");
    }
});

app.get("/roommate", async (req,res) => {
    const id = parseInt(req.query.id);     
    console.log("queried for roommate");
    console.log(req.query);
    try {
        const result = await prisma.roommate.findUnique ({
            where: {id: id},
        });
        console.log(result)
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Could not query for roommates");
    }
});


// Request to join household
// format req ={key: , name:} (name is roommate name)
app.post("/household/join", async (req,res,next) => {
    try {
        console.log("Trying join");
        if(!req.body.key || !req.body.name) {
            console.log("invalid req");
            return res.status(500).send("invalid request"); 
        }
        const query = { where:  { key: req.body.key, roommates: { some: {name: req.body.name} }}};
        console.log(query);
        const result = await prisma.household.findFirst(query);
        if(!result) {
            console.log("invalid login");
            return res.status(500).send("Invalid login, try again");
        }
        console.log(result);
        console.log("Query went thru");
        return res.status(201).json(result);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
        next(error);
    }
});

// create household with key, roommate count, roommates (from name), and name 
app.post("/household/create", async (req,res,next) => {
    try {
    if(!req.body) {
       return res.status(500).send("Request is not proper JSON");
    }
    const roommates_json = {};
    const create = []
    for (const name of req.body.roommateNames){
       create.push({name: name})
    }
    roommates_json.create = create;
    const pack = {data: {key: req.body.householdKey, name: req.body.householdName, roommateCount: req.body.numRoommates,  roommates: roommates_json}};
    console.log(pack)
    console.log(pack.data.roommates.create);
    const result = await prisma.household.create(pack);
    console.log(result);
    console.log(result.meta);
    return res.status(201).json({message: 'household created', received: req.body});
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
        next(error);
    }
});


app.post("/household/payment/create", async (req,res,next) => {
    try {
        console.log("Trying to create payment");
        if(!req.body.key || !req.body.roommateId || !req.body.description || !req.body.amount || !req.body.houesholdId) 
        {
            console.log("Invalid payment create request");
            return res.status(500).send("invalid request");
        }
        const pack = { data: { total: req.body.amount, 
            householdId: req.body.houesholdId,
            roommateId: req.body.roommateId,
            description: req.body.description
        } };
        const result = await prisma.payment.create(pack);
        console.log(result.meta);
        console.log("payment created");
        return res.status(200).json(result);
    } catch(error) {
        console.log(error);
        req.sendStatus(500);
        next(error);
    }
});

app.post("/household/expense/create", async (req,res,next) => {
    try {
        console.log("Trying to create payment");
        if(!req.body.key || !req.body.description || !req.body.amount || !req.body.houesholdId) 
        {
            console.log("Invalid payment create request");
            return res.status(500).send("invalid request");
        }
        const pack = { data: { 
            total: req.body.amount, 
            householdId: req.body.houesholdId,
            description: req.body.description
        } };
        const result = await prisma.expense.create(pack);
        console.log(result.meta);
        console.log("Expense created");
        return res.status(200).json(result);
    } catch(error) {
        console.log(error);
        req.sendStatus(500);
        next(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

