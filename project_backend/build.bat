@echo off
echo Building DBT Backend Application...

echo Cleaning previous build...
call mvnw clean

echo Compiling and packaging...
call mvnw compile package -DskipTests

if %ERRORLEVEL% EQU 0 (
    echo Build successful!
    echo You can now run the application with: java -jar target\project_backend-0.0.1-SNAPSHOT.jar
) else (
    echo Build failed! Please check the errors above.
)

pause