BIN = ./node_modules/.bin

flow:
	@$(BIN)/flow

test:
	@$(BIN)/jest

watch-test:
	@$(BIN)/jest --watch
