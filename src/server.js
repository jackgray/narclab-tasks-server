require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs");
const EXPRESS_PORT = process.env.EXPRESS_PORT || 4040;
apiRoutes = express.Router();

app.use(express.json());

// Serving JSON files
apiRoutes.get("/config/:filename", (req, res) => {
  const options = {
    root: "/app/data/config",
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
      "Content-Type": "application/json",
    },
  };

  const fileName = req.params.filename;
  res.sendFile(fileName, options, (err) => {
    if (err) {
      console.error("Error sending the file:", err);
      res.status(err.status).end();
    }
  });
});

apiRoutes.use("/config", express.static("/app/data/config"));
apiRoutes.use("/manifests", express.static(`/app/data/manifests`));
apiRoutes.use("/upload", express.static("/app/data/uploads"));

app.use("/api", apiRoutes);
apiRoutes.post("/upload", express.json(), async (req, res) => {
  try {
    console.log("Checking request: ", req);
    const filename = req.body.filename;
    const data = req.body.filedata;
    const taskname = req.body.taskname;
    const uploadPath = `/app/data/upload/${filename}`;
    const manifestOutputPath = `/app/data/manifests/${filename}`;
    const behOutputPath = `/app/data/${taskname}/beh/${filename}`;
    
    // Determine where to save file
    let outPath;
    if (filename.includes('manifest')) {
      outPath = manifestOutputPath;
    } else {
      outPath = behOutputPath;
    }

    console.log("Saving data to ", outPath, data)
    fs.writeFileSync(outPath, JSON.stringify(data));

    // delete the file from the upload directory after it has been processed
    fs.unlinkSync(uploadPath);

    res.json({
      message: "Success",
      filename: filename,
    });
  } catch (error) {
    console.error("Error writing file: ", error);
    res.status(500).json({ error: "Error writing file" });
  }
});

app.listen(EXPRESS_PORT, () => {
  console.log(`Server is running on port ${EXPRESS_PORT}`);
});
