const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
app.use(cors());
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//  Get users
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching users', details: error.message });
    }
});

//   Post users
app.post('/users', express.json(), async (req, res) => {
    try {
        const newUser = await prisma.user.create({
        data: req.body,
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user', details: error.message });
    }
});

//   Get events
app.get('/events', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
        include: {
            attendees: true,
        },
        });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching events', details: error.message });
    }
});

//   Post events
app.post('/events', express.json(), async (req, res) => {
    try {
        const newEvent = await prisma.event.create({
        data: req.body,
        });
        res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating event', details: error.message });
    }
});

//   Get user events
app.get('/users/:userId/events', async (req, res) => {
    const { userId } = req.params;
    try {
        const userEvents = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { events: true },
        });
        res.json(userEvents.events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user events', details: error.message });
    }
});

//   Get event attendees
app.post('/events/:eventId/attendees/:userId', async (req, res) => {
    const { eventId, userId } = req.params;
    try {
        const updatedEvent = await prisma.event.update({
        where: { id: parseInt(eventId) },
        data: {
            attendees: {
            connect: { id: parseInt(userId) },
            },
        },
        });
        res.json(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding attendee to event', details: error.message });
    }
});


