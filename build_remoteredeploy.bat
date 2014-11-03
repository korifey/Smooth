@call secrets.bat
asadmin redeploy --host %SMOOTH_HOST% --port 4848 --user admin --passwordfile passwordfile --secure=true --name smooth target/smooth.war --type war