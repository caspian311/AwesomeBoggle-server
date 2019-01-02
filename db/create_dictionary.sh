#!/bin/bash -e

pushd $(dirname $0) &> /dev/null
  BASEDIR=$(pwd)
popd &> /dev/null

SOURCE_FILE="$(dirname $(dirname $BASEDIR))/english-words/words.txt"
DEST_FILE="$BASEDIR/words.sql"

cat << EOF > $DEST_FILE
INSERT INTO words (text) VALUES
EOF

cat $SOURCE_FILE | gsed -r '/^.{,2}$/d' | gsed -r '/[0-9]/d' | gsed -r '/\./d' | gsed -r '/[-]/d' | gsed 's/./\L\0/g' | gsed -r "/[']/d" | nl | while read line_number word
do
  if [ $line_number -gt 1 ]
  then
    echo -n ", "
  fi

  echo "('$word')"
done >> $DEST_FILE

echo ';' >> $DEST_FILE
