const fs = require("fs");
const path = require("path");

const sourceFolder = "./source";
const sortedFolder = "./sorted";

// Get an array of all files in the source folder
const files = fs.readdirSync(sourceFolder);

// Loop through each file and sort it into the correct year and month folders
files.forEach((file) => {
  const filePath = path.join(sourceFolder, file);
  const stat = fs.statSync(filePath);
  const modifiedDate = new Date(stat.mtime);
  const year = modifiedDate.getFullYear();
  const monthName = modifiedDate.toLocaleString("default", { month: "long" });
  const month = modifiedDate.getMonth() + 1;
  const newFolder = path.join(sortedFolder, year.toString(), monthName);

  // Create the year and month folders if they don't already exist
  if (!fs.existsSync(newFolder)) {
    fs.mkdirSync(newFolder, { recursive: true });
  }

  // Get the file extension dynamically
  const fileExtension = path.extname(filePath);

  // Create a new filename in the format of "year-month-day hours.minutes.extension"
  const newFileName = `${year}-${month.toString().padStart(2, "0")}-${modifiedDate.getDate().toString().padStart(2, "0")} ${modifiedDate.getHours().toString().padStart(2, "0")}.${modifiedDate.getMinutes().toString().padStart(2, "0")}${fileExtension}`;

  // Rename the file and move it to the correct year/month folder
  const newFilePath = path.join(newFolder, newFileName);
  fs.rename(filePath, newFilePath, (err) => {
    if (err) {
      console.error(`Failed to rename file: ${filePath}`);
    } else {
      console.log(`File sorted: ${filePath} -> ${newFilePath}`);
    }
  });
});
