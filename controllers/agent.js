// first we import our dependencies…
const express = require('express');
const Agent = require('../models/agent');

// and create our instances
const router = express.Router();

router.get('/read', (req, res) => {
    Agent.find((err, agent) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: agent });
    }).limit(20);
});

router.post('/add', (req, res) => {
    const agentdata = new Agent();
    // body parser lets us use the req.body
    const { code, name} = req.body;
    if (!code && !name) {
        return res.json({
            success: false,
            error: 'Not Found'
        });
    }
    
    agentdata.code = code;
    agentdata.name = name;
   
    agentdata.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});
module.exports = router;