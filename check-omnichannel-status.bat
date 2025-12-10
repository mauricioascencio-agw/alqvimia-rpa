@echo off
echo ========================================
echo  VERIFICADOR DE ESTADO
echo  Sistema de Omnicanalidad
echo ========================================
echo.

echo Consultando estado del sistema...
echo.

curl http://localhost:3000/api/omnichannel/status

echo.
echo.
echo ========================================
echo.
pause
