import PropTypes from 'prop-types';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fData } from 'src/utils/format-number';
//
import Iconify from '../iconify';
import { varFade } from '../animate';
import FileThumbnail, { fileData } from '../file-thumbnail';
import { Box } from '@mui/material';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

export default function MultiUrlPreview({ thumbnail, urls, onRemove, sx }) {
  return (
    <AnimatePresence initial={false}>
      {urls?.map((url) => {
        if (thumbnail) {

          return (
            <Stack
              component={m.div}
              {...varFade().inUp}
              alignItems="center"
              display="inline-flex"
              justifyContent="center"
              sx={{
                m: 0.5,
                width: 80,
                height: 80,
                borderRadius: 1.25,
                overflow: 'hidden',
                position: 'relative',
                border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                ...sx,
              }}
            >
              <Box
                component="img"
                src={HOST_API + url}
                sx={{
                  width: 1,
                  height: 1,
                  flexShrink: 0,
                  objectFit: 'cover',
                  position: 'absolute',
                }}
              />

              {onRemove && (
                <IconButton
                  size="small"
                  onClick={() => onRemove(url)}
                  sx={{
                    p: 0.5,
                    top: 4,
                    right: 4,
                    position: 'absolute',
                    color: 'common.white',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    },
                  }}
                >
                  <Iconify icon="mingcute:close-line" width={14} />
                </IconButton>
              )}
            </Stack>
          );
        }

        return (
          <Stack
            key={key}
            component={m.div}
            {...varFade().inUp}
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              my: 1,
              py: 1,
              px: 1.5,
              borderRadius: 1,
              border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
              ...sx,
            }}
          >
            <Box
              component="img"
              src={HOST_API + url}
              sx={{
                width: 1,
                height: 1,
                flexShrink: 0,
                objectFit: 'cover',
                position: 'absolute',
              }}
            />

            <ListItemText
              primary={isNotFormatFile ? file : name}
              secondary={isNotFormatFile ? '' : fData(size)}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />

            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(file)}>
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            )}
          </Stack>
        );
      })}
    </AnimatePresence>
  );
}

MultiUrlPreview.propTypes = {
  files: PropTypes.array,
  onRemove: PropTypes.func,
  sx: PropTypes.object,
  thumbnail: PropTypes.bool,
};
