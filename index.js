const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 4000;

const app = express();
const s3Bucket = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/upload", async (req, res) => {
  const buf = Buffer.from(
    req.body.base64Url.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const params = {
    ACL: "public-read-write",
    Bucket: process.env.S3_BUCKET,
    Key: `${uuidv4()}.png`,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/png",
  };

  s3Bucket.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    res.status(200).send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
