CREATE TABLE Heuristic
(
	id integer AUTO_INCREMENT,
	name varchar(100) NOT NULL,
	isUnique boolean DEFAULT false,
	PRIMARY KEY(id)
);

CREATE TABLE EvaluatorTeamState
(
	id integer AUTO_INCREMENT,
	name char (18) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO EvaluatorTeamState(id, name) VALUES(1, 'new');
INSERT INTO EvaluatorTeamState(id, name) VALUES(2, 'evaluationStarted');
INSERT INTO EvaluatorTeamState(id, name) VALUES(3, 'submittedProblems');
INSERT INTO EvaluatorTeamState(id, name) VALUES(4, 'ratingProblems');
INSERT INTO EvaluatorTeamState(id, name) VALUES(5, 'evaluationFinished');

CREATE TABLE TeamState
(
	id integer AUTO_INCREMENT,
	name char (18) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO TeamState(id, name) VALUES(1, 'new');
INSERT INTO TeamState(id, name) VALUES(2, 'evaluationStarted');
INSERT INTO TeamState(id, name) VALUES(3, 'generalization');
INSERT INTO TeamState(id, name) VALUES(4, 'ratingProblems');
INSERT INTO TeamState(id, name) VALUES(5, 'evaluationFinished');

CREATE TABLE Rule
(
	id integer AUTO_INCREMENT,
	description varchar (255) NOT NULL,
	listNumber integer NOT NULL,
	heuristicId integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE ProblemRule
(
	id integer AUTO_INCREMENT,
	problemId integer NOT NULL,
	ruleId integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE Rating
(
	id integer AUTO_INCREMENT,
	value integer,
	problemId integer NOT NULL,
	evaluatorId integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE Team
(
	id integer AUTO_INCREMENT,
	name varchar (255) NOT NULL,
	report MEDIUMBLOB,
	systemName varchar (50) NOT NULL,
	systemUrl varchar (255),
	systemContacts varchar (255) NOT NULL,
	state integer DEFAULT 1,
	plan TEXT,
	creationDate date,
	generalizedDate date,
	evaluationFinishedDate date,
	heuristicId integer,
	leaderId integer,
	companyAdminId integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE User
(
	id integer AUTO_INCREMENT,
	name varchar (50) NOT NULL,
	surname varchar(50) NOT NULL,
	group varchar(50),
	loginName varchar(50) NOT NULL
	password varchar (255) NOT NULL,
	email varchar (150) NOT NULL,
	companyId integer,
	systemAdminId integer NOT NULL,
	role char (50) NOT NULL,
	lastLogon date,
	PRIMARY KEY(id)
);

CREATE TABLE Company
(
	id integer AUTO_INCREMENT,
	name varchar (255) NOT NULL,
	country varchar (60) NOT NULL,
	url varchar (255),
	address varchar (255) NOT NULL,
	systemAdminId integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE EvaluatorProblem
(
	id integer AUTO_INCREMENT,
	evaluatorId integer NOT NULL,
	problemId integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE EvaluatorTeam
(
	id integer AUTO_INCREMENT,
	state integer DEFAULT 1,
	startedEvaluationDate date,
	submittedProblemsDate date,
	submittedRatingsDate date,
	evaluatorId integer NOT NULL,
	teamId integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE Problem
(
	id integer AUTO_INCREMENT,
	description TEXT NOT NULL,
  solution TEXT,
	location varchar (255) NOT NULL,
	position integer,
	isRevised boolean DEFAULT false,
	isCombined boolean DEFAULT false,
  ratingsAverage float,
  createdDate date NOT NULL,
	teamId integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE MergedProblem
(
  id integer AUTO_INCREMENT,
  fromId integer NOT NULL,
  toId integer NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE ProblemPhoto
(
	id integer AUTO_INCREMENT,
	path varchar(255) NOT NULL,
	size integer NOT NULL,
	problemId integer NOT NULL,
	PRIMARY KEY(id)
);

ALTER TABLE Rule
	ADD CONSTRAINT consists_of FOREIGN KEY(heuristicId) REFERENCES Heuristic (id);

ALTER TABLE ProblemRule
	ADD CONSTRAINT violates FOREIGN KEY(problemId) REFERENCES Problem (id),
    ADD FOREIGN KEY(ruleId) REFERENCES Rule (id);

ALTER TABLE Rating
	ADD FOREIGN KEY(problemId) REFERENCES Problem (id),
	ADD FOREIGN KEY(evaluatorId) REFERENCES User (id);

ALTER TABLE Team
	ADD FOREIGN KEY(state) REFERENCES TeamState (id) ON DELETE CASCADE,
	ADD CONSTRAINT creates FOREIGN KEY(companyAdminId) REFERENCES User (id),
	ADD CONSTRAINT manages FOREIGN KEY(leaderId) REFERENCES User (id),
	ADD CONSTRAINT uses FOREIGN KEY(heuristicId) REFERENCES Heuristic (id);

ALTER TABLE User
	ADD CONSTRAINT belongs_to FOREIGN KEY(companyId) REFERENCES Company (id),
	ADD CONSTRAINT admin_creates FOREIGN KEY(systemAdminId) REFERENCES User (id);

ALTER TABLE Company
	ADD CONSTRAINT admin_creates_company FOREIGN KEY(systemAdminId) REFERENCES User (id);

ALTER TABLE EvaluatorProblem
	ADD CONSTRAINT detected FOREIGN KEY(evaluatorId) REFERENCES User (id),
	ADD FOREIGN KEY(problemId) REFERENCES Problem (id);

ALTER TABLE EvaluatorTeam
	ADD FOREIGN KEY(state) REFERENCES EvaluatorTeamState (id),
	ADD FOREIGN KEY(teamId) REFERENCES Team (id),
	ADD FOREIGN KEY(evaluatorId) REFERENCES User (id);

ALTER TABLE Problem
	ADD CONSTRAINT finds FOREIGN KEY(teamId) REFERENCES Team (id),

ALTER TABLE MergedProblem
  ADD CONSTRAINT is_made_of FOREIGN KEY(fromId) REFERENCES Problem (id),
  ADD CONSTRAINT generalized_to FOREIGN KEY(toId) REFERENCES Problem (id);

ALTER TABLE user AUTO_INCREMENT = 1