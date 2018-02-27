// Please add this file to .gitignore after adding it to the server

// Config for Develop
process.production = false;
process.develop = true;
process.host = process.argv[4] || 3000;

// Config for production
// process.production = true;
// process.develop = false;
// process.host = 80;