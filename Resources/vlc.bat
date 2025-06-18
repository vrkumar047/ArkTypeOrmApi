@Echo off & SetLocal EnableDelayedExpansion
set "PID="
for /f "tokens=2" %%A in ('tasklist ^| findstr /i "vlc.exe" 2^>NUL') do @Set "PID=!PID!,%%A"
if defined PID Echo %PID:~1%
