@echo off
setlocal

if "%~1"=="" (
  echo Usage: run-sql.cmd db02 sql\001_schema.sql
  exit /b 1
)

if "%~2"=="" (
  echo Usage: run-sql.cmd db02 sql\001_schema.sql
  exit /b 1
)

set "TOPIC=%~1"
set "SQL_PATH=%~2"
set "SQL_IN_CONTAINER=/work/%TOPIC%_%~n1/%SQL_PATH:\=/%"

if /I "%TOPIC%"=="db02" set "TOPIC_DIR=db02_sql_crud_schema"
if /I "%TOPIC%"=="db04" set "TOPIC_DIR=db04_transaction_lock_isolation"
if /I "%TOPIC%"=="db05" set "TOPIC_DIR=db05_index_explain_performance"
if /I "%TOPIC%"=="db06" set "TOPIC_DIR=db06_backup_restore_migration"

if "%TOPIC_DIR%"=="" (
  echo Unknown topic: %TOPIC%
  exit /b 1
)

set "SQL_IN_CONTAINER=/work/%TOPIC_DIR%/%SQL_PATH:\=/%"

docker compose exec -T db psql -v ON_ERROR_STOP=1 -U postgres -d studydb -f "%SQL_IN_CONTAINER%"
endlocal

