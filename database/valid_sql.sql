CREATE TABLE Heuristic
(
	id integer AUTO_INCREMENT,
	name TEXT,
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
	description varchar (255),
	listNumber integer,
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
	name varchar (255),
	report MEDIUMBLOB,
	plan TEXT,
	systemName varchar (255),
	systemUrl varchar (255),
	systemContacts varchar (255),
	state integer DEFAULT 1,
	companyAdminId integer NOT NULL,
	leaderId integer,
	heuristicId integer,
	PRIMARY KEY(id)
);

CREATE TABLE User
(
	id integer AUTO_INCREMENT,
	name varchar (255),
	password varchar (255),
	lastLogon date,
	email varchar (255),
	companyId integer,
	systemAdminId integer NOT NULL,
	role char (255),
	PRIMARY KEY(id)
);

CREATE TABLE Company
(
	id integer AUTO_INCREMENT,
	name varchar (255),
	country varchar (255),
	url varchar (255),
	address varchar (255),
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
	teamId integer NOT NULL,
	evaluatorId integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE Problem
(
	id integer AUTO_INCREMENT,
	description TEXT,
  solution TEXT,
	location varchar (255),
	teamId integer NOT NULL,
	isRevised boolean DEFAULT false,
	isCombined boolean DEFAULT false,
  ratingsAverage float,
  nextMergedProblemId integer,
	PRIMARY KEY(id)
);

CREATE TABLE MergedProblem
(
  id integer,
  fromId integer NOT NULL,
  toId integer NOT NULL,
)

CREATE TABLE ProblemPhoto
(
	id integer AUTO_INCREMENT,
	path varchar(255),
  isRemoved boolean DEFAULT 0,
	problemId integer,
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
	ADD CONSTRAINT is_before FOREIGN KEY(nextMergedProblemId) REFERENCES Problem (id);

ALTER TABLE MergedProblem
  ADD CONSTRAINT is_made_of FOREIGN KEY(fromId) REFERENCES Problem (id),
  ADD CONSTRAINT generalized_to FOREIGN KEY(toId) REFERENCES Problem (id);

ALTER TABLE user AUTO_INCREMENT = 1