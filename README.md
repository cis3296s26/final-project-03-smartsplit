# SmartSplit
SmartSplit is a web application that helps college roommates efficiently navigate shared living expenses from rent to groceries to fun night out spending! 

![This is a screenshot.](images.png)
# How to run  
- REQUIREMENTS
  - Node.js
  - npm
  - MySQL
1. Clone the repo using command  
```
git clone https://github.com/yourusername/smartsplit.git
cd smartsplit 
```
2. Install dependencies
- Backend
```
cd backend
npm install
```
- Frontend
```
cd ../frontend
npm install
```
3. Set up the database
- Use the file provided named schema.sql, make sure MySQL is running, then run:
```
SOURCE schema.sql;
```
This will automatically create the SmartSplit database and tables.
4. Run the backend
```
cd ../backend
node server.js
```
5. Run the frontend
```
cd ../frontend
npm start
```
# 🛠️ How to Build
Frontend
```
cd frontend
npm run build
```
This creates an optimized production build in the build/ folder.

Backend

No build step is required for the backend. It can be run directly using Node.js.
# Now you are ready to use SmartSplit!
You can...
  - Create a household
  - Add members
  - Log expenses
  - View balances

