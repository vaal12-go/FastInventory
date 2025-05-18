cd c:\Users\may13\AGVDocs\Dev\1. DevTools\4.BATs\

REM TODO: remove runConEmuWithPaths.bat  from c:\Users\may13\AGVDocs\Dev\1. DevTools\4.BATs

CALL runInConEmu.bat "c:\Portables\nginx\nginx.exe -c c:\Users\may13\AGVDocs\Dev\3.Python-projects\08.FastInventory\reverse_proxy_nginx_conf\nginx.conf" "c:\Portables\nginx\"


CALL runInConEmu.bat  "uv run fastapi dev --host 127.0.0.1 --port 8080 ./server/main.py" "c:\Users\may13\AGVDocs\Dev\3.Python-projects\08.FastInventory\fast-app\"

 CALL runInConEmu.bat  "cmd /C npm run dev" "c:\Users\may13\AGVDocs\Dev\3.Python-projects\08.FastInventory\react-front\"

cd c:\Users\may13\AGVDocs\Dev\3.Python-projects\08.FastInventory\deployment\development\