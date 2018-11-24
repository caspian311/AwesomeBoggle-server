#!/bin/bash -e

pushd $(dirname $0) &> /dev/null
  basedir=$(pwd)
popd &> /dev/null

files=( schema.sql data.sql user.sql )

for i in "${files[@]}"
do
  filename="${basedir}/$i"
  echo -n "Running $filename..."
  cat $filename | mysql -uroot
  echo "done"
done

echo "Complete"
