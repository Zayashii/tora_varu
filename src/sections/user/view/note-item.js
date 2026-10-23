import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// utils
import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import FileThumbnail from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

export default function NoteItem({ note, user, date, sx, ...other }) {

    const { enqueueSnackbar } = useSnackbar();

    const { copy } = useCopyToClipboard();

    const smUp = useResponsive('up', 'sm');

    const [inviteEmail, setInviteEmail] = useState('');

    const popover = usePopover();

    const share = useBoolean();

    const details = useBoolean();

    const favorite = useBoolean(false);


    const renderAction = (
        <Box
            sx={{
                top: 0,
                right: 8,
                position: 'absolute',
                ...(smUp && {
                    flexShrink: 0,
                    position: 'unset',
                }),
            }}
        >
            <Checkbox
                color="warning"
                icon={<Iconify icon="eva:star-outline" />}
                checkedIcon={<Iconify icon="eva:star-fill" />}
                checked={favorite.value}
                onChange={favorite.onToggle}
            />

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
        </Box>
    );

    const renderText = (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: 'space-between',
                alignItems: "center",
                width: "100%"
            }}
        >
            <ListItemText
                onClick={details.onTrue}
                primary={user + ":"}
                secondary={date}
                primaryTypographyProps={{
                    noWrap: true,
                    typography: 'subtitle2',
                }}
                secondaryTypographyProps={{
                    mt: 0.5,
                    component: 'span',
                    alignItems: 'center',
                    typography: 'caption',
                    color: 'text.disabled',
                    display: 'inline-flex',
                }}
            />
            <ListItemText
                onClick={details.onTrue}
                primary={note}
                primaryTypographyProps={{
                    noWrap: true,
                    typography: 'subtitle2',
                    alignSelf: "end",
                    textAlign: "end"
                }}
                secondaryTypographyProps={{
                    mt: 0.5,
                    component: 'span',
                    alignItems: 'center',
                    typography: 'caption',
                    color: 'text.disabled',
                    display: 'inline-flex',
                    alignSelf: "end",
                    textAlign: "end"
                }}
            />
        </div>
    );


    return (
        <>
            <Stack
                component={Paper}
                variant="outlined"
                spacing={1}
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'unset', sm: 'center' }}
                sx={{
                    borderRadius: 2,
                    bgcolor: 'unset',
                    cursor: 'pointer',
                    position: 'relative',
                    p: { xs: 2.5, sm: 2 },
                    '&:hover': {
                        bgcolor: 'background.paper',
                        boxShadow: (theme) => theme.customShadows.z20,
                    },
                    ...sx,
                }}
                {...other}
            >

                {renderText}
            </Stack>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 160 }}
            >
                <MenuItem
                    onClick={() => {
                        popover.onClose();
                        handleCopy();
                    }}
                >
                    <Iconify icon="eva:link-2-fill" />
                    Copy Link
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        popover.onClose();
                        share.onTrue();
                    }}
                >
                    <Iconify icon="solar:share-bold" />
                    Share
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem
                    onClick={() => {
                        popover.onClose();
                        onDelete();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>

        </>
    );
}

NoteItem.propTypes = {
    file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onDelete: PropTypes.func,
    sx: PropTypes.object,
};
