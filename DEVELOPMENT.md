# Development

## Tasks

remaining:

- [ ] scopes
- [ ] demo scenes
- [x] replicate blender's AgX looks
- [x] if OCIO handles lin and log grading differently, why? maybe focus on log?
- [ ] example for lift,gamma,gain?
- [ ] example for highlights,mids,lows?
- [ ] should we just be doing a GradingPrimaryTransform?

## Looks

| look                 | slope  | offset | power | saturation |
|:---------------------|------:|--------:|------:|-----------:|
| Punchy               | 1.00  | 0.000  | 1.35   | 1.40       |
| |
| Very High Contrast   | 1.57  | -0.114 | 1.00   | 0.90       |
| High Contrast        | 1.40  | -0.080 | 1.00   | 0.95       |
| Medium High Contrast | 1.20  | -0.040 | 1.00   | 1.00       |
| Base Contrast        | 1.00  | 0.000  | 1.00   | 1.00       |
| Medium Low Contrast  | 0.90  | 0.020  | 1.00   | 1.05       |
| Low Contrast         | 0.80  | 0.040  | 1.00   | 1.10       |
| Very Low Contrast    | 0.70  | 0.060  | 1.00   | 1.15       |

Conversion from OCIO::PrimaryGradingTransform contrast (log) to CDL:

- slope = contrast
- offset = (1 - contrast) x pivot

## Resources

- https://github.com/LuchoTurtle/tweakpane-plugin-file-import
- https://shoelace.style/components/select
- https://opencolorio.readthedocs.io/en/latest/api/grading_transforms.html#gradingprimarytransform
- https://docs.red.com/955-0196_v1.6/Content/4_Menus/Image_LUT/CDL/01_Intro_CDL.htm
