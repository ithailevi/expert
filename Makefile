MOCHA_OPTS=
REPORTER = spec

test: 
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

.PHONY:			 test
