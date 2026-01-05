@echo off
REM ------------------------------------------------------------------------------
REM Gradle startup script for Windows
REM ------------------------------------------------------------------------------

setlocal
set DIRNAME=%~dp0
set APP_BASE_NAME=%~n0
set JAVA_EXE=java

if "%JAVA_HOME%" == "" goto findJavaFromPath
set JAVA_EXE=%JAVA_HOME%\bin\java.exe
goto execute

:findJavaFromPath
set JAVA_EXE=java

:execute
"%JAVA_EXE%" -jar "%DIRNAME%gradle\wrapper\gradle-wrapper.jar" %*


