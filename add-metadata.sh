#!/bin/bash
find public/ -name "*.png" -exec exiftool -q \
  -Artist="Arturo Morales Pérez" \
  -Creator="Arturo Morales Pérez" \
  -Copyright="CC BY-NC 4.0" \
  -XMP-dc:Rights="CC BY-NC 4.0" \
  -XMP-dc:Creator="Arturo Morales Pérez" \
  -MWG:Creator="Arturo Morales Pérez" \
  -overwrite_original {} \;