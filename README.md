# return-to-shady-glen


## Converting Images
`brew install imagemagick` (Also adds the 'convert' command as an alias)

Single Use:
`convert 'raw-images/0000.png' -depth 8 'images/0000.png'`

Bulk Use:

for file in raw-images/*; do
    if [ -f "$file" ]; then
        file_basename=$(basename -- "$file")
        echo "Processing ${file} into ./images/${file_basename}"
        convert "${file}" -depth 8 "images/${file_basename}"
    fi
    echo " - - - DONE!"
done
