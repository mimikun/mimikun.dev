.DEFAULT_GOAL := help

## Create a patch and copy it to windows
.PHONY : patch
patch : clean diff-patch copy2win-patch

## Create a patch
.PHONY : diff-patch
diff-patch :
	mise tasks run patch:create

## Switch to master branch
.PHONY : switch-master
switch-master :
	mise tasks run git:switch-master

## Run clean
.PHONY : clean
clean :
	mise tasks run clean

## Copy patch to Windows
.PHONY : copy2win-patch
copy2win-patch :
	mise tasks run patch:copy2win

## Run lint
.PHONY : lint
lint :
	mise tasks run lint

## Run format
.PHONY : format
format :
	mise tasks run format

## Run test
.PHONY : test
test : lint

## Run fmt
.PHONY : fmt
fmt : format

## Add commit message up to `origin/master` to CHANGELOG.md
.PHONY : changelog
changelog :
	mise tasks run changelog

## Add commit message up to `origin/master` for mask to CHANGELOG.md
.PHONY : generate-commit-msg
generate-commit-msg :
	mise tasks run generate-commit-msg

## Run generate-commit-msg
.PHONY : gcm
gcm : generate-commit-msg

## Run git cleanfetch
.PHONY : clean-fetch
clean-fetch :
	mise tasks run git:fetch:clean-fetch

## Delete patch branch
.PHONY : delete-branch
delete-branch :
	mise tasks run git:delete-branch

## Run git pull
.PHONY : pull
pull :
	mise tasks run git:pull

## Run git push
.PHONY : push
push :
	mise tasks run git:push

## Create a patch branch
.PHONY : patch-branch
patch-branch :
	mise tasks run patch:branch

## Run workday morning routine
.PHONY : morning-routine
morning-routine :
	mise tasks run git:morning-routine

## Run view
.PHONY : view
view :
	mise tasks run view

#--------------------------------------------------------------

## Starts local dev server at `localhost:4321`
dev :
	pnpm run dev

## Build your production site to `./dist/`
build :
	pnpm run build

## Generates TypeScript types for all Astro modules. [Learn more](https://docs.astro.build/en/reference/cli-reference/#astro-sync).
sync :
	pnpm run sync

## Preview your build locally, before deploying
preview :
	pnpm run preview

## Show help
.PHONY : help
help :
	@make2help $(MAKEFILE_LIST)
