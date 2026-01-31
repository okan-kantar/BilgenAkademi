const http = require("http");
const fs = require("fs");
const logger = require("./modules/logger.cjs");
const filmEvents = require("./modules/eventBus.js");
const fileOperations = require("./modules/fileManager.js");

var stats = {
  "totalFilms": 10,
  "watchedFilms": 7,
  "averageRating": 7.8,
  "categories": {
    "sci-fi": 3,
    "drama": 4,
    "action": 3
  }
}

const server = http.createServer(async (req, res) => {
  // api
  if (req.url === "/api/films") {
    logger("Film API isteği alındı", "info", new Date(), req.url);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const films = fs.readFileSync("./data/films.json");
    res.end(films);
  }
  else if(req.url === "/api/stats"){
    logger("İstatistik API isteği alındı", "info", new Date(), req.url);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(stats));
  }


  if (req.url === "/") {
    fs.readFile("./templates/home.html", (err, data) => {
      if (err) {
        logger(
          "Ana sayfa yüklenirken hata oluştu",
          "error",
          new Date(),
          req.url,
        );
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("Sunucu hatası");
      } else {
        logger("Ana sayfa görüntülendi", "info", new Date(), req.url);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        const filmsData = JSON.parse(fs.readFileSync("./data/films.json"));
        const films = filmsData.films;
        const totalFilms = films.length;
        const watchedCount = films.filter(f => f.watched).length;
        const unwatchedCount = totalFilms - watchedCount;
        const averageRating = (films.reduce((sum, f) => sum + f.rating, 0) / totalFilms).toFixed(1);
        const recentFilms = films.slice(-5).reverse();

        let filmListHTML = "";
        recentFilms.forEach((f) => {
          filmListHTML += `<li>
                    ${f.title} - ${f.year} <a href="#">Detay</a></li>`;
        });

        let html = data.toString();
        html = html.replace("{{total_films}}", totalFilms);
        html = html.replace("{{watched_count}}", watchedCount);
        html = html.replace("{{unwatched_count}}", unwatchedCount);
        html = html.replace("{{average_rating}}", averageRating);
        html = html.replace("{{recent_films}}", filmListHTML);

        res.end(html);
      }
    });
  } else if (req.url === "/films") {
    fs.readFile("./templates/films.html", (err, data) => {
      if (err) {
        logger("Filmler yüklenirken hata oluştu", "error", new Date(), req.url);
      } else {
        logger("Filmler görüntülendi", "info", new Date(), req.url);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        let filmList = "";
        var filmsData = JSON.parse(fs.readFileSync("./data/films.json"));
        var films = filmsData.films;
        films.forEach((f) => {
          filmList += `<li><a href="/films/${f.id}">${f.title} (${f.year}) - Rating: ${f.rating}</a></li>`;
        });

        let categoryData = JSON.parse(fs.readFileSync("./data/categories.json"));
        let categoryList = categoryData.categories;
        let categoryHTML = "";
        categoryList.forEach((c) => {
          categoryHTML += `<li><a href="/category/${c.id}">${c.name}</a></li>`;
        });
        
      var html = data.toString().replace("{{category_list}}", categoryHTML).replace("{{film_list}}", filmList);
        res.end(html);
      }
    });
  } 
  else if (req.url.startsWith("/films/")) {
    const filmId = parseInt(req.url.split('/')[2]);
    const filmsData = JSON.parse(fs.readFileSync('./data/films.json'));
    const films = filmsData.films;
    const film = films.find(f => f.id === filmId);
    if(film){
      filmEvents.emit("filmDetailViewed", film.id, film.title);
      fs.readFile("./templates/film-detail.html", (err, data) =>{
        if(err){
          logger(`Film detayı yüklenirken hata oluştu: ID ${filmId}`, "error", new Date(), req.url);
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/plain");
          res.end("Sunucu hatası");
        }
        else{
          logger(`Film detayı görüntülendi: ${film.title} (ID: ${film.id})`, "info", new Date(), req.url);
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html");
          let html = data.toString();
          html = html.replace("{{ film_title }}", film.title);
          html = html.replace("{{ film_year }}", film.year);
          html = html.replace("{{ film_rating }}", film.rating);
          html = html.replace("{{ film_description }}", film.description);
          res.end(html);
        }
      })
    }
  }
  else if(req.url.includes("/category/")){
    const categoryId = req.url.split('/')[2];
    const categoryData = JSON.parse(fs.readFileSync('./data/categories.json'));
    const categories = categoryData.categories;
    fs.readFile("./templates/films.html", (err, data) => {
      if (err) {
        logger("Filmler yüklenirken hata oluştu", "error", new Date(), req.url);
      } else {
        logger("Filmler görüntülendi", "info", new Date(), req.url);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        let filmList = "";
        var filmsData = JSON.parse(fs.readFileSync("./data/films.json"));
        var films = filmsData.films.filter(f => f.category === categoryId);
        films.forEach((f) => {
          filmList += `<li><a href="/films/${f.id}">${f.title} (${f.year}) - Rating: ${f.rating}</a></li>`;
        });

        let categoryHTML = "";
        categories.forEach((c) => {
          categoryHTML += `<li><a href="/category/${c.id}">${c.name}</a></li>`;
        });
        
      var html = data.toString().replace("{{film_list}}", filmList).replace("{{category_list}}", categoryHTML);
        res.end(html);
      }
    });
  }
  else if(req.url.includes("/reports")){
    logger("Raporlar görüntülendi", "info", new Date(), req.url);
    res.statusCode = 200;
    const result = await fileOperations();
    res.end(result.message);
  }
  else {
    res.statusCode = 404;
    res.end("Sayfa bulunamadı");
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});



