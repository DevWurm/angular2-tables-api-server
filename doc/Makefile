.PHONY: all
all: clean simple

pretty: merge
	grip dist/doc.md --export dist/doc.html
	rm dist/*.md

simple: merge
	pandoc dist/doc.md -s -o dist/doc.html

merge: dist toc
	pandoc dist/*.md -o dist/doc.md
	rm dist/0*.md
dist:
	mkdir dist
	cp 0*.md dist

toc: headings references
	paste -d '' dist/headings.md dist/references.md >> dist/01_index.md
	rm dist/headings.md
	rm dist/references.md

headings:
	cat 0*.md | grep -v "#\!"  | grep -e "\s#\|^#" | sed -E "s/#/  /g" | sed -e 's/  //' |perl -pe 's|(\w[\w ]+)|\* [\1\]|' > dist/headings.md

references: 
	cat 0*.md | grep -v "#\!"  | grep -e "\s#\|^#" | sed s/#//g | awk '{$$1=$$1};1' | tr '[:upper:]' '[:lower:]' | sed -e "s/\s/-/g" | sed -e "s/\(.*\)/\(#\1\)/" > dist/references.md

clean:
	rm -rf dist
