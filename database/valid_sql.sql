CREATE TABLE Heuristic
(
	id_Heuristic integer AUTO_INCREMENT,
	name varchar (255),
	isUnique boolean DEFAULT false,
	PRIMARY KEY(id_Heuristic)
);

CREATE TABLE ExpertTeamState
(
	id_ExpertTeamState integer AUTO_INCREMENT,
	name char (18) NOT NULL,
	PRIMARY KEY(id_ExpertTeamState)
);
INSERT INTO ExpertTeamState(id_ExpertTeamState, name) VALUES(1, 'evaluationFinished');
INSERT INTO ExpertTeamState(id_ExpertTeamState, name) VALUES(2, 'evaluationStarted');
INSERT INTO ExpertTeamState(id_ExpertTeamState, name) VALUES(3, 'ratingProblems');

CREATE TABLE TeamState
(
	id_TeamState integer AUTO_INCREMENT,
	name char (18) NOT NULL,
	PRIMARY KEY(id_TeamState)
);
INSERT INTO TeamState(id_TeamState, name) VALUES(1, 'evaluationFinished');
INSERT INTO TeamState(id_TeamState, name) VALUES(2, 'evaluationStarted');
INSERT INTO TeamState(id_TeamState, name) VALUES(3, 'generalization');
INSERT INTO TeamState(id_TeamState, name) VALUES(4, 'new');
INSERT INTO TeamState(id_TeamState, name) VALUES(5, 'ratingProblems');

CREATE TABLE Rule
(
	id_Rule integer AUTO_INCREMENT,
	description varchar (255),
	fk_Heuristicid_Heuristic integer NOT NULL,
	PRIMARY KEY(id_Rule)
);

CREATE TABLE ProblemRule
(
	id_ProblemRule integer AUTO_INCREMENT,
	fk_Problemid_Problem integer NOT NULL,
	fk_Ruleid_Rule integer NOT NULL,
	PRIMARY KEY(id_ProblemRule)
);

CREATE TABLE Rating
(
	id_Rating integer AUTO_INCREMENT,
	value integer,
	comment varchar (255),
	fk_Problemid_Problem integer NOT NULL,
	fk_Expertid_User integer NOT NULL,
	PRIMARY KEY(id_Rating)
);

CREATE TABLE Team
(
	id_Team integer AUTO_INCREMENT,
	name varchar (255),
	report smallint,
	systemName varchar (255),
	systemUrl varchar (255),
	systemContacts varchar (255),
	state integer,
	fk_CompanyAdminid_User integer NOT NULL,
	fk_LeadExpertid_User integer NOT NULL,
	fk_Heuristicid_Heuristic integer NOT NULL,
	PRIMARY KEY(id_Team)
);

CREATE TABLE User
(
	id_User integer AUTO_INCREMENT,
	name varchar (255),
	password varchar (255),
	isBlocked boolean,
	lastLogon date,
	email varchar (255),
	fk_Companyid_Company integer,
	fk_SystemAdminid_User integer NOT NULL,
	typeSelector char (255),
	PRIMARY KEY(id_User)
);

CREATE TABLE Company
(
	id_Company integer AUTO_INCREMENT,
	name varchar (255),
	country varchar (255),
	url varchar (255),
	address varchar (255),
	fk_SystemAdminid_User integer NOT NULL,
	PRIMARY KEY(id_Company)
);

CREATE TABLE Task
(
	id_Task integer AUTO_INCREMENT,
	description varchar (255),
	number integer,
	fk_Teamid_Team integer NOT NULL,
	PRIMARY KEY(id_Task)
);

CREATE TABLE ExpertProblem
(
	id_ExpertProblem integer AUTO_INCREMENT,
	fk_Expertid_User integer NOT NULL,
	fk_Problemid_Problem integer NOT NULL,
	PRIMARY KEY(id_ExpertProblem)
);

CREATE TABLE ExpertTeam
(
	id_ExpertTeam integer AUTO_INCREMENT,
	state integer,
	fk_Teamid_Team integer NOT NULL,
	fk_Expertid_User integer NOT NULL,
	PRIMARY KEY(id_ExpertTeam)
);

CREATE TABLE Problem
(
	id_Problem integer AUTO_INCREMENT,
	description varchar (255),
	location varchar (255),
	photo smallint,
	ratingsAverage float,
	isCombined boolean DEFAULT false,
	fk_Teamid_Team integer NOT NULL,
	PRIMARY KEY(id_Problem)
);

ALTER TABLE Rule
	ADD CONSTRAINT consists_of FOREIGN KEY(fk_Heuristicid_Heuristic) REFERENCES Heuristic (id_Heuristic);

ALTER TABLE ProblemRule
	ADD CONSTRAINT violates FOREIGN KEY(fk_Problemid_Problem) REFERENCES Problem (id_Problem),
    ADD FOREIGN KEY(fk_Ruleid_Rule) REFERENCES Rule (id_Rule);
    
ALTER TABLE Rating
	ADD FOREIGN KEY(fk_Problemid_Problem) REFERENCES Problem (id_Problem),
	ADD FOREIGN KEY(fk_Expertid_User) REFERENCES User (id_User);

ALTER TABLE Team
	ADD FOREIGN KEY(state) REFERENCES TeamState (id_TeamState),
	ADD CONSTRAINT creates FOREIGN KEY(fk_CompanyAdminid_User) REFERENCES User (id_User),
	ADD CONSTRAINT manages FOREIGN KEY(fk_LeadExpertid_User) REFERENCES User (id_User),
	ADD CONSTRAINT uses FOREIGN KEY(fk_Heuristicid_Heuristic) REFERENCES Heuristic (id_Heuristic);
    
ALTER TABLE User
	ADD CONSTRAINT belongs_to FOREIGN KEY(fk_Companyid_Company) REFERENCES Company (id_Company),
	ADD CONSTRAINT admin_creates FOREIGN KEY(fk_SystemAdminid_User) REFERENCES User (id_User);
    
ALTER TABLE Company
	ADD CONSTRAINT admin_creates_company FOREIGN KEY(fk_SystemAdminid_User) REFERENCES User (id_User);
    
ALTER TABLE Task
	ADD CONSTRAINT has FOREIGN KEY(fk_Teamid_Team) REFERENCES Team (id_Team);
    
ALTER TABLE ExpertProblem
	ADD CONSTRAINT detected FOREIGN KEY(fk_Expertid_User) REFERENCES User (id_User),
	ADD FOREIGN KEY(fk_Problemid_Problem) REFERENCES Problem (id_Problem);
    
ALTER TABLE ExpertTeam
	ADD FOREIGN KEY(state) REFERENCES ExpertTeamState (id_ExpertTeamState),
	ADD FOREIGN KEY(fk_Teamid_Team) REFERENCES Team (id_Team),
	ADD FOREIGN KEY(fk_Expertid_User) REFERENCES User (id_User);
    
ALTER TABLE Problem
	ADD CONSTRAINT finds FOREIGN KEY(fk_Teamid_Team) REFERENCES Team (id_Team);