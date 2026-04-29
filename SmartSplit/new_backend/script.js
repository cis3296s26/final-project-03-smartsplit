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
})

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
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

