const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://kanimozhiit46:RiRGgv9v3OsSYffV@cluster0.fnbrsiy.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("DB Success"))
.catch(() => console.log("DB failed"));

// 👇 NOTE: use lowercase `name`
const Fruit = mongoose.model("Fruit", { name: String }, "fruits");

// Get all fruits
app.get("/fruits", function (req, res) {
    Fruit.find()
    .then(function (retdata) {
        console.log(retdata);
        res.json(retdata);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error fetching fruits");
    });
});

// Add a new fruit
app.post("/addfruit", function (req, res) {
    const fruitName = req.body.newfruit;

    const newFruit = new Fruit({
        name: fruitName // 👈 use `name`
    });

    newFruit.save()
    .then((savedFruit) => {
        console.log("Saved Successfully");
        res.status(201).json(savedFruit);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving fruit");
    });
});

// Update a fruit
app.put("/updatefruit/:id", function (req, res) {
    const { id } = req.params;
    const { name } = req.body;

    Fruit.findByIdAndUpdate(id, { name: name }, { new: true })
    .then((updatedFruit) => {
        console.log("Updated Successfully");
        res.json(updatedFruit);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error updating fruit");
    });
});

// Delete a fruit
app.delete("/deletefruit/:id", function (req, res) {
    const { id } = req.params;

    Fruit.findByIdAndDelete(id)
    .then(() => {
        console.log("Deleted Successfully");
        res.send("Fruit deleted");
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error deleting fruit");
    });
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});
