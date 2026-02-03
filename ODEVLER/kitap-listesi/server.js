const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

const filePath = path.join(__dirname, "book.json");

const readData = () => {
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
}

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.get("/books", (req, res) => {
  const data = readData();
  res.status(200).json(data);
});

app.get("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const data = readData();
  const book = data.find(b => b.id === bookId);
  if (book){
    return res.status(200).json(book);
  }
  else{
    return res.status(404).json({ message: "Kitap bulunamadı" });
  }
})

app.post("/add-book", (req, res) => {
  const data = req.body;
  const jsonData = readData();
  jsonData.push(data);
  writeData(jsonData);
  res.status(201).json(jsonData);
});

app.put("/update-book/:id", (res, reg) => {
  const bookId = parseInt(req.params.id);
  const updatedData = req.body;
  const jsonData = readData();
  const bookData = jsonData.find(b => b.id === bookId);
  if(bookData){
    jsonData = jsonData.map(b => {
      if(b.id === bookId){
        return {...b, ...updatedData}
      }
      return b;
    })
    writeData(jsonData);
    res.status(200).json(jsonData);
  }
  else{
    res.status(404).json({ message: "Kitap bulunamadı" });
  }
})

app.delete("/delete-book/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  let jsonData = readData();
  const bookIndex = jsonData.findIndex(b=> b.id === bookId);
  if(bookIndex !== -1){
    jsonData.splice(bookIndex, 1);
    writeData(jsonData);
    res.status(200).json({ message: "Kitap silindi", data: jsonData });
  }
  else{
    res.status(404).json({ message: "Kitap bulunamadı" });
  }
})

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
  console.log(__dirname);
  console.log(`Server is running on http://localhost:${port}`);
});
