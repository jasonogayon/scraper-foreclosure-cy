ifeq ($(OS), Windows_NT)
	OSTYPE := Windows
else
	OSTYPE := $(shell sh -c 'uname -s 2>/dev/null || echo not')
endif

ORIG_PREFIX:= @
NEW_PREFIX:= -t @

help:
	@echo ""
	@echo "usage: make COMMAND"
	@echo ""
	@echo "Commands:"
	@echo ""
	@echo "    install             Install scraper dependencies"
	@echo "    open                Open Cypress UI"
	@echo "    scrape              Run scraper locally without browser (headless)"
	@echo ""


install:
	@npm install

open:
	@npm run open

scrape:
	@echo "Running tests ..."; echo "";
	@yarn run scrape




m:
	@echo "Fetching master (remote) ..."; echo ""
	@git checkout master && git fetch -p origin
	@echo "Merging master (remote to local) ..."; echo ""
	@git merge origin/master
	@echo "Done"; echo ""

b:
	@make m
	@echo "Creating new feature branch ..."; echo ""
	@git checkout -b $(tag) master && git branch
	@echo "Done"; echo ""

bu:
	@make m
	@echo "Merging master to feature branch ..."; echo ""
	@git checkout $(tag) && git merge master && git branch
	@echo "Done"; echo ""

bn:
	@echo "Renaming branch ..."; echo ""
	@git branch -m $(old) $(new)
	@echo "Done"; echo ""

d:
	@echo "Deleting branch (local) ..."; echo ""
	@git checkout master && git branch -D $(tag) && git branch
	@echo "Done"; echo ""

dr:
	@echo "Deleting branch (remote) ..."; echo ""
	@git checkout master && git push origin --delete $(tag)
	@echo "Done"; echo ""


.PHONY: clean init
