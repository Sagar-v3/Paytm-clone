const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");

const signUpSchema = zod.object({
  username: zod.string().email(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signUpSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken!",
    });
  }

  const newUser = await User.create(req.body);

  const userId = newUser._id;

   await Account.create({
    userId,
    balance: 1 + Math.random() * 10000
  });

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  return res.status(201).json({
    message: "User created successfully",
    token: token,
  });
});

const signInSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signin",async (req,res)=> {

    const {success} = signInSchema.safeParse(req.body);

    if(!success) {
        return res.status(411).json({
            message: "Error while logging in"
        });
    }

    const user = await User.findOne(req.body);

    if(user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        return res.json({
            token: token
        });
    }

    return res.status(411).json({
        message: "Error while logging in"
    });
});

const updateSchema  = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
});

router.put("/",authMiddleware, async (req,res)=> {
    
    try {
        const {success} = updateSchema.safeParse(req.body);

        if(!success) {
            return res.status(411).json({
                message: "Error while updating information"
            });
        }
    
        await User.updateOne({_id: req.userId},req.body);
    
        return res.json({
            message: "Updated successfully"
        });

    } catch (error) {
        console.error(err);
        return res.json({
            message: "Internal server error"
        });
    }
   
});

router.get("/bulk", authMiddleware,async (req,res)=> {

    try {
    const filter = req.query.filter || "";
    const currentUser = req.userId;

    const users = await User.find({
        _id: {$ne: currentUser},
        $or: [
            {firstname: { $regex: filter, $options: "i" } },
            {lastname: { $regex: filter, $options: "i" } },
        ],
    },
    "username firstname lastname _id"
);


    return res.json({
        users: users
    });

        
    } catch (error) {
        console.log(error);
        return res.json({
            message: "Internal server error"
        });
    }

   
});



module.exports = router;
