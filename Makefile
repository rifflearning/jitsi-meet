BUILD_DIR = build
CLEANCSS = ./node_modules/.bin/cleancss
DEPLOY_DIR = libs
LIBJITSIMEET_DIR = node_modules/lib-jitsi-meet/
LIBFLAC_DIR = node_modules/libflacjs/dist/min/
OLM_DIR = node_modules/@matrix-org/olm
RNNOISE_WASM_DIR = node_modules/rnnoise-wasm/dist/
TFLITE_WASM = react/features/stream-effects/virtual-background/vendor/tflite
MEET_MODELS_DIR  = react/features/stream-effects/virtual-background/vendor/models/
NODE_SASS = ./node_modules/.bin/sass
SASS_OPTIONS = --load-path ./node_modules
NPM = npm
OUTPUT_DIR = .
STYLES_BUNDLE = css/all.bundle.css
STYLES_DESTINATION = css/all.css
STYLES_MAIN = css/main.scss
WEBPACK = ./node_modules/.bin/webpack
WEBPACK_DEV_SERVER = ./node_modules/.bin/webpack-dev-server
ENV ?= UNKenv

SRC_PKG_FILES := \
	README.md               \
	CHANGELOG.md            \
	LICENSE                 \
	favicon.ico             \
	package.json            \
	*.js                    \
	*.html                  \
	resources/*.txt         \
	connection_optimization \
	fonts                   \
	images                  \
	libs                    \
	static                  \
	sounds                  \
	lang                    \


NOT_SRC_PKG_FILES := \
	babel.config.js         \
	webpack.config.js       \


all: compile deploy clean

compile: compile-load-test
	$(WEBPACK) -p

compile-load-test:
	${NPM} install --prefix resources/load-test && ${NPM} run build --prefix resources/load-test

clean:
	rm -fr $(BUILD_DIR)

.NOTPARALLEL:
deploy: deploy-init deploy-appbundle deploy-rnnoise-binary deploy-tflite deploy-meet-models deploy-lib-jitsi-meet deploy-libflac deploy-olm deploy-css deploy-local

deploy-init:
	rm -fr $(DEPLOY_DIR)
	mkdir -p $(DEPLOY_DIR)

deploy-appbundle:
	cp \
		$(BUILD_DIR)/app.bundle.min.js \
		$(BUILD_DIR)/app.bundle.min.map \
		$(BUILD_DIR)/do_external_connect.min.js \
		$(BUILD_DIR)/do_external_connect.min.map \
		$(BUILD_DIR)/external_api.min.js \
		$(BUILD_DIR)/external_api.min.map \
		$(BUILD_DIR)/flacEncodeWorker.min.js \
		$(BUILD_DIR)/flacEncodeWorker.min.map \
		$(BUILD_DIR)/dial_in_info_bundle.min.js \
		$(BUILD_DIR)/dial_in_info_bundle.min.map \
		$(BUILD_DIR)/alwaysontop.min.js \
		$(BUILD_DIR)/alwaysontop.min.map \
		$(OUTPUT_DIR)/analytics-ga.js \
		$(BUILD_DIR)/analytics-ga.min.js \
		$(BUILD_DIR)/analytics-ga.min.map \
		$(BUILD_DIR)/close3.min.js \
		$(BUILD_DIR)/close3.min.map \
		$(DEPLOY_DIR)

deploy-lib-jitsi-meet:
	cp \
		$(LIBJITSIMEET_DIR)/lib-jitsi-meet.min.js \
		$(LIBJITSIMEET_DIR)/lib-jitsi-meet.min.map \
		$(LIBJITSIMEET_DIR)/lib-jitsi-meet.e2ee-worker.js \
		$(LIBJITSIMEET_DIR)/connection_optimization/external_connect.js \
		$(LIBJITSIMEET_DIR)/modules/browser/capabilities.json \
		$(DEPLOY_DIR)

deploy-libflac:
	cp \
		$(LIBFLAC_DIR)/libflac4-1.3.2.min.js \
		$(LIBFLAC_DIR)/libflac4-1.3.2.min.js.mem \
		$(DEPLOY_DIR)

deploy-olm:
	cp \
		$(OLM_DIR)/olm.wasm \
		$(DEPLOY_DIR)

deploy-rnnoise-binary:
	cp \
		$(RNNOISE_WASM_DIR)/rnnoise.wasm \
		$(DEPLOY_DIR)

deploy-tflite:
	cp \
		$(TFLITE_WASM)/*.wasm \
		$(DEPLOY_DIR)

deploy-meet-models:
	cp \
		$(MEET_MODELS_DIR)/*.tflite \
		$(DEPLOY_DIR)

deploy-css:
	$(NODE_SASS) $(SASS_OPTIONS) $(STYLES_MAIN) $(STYLES_BUNDLE) && \
	$(CLEANCSS) --skip-rebase $(STYLES_BUNDLE) > $(STYLES_DESTINATION) ; \
	rm $(STYLES_BUNDLE)

deploy-local:
	([ ! -x deploy-local.sh ] || ./deploy-local.sh)

deploy-aws: ## deploy a dev build based on the current state of the working directory to AWS
deploy-aws: AWS_NAME := ${shell bash -c 'source .env ; echo $$AWS_NAME'}#' cmt to fix vim formatting
deploy-aws: PEM_PATH := ${shell bash -c 'source .env ; echo $$PEM_PATH'}#' cmt to fix vim formatting
deploy-aws: GIT_USER := ${shell git config --get user.name}
deploy-aws: dev-package
	scp -i $(PEM_PATH) rifflearning-jitsi-meet-dev.tar.bz2 $(AWS_NAME):/home/ubuntu/tmp
	ssh -i $(PEM_PATH) $(AWS_NAME) 'bin/install-riff-jitsi.sh tmp/rifflearning-jitsi-meet-dev.tar.bz2 "$(GIT_USER)"'

.NOTPARALLEL:
dev: deploy-init deploy-css deploy-rnnoise-binary deploy-lib-jitsi-meet deploy-meet-models deploy-libflac deploy-olm deploy-tflite
	$(WEBPACK_DEV_SERVER) --host 0.0.0.0

source-package: ## create a distribution tar file packaging all files to be served by a web server (run make all first)
source-package: PKG_VERSION := ${shell sed -nE 's/^\s*\"version\": \"([^\"]+)\",$$/\1/p' package.json}
source-package: source-package-version
	cd source_package ; tar cjf ../rifflearning-jitsi-meet-$(PKG_VERSION)-$(ENV).tar.bz2 jitsi-meet
	rm -rf source_package

source-package-files: ## copy all files needed for distribution (built and static) to the source_package directory
	mkdir -p source_package/jitsi-meet/css
	cp -r $(SRC_PKG_FILES) source_package/jitsi-meet
	cd source_package/jitsi-meet ; rm $(NOT_SRC_PKG_FILES)
	cp css/all.css source_package/jitsi-meet/css

source-package-version: ## add versioning to all.css, app.bundle.min.js and other imports in index.html
source-package-version: SHASUM_ALL_CSS = $(shell shasum ./css/all.css | cut -c -8)
source-package-version: SHASUM_APP_BUNDLE = $(shell shasum ./libs/app.bundle.min.js | cut -c -8)
source-package-version: SHASUM_LIB_JITSI_MEET = $(shell shasum ./libs/lib-jitsi-meet.min.js | cut -c -8)
source-package-version: SHASUM_DO_EXTERNAL_CONNECT = $(shell shasum ./libs/do_external_connect.min.js | cut -c -8)
source-package-version: source-package-files
	@cd source_package/jitsi-meet ; \
	echo "versioning all.css (v=$(SHASUM_ALL_CSS)) and app.bundle.min.js (v=$(SHASUM_APP_BUNDLE)) in index.html" ; \
	sed -e 's/css\/all.css/&?v='$(SHASUM_ALL_CSS)'/' \
		-e 's/\(app\.bundle\.min\.js\)?v=[0-9]\+/\1?v='$(SHASUM_APP_BUNDLE)'/' \
		-e 's/\(lib-jitsi-meet\.min\.js\)?v=[0-9]\+/\1?v='$(SHASUM_LIB_JITSI_MEET)'/' \
		-e 's/\(do_external_connect\.min\.js\)?v=[0-9]\+/\1?v='$(SHASUM_DO_EXTERNAL_CONNECT)'/' \
		--in-place index.html

dev-package: ## create package using working dir code for development deployment
dev-package: PKG_VERSION := ${shell sed -nE 's/^\s*\"version\": \"([^\"]+)\",$$/\1/p' package.json}
dev-package:
	$(MAKE) all source-package ENV=custom
	mv --backup rifflearning-jitsi-meet-$(PKG_VERSION)-custom.tar.bz2 rifflearning-jitsi-meet-dev.tar.bz2

prod-package: ## create package using working dir code for production deployment
	$(MAKE) all source-package ENV=prod

# Help documentation à la https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
# if you want the help sorted rather than in the order of occurrence, pipe the grep to sort and pipe that to awk
help: ## this help documentation (extracted from comments on the targets)
	@echo ""                                            ; \
	echo "Useful targets in this riff-docker Makefile:" ; \
	(grep -E '^[a-zA-Z_-]+ ?:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = " ?:.*?## "}; {printf "\033[36m%-20s\033[0m : %s\n", $$1, $$2}') ; \
	echo ""
