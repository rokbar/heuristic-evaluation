CREATE TABLE Heuristics
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

CREATE TABLE Rules
(
	id_Rule integer AUTO_INCREMENT,
	description varchar (255),
	fk_Heuristicid_Heuristic integer NOT NULL,
	PRIMARY KEY(id_Rule)
);

CREATE TABLE ProblemsRules
(
	id_ProblemRule integer AUTO_INCREMENT,
	fk_Problemid_Problem integer NOT NULL,
	fk_Ruleid_Rule integer NOT NULL,
	PRIMARY KEY(id_ProblemRule)
);

CREATE TABLE Ratings
(
	id_Rating integer AUTO_INCREMENT,
	value integer,
	comment varchar (255),
	fk_Problemid_Problem integer NOT NULL,
	fk_Expertid_User integer NOT NULL,
	PRIMARY KEY(id_Rating)
);

CREATE TABLE Teams
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

CREATE TABLE Users
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

CREATE TABLE Companies
(
	id_Company integer AUTO_INCREMENT,
	name varchar (255),
	country varchar (255),
	url varchar (255),
	address varchar (255),
	fk_SystemAdminid_User integer NOT NULL,
	PRIMARY KEY(id_Company)
);

CREATE TABLE Tasks
(
	id_Task integer AUTO_INCREMENT,
	description varchar (255),
	number integer,
	fk_Teamid_Team integer NOT NULL,
	PRIMARY KEY(id_Task)
);

CREATE TABLE ExpertsProblems
(
	id_ExpertProblem integer AUTO_INCREMENT,
	fk_Expertid_User integer NOT NULL,
	fk_Problemid_Problem integer NOT NULL,
	PRIMARY KEY(id_ExpertProblem)
);

CREATE TABLE ExpertTeams
(
	id_ExpertTeam integer AUTO_INCREMENT,
	state integer,
	fk_Teamid_Team integer NOT NULL,
	fk_Expertid_User integer NOT NULL,
	PRIMARY KEY(id_ExpertTeam)
);

CREATE TABLE Problems
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

ALTER TABLE Rules
	ADD CONSTRAINT consists_of FOREIGN KEY(fk_Heuristicid_Heuristic) REFERENCES Heuristics (id_Heuristic);

ALTER TABLE ProblemsRules
	ADD CONSTRAINT violates FOREIGN KEY(fk_Problemid_Problem) REFERENCES Problems (id_Problem),
    ADD FOREIGN KEY(fk_Ruleid_Rule) REFERENCES Rules (id_Rule);
    
ALTER TABLE Ratings
	ADD FOREIGN KEY(fk_Problemid_Problem) REFERENCES Problems (id_Problem),
	ADD FOREIGN KEY(fk_Expertid_User) REFERENCES Users (id_User);

ALTER TABLE Teams
	ADD FOREIGN KEY(state) REFERENCES TeamState (id_TeamState),
	ADD CONSTRAINT creates FOREIGN KEY(fk_CompanyAdminid_User) REFERENCES Users (id_User),
	ADD CONSTRAINT manages FOREIGN KEY(fk_LeadExpertid_User) REFERENCES Users (id_User),
	ADD CONSTRAINT uses FOREIGN KEY(fk_Heuristicid_Heuristic) REFERENCES Heuristics (id_Heuristic);
    
ALTER TABLE Users
	ADD CONSTRAINT belongs_to FOREIGN KEY(fk_Companyid_Company) REFERENCES Companies (id_Company),
	ADD CONSTRAINT admin_creates FOREIGN KEY(fk_SystemAdminid_User) REFERENCES Users (id_User);
    
ALTER TABLE Companies
	ADD CONSTRAINT admin_creates_company FOREIGN KEY(fk_SystemAdminid_User) REFERENCES Users (id_User);
    
ALTER TABLE Tasks
	ADD CONSTRAINT has FOREIGN KEY(fk_Teamid_Team) REFERENCES Teams (id_Team);
    
ALTER TABLE ExpertsProblems
	ADD CONSTRAINT detected FOREIGN KEY(fk_Expertid_User) REFERENCES Users (id_User),
	ADD FOREIGN KEY(fk_Problemid_Problem) REFERENCES Problems (id_Problem);
    
ALTER TABLE ExpertTeams
	ADD FOREIGN KEY(state) REFERENCES ExpertTeamState (id_ExpertTeamState),
	ADD FOREIGN KEY(fk_Teamid_Team) REFERENCES Teams (id_Team),
	ADD FOREIGN KEY(fk_Expertid_User) REFERENCES Users (id_User);
    
ALTER TABLE Problems
	ADD CONSTRAINT finds FOREIGN KEY(fk_Teamid_Team) REFERENCES Teams (id_Team);