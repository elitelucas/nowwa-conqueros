require('dotenv').config();
const
    fs = require('fs'),
    rp = require('request-promise'),
    configuration = JSON.parse(fs.readFileSync('./playcanvas.json'));

fs.readFile(`./dist/${process.env.OUTPUT_FILE}`, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  
  console.log(`Uploading ${process.env.OUTPUT_FILE} to PlayCanvas`);
  let req = rp({
      uri: `https://playcanvas.com/api/assets`,
      method: 'POST',
      headers: {
          "Authorization": `Bearer ${configuration.upload.bearer}`
      }
  })
  let form = req.form()
  form.append("project", "" + configuration.playcanvas.project_id)
  form.append("name", "" + process.env.OUTPUT_FILE)
  form.append("asset", "" + configuration.upload.asset_id)
  form.append("data", JSON.stringify({order: 100, scripts: {}}))
  form.append("preload", "true")
  form.append("branchId", "" + configuration.upload.branch_id)
  form.append("file", data, {
      filename: process.env.OUTPUT_FILE,
      contentType: "text/javascript"
  })
  req.then(() => {
      console.log(`Upload complete for file ${process.env.OUTPUT_FILE}`)
      
  }, (e) => {
      console.error(e);
  });
});
