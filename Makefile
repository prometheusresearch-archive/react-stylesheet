.DELETE_ON_ERROR:

BIN           = ./node_modules/.bin
TESTS         = $(shell find src -path '*/__tests__/*-test.js')
SRC           = $(filter-out $(TESTS), $(shell find src -name '*.js')) $(wildcard src/*.js.flow)
LIB           = $(SRC:src/%.js=lib/%.js) $(SRC:src/%.js=lib/%.js.flow)
NODE          = $(BIN)/babel-node $(BABEL_OPTIONS)
MOCHA_OPTIONS = --require ./src/__tests__/setup.js
MOCHA         = $(BIN)/_mocha $(MOCHA_OPTIONS)
NYC_OPTIONS   = --all --require babel-core/register
NYC           = $(BIN)/nyc $(NYC_OPTIONS)

build:
	@$(MAKE) -j 8 $(LIB)

lint:
	@$(BIN)/eslint src

check:
	@$(BIN)/flow

test::
	@NODE_ENV=test $(BIN)/jest

ci:
	@NODE_ENV=test $(BIN)/jest --watch

storybook:
	@$(BIN)/start-storybook -p 6006

storybook-build:
	@$(BIN)/build-storybook

doctoc:
	@$(BIN)/doctoc --title '**Table of Contents**' ./README.md

test-cov::
	@NODE_ENV=test $(BIN)/jest --coverage

test-flow::
	@(cd test_flow/ && npm install && $(BIN)/flow check)

version-major version-minor version-patch: lint test
	@npm version $(@:version-%=%)

publish: build test lint
	@npm publish
	@git push --tags origin HEAD:master

clean:
	@rm -rf lib/

lib/%.js: src/%.js
	@echo "Building $@"
	@mkdir -p $(@D)
	@$(BIN)/babel $(BABEL_OPTIONS) -o $@ $<

lib/%.js.flow: src/%.js
	@echo "Building $@"
	@mkdir -p $(@D)
	@cp $< $@
