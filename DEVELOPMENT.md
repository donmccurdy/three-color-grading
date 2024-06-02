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

| name                 | slope | offset | power | saturation |
|----------------------|-------|--------|-------|------------|
| Punchy               | 1.0   | 0.0    | 1.35  | 1.4        |
| Very High Contrast   | 1.57  | -0.114 | 1.0   | 0.9        |
| High Contrast        | 1.4   | -0.08  | 1.0   | 0.95       |
| Medium High Contrast | 1.2   | -0.04  | 1.0   | 1.0        |
| Base Contrast        | 1.0   | 0.0    | 1.0   | 1.0        |
| Medium Low Contrast  | 0.9   | 0.02   | 1.0   | 1.05       |
| Low Contrast         | 0.8   | 0.04   | 1.0   | 1.1        |
| Very Low Contrast    | 0.7   | 0.06   | 1.0   | 1.15       |

Conversion from OCIO::PrimaryGradingTransform contrast (log) to CDL:

- slope = contrast
- offset = (1 - contrast) x pivot

## Resources

- https://github.com/LuchoTurtle/tweakpane-plugin-file-import
- https://shoelace.style/components/select
- https://opencolorio.readthedocs.io/en/latest/api/grading_transforms.html#gradingprimarytransform
- https://docs.red.com/955-0196_v1.6/Content/4_Menus/Image_LUT/CDL/01_Intro_CDL.htm
