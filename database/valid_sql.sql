CREATE TABLE Heuristic
(
	id integer AUTO_INCREMENT,
	isRemoved boolean DEFAULT 0,
	name varchar (255),
	isUnique boolean DEFAULT false,
	PRIMARY KEY(id)
);

CREATE TABLE EvaluatorTeamState
(
	id integer AUTO_INCREMENT,
	name char (18) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO EvaluatorTeamState(id, name) VALUES(1, 'evaluationStarted');
INSERT INTO EvaluatorTeamState(id, name) VALUES(2, 'ratingProblems');
INSERT INTO EvaluatorTeamState(id, name) VALUES(3, 'evaluationFinished');

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
	isRemoved boolean DEFAULT 0,
	description varchar (255),
	heuristic_id integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE ProblemRule
(
	id integer AUTO_INCREMENT,
	isRemoved boolean DEFAULT 0,
	problem_id integer NOT NULL,
	rule_id integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE Rating
(
	id integer AUTO_INCREMENT,
	isRemoved boolean DEFAULT 0,
	value integer,
	comment varchar (255),
	problem_id integer NOT NULL,
	evaluator_id integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE Team
(
	id integer AUTO_INCREMENT,
  isRemoved boolean DEFAULT 0,
	name varchar (255),
	report smallint,
	systemName varchar (255),
	systemUrl varchar (255),
	systemContacts varchar (255),
	state integer DEFAULT 1,
	companyAdmin_id integer NOT NULL,
	leader_id integer,
	heuristic_id integer,
	PRIMARY KEY(id)
);

CREATE TABLE User
(
	id integer AUTO_INCREMENT,
  isRemoved boolean DEFAULT 0,
	name varchar (255),
	password varchar (255),
	isBlocked boolean DEFAULT 0,
	lastLogon date,
	email varchar (255),
	company_id integer,
	systemAdmin_id integer NOT NULL,
	role char (255),
	PRIMARY KEY(id)
);

CREATE TABLE Company
(
	id integer AUTO_INCREMENT,
  isRemoved boolean DEFAULT 0,
	name varchar (255),
	country varchar (255),
	url varchar (255),
	address varchar (255),
	systemAdmin_id integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE Task
(
	id integer AUTO_INCREMENT,
  isRemoved boolean DEFAULT 0,
	description varchar (255),
	number integer,
	team_id integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE EvaluatorProblem
(
	id integer AUTO_INCREMENT,
  isRemoved boolean DEFAULT 0,
	evaluator_id integer NOT NULL,
	problem_id integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE EvaluatorTeam
(
	id integer AUTO_INCREMENT,
  isRemoved boolean DEFAULT 0,
	state integer DEFAULT 1,
	team_id integer NOT NULL,
	evaluator_id integer NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE Problem
(
	id integer AUTO_INCREMENT,
  isRemoved boolean DEFAULT 0,
	description varchar (255),
	location varchar (255),
	photo smallint,
	ratingsAverage float,
	isCombined boolean DEFAULT false,
	team_id integer NOT NULL,
	PRIMARY KEY(id)
);

ALTER TABLE Rule
	ADD CONSTRAINT consists_of FOREIGN KEY(heuristic_id) REFERENCES Heuristic (id) ON DELETE CASCADE;

ALTER TABLE ProblemRule
	ADD CONSTRAINT violates FOREIGN KEY(problem_id) REFERENCES Problem (id) ON DELETE CASCADE,
    ADD FOREIGN KEY(rule_id) REFERENCES Rule (id) ON DELETE CASCADE;
    
ALTER TABLE Rating
	ADD FOREIGN KEY(problem_id) REFERENCES Problem (id) ON DELETE CASCADE,
	ADD FOREIGN KEY(evaluator_id) REFERENCES User (id) ON DELETE CASCADE;

ALTER TABLE Team
	ADD FOREIGN KEY(state) REFERENCES TeamState (id) ON DELETE CASCADE,
	ADD CONSTRAINT creates FOREIGN KEY(companyAdmin_id) REFERENCES User (id) ON DELETE CASCADE,
	ADD CONSTRAINT manages FOREIGN KEY(leader_id) REFERENCES User (id) ON DELETE CASCADE,
	ADD CONSTRAINT uses FOREIGN KEY(heuristic_id) REFERENCES Heuristic (id) ON DELETE CASCADE;
    
ALTER TABLE User
	ADD CONSTRAINT belongs_to FOREIGN KEY(company_id) REFERENCES Company (id) ON DELETE CASCADE,
	ADD CONSTRAINT admin_creates FOREIGN KEY(systemAdmin_id) REFERENCES User (id) ON DELETE CASCADE;
    
ALTER TABLE Company
	ADD CONSTRAINT admin_creates_company FOREIGN KEY(systemAdmin_id) REFERENCES User (id) ON DELETE CASCADE;
    
ALTER TABLE Task
	ADD CONSTRAINT has FOREIGN KEY(team_id) REFERENCES Team (id) ON DELETE CASCADE;
    
ALTER TABLE EvaluatorProblem
	ADD CONSTRAINT detected FOREIGN KEY(evaluator_id) REFERENCES User (id) ON DELETE CASCADE,
	ADD FOREIGN KEY(problem_id) REFERENCES Problem (id) ON DELETE CASCADE;
    
ALTER TABLE EvaluatorTeam
	ADD FOREIGN KEY(state) REFERENCES EvaluatorTeamState (id) ON DELETE CASCADE,
	ADD FOREIGN KEY(team_id) REFERENCES Team (id) ON DELETE CASCADE,
	ADD FOREIGN KEY(evaluator_id) REFERENCES User (id) ON DELETE CASCADE;
    
ALTER TABLE Problem
	ADD CONSTRAINT finds FOREIGN KEY(team_id) REFERENCES Team (id) ON DELETE CASCADE;

ALTER TABLE user AUTO_INCREMENT = 1