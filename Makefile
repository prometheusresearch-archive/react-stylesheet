BIN = ./node_modules/.bin

SRC = ./src
OUT = ./lib
SRC_FILES = $(shell find $(SRC) -name '*.js')
OUT_FLOW_FILES = $(SRC_FILES:./src/%=./lib/%.flow)

build: build-js build-flow

build-js:
	@$(BIN)/babel --copy-files --out-dir $(OUT) $(SRC)

build-flow: $(OUT_FLOW_FILES)

build-watch:
	@$(BIN)/babel --copy-files --watch --out-dir $(OUT) $(SRC)

clean:
	@rm -rf $(OUT) ./coverage

version-major version-minor version-patch: build flow test
	@npm version $(@:version-%=%)

publish:
	@npm publish
	@git push --tags origin HEAD:master

flow:
	@$(BIN)/flow

test:
	@$(BIN)/jest

test-watch:
	@$(BIN)/jest --watch

test-cov:
	@$(BIN)/jest --coverage

doctoc:
	@$(BIN)/doctoc --title '**Table of Contents**' ./README.md

lib/%.js.flow: src/%.js
	@echo "$< -> $@"
	@mkdir -p $(@D)
	@cp $< $@

src/experimental/CSSVariableElement.css: $(SRC_FILES) scripts/generateElementBaseStylesheet.js
	@$(BIN)/babel-node ./scripts/generateElementBaseStylesheet.js > $(@)
