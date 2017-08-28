BIN = ./node_modules/.bin

flow:
	@$(BIN)/flow

test:
	@$(BIN)/jest

test-watch:
	@$(BIN)/jest --watch

test-cov:
	@$(BIN)/jest --coverage
