CREATE TABLE User (
  userId VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Household (
  householdId VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  householdKey VARCHAR(20) UNIQUE
);

-- Many-to-many: users can belong to multiple households
CREATE TABLE HouseholdMember (
  userId VARCHAR(36),
  householdId VARCHAR(36),
  PRIMARY KEY (userId, householdId),
  FOREIGN KEY (userId) REFERENCES User(userId),
  FOREIGN KEY (householdId) REFERENCES Household(householdId)
);


CREATE TABLE Lease (
  leaseId VARCHAR(36) PRIMARY KEY,
  totalRent DECIMAL(10,2) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  householdId VARCHAR(36),
  templateId VARCHAR(36),
  FOREIGN KEY (householdId) REFERENCES Household(householdId),
  FOREIGN KEY (templateId) REFERENCES RentTemplate(templateId)
);

ALTER TABLE Household
ADD householdKey VARCHAR2(20) UNIQUE;

CREATE TABLE Expense (
  expenseId VARCHAR(36) PRIMARY KEY,
  description VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  splitType ENUM('Equal', 'Percentage', 'Custom') NOT NULL,
  category ENUM('Rent', 'Utilities', 'Groceries', 'Subscriptions', 'Other') NOT NULL,
  householdId VARCHAR(36),
  FOREIGN KEY (householdId) REFERENCES Household(householdId)
);

CREATE TABLE ExpenseShare (
  shareId VARCHAR(36) PRIMARY KEY,
  amountOwed DECIMAL(10,2) NOT NULL,
  userId VARCHAR(36),
  expenseId VARCHAR(36),
  FOREIGN KEY (userId) REFERENCES User(userId),
  FOREIGN KEY (expenseId) REFERENCES Expense(expenseId)
);

CREATE TABLE Payment (
  paymentId VARCHAR(36) PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  payerId VARCHAR(36),
  receiverId VARCHAR(36),
  method ENUM('Zelle', 'Venmo', 'Paypal', 'Cash') NOT NULL,
  householdId VARCHAR(36),
  processed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (payerId) REFERENCES User(userId),
  FOREIGN KEY (receiverId) REFERENCES User(userId),
  FOREIGN KEY (householdId) REFERENCES Household(householdId)
);

CREATE TABLE Insight (
  insightId VARCHAR(36) PRIMARY KEY,
  category ENUM('Rent', 'Utilities', 'Groceries', 'Subscriptions', 'Other'),
  message VARCHAR(255),
  predictedAmount DECIMAL(10,2),
  createdAt DATE,
  householdId VARCHAR(36),
  FOREIGN KEY (householdId) REFERENCES Household(householdId)
);