#!/usr/bin/env bash

AGX_CONFIG="/Applications/Blender 4.1.app/Contents/Resources/4.1/datafiles/colormanagement/config.ocio"

# Source: https://github.com/sobotka/Testing_Imagery
declare -a images=(
	"blue_bar_709"
	"Matas_Alexa_Mini_sample_BT709"
	"mery_lightSaber_lin_srgb"
	"red_xmas_rec709"
	"Sweep_sRGB_Linear_Half_Zip"
	"Siren4_arri_alexa35_BT709"
)

declare -a looks=(
	"AgX - Punchy"
	"AgX - Greyscale"
	"AgX - Very High Contrast"
	"AgX - High Contrast"
	"AgX - Medium High Contrast"
	"AgX - Base Contrast"
	"AgX - Medium Low Contrast"
	"AgX - Low Contrast"
	"AgX - Very Low Contrast"
)

rm -rf ./public/references/*

for image in "${images[@]}"
do
   echo "$image"
   for look in "${looks[@]}"
   do
   	oiiotool --colorconfig "$AGX_CONFIG" -i "./public/images/$image.exr" --colorconvert "Linear Rec.709" "AgX Base sRGB" --ociolook "$look" --resize 50% --ch "R,G,B" -o ./public/references/"$image - $look".jpg
   done
done
