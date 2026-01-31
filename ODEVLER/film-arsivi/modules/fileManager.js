const fs = require("fs").promises;
const logger = require("./logger.cjs"); // './' yeterli, './modules/' olmamalı

async function fileOperations() {
    try {
        // Node.js'te fetch yok, direkt dosyayı oku
        const data = await fs.readFile("./data/films.json", "utf8");
        const films = JSON.parse(data);
        const jsonData = JSON.stringify(films, null, 2);
        
        await fs.writeFile("./reports/films-export.txt", jsonData);
        logger("Filmler raporu oluşturuldu.", "info", new Date(), "/reports");
        
        return { success: true, message: "Rapor oluşturuldu" };
    }   
    catch (err) {
        logger(`Dosya işlemi hatası: ${err}`, "error", new Date(), "/reports");
        return { success: false, message: err.message };
    }   
}

module.exports = fileOperations;