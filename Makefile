.DELETE_ON_ERROR:

BIN           = ./node_modules/.bin
TESTS         = $(shell find src -path '*/__tests__/*-test.js')
SRC           = $(filter-out $(TESTS), $(shell find src -name '*.js')) $(wildcard src/*.js.flow)
FLOW_EXT      = lib/CSS.js.flow lib/CSSType.js.flow
LIB           = $(SRC:src/%.js=lib/%.js) $(SRC:src/%.js.flow=lib/%.js.flow) $(FLOW_EXT)
NODE          = $(BIN)/babel-node $(BABEL_OPTIONS)
MOCHA_OPTIONS = --require ./src/__tests__/setup.js
MOCHA         = $(BIN)/_mocha $(MOCHA_OPTIONS)
NYC_OPTIONS   = --all --require babel-core/register
NYC           = $(BIN)/nyc $(NYC_OPTIONS)

build:
	@$(MAKE) -j 8 $(LIB)

lint:
	@$(BIN)/eslint src

test::
	@NODE_ENV=test $(BIN)/babel-node $(MOCHA) -- $(TESTS)

ci:
	@NODE_ENV=test $(BIN)/babel-node $(MOCHA) --watch -- $(TESTS)

test-cov::
	@NODE_ENV=test $(NYC) --check-coverage $(MOCHA) -- $(TESTS)

test-flow::
	@(cd test_flow/ && npm install && $(BIN)/flow check)

report-cov::
	@$(BIN)/nyc report --reporter html

report-cov-coveralls::
	@$(BIN)/nyc report --reporter=text-lcov | $(BIN)/coveralls

version-major version-minor version-patch: lint test
	@npm version $(@:version-%=%)

publish: build test lint
	@npm publish
	@git push --tags origin HEAD:master

clean:
	@rm -rf lib/

lib/%.js: src/%.js
	@echo "Building $<"
	@mkdir -p $(@D)
	@$(BIN)/babel $(BABEL_OPTIONS) -o $@ $<

lib/%.js.flow: src/%.js
	@echo "Building $<"
	@mkdir -p $(@D)
	@cp $< $@

src/CSSType.js: ./node_modules/css-tree/data/mozilla-cssdata.json
	@echo "Building $<"
	@mkdir -p $(@D)
	@node ./scripts/make-CSSType.js > $@

./node_modules/css-tree/data/mozilla-cssdata.json:
	@echo ok
