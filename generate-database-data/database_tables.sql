CREATE TABLE `Users` (
  `UserID` int PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(255),
  `Email` varchar(255),
  `Username` varchar(255),
  `Password` varchar(255),
  `Title` varchar(255),
  `DepartmentID` int,
  `Privileges` varchar(255),
  `Salary` decimal,
  `LastLogin` datetime,
  `IsSensitive` boolean
);

CREATE TABLE `Department` (
  `DepartmentID` int PRIMARY KEY,
  `Name` varchar(255)
);

CREATE TABLE `CloudResources` (
  `ResourceID` int PRIMARY KEY AUTO_INCREMENT,
  `Category` varchar(255),
  `DepartmentID` int,
  `AccessRequirement` varchar(255),
  `SessionDuration` int,
  `KeyPublic` varchar(255),
  `KeyPrivate` varchar(255)
);

CREATE TABLE `Keys` (
  `KeyID` int PRIMARY KEY AUTO_INCREMENT,
  `ResourceID` int,
  `KeyType` varchar(255),
  `KeyValue` varchar(255)
);

CREATE TABLE `ForumComments` (
  `CommentID` int PRIMARY KEY AUTO_INCREMENT,
  `ForumID` int,
  `UserID` int,
  `Comment` text,
  `Timestamp` datetime
);

CREATE TABLE `Forum` (
  `ForumID` int PRIMARY KEY AUTO_INCREMENT,
  `Title` varchar(255),
  `Description` text,
  `ForumCategory` varchar(255)
);

CREATE TABLE `Expenses` (
  `ExpenseID` int PRIMARY KEY AUTO_INCREMENT,
  `UserID` int,
  `Amount` decimal,
  `Category` varchar(255),
  `Status` varchar(255),
  `LastModifiedBy` int,
  `Timestamp` datetime
);

CREATE TABLE `ITSupport` (
  `TicketID` int PRIMARY KEY AUTO_INCREMENT,
  `ReportedBy` int,
  `Issue` text,
  `Status` varchar(255),
  `AssignedTo` int,
  `Timestamp` datetime
);

CREATE TABLE `PerformanceAnalytics` (
  `MetricID` int PRIMARY KEY AUTO_INCREMENT,
  `DepartmentID` int,
  `Metric` varchar(255),
  `Value` decimal,
  `LastUpdated` datetime
);

CREATE TABLE `CorporateInitiatives` (
  `ProjectID` int PRIMARY KEY AUTO_INCREMENT,
  `ProjectName` varchar(255),
  `Budget` decimal,
  `Progress` varchar(255),
  `ExecutiveSponsor` varchar(255)
);

CREATE TABLE `SecurityQuestions` (
  `QuestionID` int PRIMARY KEY AUTO_INCREMENT,
  `QuestionText` varchar(255)
);

CREATE TABLE `SecurityAnswers` (
  `AnswerID` int PRIMARY KEY AUTO_INCREMENT,
  `UserID` int,
  `QuestionID` int,
  `Answer` varchar(255),
  `Timestamp` datetime
);

ALTER TABLE `Users` ADD FOREIGN KEY (`DepartmentID`) REFERENCES `Department` (`DepartmentID`);

ALTER TABLE `CloudResources` ADD FOREIGN KEY (`DepartmentID`) REFERENCES `Department` (`DepartmentID`);

ALTER TABLE `Keys` ADD FOREIGN KEY (`ResourceID`) REFERENCES `CloudResources` (`ResourceID`);

ALTER TABLE `ForumComments` ADD FOREIGN KEY (`ForumID`) REFERENCES `Forum` (`ForumID`);

ALTER TABLE `ForumComments` ADD FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

ALTER TABLE `Expenses` ADD FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

ALTER TABLE `ITSupport` ADD FOREIGN KEY (`ReportedBy`) REFERENCES `Users` (`UserID`);

ALTER TABLE `ITSupport` ADD FOREIGN KEY (`AssignedTo`) REFERENCES `Users` (`UserID`);

ALTER TABLE `PerformanceAnalytics` ADD FOREIGN KEY (`DepartmentID`) REFERENCES `Department` (`DepartmentID`);

ALTER TABLE `SecurityAnswers` ADD FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

ALTER TABLE `SecurityAnswers` ADD FOREIGN KEY (`QuestionID`) REFERENCES `SecurityQuestions` (`QuestionID`);
