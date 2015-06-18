#!/bin/bash
## qp.sh
## Processes XML execution plans to HTML and opens the destination plan using the default HTML viewer
## Usage:
##      qp.sh Input Output
## Input    Path to the input XML query plan.
## Output   (optional) Path to the output file / directory.  
##          If not specified then a temporary directory is used.  Use '.' for the current directory.

## Edit this to set path to your conversion program
## e.g. XSLT 1.0 compatible: /path/to/org.apache.xalan_2.7.1.v201005080400.jar  
## or XSLT 2.0 compatible: /another/path/to/saxon9he.jar
# CONVPGM=xml2html.sh
CONVPGM=

convert () {
	# takes three arguments: XML file, XSL stylesheet, output file
	if [[ -z "$CONVPGM" ]]; then
		printf "\n\nPlease configure this script: set the variable CONVPGM to the path of your conversion program.\n"
		printf "Hint: Apache Xalan and Saxonica Saxon JAR files can perform XSL transforms.\n\n"
		exit -1
	fi

	# this changes depending on the particular program too, as the way to pass arguments can be different
	"${CONVPGM}" "$1" "$2" "$3"

	# if using Xalan:
	# "${CONVPGM}" -IN "$1" -OUT "$3" -XSL "$2" -HTML

	# if using Saxon:
	# "${CONVPGM}" -s:"$1" -xsl:"$2" -o:"$3"

}

## TODO: Handle /h, /? etc...
if [[ -z "$1" ]] ; then
	printf "
qp.sh - Generates 

Usage:
     qp.sh Input Output

Input    Path to the input XML query plan.
Output   (optional) Path to the output file / directory.  
         If not specified then a temporary directory is used.  Use '.' for the current directory."
    exit -1
fi

OUTDIR=$(dirname "$2")
if [[ -z "$2" ]]; then
	OUTDIR=/tmp
elif [[ "$2" == "." ]]; then
	OUTDIR=.
fi

OUTFILE=$(basename "$2")
MYDIR=$(dirname "$0")
if [[ -z "$OUTFILE" ]]; then
	INFILE=$(basename "$1")
	OUTFILE=${INFILE##.}
fi

convert "$1" "${MYDIR}/qp_page.xslt" "${OUTDIR}/${OUTFILE}.html"
cp -Rf "${MYDIR}/images" "${MYDIR}/jquery.min.js" "${MYDIR}/qp.css" "${MYDIR}/qp.js" "${OUTDIR}"

PLATFORM=$(uname)

if [[ "$PLATFORM" == "Linux" ]]; then
	xdg-open "${OUTDIR}/${OUTFILE}.html"
elif [[ "$PLATFORM" == "Darwin" ]]; then
	open "${OUTDIR}/${OUTFILE}.html"
else
	echo "Open ${OUTDIR}/${OUTFILE}.html using your favourite browser"
fi
