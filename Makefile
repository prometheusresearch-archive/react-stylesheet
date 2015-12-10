.DELETE_ON_ERROR:

BABEL_OPTIONS = --stage 0
BIN           = ./node_modules/.bin
TESTS         = $(shell find src -path '*/__tests__/*-test.js')
SRC           = $(filter-out $(TESTS), $(shell find src -name '*.js'))
LIB           = $(SRC:src/%=lib/%)
NODE          = $(BIN)/babel-node $(BABEL_OPTIONS)
MOCHA_OPTIONS = --compilers js:babel/register --require ./src/__tests__/setup.js
MOCHA					= NODE_ENV=test node $(BIN)/mocha $(MOCHA_OPTIONS)

build:
	@$(MAKE) -j 8 $(LIB)

lint:
	@$(BIN)/eslint src

test:
	@$(MOCHA) -- $(TESTS)

ci:
	@$(MOCHA) --watch -- $(TESTS)

version-major version-minor version-patch: lint test
	@npm version $(@:version-%=%)

push:
	@git push --tags origin HEAD:master

clean:
	@rm -f $(LIB)

lib/%: src/%
	@echo "Building $<"
	@mkdir -p $(@D)
	@$(BIN)/babel $(BABEL_OPTIONS) -o $@ $<
