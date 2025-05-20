import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/listar-usuarios', async (req, res) => {
    try {
        const users = await prisma.user.findMany({ omit: { password: true } })
        if (!users) {
            return res.status(404).json({
                message: 'No users found',
            })
        }
        res.status(200).json({
            message: 'Users fetched successfully',
            users,
        })

    } catch (err) {
        res.status(500).json({
            message: 'Error fetching users',
            error: err.message,
        })
    }
})

export default router