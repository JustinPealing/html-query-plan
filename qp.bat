:: qp.bat
:: Processes XML execution plans to HTML and opens the destination plan using the default HTML viewer
:: Usage:
::      qp.bat Input Output
:: Input    Path to the input XML query plan.
:: Output   (optional) Path to the output file / directory.  
::          If not specified then a temporary directory is used.  Use '.' for the current directory.

@echo off
SETLOCAL

:: TODO: Handle /h, /? etc...
IF [%1] == [] GOTO:help

SET outdir=%~dp2
IF [%2] == [] SET outdir=%TEMP%.\
IF [%2] == [.] SET outdir=.\

SET outfile=%~nx2
IF [%outfile%] == [] SET outfile=%~n1

"%~dp0msxsl.exe" %1 "%~dp0qp_page.xslt" -o "%outdir%%outfile%.html"
xcopy "%~dp0images" %outdir%images /IQYD
xcopy "%~dp0jquery.min.js" %outdir% /QYD
xcopy "%~dp0qp.css" %outdir% /QYD
xcopy "%~dp0qp.js" %outdir% /QYD

start "" "%outdir%%outfile%.html"
GOTO:EOF

:help
ECHO qp.bat - Generates 
ECHO.
ECHO Usage:
ECHO      qp.bat Input Output
ECHO.
ECHO Input    Path to the input XML query plan.
ECHO Output   (optional) Path to the output file / directory.  
ECHO          If not specified then a temporary directory is used.  Use '.' for the current directory.