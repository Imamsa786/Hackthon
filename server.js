const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DB = "db.json";
if (!fs.existsSync(DB)) fs.writeFileSync(DB, "[]");

app.post("/register", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB));
    if (db.find(d => d.emails.some(e => req.body.emails.includes(e))))
        return res.json({ exists: true });
    db.push(req.body);
    fs.writeFileSync(DB, JSON.stringify(db, null, 2));
    res.json({ success: true });
});

app.get("/download", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB));
    let csv = "Team,Emails\n";
    db.forEach(d => csv += `${d.team},"${d.emails.join("|")}"\n`);
    fs.writeFileSync("data.csv", csv);
    res.download("data.csv");
});

app.listen(3000, () => console.log("Server running"));
