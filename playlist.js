const express = require("express");
const cron = require("node-cron");
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.json());

let playlist = [];

// schedule song playback
function ScheduleSong(song){
    const{name, time} = song;
    const task =cron.schedule( time, ()=> {
        console.log(`now Playing: ${name}`);
    });

    return task;
}

// Route to add a song to the playlist
app.post("/add", (req, res) => {
    const {name, time} = req.body;
    if (!name || ! time){
        return res.status(400).json({error: "Song name and time required"});

    }

    const task = scheduleSong({name, time});
    playlist.push({name, time, task});

    res.json({message: "Song Scheduled", name, time});
});


// Route to list all scheduled songs
app.get("/playlist", (req, res) => {
    res.json(playlist.map(song => ({ name: song.name, time: song.time })));
}); 


// Route to remove a song
app.delete("/remove/:name", (req, res) => {
    const name = req.params.name;
    const index = playlist.findIndex(song => song.name === name);

    if (index === -1) {
        return res.status(404).json({ error: "Song not found!" });
    }

    playlist[index].task.stop();
    playlist.splice(index, 1);
    res.json({ message: `Song ${name} removed.` });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Playlist Scheduler running on port ${PORT}`));