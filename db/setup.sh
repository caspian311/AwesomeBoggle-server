#!/bin/bash -e

pushd $(dirname $0) &> /dev/null
  BASEDIR=$(pwd)
popd &> /dev/null

NODE_ENV=${NODE_ENV:-development}
DATABASE_NAME="awesomeboggle_${NODE_ENV}"
if [ "$NODE_ENV" == "production" ]
then
  DATABASE_NAME="awesomeboggle"
fi
SETUP_DATABASE_FILE=${BASEDIR}/database.sql

echo "Setting database ${DATABASE_NAME}"
mysql -uroot -e "set @db='${DATABASE_NAME}'; source ${SETUP_DATABASE_FILE};"

files=( user.sql schema.sql data.sql words.sql )

for i in "${files[@]}"
do
  filename="${BASEDIR}/$i"
  echo -n "Running $filename..."
  mysql -uroot ${DATABASE_NAME} -e "set @db='${DATABASE_NAME}'; source ${filename};"
  echo "done"
done

echo "Complete"
