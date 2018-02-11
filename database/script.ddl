--@(#) script.ddl

CREATE TABLE Model.Heuristics
(
	id_Heuristic integer,
	name varchar (255),
	isUnique boolean DEFAULT false,
	PRIMARY KEY(id_Heuristic)
);

CREATE TABLE Model.ExpertTeamState
(
	id_ExpertTeamState integer,
	name char (18) NOT NULL,
	PRIMARY KEY(id_ExpertTeamState)
);
INSERT INTO ExpertTeamState(id_ExpertTeamState, name) VALUES(1, 'evaluationFinished')
INSERT INTO ExpertTeamState(id_ExpertTeamState, name) VALUES(2, 'evaluationStarted')
INSERT INTO ExpertTeamState(id_ExpertTeamState, name) VALUES(3, 'ratingProblems')

CREATE TABLE Model.TeamState
(
	id_TeamState integer,
	name char (18) NOT NULL,
	PRIMARY KEY(id_TeamState)
);
INSERT INTO TeamState(id_TeamState, name) VALUES(1, 'evaluationFinished')
INSERT INTO TeamState(id_TeamState, name) VALUES(2, 'evaluationStarted')
INSERT INTO TeamState(id_TeamState, name) VALUES(3, 'generalization')
INSERT INTO TeamState(id_TeamState, name) VALUES(4, 'new')
INSERT INTO TeamState(id_TeamState, name) VALUES(5, 'ratingProblems')

CREATE TABLE Model.Rules
(
	id_Rule integer,
	description varchar (255),
	fk_Heuristicid_Heuristic integer NOT NULL,
	PRIMARY KEY(id_Rule),
	CONSTRAINT consists of FOREIGN KEY(fk_Heuristicid_Heuristic) REFERENCES Model.Heuristics (id_Heuristic)
);

CREATE TABLE Model.ProblemsRules
(
	id_ProblemRule integer,
	fk_Problemid_Problem integer NOT NULL,
	fk_Ruleid_Rule integer NOT NULL,
	PRIMARY KEY(id_ProblemRule),
	CONSTRAINT violates FOREIGN KEY(fk_Problemid_Problem) REFERENCES Model.Problems (id_Problem),
	FOREIGN KEY(fk_Ruleid_Rule) REFERENCES Model.Rules (id_Rule)
);

CREATE TABLE Model.Ratings
(
	id_Rating integer,
	value integer,
	comment varchar (255),
	fk_Problemid_Problem integer NOT NULL,
	fk_Expertid_User integer NOT NULL,
	PRIMARY KEY(id_Rating),
	FOREIGN KEY(fk_Problemid_Problem) REFERENCES Model.Problems (id_Problem),
	FOREIGN KEY(fk_Expertid_User) REFERENCES Model.Users (id_User)
);

CREATE TABLE Model.Teams
(
	id_Team integer,
	name varchar (255),
	report smallint,
	systemName varchar (255),
	systemUrl varchar (255),
	systemContacts varchar (255),
	state integer,
	fk_CompanyAdminid_User integer NOT NULL,
	fk_LeadExpertid_User integer NOT NULL,
	fk_Heuristicid_Heuristic integer NOT NULL,
	PRIMARY KEY(id_Team),
	FOREIGN KEY(state) REFERENCES Model.TeamState (id_TeamState),
	CONSTRAINT creates FOREIGN KEY(fk_CompanyAdminid_User) REFERENCES Model.Users (id_User),
	CONSTRAINT manages FOREIGN KEY(fk_LeadExpertid_User) REFERENCES Model.Users (id_User),
	CONSTRAINT uses FOREIGN KEY(fk_Heuristicid_Heuristic) REFERENCES Model.Heuristics (id_Heuristic)
);

CREATE TABLE Model.Users
(
	id_User integer,
	name varchar (255),
	password varchar (255),
	isBlocked boolean,
	lastLogon date,
	email varchar (255),
	fk_Companyid_Company integer,
	fk_SystemAdminid_User integer NOT NULL,
	typeSelector char (255),
	PRIMARY KEY(id_User),
	CONSTRAINT belongs to FOREIGN KEY(fk_Companyid_Company) REFERENCES Model.Companies (id_Company),
	CONSTRAINT creates FOREIGN KEY(fk_SystemAdminid_User) REFERENCES Model.Users (id_User)
);

CREATE TABLE Model.Companies
(
	id_Company integer,
	name varchar (255),
	country varchar (255),
	url varchar (255),
	address varchar (255),
	fk_SystemAdminid_User integer NOT NULL,
	PRIMARY KEY(id_Company),
	CONSTRAINT creates FOREIGN KEY(fk_SystemAdminid_User) REFERENCES Model.Users (id_User)
);

CREATE TABLE Model.Tasks
(
	id_Task integer,
	description varchar (255),
	number integer,
	fk_Teamid_Team integer NOT NULL,
	PRIMARY KEY(id_Task),
	CONSTRAINT has FOREIGN KEY(fk_Teamid_Team) REFERENCES Model.Teams (id_Team)
);

CREATE TABLE Model.ExpertsProblems
(
	id_ExpertProblem integer,
	fk_Expertid_User integer NOT NULL,
	fk_Problemid_Problem integer NOT NULL,
	PRIMARY KEY(id_ExpertProblem),
	CONSTRAINT detected FOREIGN KEY(fk_Expertid_User) REFERENCES Model.Users (id_User),
	FOREIGN KEY(fk_Problemid_Problem) REFERENCES Model.Problems (id_Problem)
);

CREATE TABLE Model.ExpertTeams
(
	id_ExpertTeam integer,
	state integer,
	fk_Teamid_Team integer NOT NULL,
	fk_Expertid_User integer NOT NULL,
	PRIMARY KEY(id_ExpertTeam),
	FOREIGN KEY(state) REFERENCES Model.ExpertTeamState (id_ExpertTeamState),
	FOREIGN KEY(fk_Teamid_Team) REFERENCES Model.Teams (id_Team),
	FOREIGN KEY(fk_Expertid_User) REFERENCES Model.Users (id_User)
);

CREATE TABLE Model.Problems
(
	id_Problem integer,
	description varchar (255),
	location varchar (255),
	photo smallint,
	ratingsAverage float,
	isCombined boolean DEFAULT false,
	fk_Teamid_Team integer NOT NULL,
	PRIMARY KEY(id_Problem),
	CONSTRAINT finds FOREIGN KEY(fk_Teamid_Team) REFERENCES Model.Teams (id_Team)
);
