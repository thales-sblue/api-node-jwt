import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

router.post('/cadastro', async (req, res) => {
    try {
        const user = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt)

        const userDB = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
            },
        })

        res.status(201).json({
            message: 'User created successfully',
            userDB,
        })

    } catch (err) {
        res.status(500).json({
            message: 'Error creating user',
            error: err.message,
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const userInfo = req.body
        const user = await prisma.user.findUnique({ where: { email: userInfo.email } })
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            })
        }

        const isPasswordValid = await bcrypt.compare(userInfo.password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password',
            })
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' })
        res.cookie('token', token)

        res.status(200).json({ user })
    } catch (err) {
        res.status(500).json({
            message: 'Error logging in',
            error: err.message,
        })
    }
})

export default router

