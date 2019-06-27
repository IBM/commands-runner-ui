###############################################################################
# Licensed Materials - Property of IBM Copyright IBM Corporation 2017, 2019. All Rights Reserved.
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
# Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################
#
# WARNING: DO NOT MODIFY. Changes may be overwritten in future updates.
#
# The following build goals are designed to be generic for any docker image.
# This Makefile is designed to be included in other Makefiles.
# You must ensure that Make variables are defined for IMAGE_REPO and IMAGE_NAME.
#
# If you are using a Bluemix image registry, you must also define BLUEMIX_API_KEY,
# BLUEMIX_ORG, and BLUEMIX_SPACE
###############################################################################

.DEFAULT_GOAL := all

BEFORE_SCRIPT := $(shell ./build-tools/before-make-script.sh)

.PHONY: all-checks
all-checks: copyright-check

.PHONY: clean
clean::
	rm -rf _build

.PHONY: npm-build
npm-build:: 
	mkdir -p _build
	#Install all packages (devDependencies and dependencies)
	npm install
	#build the UI
	npm run build
	# Delete all dependencies
	rm -rf node_modules
	#Install only dependencies that needs to be shipped in order for the app to run.
	npm install --production
	#Copy the builded app to _build
	cp -Rv build _build
	#Copy the production package to _build
	cp -Rv node_modules _build
	#Copy the webpack configuration
	cp webpack.common.js _build
	cp webpack.prod.js _build
	#Copy the package list
	cp package.json _build
	cp package-lock.json _build
	#Copy server 
	cp -Rv server _build

.PHONY: all
all:: copyright-check npm-build

.PHONY: copyright-check
copyright-check:
	./build-tools/copyright-check.sh
